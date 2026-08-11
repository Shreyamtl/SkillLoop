import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, sendMatchRequest } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PublicProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getAllUsers();
        const found = res.data.find(u => u._id === userId);
        if (found) {
          setProfileUser(found);
          if (found.skillsToTeach?.length > 0) {
            setSelectedSkill(found.skillsToTeach[0]);
          }
        } else {
          toast.error('User not found');
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSendRequest = async () => {
    if (!selectedSkill) {
      toast.error('Please select a skill');
      return;
    }

    setSending(true);
    try {
      await sendMatchRequest({
        toUser: profileUser._id,
        skill: selectedSkill,
        message: message.trim() || `I'd like to learn ${selectedSkill} from you!`,
      });
      toast.success(`Request sent for ${selectedSkill}!`);
      setShowRequestModal(false);
      setMessage('');
      navigate('/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!profileUser) return <p className="text-center py-16 text-gray-500">User not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-6 border-b pb-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
            {profileUser.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profileUser.name}</h1>
            <p className="text-gray-500">{profileUser.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Skills They Can Teach
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileUser.skillsToTeach?.length > 0 ? (
                profileUser.skillsToTeach.map((skill) => (
                  <span key={skill} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              Skills They Want to Learn
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileUser.skillsToLearn?.length > 0 ? (
                profileUser.skillsToLearn.map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>

        {user?._id !== profileUser._id && profileUser.skillsToTeach?.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <button
              onClick={() => setShowRequestModal(true)}
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Request a Skill
            </button>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slideUp">
            <h2 className="text-2xl font-bold mb-2">Request a Skill</h2>
            <p className="text-gray-500 text-sm mb-6">
              Send a request to {profileUser.name} to teach you a skill.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">Skill</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {profileUser.skillsToTeach.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-1">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi, I'd like to learn ${selectedSkill || 'a skill'} from you!`}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSendRequest}
                  disabled={sending}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-2.5 rounded-xl border hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}