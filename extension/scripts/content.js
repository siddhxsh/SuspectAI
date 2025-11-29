/**
 * Suspect.AI - Content Script
 * Extracts page content, transcript, and metadata from web pages
 */

// Configuration constants
const MAX_CONTENT_LENGTH = 10000; // Maximum characters to extract from page content

// Listen for messages from background script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractPageContent();
    sendResponse({ success: true, data: content });
  }
  return true;
});

/**
 * Extract content from the current page
 * @returns {Object} Page data including URL, title, and content
 */
function extractPageContent() {
  const pageData = {
    url: window.location.href,
    title: document.title,
    content: '',
    type: detectPageType()
  };

  // Extract content based on page type
  if (pageData.type === 'youtube') {
    pageData.content = extractYouTubeContent();
  } else if (pageData.type === 'article') {
    pageData.content = extractArticleContent();
  } else {
    pageData.content = extractGenericContent();
  }

  return pageData;
}

/**
 * Detect the type of page
 * @returns {string} Page type: 'youtube', 'article', or 'generic'
 */
function detectPageType() {
  const url = window.location.href;
  
  if (url.includes('youtube.com/watch')) {
    return 'youtube';
  }
  
  // Check for common article indicators
  const articleIndicators = [
    document.querySelector('article'),
    document.querySelector('[itemtype*="Article"]'),
    document.querySelector('[itemtype*="NewsArticle"]'),
    document.querySelector('[itemtype*="BlogPosting"]')
  ];
  
  if (articleIndicators.some(el => el !== null)) {
    return 'article';
  }
  
  return 'generic';
}

/**
 * Extract content from YouTube pages
 * @returns {string} Video description and available transcript
 */
function extractYouTubeContent() {
  const parts = [];
  
  // Get video title
  const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer, h1.title');
  if (titleElement) {
    parts.push('Title: ' + titleElement.textContent.trim());
  }
  
  // Get video description
  const descriptionElement = document.querySelector('#description-inline-expander, #description');
  if (descriptionElement) {
    parts.push('Description: ' + descriptionElement.textContent.trim());
  }
  
  // Get channel name
  const channelElement = document.querySelector('#channel-name a, ytd-channel-name a');
  if (channelElement) {
    parts.push('Channel: ' + channelElement.textContent.trim());
  }
  
  // Try to get transcript if available (from transcript panel)
  const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer .segment-text');
  if (transcriptSegments.length > 0) {
    const transcript = Array.from(transcriptSegments)
      .map(seg => seg.textContent.trim())
      .join(' ');
    parts.push('Transcript: ' + transcript);
  }
  
  return parts.join('\n\n');
}

/**
 * Extract content from article pages
 * @returns {string} Article text content
 */
function extractArticleContent() {
  const parts = [];
  
  // Try to find article element
  const articleElement = document.querySelector('article') || 
                         document.querySelector('[itemtype*="Article"]') ||
                         document.querySelector('main');
  
  if (articleElement) {
    // Get headings
    const headings = articleElement.querySelectorAll('h1, h2, h3');
    headings.forEach(h => {
      parts.push(h.textContent.trim());
    });
    
    // Get paragraphs
    const paragraphs = articleElement.querySelectorAll('p');
    paragraphs.forEach(p => {
      const text = p.textContent.trim();
      if (text.length > 20) { // Filter out short/empty paragraphs
        parts.push(text);
      }
    });
  }
  
  // Fallback to meta description if no content found
  if (parts.length === 0) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      parts.push(metaDesc.getAttribute('content'));
    }
  }
  
  return parts.join('\n\n');
}

/**
 * Extract generic page content
 * @returns {string} Main text content from the page
 */
function extractGenericContent() {
  const parts = [];
  
  // Get meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    parts.push(metaDesc.getAttribute('content'));
  }
  
  // Get main content area
  const mainContent = document.querySelector('main') || 
                      document.querySelector('#content') ||
                      document.querySelector('.content') ||
                      document.body;
  
  if (mainContent) {
    // Get text from paragraphs
    const paragraphs = mainContent.querySelectorAll('p');
    paragraphs.forEach(p => {
      const text = p.textContent.trim();
      if (text.length > 30) {
        parts.push(text);
      }
    });
  }
  
  // Limit content length
  const fullContent = parts.join('\n\n');
  return fullContent.substring(0, MAX_CONTENT_LENGTH);
}

// Auto-announce when loaded (for debugging)
console.log('Suspect.AI content script loaded on:', window.location.href);
