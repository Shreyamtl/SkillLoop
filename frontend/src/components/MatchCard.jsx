import { useState } from 'react';

/**
 * Displays a single suggested match.
 * Props:
 *  - match: { _id, name, skillsToTeach, sharedSkills, mutual }
 *  - onSendRequest: (userId, skill, message) => Promise
 */
export default function MatchCard({ match, onSendRequest }) {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(match.sharedSkills?.[0] || '');
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    await onSendRequest(match._id, selectedSkill, message);
    setSent(true);
  };

  return (
    <div className="hairline pb-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-ink">{match.name}</h3>
            {match.mutual && (
              <span className="font-label text-[10px] uppercase tracking-wide bg-sage/20 text-sage border border-sage px-2 py-0.5 rounded-sm">
                mutual
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {match.skillsToTeach.map((skill) => (
              <span
                key={skill}
                className={`skill-tag ${
                  match.sharedSkills.includes(skill) ? 'skill-tag--shared' : ''
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* signature: overlapping-circle indicator of shared ground */}
        <div className="relative w-16 h-10 shrink-0" aria-hidden="true">
          <div className="absolute left-0 w-9 h-9 rounded-full border border-ink/40" />
          <div className="absolute left-6 w-9 h-9 rounded-full border border-amber bg-amber/10" />
        </div>
      </div>

      {!sent ? (
        !expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="mt-4 font-label text-xs border border-ink px-3 py-1.5 rounded-sm hover:bg-ink hover:text-paper transition-colors"
          >
            send request
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <div>
              <label className="font-label text-xs uppercase tracking-wide text-ink/70 block mb-1">
                skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="border border-ink/30 rounded-sm text-sm px-2 py-1.5 bg-white"
              >
                {match.sharedSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional message — say why you'd like to learn this"
              className="w-full border border-ink/30 rounded-sm text-sm px-3 py-2 bg-white"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSend}
                className="font-label text-xs bg-ink text-paper px-3 py-1.5 rounded-sm hover:bg-amber hover:text-ink transition-colors"
              >
                send
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="font-label text-xs text-ink/60 px-3 py-1.5"
              >
                cancel
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="mt-4 font-label text-xs text-sage">request sent ✓</p>
      )}
    </div>
  );
}
