import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signup(form);
      loginUser(res.data.token, res.data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-label text-xl text-ink mb-1">create account</h1>
      <p className="text-sm text-ink/60 mb-8">
        Join and list what you can teach and want to learn.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-label text-xs uppercase tracking-wide text-ink/70 block mb-1">
            name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-ink/30 rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="font-label text-xs uppercase tracking-wide text-ink/70 block mb-1">
            email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-ink/30 rounded-sm px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="font-label text-xs uppercase tracking-wide text-ink/70 block mb-1">
            password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full border border-ink/30 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-rust">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-label text-sm bg-ink text-paper py-2.5 rounded-sm hover:bg-amber hover:text-ink transition-colors disabled:opacity-50"
        >
          {loading ? 'creating...' : 'sign up'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
