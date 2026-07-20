import { useState } from 'react';

/**
 * Reusable tag-style input.
 * Props:
 *  - label: field label shown above the input
 *  - tags: array of current tag strings
 *  - onChange: (newTagsArray) => void
 *  - placeholder: input placeholder text
 */
export default function TagInput({ label, tags, onChange, placeholder }) {
  const [draft, setDraft] = useState('');

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

  return (
    <div>
      <label className="font-label text-xs uppercase tracking-wide text-ink/70 block mb-2">
        {label}
      </label>
      <div className="border border-ink/30 rounded-sm p-3 flex flex-wrap gap-2 bg-white">
        {tags.map((tag, i) => (
          <span key={tag + i} className="skill-tag">
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
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder || 'Type a skill and press Enter'}
          className="flex-1 min-w-[140px] outline-none text-sm bg-transparent py-1"
        />
      </div>
    </div>
  );
}
