import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="hairline bg-paper sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-label text-lg tracking-tight text-ink">
          SkillSwap<span className="text-amber">.</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6 font-label text-sm">
            <Link to="/matches" className="hover:text-amber transition-colors">
              matches
            </Link>
            <Link to="/requests" className="hover:text-amber transition-colors">
              requests
            </Link>
            <Link to="/profile" className="hover:text-amber transition-colors">
              profile
            </Link>
            <button
              onClick={handleLogout}
              className="border border-ink px-3 py-1 rounded-sm hover:bg-ink hover:text-paper transition-colors"
            >
              log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 font-label text-sm">
            <Link to="/login" className="hover:text-amber transition-colors">
              log in
            </Link>
            <Link
              to="/signup"
              className="border border-ink px-3 py-1 rounded-sm hover:bg-ink hover:text-paper transition-colors"
            >
              sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
