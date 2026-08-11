import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getMyRequests } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  UserGroupIcon, 
  FireIcon,
  ArrowRightIcon,
  ComputerDesktopIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  HeartIcon,
  GlobeAltIcon,
  SparklesIcon,
  EnvelopeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

export default function Homepage() {
  const { user } = useAuth();
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, requestsRes] = await Promise.all([
          getAllUsers(),
          getMyRequests()
        ]);

        const otherUsers = usersRes.data.filter(u => u._id !== user?._id);
        setRecentUsers(otherUsers.slice(0, 3));

        const skillCount = {};
        usersRes.data.forEach(u => {
          u.skillsToTeach?.forEach(skill => {
            skillCount[skill] = (skillCount[skill] || 0) + 1;
          });
        });
        const sortedSkills = Object.entries(skillCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([skill, count]) => ({ skill, count }));

        setTrendingSkills(sortedSkills);

        const userMatches = {};
        [...requestsRes.data.sent, ...requestsRes.data.received].forEach(r => {
          if (r.status === 'accepted') {
            const id = r.fromUser?._id || r.toUser?._id;
            userMatches[id] = (userMatches[id] || 0) + 1;
          }
        });
        const topUsersList = Object.entries(userMatches)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id, matches]) => {
            const found = usersRes.data.find(u => u._id === id);
            return found ? { ...found, matches } : null;
          })
          .filter(Boolean);

        setTopUsers(topUsersList);

      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const categories = [
    { name: 'Technology', icon: ComputerDesktopIcon, color: 'text-sky-600', bg: 'bg-sky-50 hover:bg-sky-100 border-sky-200', skills: ['Python', 'JavaScript', 'React', 'Node.js'] },
    { name: 'Music', icon: MusicalNoteIcon, color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200', skills: ['Guitar', 'Piano', 'Singing', 'Music Theory'] },
    { name: 'Art', icon: PaintBrushIcon, color: 'text-rose-600', bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200', skills: ['Drawing', 'Painting', 'Graphic Design', 'Photography'] },
    { name: 'Wellness', icon: HeartIcon, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200', skills: ['Yoga', 'Meditation', 'Fitness'] },
    { name: 'Languages', icon: GlobeAltIcon, color: 'text-indigo-600', bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200', skills: ['Spanish', 'French', 'Hindi', 'English'] },
    { name: 'Lifestyle', icon: SparklesIcon, color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200', skills: ['Cooking', 'Baking', 'Gardening'] },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      window.location.href = `/matches?search=${encodeURIComponent(searchTerm.trim())}&mode=browse`;
    }
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    skills: cat.skills.filter(s => 
      s.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.skills.length > 0 || !searchTerm);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      <div className="relative bg-gradient-to-br from-sky-100 via-amber-50 to-rose-100 text-[#1a1a2e] overflow-hidden px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white/70 backdrop-blur-sm px-5 py-1.5 rounded-full text-sm font-medium text-[#1a1a2e] mb-4 border border-white/30 shadow-sm">
                community learning
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 leading-tight text-[#1a1a2e]">
                Learn Anything<br />From Anyone
              </h1>
              <p className="text-lg text-[#4a4440] mb-8 max-w-lg leading-relaxed">
                Connect with people who share your passion. Teach what you know, learn what you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/matches"
                  className="bg-[#1a1a2e] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#2d2a44] transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                >
                  Start Learning
                </Link>
                <Link
                  to="/profile/edit"
                  className="border border-[#1a1a2e]/20 text-[#1a1a2e] px-8 py-3.5 rounded-full font-medium hover:bg-[#1a1a2e]/5 transition-all duration-300 text-center"
                >
                  Share Your Skills
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/40 shadow-xl">
                <h3 className="text-sm font-medium text-[#4a4440]/60 mb-4 tracking-wider uppercase text-center">
                  active members
                </h3>
                {recentUsers.length > 0 ? (
                  recentUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/50 transition">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {u.name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{u.name}</p>
                        <p className="text-sm text-[#4a4440]/60">
                          {u.skillsToTeach?.length || 0} skills to teach
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#4a4440]/60 text-sm text-center">No other users yet. Invite friends!</p>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-12">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4440]/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search for skills..."
                className="w-full pl-14 pr-6 py-4 rounded-full text-[#1a1a2e] bg-white/80 backdrop-blur-md shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-300/50 border border-white/60 placeholder:text-[#4a4440]/40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        {trendingSkills.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-[#1a1a2e]/5">
            <div className="flex items-center gap-2 mb-4">
              <FireIcon className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-serif font-semibold text-[#1a1a2e]">Trending Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingSkills.map(({ skill, count }) => (
                <Link
                  key={skill}
                  to={`/matches?search=${encodeURIComponent(skill)}&mode=browse`}
                  className="group bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/50 px-5 py-2.5 rounded-full text-sm font-medium text-[#1a1a2e] transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <span>{skill}</span>
                  <span className="text-xs bg-amber-200/50 text-amber-700 px-2 py-0.5 rounded-full group-hover:bg-amber-300/50 transition">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.name} className={`bg-white rounded-3xl shadow-lg p-6 border ${category.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full ${category.bg} flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-[#1a1a2e]">{category.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Link
                      key={skill}
                      to={`/matches?search=${encodeURIComponent(skill)}&mode=browse`}
                      className="bg-[#f5f0eb] hover:bg-[#e8e0d8] text-[#1a1a2e] px-4 py-1.5 rounded-full text-sm border border-[#1a1a2e]/5 transition-all duration-200"
                    >
                      {skill}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {topUsers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-[#1a1a2e]/5">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-serif font-semibold text-[#1a1a2e]">Top Contributors</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {topUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm hover:shadow-md transition">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {u.name?.[0] || 'U'}
                  </div>
                  <span className="font-medium text-[#1a1a2e]">{u.name}</span>
                  <span className="text-xs text-[#4a4440]/50">{u.matches} matches</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 pb-12">
          <Link to="/matches">
            <div className="group bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-sky-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-semibold text-[#1a1a2e]">Find Matches</h3>
              <p className="text-sm text-[#4a4440]/60">Discover people who can teach you</p>
            </div>
          </Link>
          <Link to="/requests">
            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-[#1a1a2e] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <EnvelopeIcon className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-semibold text-[#1a1a2e]">Check Requests</h3>
              <p className="text-sm text-[#4a4440]/60">View and manage your pending requests</p>
            </div>
          </Link>
          <Link to="/profile/edit">
            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-emerald-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <PencilIcon className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-semibold text-[#1a1a2e]">Update Skills</h3>
              <p className="text-sm text-[#4a4440]/60">Keep your skills list fresh</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}