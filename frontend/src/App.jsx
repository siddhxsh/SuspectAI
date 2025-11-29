import { useState } from 'react'
import Header from './components/Header'
import ClaimInput from './components/ClaimInput'
import ResultsDisplay from './components/ResultsDisplay'
import './App.css'

// Sample data for demonstration
const sampleResults = {
  url: 'https://example.com/article',
  title: 'Sample Article',
  claims: [
    {
      text: 'The Earth is approximately 4.5 billion years old.',
      verdict: 'supported',
      confidence: 95,
      evidence: 'Scientific consensus based on radiometric dating of meteorites and Earth rocks.'
    },
    {
      text: 'Vaccines cause autism in children.',
      verdict: 'refuted',
      confidence: 99,
      evidence: 'Multiple large-scale studies have found no link between vaccines and autism. The original study making this claim was retracted.'
    },
    {
      text: 'A new treatment shows promising results for cancer.',
      verdict: 'unclear',
      confidence: 45,
      evidence: 'Limited clinical trial data available. More research is needed to confirm efficacy.'
    }
  ]
}

function App() {
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (input) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // In production, this would call the n8n webhook
      // For demo, we simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate API call to n8n webhook
      // const response = await fetch('http://localhost:5678/webhook/suspectai', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(input)
      // })
      // const data = await response.json()
      
      setResults(sampleResults)
    } catch (err) {
      setError('Failed to analyze content. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <ClaimInput 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading}
          onClear={handleClear}
        />
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {results && <ResultsDisplay results={results} />}
        
        {!results && !isLoading && (
          <div className="placeholder">
            <div className="placeholder-icon">🔍</div>
            <h3>Ready to Verify</h3>
            <p>Enter a URL or paste text content to analyze claims and check for misinformation.</p>
          </div>
        )}
      </main>
      
      <footer className="footer">
        <p>Suspect.AI — AI-Powered Misinformation Detection</p>
        <p className="footer-links">
          <a href="https://github.com/siddhxsh/SuspectAI" target="_blank" rel="noopener noreferrer">GitHub</a>
          {' • '}
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Documentation coming soon!'); }}>Docs</a>
        </p>
      </footer>
    </div>
  )
}

export default App
