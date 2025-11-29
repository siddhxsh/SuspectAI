# Suspect.AI 🔍

<p align="center">
  <img src="extension/icons/icon128.png" alt="Suspect.AI Logo" width="128" height="128">
</p>

**Suspect.AI** is an AI-powered browser extension and web application that detects misinformation and hype in YouTube videos and news articles. It extracts claims, searches for evidence, verifies using AI, and returns **Supported / Refuted / Unclear** verdicts with confidence scores.

## ✨ Features

- 🎯 **Claim Extraction**: Automatically identifies verifiable claims from web content
- 🔬 **AI Verification**: Uses AI to analyze claims against evidence
- 📊 **Confidence Scores**: Shows how confident the AI is in each verdict
- 🎬 **YouTube Support**: Extracts video transcripts and descriptions
- 📰 **Article Support**: Parses news articles and blog posts
- 🌐 **Universal**: Works on any webpage with extractable content

## 🏗️ Project Structure

```
SuspectAI/
├── extension/              # Chrome Extension (Manifest v3)
│   ├── manifest.json       # Extension manifest
│   ├── icons/              # Extension icons
│   ├── popup/              # Popup UI (HTML, CSS, JS)
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   └── scripts/            # Extension scripts
│       ├── background.js   # Service worker
│       └── content.js      # Content script
├── frontend/               # React Web Application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main application
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Chrome** browser
- **n8n** (for webhook processing) - [Installation Guide](https://docs.n8n.io/hosting/installation/)

### 1. Clone the Repository

```bash
git clone https://github.com/siddhxsh/SuspectAI.git
cd SuspectAI
```

### 2. Install Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension` folder from this repository
5. The Suspect.AI extension should now appear in your extensions bar

### 3. Set Up n8n Webhook

The extension sends data to a local n8n webhook at `http://localhost:5678/webhook/suspectai`.

1. Install and start n8n:
   ```bash
   # Using npm
   npm install -g n8n
   n8n start
   
   # Or using Docker
   docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
   ```

2. Create a new workflow in n8n with:
   - A **Webhook** trigger node set to path `/suspectai`
   - Add your AI processing nodes (OpenAI, Claude, etc.)
   - Return JSON response with claim verification results

3. Expected webhook response format:
   ```json
   {
     "claims": [
       {
         "text": "The claim being verified",
         "verdict": "supported | refuted | unclear",
         "confidence": 85,
         "evidence": "Brief explanation of the evidence"
       }
     ]
   }
   ```

### 4. Run the Frontend (Optional)

The frontend provides a standalone web interface for claim verification:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to use the web application.

## 📖 Usage

### Using the Chrome Extension

1. Navigate to any YouTube video or news article
2. Click the Suspect.AI extension icon in your browser toolbar
3. Click **"Analyze Page"** to extract and verify claims
4. View the verification results with verdicts and confidence scores

### Using the Web Frontend

1. Start the frontend development server
2. Enter a URL or paste text content
3. Click **"Analyze"** to process the content
4. Review the claim verification results

## 🔧 Configuration

### Webhook URL

The default webhook URL is `http://localhost:5678/webhook/suspectai`. To change it:

1. Open `extension/scripts/background.js`
2. Modify the `WEBHOOK_URL` constant:
   ```javascript
   const WEBHOOK_URL = 'your-custom-webhook-url';
   ```

### Extension Permissions

The extension requires these permissions (defined in `manifest.json`):
- `activeTab`: Access the current tab's content
- `scripting`: Inject content scripts
- `storage`: Store analysis results locally

## 🎨 Branding

- **Primary Color**: `#6366f1` (Indigo)
- **Gradient**: `#6366f1` → `#a855f7` (Indigo to Purple)
- **Font**: System fonts (SF Pro, Segoe UI, Roboto)

## 🛠️ Development

### Extension Development

The extension uses vanilla JavaScript with no build step required. Simply modify the files and reload the extension in Chrome.

### Frontend Development

```bash
cd frontend
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 API Reference

### Webhook Request

The extension sends POST requests to the webhook with:

```json
{
  "url": "https://example.com/article",
  "title": "Page Title",
  "content": "Extracted page content...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Expected Response

```json
{
  "claims": [
    {
      "text": "Claim text",
      "verdict": "supported | refuted | unclear",
      "confidence": 0-100,
      "evidence": "Evidence description"
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for fighting misinformation
- Uses [n8n](https://n8n.io/) for workflow automation
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

