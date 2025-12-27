import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSignupMode = searchParams.get('signup') === 'true';
  
  const [isSignup, setIsSignup] = useState(isSignupMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup && password !== confirmPassword) {
      return setError('Passwörter stimmen nicht überein');
    }

    if (password.length < 6) {
      return setError('Passwort muss mindestens 6 Zeichen haben');
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email bereits registriert');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Ungültige Anmeldedaten');
      } else if (err.code === 'auth/user-not-found') {
        setError('Benutzer nicht gefunden');
      } else {
        setError('Fehler: ' + (err.message || 'Unbekannter Fehler'));
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Google Login fehlgeschlagen: ' + (err.message || ''));
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          Zurück zur Startseite
        </button>

        {/* Login Card */}
        <div className="glass rounded-3xl p-8 border border-blue-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <i className="fas fa-chart-line text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">
              {isSignup ? 'Account erstellen' : 'Willkommen zurück'}
            </h1>
            <p className="text-slate-400 text-sm">
              {isSignup ? 'Starte deine AI-gestützte Analyse' : 'Melde dich an, um fortzufahren'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Email-Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="deine@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Lädt...</>
              ) : (
                <>{isSignup ? 'Account erstellen' : 'Anmelden'}</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/50 text-slate-400">oder</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fab fa-google text-red-500"></i>
            Mit Google anmelden
          </button>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm text-slate-400">
            {isSignup ? 'Bereits registriert?' : 'Noch kein Account?'}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              {isSignup ? 'Jetzt anmelden' : 'Account erstellen'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-6 text-xs text-slate-500">
          Mit der Anmeldung akzeptierst du unsere Nutzungsbedingungen
        </p>
      </div>
    </div>
  );
};

export default LoginPage;