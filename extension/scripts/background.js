/**
 * Suspect.AI - Background Service Worker
 * Handles communication between content script, popup, and n8n webhook
 */

const WEBHOOK_URL = 'http://localhost:5678/webhook/suspectai';

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeContent') {
    handleAnalyzeContent(request.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
  
  if (request.action === 'getPageContent') {
    // Forward request to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractContent' }, (response) => {
          sendResponse(response);
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }
});

/**
 * Send content to n8n webhook for analysis
 * @param {Object} data - Page data including URL, title, and content
 * @returns {Promise<Object>} - Verification results
 */
async function handleAnalyzeContent(data) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: data.url,
        title: data.title,
        content: data.content,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`);
    }

    const result = await response.json();
    
    // Store the result for later retrieval
    await chrome.storage.local.set({
      lastAnalysis: {
        url: data.url,
        result: result,
        timestamp: new Date().toISOString()
      }
    });

    return result;
  } catch (error) {
    console.error('Suspect.AI: Error sending to webhook:', error);
    throw error;
  }
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Suspect.AI extension installed successfully');
  } else if (details.reason === 'update') {
    console.log('Suspect.AI extension updated to version', chrome.runtime.getManifest().version);
  }
});
