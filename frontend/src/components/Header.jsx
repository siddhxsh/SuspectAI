import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">
            <h1>Suspect.AI</h1>
            <span className="tagline">AI-Powered Misinformation Detection</span>
          </div>
        </div>
        
        <nav className="nav">
          <a href="https://github.com/siddhxsh/SuspectAI" target="_blank" rel="noopener noreferrer" className="nav-link">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
