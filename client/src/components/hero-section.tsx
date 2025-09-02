import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Mic, MicOff, Users, Heart, Shield, Zap, Cloud, Sun, CloudRain, MapPin, Smartphone, Globe, MessageCircle, Fingerprint } from "lucide-react";

// Speech Recognition API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
import GlassCard from "./glass-card";
import type { DashboardStats } from "@shared/schema";

export default function HeroSection() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard-stats'],
  });

  const [livesSaved, setLivesSaved] = useState(1247);
  const [patientsHelped, setPatientsHelped] = useState(8934);
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [voiceCommand, setVoiceCommand] = useState('');
  const [isPWAInstallable, setIsPWAInstallable] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentWeather, setCurrentWeather] = useState({
    temp: 32,
    condition: "Sunny",
    humidity: 78,
    icon: <Sun className="w-6 h-6" />
  });

  // Animate social impact counters
  useEffect(() => {
    const interval = setInterval(() => {
      setLivesSaved(prev => prev + Math.floor(Math.random() * 3) + 1);
      setPatientsHelped(prev => prev + Math.floor(Math.random() * 5) + 2);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Simulate weather changes
  useEffect(() => {
    const weatherConditions = [
      { temp: 32, condition: "Sunny", humidity: 78, icon: <Sun className="w-6 h-6 text-orange-400" /> },
      { temp: 28, condition: "Cloudy", humidity: 82, icon: <Cloud className="w-6 h-6 text-gray-400" /> },
      { temp: 25, condition: "Rainy", humidity: 95, icon: <CloudRain className="w-6 h-6 text-blue-400" /> }
    ];
    
    const interval = setInterval(() => {
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setCurrentWeather(randomWeather);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced multilingual voice command handler
  const handleVoiceCommand = () => {
    if (!isListening) {
      setIsListening(true);
      
      // Check for Web Speech API support
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Set language based on selection
        const languageMap = {
          'english': 'en-IN',
          'hindi': 'hi-IN', 
          'marathi': 'mr-IN',
          'gujarati': 'gu-IN'
        };
        
        recognition.lang = languageMap[currentLanguage as keyof typeof languageMap];
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const command = event.results[last][0].transcript.toLowerCase();
          setVoiceCommand(command);
          
          // Enhanced command processing
          if (command.includes('hospital') || command.includes('हॉस्पिटल') || command.includes('रुग्णालय')) {
            window.location.href = '/map';
          } else if (command.includes('emergency') || command.includes('आपातकाल')) {
            window.location.href = '/dashboard';
          } else if (command.includes('doctor') || command.includes('डॉक्टर')) {
            window.location.href = '/advisory';
          } else if (command.includes('health') || command.includes('आरोग्य')) {
            window.location.href = '/patient-journey';
          }
        };
        
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        
        recognition.start();
      } else {
        // Fallback simulation
        setTimeout(() => {
          setIsListening(false);
          setVoiceCommand('Show nearest hospital');
          alert("Voice command detected: 'Show nearest hospital' - Redirecting to map...");
          window.location.href = "/map";
        }, 3000);
      }
    }
  };
  
  // PWA Installation handler
  const handlePWAInstall = () => {
    if (isPWAInstallable) {
      // Trigger PWA install prompt
      alert('Installing MumbaiHacks AI Health as PWA...');
      setIsPWAInstallable(false);
    }
  };
  
  // Location services handler
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          alert('Location enabled! Now showing nearby hospitals.');
        },
        (error) => {
          console.error('Location error:', error);
          alert('Please enable location services for better hospital recommendations.');
        }
      );
    }
  };
  
  // Push notifications handler
  const enableNotifications = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        new Notification('MumbaiHacks AI Health', {
          body: 'You will now receive health alerts and emergency notifications.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
      {/* Mumbai skyline background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Mumbai skyline at night" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 z-10">
        {/* Live Health Metrics Ticker */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-black/20 backdrop-blur-sm border-b border-white/10" data-testid="health-ticker">
          <div className="container mx-auto px-6 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">System Status: OPERATIONAL</span>
                </div>
                <div className="flex items-center space-x-2">
                  {currentWeather.icon}
                  <span>Mumbai: {currentWeather.temp}°C, {currentWeather.condition}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span>AQI Impact: +15% respiratory cases</span>
                </div>
              </div>
              <div className="hidden md:block text-neon-purple">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center animate-slide-up pt-12" data-testid="hero-content">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow animate-glow" data-testid="hero-title">
            MumbaiHacks AI Health
          </h1>
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-neon-cyan" data-testid="hero-subtitle">
            Future of Healthcare Technology
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90" data-testid="hero-description">
            Leveraging artificial intelligence to predict, prepare, and manage patient surges 
            across Mumbai's healthcare network in real-time.
          </p>

          {/* Enhanced Voice Command Interface */}
          <div className="mb-12">
            {/* Language Selector */}
            <div className="flex justify-center mb-4">
              <select 
                value={currentLanguage} 
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="glass-dark px-4 py-2 rounded-full text-sm border border-neon-cyan/30 bg-black/20 text-white"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="marathi">मराठी</option>
                <option value="gujarati">ગુજરાતી</option>
              </select>
            </div>
            
            <button
              onClick={handleVoiceCommand}
              className={`glass-dark px-6 py-3 rounded-full flex items-center space-x-3 mx-auto hover-glow transition-all ${
                isListening ? 'animate-pulse-glow border-2 border-neon-cyan' : 'neon-border'
              }`}
              data-testid="voice-command"
            >
              {isListening ? <MicOff className="w-5 h-5 text-neon-cyan animate-pulse" /> : <Mic className="w-5 h-5 text-neon-cyan" />}
              <span className="text-sm">
                {isListening ? "Listening... (Multilingual)" : "🎤 Hey Mumbai Health - Voice Commands"}
              </span>
            </button>
            
            {voiceCommand && (
              <div className="mt-3 text-center text-neon-purple text-sm">
                Last command: "{voiceCommand}"
              </div>
            )}
          </div>
          
          {/* Smart Features Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <button 
              onClick={handlePWAInstall}
              className="glass-dark px-4 py-3 rounded-lg hover-glow flex items-center space-x-2 text-sm"
            >
              <Smartphone className="w-4 h-4 text-neon-cyan" />
              <span>Install App</span>
            </button>
            
            <button 
              onClick={requestLocation}
              className="glass-dark px-4 py-3 rounded-lg hover-glow flex items-center space-x-2 text-sm"
            >
              <MapPin className="w-4 h-4 text-green-400" />
              <span>{userLocation ? '📍 Located' : 'Enable GPS'}</span>
            </button>
            
            <button 
              onClick={enableNotifications}
              className="glass-dark px-4 py-3 rounded-lg hover-glow flex items-center space-x-2 text-sm"
            >
              <MessageCircle className="w-4 h-4 text-orange-400" />
              <span>{notificationsEnabled ? '🔔 Active' : 'Notifications'}</span>
            </button>
            
            <button 
              onClick={() => alert('Biometric login will be available in next update!')}
              className="glass-dark px-4 py-3 rounded-lg hover-glow flex items-center space-x-2 text-sm"
            >
              <Fingerprint className="w-4 h-4 text-neon-purple" />
              <span>Biometric</span>
            </button>
          </div>
        </div>

        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" data-testid="hero-stats">
          <GlassCard 
            className="hover-glow animate-float" 
            style={{ animationDelay: '0.2s' }}
            data-testid="stat-card-surge"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Next Surge Prediction</h3>
              <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse-glow"></div>
            </div>
            <div className="text-3xl font-bold text-neon-cyan mb-2">
              {isLoading ? '...' : stats?.nextSurge || '18% Rise'}
            </div>
            <p className="text-sm opacity-70">Expected tomorrow 6-8 PM</p>
            <div className="mt-4 text-xs text-neon-purple">🤖 AI Confidence: 87%</div>
          </GlassCard>

          <GlassCard 
            className="hover-glow animate-float" 
            style={{ animationDelay: '0.4s' }}
            data-testid="stat-card-aqi"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current AQI Mumbai</h3>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse-glow"></div>
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {isLoading ? '...' : stats?.currentAqi || '284'}
            </div>
            <p className="text-sm opacity-70">Poor - Health Advisory Active</p>
            <div className="mt-4 text-xs text-neon-purple">📍 Worst: Andheri (312)</div>
          </GlassCard>

          <GlassCard 
            className="hover-glow animate-float" 
            style={{ animationDelay: '0.6s' }}
            data-testid="stat-card-preparedness"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Preparedness Score</h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-glow"></div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {isLoading ? '...' : `${stats?.preparednessScore || '78'}/100`}
            </div>
            <p className="text-sm opacity-70">Good - System Ready</p>
            <div className="mt-4 text-xs text-neon-purple">⚡ Updated 2 min ago</div>
          </GlassCard>
        </div>

        {/* Social Impact Counters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 mb-16" data-testid="impact-counters">
          <GlassCard className="text-center hover-glow animate-float" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center mb-3">
              <Heart className="w-8 h-8 text-red-400 animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-2 animate-glow" data-testid="lives-saved">
              {livesSaved.toLocaleString()}
            </div>
            <div className="text-sm opacity-80">Lives Saved</div>
            <div className="text-xs text-neon-purple mt-1">+3 in last hour</div>
          </GlassCard>

          <GlassCard className="text-center hover-glow animate-float" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-neon-cyan animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-neon-cyan mb-2 animate-glow" data-testid="patients-helped">
              {patientsHelped.toLocaleString()}
            </div>
            <div className="text-sm opacity-80">Patients Helped</div>
            <div className="text-xs text-neon-purple mt-1">+12 in last hour</div>
          </GlassCard>

          <GlassCard className="text-center hover-glow animate-float" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-green-400 animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2 animate-glow">
              99.7%
            </div>
            <div className="text-sm opacity-80">Uptime</div>
            <div className="text-xs text-neon-purple mt-1">24/7 monitoring</div>
          </GlassCard>

          <GlassCard className="text-center hover-glow animate-float" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-8 h-8 text-orange-400 animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-2 animate-glow">
              2.3s
            </div>
            <div className="text-sm opacity-80">Response Time</div>
            <div className="text-xs text-neon-purple mt-1">AI processing</div>
          </GlassCard>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center space-y-6">
          <Link
            href="/dashboard"
            className="glass-dark px-8 py-4 rounded-full text-lg font-semibold hover-glow neon-border inline-block animate-pulse-glow"
            data-testid="enter-control-center"
          >
            🚀 Enter AI Control Center →
          </Link>
          
          <div className="flex items-center justify-center space-x-8 text-sm opacity-70">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>47 Hospitals Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
              <span>Real-time Monitoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
              <span>AI-Powered Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
