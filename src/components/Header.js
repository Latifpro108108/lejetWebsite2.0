import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <img src="/assets/lejetlogo.png" alt="LEJET Logo" className="h-8 mr-2" />
          LEJET Airline
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            {user ? (
              <>
                <li><Link to={user.role === 'admin' ? "/admin-dashboard" : "/user-dashboard"} className="hover:underline">Dashboard</Link></li>
                <li><button onClick={logout} className="hover:underline">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:underline">Login</Link></li>
                <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
              </>
            )}
            <li><Link to="/feedback" className="hover:underline">Feedback</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

