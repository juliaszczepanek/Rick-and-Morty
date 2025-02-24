import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Characters,
  Episodes,
  EpisodesGraphQl,
  Locations,
  WatchList,
} from "./pages";
import { Signup, Login, ProtectedRoute } from "./authentication";
import { Navigation, Footer } from "./UI";
import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  const routing = [
    { path: "/characters", element: <Characters isMenuOpen={isMenuOpen} /> },
    // { path: "/episodes", element: <Episodes isMenuOpen={isMenuOpen} /> },
    { path: "/episodes", element: <EpisodesGraphQl isMenuOpen={isMenuOpen} /> },
    { path: "/locations", element: <Locations isMenuOpen={isMenuOpen} /> },
    {
      path: "/watch-list",
      element: (
        <ProtectedRoute>
          <WatchList isMenuOpen={isMenuOpen} />
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  return (
    <AuthProvider>
      <Router>
        <Navigation onToggleMenu={handleToggleMenu} />
        <Routes>
          {routing.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
