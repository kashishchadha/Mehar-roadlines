import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post('/auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      <section className="w-full md:w-[40%] bg-primary flex flex-col items-center justify-center relative overflow-hidden py-16 px-8 md:min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px] opacity-40"></div>
        <div className="absolute top-1/4 -rotate-12 h-px w-full bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
        <div className="absolute top-1/2 rotate-6 h-px w-full bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
        <div className="absolute top-3/4 -rotate-3 h-px w-full bg-gradient-to-r from-transparent via-secondary/10 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center bg-secondary p-4 rounded-lg shadow-xl">
            <span className="material-symbols-outlined text-[48px] text-white">local_shipping</span>
          </div>
          <h1 className="font-extrabold text-4xl text-white tracking-tight uppercase">
            Mehar <span className="font-black text-secondary">Roadlines</span>
          </h1>
          <p className="text-lg text-white opacity-70 mt-2 font-medium">
            Delivering Trust. Mile After Mile.
          </p>
        </div>
        
        <div className="hidden md:block absolute bottom-8 text-white opacity-30 text-xs font-semibold tracking-widest">
          KINETIC LOGISTICS SYSTEM V4.2
        </div>
      </section>

      <section className="w-full md:w-[60%] bg-surface-low flex items-center justify-center px-4 py-16 md:px-12">
        <div className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded shadow-md border border-outline-light">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-primary mb-1">
              Admin Login
            </h2>
            <p className="text-sm text-on-surface-muted">
              Mehar Roadlines Internal Control Panel
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider" htmlFor="username">
                Username or Email
              </label>
              <div className="relative group">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin credentials"
                  className="w-full h-[52px] px-4 pr-12 bg-surface-low border border-outline-light rounded text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all duration-200"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted/60">person</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[52px] px-4 pr-12 bg-surface-low border border-outline-light rounded text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted/60 hover:text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-light text-secondary focus:ring-secondary"
                />
                <span className="text-xs text-on-surface-muted group-hover:text-on-surface transition-colors font-medium">
                  Remember this device
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-secondary text-white font-bold text-sm rounded shadow hover:bg-secondary-dark active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-75 cursor-pointer"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Login to Dashboard
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>

            <div className="pt-6 border-t border-outline-faint mt-8 text-center">
              <p className="text-xs text-on-surface-muted">
                Forgot password? 
                <a className="text-secondary font-bold hover:underline ml-1" href="#">Contact your administrator.</a>
              </p>
            </div>
          </form>

          <div className="mt-10 flex items-center justify-center gap-6 opacity-30 grayscale">
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-tight">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              SECURE AES-256
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-tight">
              <span className="material-symbols-outlined text-sm">gpp_maybe</span>
              INTERNAL ACCESS ONLY
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
