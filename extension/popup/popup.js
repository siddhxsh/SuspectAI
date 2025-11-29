/**
 * Suspect.AI - Popup Script
 * Handles popup UI interactions and communication with background script
 */

// DOM Elements
const pageTitle = document.getElementById('page-title');
const pageUrl = document.getElementById('page-url');
const analyzeBtn = document.getElementById('analyze-btn');
const statusSection = document.getElementById('status-section');
const statusText = document.getElementById('status-text');
const resultsSection = document.getElementById('results-section');
const resultsContainer = document.getElementById('results-container');
const errorSection = document.getElementById('error-section');
const errorText = document.getElementById('error-text');
const retryBtn = document.getElementById('retry-btn');

// Initialize popup
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab) {
    pageTitle.textContent = tab.title || 'Unknown Page';
    pageUrl.textContent = tab.url || '';
  }
  
  // Check for cached results
  const cached = await chrome.storage.local.get('lastAnalysis');
  if (cached.lastAnalysis && cached.lastAnalysis.url === tab?.url) {
    displayResults(cached.lastAnalysis.result);
  }
  
  // Set up event listeners
  analyzeBtn.addEventListener('click', handleAnalyze);
  retryBtn.addEventListener('click', handleAnalyze);
}

/**
 * Handle analyze button click
 */
async function handleAnalyze() {
  // Show loading state
  showLoading();
  
  try {
    // Get page content from content script
    const contentResponse = await sendMessage({ action: 'getPageContent' });
    
    if (!contentResponse || !contentResponse.success) {
      throw new Error('Failed to extract page content');
    }
    
    const pageData = contentResponse.data;
    updateStatus('Sending to AI for analysis...');
    
    // Send to background script for webhook processing
    const analysisResponse = await sendMessage({
      action: 'analyzeContent',
      data: pageData
    });
    
    if (!analysisResponse || !analysisResponse.success) {
      throw new Error(analysisResponse?.error || 'Analysis failed');
    }
    
    // Display results
    displayResults(analysisResponse.data);
    
  } catch (error) {
    console.error('Suspect.AI: Analysis error:', error);
    showError(error.message || 'Failed to analyze page');
  }
}

/**
 * Send message to background script
 * @param {Object} message - Message to send
 * @returns {Promise<Object>} Response from background
 */
function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}

/**
 * Show loading state
 */
function showLoading() {
  analyzeBtn.disabled = true;
  statusSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  updateStatus('Extracting page content...');
}

/**
 * Update status text
 * @param {string} text - Status message
 */
function updateStatus(text) {
  statusText.textContent = text;
}

/**
 * Show error state
 * @param {string} message - Error message
 */
function showError(message) {
  analyzeBtn.disabled = false;
  statusSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  errorSection.classList.remove('hidden');
  
  // Provide helpful error messages based on error type
  const lowerMessage = message.toLowerCase();
  const isNetworkError = lowerMessage.includes('failed to fetch') || 
                         lowerMessage.includes('network') ||
                         lowerMessage.includes('connection refused') ||
                         lowerMessage.includes('webhook returned status');
  
  if (isNetworkError) {
    errorText.textContent = 'Could not connect to n8n webhook. Make sure n8n is running locally.';
  } else {
    errorText.textContent = message;
  }
}

/**
 * Display verification results
 * @param {Object} data - Results data from webhook
 */
function displayResults(data) {
  analyzeBtn.disabled = false;
  statusSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  
  // Clear previous results
  resultsContainer.innerHTML = '';
  
  // Check if we have claims to display
  if (!data || !data.claims || data.claims.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>No verifiable claims found on this page.</p>
      </div>
    `;
    return;
  }
  
  // Display summary
  const summary = calculateSummary(data.claims);
  const summaryHtml = `
    <div class="summary-card">
      <div class="summary-item">
        <div class="summary-count" style="color: var(--success-color)">${summary.supported}</div>
        <div class="summary-label">Supported</div>
      </div>
      <div class="summary-item">
        <div class="summary-count" style="color: var(--danger-color)">${summary.refuted}</div>
        <div class="summary-label">Refuted</div>
      </div>
      <div class="summary-item">
        <div class="summary-count" style="color: var(--warning-color)">${summary.unclear}</div>
        <div class="summary-label">Unclear</div>
      </div>
    </div>
  `;
  
  resultsContainer.innerHTML = summaryHtml;
  
  // Display individual claims
  data.claims.forEach((claim, index) => {
    const claimCard = createClaimCard(claim, index);
    resultsContainer.appendChild(claimCard);
  });
}

/**
 * Calculate summary statistics
 * @param {Array} claims - Array of claim results
 * @returns {Object} Summary counts
 */
function calculateSummary(claims) {
  const summary = { supported: 0, refuted: 0, unclear: 0 };
  
  claims.forEach(claim => {
    const verdict = (claim.verdict || '').toLowerCase();
    if (verdict === 'supported') summary.supported++;
    else if (verdict === 'refuted') summary.refuted++;
    else summary.unclear++;
  });
  
  return summary;
}

/**
 * Create a claim result card element
 * @param {Object} claim - Claim data
 * @param {number} index - Claim index
 * @returns {HTMLElement} Claim card element
 */
function createClaimCard(claim, index) {
  const card = document.createElement('div');
  card.className = 'claim-card';
  
  const verdict = (claim.verdict || 'unclear').toLowerCase();
  const confidence = claim.confidence || 0;
  const verdictClass = `verdict-${verdict}`;
  const verdictIcon = verdict === 'supported' ? '✓' : verdict === 'refuted' ? '✗' : '?';
  
  // Get color for confidence bar
  let confidenceColor = 'var(--warning-color)';
  if (verdict === 'supported') confidenceColor = 'var(--success-color)';
  else if (verdict === 'refuted') confidenceColor = 'var(--danger-color)';
  
  card.innerHTML = `
    <div class="claim-text">"${escapeHtml(claim.text || claim.claim || 'Unknown claim')}"</div>
    <span class="verdict-badge ${verdictClass}">
      ${verdictIcon} ${verdict}
    </span>
    <div class="confidence-bar">
      <div class="confidence-fill" style="width: ${confidence}%; background: ${confidenceColor}"></div>
    </div>
    ${claim.evidence ? `<div class="evidence-text">📎 ${escapeHtml(claim.evidence)}</div>` : ''}
  `;
  
  return card;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
