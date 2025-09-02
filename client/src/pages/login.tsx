import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Eye, EyeOff, Activity, Sparkles, Heart } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { login, register } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess(true);
        
        // Success animation delay
        setTimeout(() => {
          setLocation("/home");
        }, 1500);
      } else {
        await register(email, password, displayName);
        setSuccess(true);
        
        // Success animation delay
        setTimeout(() => {
          setLocation("/home");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Success Animation Component
  if (success) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
        <div className="text-center animate-bounce">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-neon-cyan rounded-full animate-ping opacity-60"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-green-400 to-neon-cyan rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-16 h-16 text-white animate-pulse" fill="currentColor" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">Welcome to MumbaiHacks AI Health!</h2>
          <p className="text-xl text-gray-300">Redirecting to dashboard...</p>
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-glow">MumbaiHacks AI Health</span>
            </div>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2 text-glow">
            {isLogin ? "Welcome Back!" : "Join the Platform"}
          </h1>
          <p className="text-gray-400">
            {isLogin ? "Sign in to access your health dashboard" : "Create your account to get started"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="glass-dark rounded-2xl p-8 border border-neon-cyan/30">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-purple" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-neon-purple/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-cyan" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/30 border border-neon-cyan/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neon-purple" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-black/30 border border-neon-purple/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-purple transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg text-white font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                  <Heart className="w-5 h-5 animate-pulse" />
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  <Sparkles className="w-5 h-5 group-hover:animate-spin transition-all" />
                </div>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
                setDisplayName("");
              }}
              className="text-neon-cyan hover:text-neon-purple transition-colors font-semibold"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          {/* Back to Landing */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}