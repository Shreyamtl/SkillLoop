import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-label text-xl text-ink mb-1">
        welcome{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p className="text-sm text-ink/60 mb-10">
        Trade what you know for what you want to learn.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/matches" className="hairline pb-6 block group">
          <p className="font-label text-xs text-amber mb-1">01</p>
          <p className="font-semibold text-ink group-hover:text-amber transition-colors">
            Find matches
          </p>
          <p className="text-sm text-ink/60 mt-1">See who can teach you what you want to learn.</p>
        </Link>
        <Link to="/requests" className="hairline pb-6 block group">
          <p className="font-label text-xs text-amber mb-1">02</p>
          <p className="font-semibold text-ink group-hover:text-amber transition-colors">
            Check requests
          </p>
          <p className="text-sm text-ink/60 mt-1">Accept, decline, or track pending swaps.</p>
        </Link>
        <Link to="/profile" className="hairline pb-6 block group">
          <p className="font-label text-xs text-amber mb-1">03</p>
          <p className="font-semibold text-ink group-hover:text-amber transition-colors">
            Update profile
          </p>
          <p className="text-sm text-ink/60 mt-1">Keep your skills list fresh.</p>
        </Link>
      </div>
    </div>
  );
}
