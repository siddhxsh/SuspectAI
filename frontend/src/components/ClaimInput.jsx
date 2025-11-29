import { useState } from 'react'
import './ClaimInput.css'

function ClaimInput({ onAnalyze, isLoading, onClear }) {
  const [inputType, setInputType] = useState('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const input = inputType === 'url' 
      ? { url, title: 'URL Analysis' }
      : { content: text, title: 'Text Analysis' }
    
    onAnalyze(input)
  }

  const handleClear = () => {
    setUrl('')
    setText('')
    onClear()
  }

  return (
    <div className="claim-input">
      <div className="input-tabs">
        <button 
          className={`tab ${inputType === 'url' ? 'active' : ''}`}
          onClick={() => setInputType('url')}
        >
          🔗 URL
        </button>
        <button 
          className={`tab ${inputType === 'text' ? 'active' : ''}`}
          onClick={() => setInputType('text')}
        >
          📝 Text
        </button>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        {inputType === 'url' ? (
          <input
            type="url"
            className="url-input"
            placeholder="Enter URL to analyze (e.g., https://example.com/article)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        ) : (
          <textarea
            className="text-input"
            placeholder="Paste article text or claims to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            required
          />
        )}

        <div className="button-group">
          <button 
            type="submit" 
            className="analyze-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loader"></span>
                Analyzing...
              </>
            ) : (
              <>
                🔍 Analyze
              </>
            )}
          </button>
          
          <button 
            type="button" 
            className="clear-button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClaimInput
