import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyRequests } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teachCount: 0,
    learnCount: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    sentRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests()
      .then((res) => {
        const pending = res.data.received.filter(r => r.status === 'pending').length;
        const accepted = res.data.received.filter(r => r.status === 'accepted').length;
        const sent = res.data.sent.length;
        setStats({
          teachCount: user?.skillsToTeach?.length || 0,
          learnCount: user?.skillsToLearn?.length || 0,
          pendingRequests: pending,
          acceptedRequests: accepted,
          sentRequests: sent,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-16 animate-fadeIn">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-2 animate-slideUp">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-lg opacity-90 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            Trade what you know for what you want to learn.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            number={stats.teachCount}
            label="Skills I Teach"
            icon="📚"
            color="purple"
          />
          <StatCard
            number={stats.learnCount}
            label="Skills I Learn"
            icon="🎯"
            color="blue"
          />
          <StatCard
            number={stats.pendingRequests}
            label="Pending Requests"
            icon="⏳"
            color="amber"
          />
          <StatCard
            number={stats.acceptedRequests}
            label="Matches Made"
            icon="🤝"
            color="green"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <ActionCard
            to="/matches"
            title="Find Matches"
            description="See who can teach you new skills"
            emoji="🔍"
            color="purple"
          />
          <ActionCard
            to="/requests"
            title="Check Requests"
            description={`${stats.pendingRequests} pending, ${stats.sentRequests} sent`}
            emoji="📨"
            color="blue"
          />
          <ActionCard
            to="/profile/edit"
            title="Update Skills"
            description="Keep your skills list fresh"
            emoji="✏️"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label, icon, color }) {
  const colors = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
  };

  const bgColors = {
    purple: 'hover:shadow-purple-200',
    blue: 'hover:shadow-blue-200',
    amber: 'hover:shadow-amber-200',
    green: 'hover:shadow-green-200',
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${bgColors[color]}`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${colors[color]}`}>{number}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function ActionCard({ to, title, description, emoji, color }) {
  const colors = {
    purple: 'hover:border-purple-300 hover:shadow-purple-100',
    blue: 'hover:border-blue-300 hover:shadow-blue-100',
    green: 'hover:border-green-300 hover:shadow-green-100',
  };

  return (
    <Link to={to}>
      <div className={`bg-white rounded-xl shadow-lg p-6 border-2 border-transparent ${colors[color]} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className="text-4xl mb-3">{emoji}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </Link>
  );
}