import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/30 animate-pulse-slow">
              <i className="fas fa-chart-line text-white text-5xl"></i>
            </div>
          </div>
          
          <h1 className="text-7xl font-black text-white tracking-tight">
            SlotTracker AI <span className="text-blue-500">PRO</span>
          </h1>
          
          <p className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Professionelle Echtzeit-Analyse mit Machine Learning und KI-gestützten Prognosen für maximale Transparenz
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-6 border border-blue-500/20">
              <div className="bg-blue-600/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-blue-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">KI-Analyse</h3>
              <p className="text-slate-400 text-sm">Gemini-powered Echtzeitanalyse mit präzisen Vorhersagen</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-emerald-500/20">
              <div className="bg-emerald-600/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-bar text-emerald-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live-Tracking</h3>
              <p className="text-slate-400 text-sm">RTP-Monitoring in Echtzeit mit interaktiven Dashboards</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-purple-500/20">
              <div className="bg-purple-600/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-robot text-purple-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ML-Engine</h3>
              <p className="text-slate-400 text-sm">Behavioral Forecasting für optimale Strategien</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Jetzt einloggen
            </button>
            <button
              onClick={() => navigate('/login?signup=true')}
              className="px-8 py-4 glass hover:bg-slate-800/50 text-white font-bold rounded-xl text-lg transition-all border border-slate-700"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Kostenlosen Account erstellen
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-black text-blue-500">24/7</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider mt-2">Live Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-500">100%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider mt-2">Transparenz</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-500">AI</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider mt-2">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;