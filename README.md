<p align="center">
  <img src="https://img.shields.io/badge/Status-Prototype%20v0.1-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Agentic%20Workflow-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Powered%20By-n8n%20%2B%20Gemini-green?style=for-the-badge" />
</p>


<h1 align="center">🚨 SuspectAI — No Cap, Just Facts</h1>

<p align="center">AI-powered hype detector that analyzes YouTube and online content, extracts claims, verifies them using AI + web evidence, and returns a factual verdict.</p>

---

# SuspectAI
Suspect.AI — Browser extension + AI pipeline that detects misinformation and hype in YouTube videos and news articles. Extracts claims, searches evidence, verifies using AI, and returns Supported / Refuted / Unclear verdicts with confidence.
📌 Problem

People consume news from YouTube & social media where sensational claims and clickbait spread misinformation. Manual fact-checking is slow, confusing, and inaccessible for everyday viewers.


## ⚙️ How It Works (Under the Hood)
1. User clicks Analyze this site
2. The extension/Webhook sends metadata and content to n8n
3. Gemini extracts claims and classifies them
4. Tavily Search API finds real-world evidence
5. Gemini verifies each claim as **Supported / Refuted / Unclear**
6. Results returned as JSON with confidence, explanation & evidence links



💡 Solution

Suspect.AI automates fact-checking. It extracts claims from videos, verifies them with real sources using AI search + LLM reasoning, and returns verdicts: Supported / Refuted / Unclear with evidence & confidence.
## 🔥 Demo Preview

### 🧠 Workflow Overview (n8n automation pipeline)
<p align="center">
  <img src="screenshots/Screenshot 2025-11-29 112901.png" alt="SuspectAI n8n Workflow" width="800"/>
</p>

### 🧠 Extension
<p align="center">
  <img src="screenshots/Screenshot 2025-11-29 113001.png" alt="SuspectAI n8n Workflow" width="800"/>
</p>

🧠 Tech Stack

Browser Extension: JavaScript, Manifest V3

Backend Workflow: n8n, Tavily API, Gemini LLM

Web Search + NLP + Claim Classification

Response via Webhook

🎯 Business Model

Freemium + Subscription:

Free: 15 checks/month

Pro: Unlimited checks + API + dashboard

B2B licensing for journalism, schools, media houses

📈 Impact

Makes news more trustworthy

Helps students & educators verify information

Saves time for researchers and creators

Reduces misinformation spread

## 🏆 Why SuspectAI
Misinformation scales faster than truth. We help audiences verify content — instantly and objectively.
Our prototype shows real-time claim extraction + factual verification using AI + live web evidence.
This can transform journalism, education policy, research & media literacy at scale.

