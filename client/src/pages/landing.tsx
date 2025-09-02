import { Link } from "wouter";
import { Sparkles, Activity, Brain, Shield, Zap, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Main Title */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center">
                <Activity className="w-10 h-10 text-white animate-pulse" />
              </div>
              <Sparkles className="w-8 h-8 text-neon-cyan animate-bounce" />
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-6 text-glow leading-tight">
              <span className="bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent">
                MumbaiHacks
              </span>
              <br />
              <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-blue-400 bg-clip-text text-transparent animate-pulse">
                AI Health
              </span>
            </h1>

            <p className="text-2xl md:text-3xl font-light mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Revolutionary AI-powered healthcare platform with 
              <span className="text-neon-cyan font-semibold"> predictive analytics</span>, 
              <span className="text-neon-purple font-semibold"> AR visualization</span>, and 
              <span className="text-blue-400 font-semibold"> real-time monitoring</span>
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up">
            <div className="glass-dark p-6 rounded-2xl border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all hover:scale-105">
              <Brain className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neon-cyan mb-2">AI Predictive Analytics</h3>
              <p className="text-gray-300">7-day surge forecasting and real-time health insights</p>
            </div>
            
            <div className="glass-dark p-6 rounded-2xl border border-neon-purple/30 hover:border-neon-purple/60 transition-all hover:scale-105">
              <Zap className="w-12 h-12 text-neon-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold text-neon-purple mb-2">AR Vision System</h3>
              <p className="text-gray-300">Augmented reality for medical diagnostics and navigation</p>
            </div>
            
            <div className="glass-dark p-6 rounded-2xl border border-blue-400/30 hover:border-blue-400/60 transition-all hover:scale-105">
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-400 mb-2">Community Health</h3>
              <p className="text-gray-300">Social features, challenges, and telemedicine platform</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-bounce-slow">
            <Link href="/login">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl text-2xl font-bold text-white hover:scale-110 transition-all duration-300 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center space-x-3">
                  <Shield className="w-8 h-8" />
                  <span>Enter Platform</span>
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
              </button>
            </Link>
          </div>

          {/* Subtitle */}
          <p className="mt-8 text-lg text-gray-400 animate-fade-in-delay">
            Secure • AI-Powered • Real-Time • Mumbai-First
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center glass-dark p-6 rounded-xl border border-green-400/30">
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-300">Connected Hospitals</div>
            </div>
            
            <div className="text-center glass-dark p-6 rounded-xl border border-neon-cyan/30">
              <div className="text-4xl font-bold text-neon-cyan mb-2">99.9%</div>
              <div className="text-gray-300">System Uptime</div>
            </div>
            
            <div className="text-center glass-dark p-6 rounded-xl border border-neon-purple/30">
              <div className="text-4xl font-bold text-neon-purple mb-2">24/7</div>
              <div className="text-gray-300">AI Monitoring</div>
            </div>
            
            <div className="text-center glass-dark p-6 rounded-xl border border-orange-400/30">
              <div className="text-4xl font-bold text-orange-400 mb-2">92%</div>
              <div className="text-gray-300">Preparedness Score</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}