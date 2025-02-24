import { NavLink } from "react-router-dom";
import logoImg from "/logo.png";
import { useState } from "react";
import {
  Characters,
  Episodes,
  EpisodesGraphQl,
  Locations,
  WatchList,
} from "./../pages";
import Login from "../authentication/Login";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { title: "Characters", path: "/characters", element: <Characters /> },
  // { title: "Episodes", path: "/episodes", element: <Episodes /> },
  { title: "Episodes", path: "/episodes", element: <EpisodesGraphQl /> },
  { title: "Locations", path: "/locations", element: <Locations /> },
  { title: "Watch List", path: "/watch-list", element: <WatchList /> },
];

export default function Navigation({ onToggleMenu }) {
  const [isChecked, setIsChecked] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleCheckbox = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onToggleMenu(newCheckedState);
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      await logout();
      setTimeout(() => {
        navigate("/login");
      }, 200);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="navigation">
      <img
        src={logoImg}
        alt="rick and morty logo"
        className="navigation__logo"
      />

      <button
        className="navigation__hamburger"
        aria-label="Toggle Menu"
        onClick={toggleCheckbox}
        aria-pressed={isChecked}
      >
        {!isChecked ? (
          <svg className="navigation__hamburger-open">
            <use xlinkHref="./hamburger/sprite.svg#burger"></use>
          </svg>
        ) : (
          <svg className="navigation__hamburger-close">
            <use xlinkHref="./hamburger/sprite.svg#cross"></use>
          </svg>
        )}
      </button>

      <ul className={`navigation__list ${isChecked ? "is-open" : ""}`}>
        {navLinks.map((link) => (
          <li key={link.path} className="navigation__item">
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive ? "navigation__link active" : "navigation__link"
              }
            >
              <span>{link.title}</span>
            </NavLink>
          </li>
        ))}
        <li className="navigation__item">
          {currentUser ? (
            <NavLink onClick={handleLogout} className="navigation__link">
              Logout
            </NavLink>
          ) : (
            <NavLink to="/login" className="navigation__link">
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
