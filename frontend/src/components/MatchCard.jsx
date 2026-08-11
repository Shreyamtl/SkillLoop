import { useState } from 'react';

export default function MatchCard({ match, onSendRequest, isBrowseMode = false }) {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(match.sharedSkills?.[0] || match.skillsToTeach?.[0] || '');
  const [sent, setSent] = useState(false);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSend = async () => {
    await onSendRequest(match._id, selectedSkill, message);
    setSent(true);
  };

  const displaySkills = isBrowseMode ? match.skillsToTeach : match.skillsToTeach;
  const sharedSkills = isBrowseMode ? match.skillsToTeach : match.sharedSkills;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition">
      <div className="flex items-start gap-6">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
          {getInitials(match.name)}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">{match.name}</h3>
            {match.mutual && (
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">
                🤝 Mutual
              </span>
            )}
            {isBrowseMode && (
              <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                🌐 Browse
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {displaySkills.map((skill) => (
              <span
                key={skill}
                className={`px-3 py-1 rounded-full text-sm ${
                  sharedSkills.includes(skill)
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : isBrowseMode
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {sharedSkills.includes(skill) && '⭐ '}
                {skill}
              </span>
            ))}
          </div>

          {isBrowseMode && (
            <p className="text-xs text-gray-400 mt-2">
              {match.skillsToTeach.length} skills available to learn
            </p>
          )}

          {!sent ? (
            !expanded ? (
              <button
                onClick={() => setExpanded(true)}
                className={`mt-4 px-6 py-2 rounded-lg text-sm font-semibold transition ${
                  isBrowseMode && match.sharedSkills.length === 0
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isBrowseMode ? '💬 Send Request' : 'Send Request'}
              </button>
            ) : (
              <div className="mt-4 space-y-3 border-t pt-4">
                <div>
                  <label className="text-sm font-semibold block mb-1">
                    Which skill do you want to learn?
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="border rounded-lg px-3 py-2 w-full"
                  >
                    {displaySkills.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Optional message..."
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSend}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Send ✓
                  </button>
                  <button
                    onClick={() => setExpanded(false)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          ) : (
            <p className="mt-4 text-green-600 font-semibold">✅ Request sent!</p>
          )}
        </div>
      </div>
    </div>
  );
}