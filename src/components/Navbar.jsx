import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-bar">
        <NavLink to="/" className="brand-link">
          <span className="brand-mark">🐾</span>
          <div>
            <h1>Paws & Home</h1>
            <p>Find a pet. Find a home.</p>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/pets">Browse Pets</NavLink>
          <NavLink to="/guides">Care Guides</NavLink>
          <NavLink to="/messages">Messages</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
