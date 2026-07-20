import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TagInput from '../components/TagInput';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileSetup() {
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => {
        setSkillsToTeach(res.data.skillsToTeach || []);
        setSkillsToLearn(res.data.skillsToLearn || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const res = await updateProfile({ skillsToTeach, skillsToLearn });
    setUser(res.data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleContinue = async () => {
    await handleSave();
    navigate('/matches');
  };

  if (loading) return <p className="text-center py-16 text-ink/50 text-sm">loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-label text-xl text-ink mb-1">your profile</h1>
      <p className="text-sm text-ink/60 mb-8">
        List skills as tags — press Enter or comma to add one.
      </p>

      <div className="space-y-8">
        <TagInput
          label="skills I can teach"
          tags={skillsToTeach}
          onChange={setSkillsToTeach}
          placeholder="e.g. Python basics"
        />
        <TagInput
          label="skills I want to learn"
          tags={skillsToLearn}
          onChange={setSkillsToLearn}
          placeholder="e.g. Public speaking"
        />
      </div>

      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={handleSave}
          className="font-label text-xs border border-ink px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors"
        >
          save
        </button>
        <button
          onClick={handleContinue}
          className="font-label text-xs bg-ink text-paper px-4 py-2 rounded-sm hover:bg-amber hover:text-ink transition-colors"
        >
          save &amp; find matches →
        </button>
        {saved && <span className="text-sage text-xs font-label">saved ✓</span>}
      </div>
    </div>
  );
}
