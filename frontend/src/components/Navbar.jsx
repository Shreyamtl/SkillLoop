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
    { to: '/matches', label: 'Matches' },
    { to: '/requests', label: `Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { to: '/chat', label: 'Chat' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[#1a1a2e]/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold text-[#1a1a2e] tracking-tight">
          SkillSwap
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    location.pathname === link.to
                      ? 'bg-[#1a1a2e]/10 text-[#1a1a2e]'
                      : 'text-[#4a4440] hover:bg-[#f5f0eb]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={logoutUser}
                className="ml-2 text-sm text-[#4a4440]/60 hover:text-[#1a1a2e] transition px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#4a4440] hover:text-[#1a1a2e]">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-[#1a1a2e] text-white rounded-full hover:bg-[#2d2a44] transition shadow-md hover:shadow-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}