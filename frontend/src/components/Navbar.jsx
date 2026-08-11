import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getMyRequests } from '../services/api';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user) {
      getMyRequests()
        .then((res) => {
          const pending = res.data.received.filter(r => r.status === 'pending').length;
          setPendingCount(pending);
        })
        .catch(() => {});
    }
  }, [user]);

  const navLinks = [
    { to: '/matches', label: '🎯 Matches' },
    { to: '/requests', label: `📨 Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { to: '/chat', label: '💬 Chat' },
    { to: '/profile', label: '👤 Profile' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          SkillSwap
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    location.pathname === link.to
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={logoutUser}
                className="ml-2 text-sm text-gray-500 hover:text-red-500 transition px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:opacity-90">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
