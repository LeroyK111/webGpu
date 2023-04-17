import { NavLink } from "react-router-dom";
import "./navbar.less"


export default function NavBar() {
  let activeStyle = {
    color: "red",
    backgroundColor: "skyblue",
  };
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to={`page2D`}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            className="NavLink"
          >
            2D
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`page3D`}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            className="NavLink"
          >
            3D
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`gis`}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            className="NavLink"
          >
            GIS
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`numbers`}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            className="NavLink"
          >
            Number
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`game`}
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            className="NavLink"
          >
            GAME
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
