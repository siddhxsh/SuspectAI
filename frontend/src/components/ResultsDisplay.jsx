import './ResultsDisplay.css'

function ResultsDisplay({ results }) {
  const { claims = [] } = results

  const summary = claims.reduce((acc, claim) => {
    const verdict = (claim.verdict || 'unclear').toLowerCase()
    acc[verdict] = (acc[verdict] || 0) + 1
    return acc
  }, { supported: 0, refuted: 0, unclear: 0 })

  return (
    <div className="results-display">
      <h2 className="results-title">Verification Results</h2>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card supported">
          <div className="summary-icon">✓</div>
          <div className="summary-count">{summary.supported}</div>
          <div className="summary-label">Supported</div>
        </div>
        <div className="summary-card refuted">
          <div className="summary-icon">✗</div>
          <div className="summary-count">{summary.refuted}</div>
          <div className="summary-label">Refuted</div>
        </div>
        <div className="summary-card unclear">
          <div className="summary-icon">?</div>
          <div className="summary-count">{summary.unclear}</div>
          <div className="summary-label">Unclear</div>
        </div>
      </div>

      {/* Claims List */}
      <div className="claims-list">
        {claims.map((claim, index) => (
          <ClaimCard key={index} claim={claim} index={index} />
        ))}
      </div>
    </div>
  )
}

function ClaimCard({ claim, index }) {
  const verdict = (claim.verdict || 'unclear').toLowerCase()
  const confidence = claim.confidence || 0
  
  const verdictColors = {
    supported: 'var(--success-color)',
    refuted: 'var(--danger-color)',
    unclear: 'var(--warning-color)'
  }
  
  const verdictIcons = {
    supported: '✓',
    refuted: '✗',
    unclear: '?'
  }

  return (
    <div className={`claim-card verdict-${verdict}`}>
      <div className="claim-header">
        <span className="claim-number">Claim {index + 1}</span>
        <span className={`verdict-badge ${verdict}`}>
          {verdictIcons[verdict]} {verdict.charAt(0).toUpperCase() + verdict.slice(1)}
        </span>
      </div>
      
      <p className="claim-text">"{claim.text}"</p>
      
      <div className="confidence-section">
        <div className="confidence-header">
          <span>Confidence</span>
          <span>{confidence}%</span>
        </div>
        <div className="confidence-bar">
          <div 
            className="confidence-fill"
            style={{ 
              width: `${confidence}%`,
              backgroundColor: verdictColors[verdict]
            }}
          />
        </div>
      </div>
      
      {claim.evidence && (
        <div className="evidence-section">
          <span className="evidence-label">📎 Evidence:</span>
          <p className="evidence-text">{claim.evidence}</p>
        </div>
      )}
    </div>
  )
}

export default ResultsDisplay
