import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="logo192.png" alt="Logo" />
      </div>

      <input type="checkbox" id="menu-btn" className="menu-btn" />
      <label htmlFor="menu-btn" className="menu-icon">
        <span className="navicon"></span>
      </label>

      <ul className="menu">
        <li>
          <Link to="/actors">Актёры</Link>
        </li>
        <li>
          <Link to="/agents">Агенты</Link>
        </li>
      </ul>
    </nav>
  );
}
