import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Skills Sections */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              📚 Skills I Can Teach
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.skillsToTeach?.length > 0 ? (
                user.skillsToTeach.map((skill) => (
                  <span key={skill} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
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
              🎯 Skills I Want to Learn
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {user?.skillsToLearn?.length > 0 ? (
                user.skillsToLearn.map((skill) => (
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

        {/* Edit Button */}
        <div className="mt-8 pt-6 border-t">
          <Link
            to="/profile/edit"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            ✏️ Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}