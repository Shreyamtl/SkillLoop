import { useState } from 'react';

const POPULAR_SKILLS = {
  teach: [
    'Python', 'JavaScript', 'React', 'Node.js', 'HTML/CSS',
    'Guitar', 'Piano', 'Singing', 'Music Theory',
    'Photography', 'Video Editing', 'Graphic Design',
    'Public Speaking', 'Writing', 'Storytelling',
    'Yoga', 'Meditation', 'Fitness',
    'Cooking', 'Baking', 'Gardening',
    'Spanish', 'French', 'Hindi', 'English',
    'Data Science', 'Machine Learning', 'AI',
    'Dance', 'Drawing', 'Painting'
  ],
  learn: [
    'Python', 'JavaScript', 'React', 'Node.js', 'HTML/CSS',
    'Guitar', 'Piano', 'Singing', 'Music Theory',
    'Photography', 'Video Editing', 'Graphic Design',
    'Public Speaking', 'Writing', 'Storytelling',
    'Yoga', 'Meditation', 'Fitness',
    'Cooking', 'Baking', 'Gardening',
    'Spanish', 'French', 'Hindi', 'English',
    'Data Science', 'Machine Learning', 'AI',
    'Dance', 'Drawing', 'Painting'
  ]
};

export default function TagInput({ label, tags, onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = () => {
    const value = draft.trim();
    if (!value) return;
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...tags, value]);
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const addSuggestedSkill = (skill) => {
    if (!tags.some((t) => t.toLowerCase() === skill.toLowerCase())) {
      onChange([...tags, skill]);
    }
  };

  const isTeach = label.toLowerCase().includes('teach');
  const suggestions = isTeach ? POPULAR_SKILLS.teach : POPULAR_SKILLS.learn;
  const availableSuggestions = suggestions.filter(
    s => !tags.some(t => t.toLowerCase() === s.toLowerCase())
  ).slice(0, 8);

  return (
    <div>
      <label className="font-label text-xs uppercase tracking-wide text-ink/70 block mb-2">
        {label}
      </label>
      <div className="border border-ink/30 rounded-sm p-3 flex flex-wrap gap-2 bg-white">
        {tags.map((tag, i) => (
          <span key={tag + i} className="skill-tag animate-fadeIn">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              aria-label={`Remove ${tag}`}
              className="text-ink/50 hover:text-rust leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder || 'Type a skill and press Enter'}
          className="flex-1 min-w-[140px] outline-none text-sm bg-transparent py-1"
        />
      </div>

      {showSuggestions && availableSuggestions.length > 0 && (
        <div className="mt-2 animate-fadeIn">
          <p className="text-xs text-gray-500 mb-1">💡 Popular skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addSuggestedSkill(skill);
                }}
                className="text-xs bg-gray-100 hover:bg-purple-100 hover:text-purple-700 px-2.5 py-1 rounded-full transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}