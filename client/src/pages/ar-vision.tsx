import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/navigation";
import GlassCard from "@/components/glass-card";
import { Camera, Navigation as NavigationIcon, Zap, Eye, Smartphone, MapPin, User, Heart, QrCode, Scan, Pill, Building, MessageSquare, Fingerprint, ShoppingCart } from "lucide-react";

export default function ARVision() {
  const [selectedFeature, setSelectedFeature] = useState<string>("navigation");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [symptomChecker, setSymptomChecker] = useState(false);

  // Enhanced AR features with QR scanning, symptom checker, virtual tours, and medicine ID
  const arFeatures = {
    navigation: {
      title: "AR Hospital Navigation",
      description: "Neon arrows guide patients through complex hospital layouts",
      icon: <NavigationIcon className="w-6 h-6" />,
      color: "text-neon-cyan",
      demo: "🚶‍♂️ → 📍 Emergency Room (2 mins)"
    },
    qrScanning: {
      title: "QR Code Hospital Info",
      description: "Scan QR codes to instantly get detailed hospital information",
      icon: <QrCode className="w-6 h-6" />,
      color: "text-neon-purple",
      demo: "📱 Scan → 🏥 KEM Hospital | ICU: 12 beds available"
    },
    symptomChecker: {
      title: "AR Symptom Checker",
      description: "Point camera at body part for AI-powered symptom guidance",
      icon: <Scan className="w-6 h-6" />,
      color: "text-green-400",
      demo: "📍 Point at chest → ❤️ Heart rate: Normal | BP: Check recommended"
    },
    medicineId: {
      title: "Medicine Identification",
      description: "Scan pills to verify authenticity and get drug information",
      icon: <Pill className="w-6 h-6" />,
      color: "text-orange-400",
      demo: "💊 Aspirin 325mg | ✅ Authentic | ⚠️ Take with food"
    },
    virtualTours: {
      title: "Virtual Hospital Tours",
      description: "Take virtual tours of hospitals before visiting",
      icon: <Building className="w-6 h-6" />,
      color: "text-pink-400",
      demo: "🏥 360° Tour → Emergency: 2min | ICU: 5min wait"
    },
    vitals: {
      title: "Vital Signs Overlay",
      description: "Real-time patient monitoring with AR visualization",
      icon: <Heart className="w-6 h-6" />,
      color: "text-red-400",
      demo: "💓 HR: 72 | 🌡️ 98.6°F | 💨 O2: 98%"
    },
    identification: {
      title: "Biometric Staff ID",
      description: "Instant biometric identification and role verification",
      icon: <Fingerprint className="w-6 h-6" />,
      color: "text-yellow-400",
      demo: "👨‍⚕️ Dr. Sharma | ✅ Verified | Cardiology Dept"
    },
    alerts: {
      title: "Emergency Alerts",
      description: "Critical notifications overlaid in real-time",
      icon: <Zap className="w-6 h-6" />,
      color: "text-red-500",
      demo: "🚨 Code Blue | Room 304 | 30 seconds ago"
    }
  };

  // Camera and QR scanning functionality
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access required for AR features. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate QR code detection
    setTimeout(() => {
      setScanResult('🏥 KEM Hospital | ICU: 12 beds available | Emergency: 5min wait');
      setTimeout(() => setScanResult(''), 5000);
    }, 2000);
  };

  const activateSymptomChecker = () => {
    setSymptomChecker(true);
    setTimeout(() => {
      alert('AI Analysis: Point camera at chest area for heart rate detection');
      setTimeout(() => {
        alert('✅ Heart Rate: 72 BPM (Normal) | Recommendation: Regular monitoring');
        setSymptomChecker(false);
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16" data-testid="ar-header">
              <h2 className="text-4xl font-bold mb-4 text-glow">🔮 Advanced AR Healthcare Suite</h2>
              <p className="text-xl opacity-80 mb-6">Next-generation augmented reality with QR scanning, symptom detection, and medicine verification</p>
              
              {/* AR Control Panel */}
              <div className="flex justify-center space-x-4 mb-8">
                <button 
                  onClick={isScanning ? stopCamera : startCamera}
                  className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                    isScanning ? 'border-2 border-red-400 animate-pulse' : 'border border-neon-cyan'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>{isScanning ? 'Stop Camera' : 'Start AR Camera'}</span>
                </button>
                
                <button 
                  onClick={simulateQRScan}
                  disabled={!isScanning}
                  className="px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 border border-neon-purple disabled:opacity-50"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Scan QR Code</span>
                </button>
                
                <button 
                  onClick={activateSymptomChecker}
                  className="px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 border border-green-400"
                >
                  <Scan className="w-5 h-5" />
                  <span>Symptom Check</span>
                </button>
              </div>
              
              {/* Live scan results */}
              {scanResult && (
                <div className="mb-6 p-4 glass-dark rounded-lg border border-neon-purple animate-pulse-glow">
                  <div className="text-neon-purple font-bold mb-2">📱 QR Scan Result:</div>
                  <div>{scanResult}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced AR Phone Mockup with Live Camera */}
              <GlassCard className="hover-glow relative overflow-hidden" data-testid="ar-mockup">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10"></div>
                
                {/* Phone Frame */}
                <div className="relative mx-auto max-w-sm">
                  <div className="bg-black rounded-[3rem] p-4 shadow-2xl">
                    <div className="bg-space-900 rounded-[2.5rem] p-6 relative overflow-hidden h-96">
                      {/* Live Camera View or Static Background */}
                      <div className="absolute inset-0">
                        {isScanning && videoRef.current ? (
                          <video 
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <img 
                              src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600" 
                              alt="Hospital corridor view" 
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-space-900/60 to-transparent"></div>
                          </>
                        )}
                        
                        {/* QR Code Detection Overlay */}
                        {isScanning && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="border-2 border-neon-cyan rounded-lg w-32 h-32 animate-pulse">
                              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-cyan"></div>
                              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-cyan"></div>
                              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-cyan"></div>
                              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-cyan"></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Symptom Checker Overlay */}
                        {symptomChecker && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 border-2 border-green-400 rounded-full animate-ping"></div>
                            <div className="absolute text-green-400 text-sm font-bold">Analyzing...</div>
                          </div>
                        )}
                      </div>
                      
                      {/* AR Overlays */}
                      <div className="relative z-10 h-full">
                        {/* Neon Navigation Arrows */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="flex items-center space-x-4 animate-pulse-glow">
                            <div className="w-8 h-2 bg-neon-cyan rounded-full"></div>
                            <div className="w-0 h-0 border-l-8 border-l-neon-cyan border-y-4 border-y-transparent"></div>
                          </div>
                        </div>
                        
                        {/* AR Info Cards */}
                        <div className="absolute top-4 right-4 glass-dark p-2 rounded-lg text-xs">
                          <div className="text-neon-cyan">📍 Emergency Room</div>
                          <div className="text-white/80">120m ahead</div>
                        </div>
                        
                        <div className="absolute bottom-4 left-4 glass-dark p-2 rounded-lg text-xs">
                          <div className="text-green-400">🟢 Dr. Available</div>
                          <div className="text-white/80">Room 203</div>
                        </div>
                        
                        {/* Dynamic Feature Demo */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                          <div className="glass-dark p-3 rounded-xl text-center animate-slide-up">
                            <div className={`${arFeatures[selectedFeature as keyof typeof arFeatures].color} mb-1`}>
                              {arFeatures[selectedFeature as keyof typeof arFeatures].icon}
                            </div>
                            <div className="text-xs">
                              {arFeatures[selectedFeature as keyof typeof arFeatures].demo}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Camera Icon */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center animate-pulse-glow">
                    <Camera className="w-6 h-6 text-neon-cyan" />
                  </div>
                </div>
              </GlassCard>

              {/* AR Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="w-3 h-3 bg-neon-purple rounded-full mr-3 animate-pulse-glow"></span>
                  AR Features
                </h3>
                
                {Object.entries(arFeatures).map(([key, feature]) => (
                  <GlassCard 
                    key={key}
                    className={`cursor-pointer transition-all hover-glow ${
                      selectedFeature === key ? 'border-2 border-current' : ''
                    }`}
                    onClick={() => setSelectedFeature(key)}
                    data-testid={`ar-feature-${key}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${feature.color} p-3 bg-current/20 rounded-lg`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-2 ${feature.color}`}>
                          {feature.title}
                        </h4>
                        <p className="text-sm opacity-90 mb-2">
                          {feature.description}
                        </p>
                        <div className="text-xs text-neon-purple">
                          Demo: {feature.demo}
                        </div>
                      </div>
                      {selectedFeature === key && (
                        <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse-glow"></div>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Enhanced AR Capabilities Grid */}
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-center mb-12 text-glow">🚀 Advanced AR Capabilities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                
                {/* QR Code Features */}
                <GlassCard className="hover-glow text-center p-6">
                  <QrCode className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-neon-purple mb-3">Smart QR Integration</h4>
                  <div className="space-y-2 text-sm">
                    <div>🏥 Hospital Information</div>
                    <div>🛏️ Bed Availability</div>
                    <div>👨‍⚕️ Doctor Schedules</div>
                    <div>💊 Pharmacy Stock</div>
                  </div>
                </GlassCard>
                
                {/* Biometric Features */}
                <GlassCard className="hover-glow text-center p-6">
                  <Fingerprint className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-yellow-400 mb-3">Biometric Security</h4>
                  <div className="space-y-2 text-sm">
                    <div>👆 Fingerprint Login</div>
                    <div>👁️ Face ID Verification</div>
                    <div>🎤 Voice Authentication</div>
                    <div>🔐 Multi-Factor Auth</div>
                  </div>
                </GlassCard>
                
                {/* Virtual Tours */}
                <GlassCard className="hover-glow text-center p-6">
                  <Building className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-pink-400 mb-3">Virtual Hospital Tours</h4>
                  <div className="space-y-2 text-sm">
                    <div>🏥 360° Hospital Views</div>
                    <div>🚪 Department Walkthroughs</div>
                    <div>⏱️ Wait Time Previews</div>
                    <div>📍 Interactive Floor Maps</div>
                  </div>
                </GlassCard>
                
              </div>
            </div>
            
            {/* AR Implementation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8" data-testid="ar-stats">
              <GlassCard className="text-center hover-glow">
                <Eye className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                <div className="text-2xl font-bold text-neon-cyan mb-2">95%</div>
                <div className="text-sm opacity-80">Navigation Accuracy</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <Smartphone className="w-8 h-8 text-neon-purple mx-auto mb-3" />
                <div className="text-2xl font-bold text-neon-purple mb-2">0.2s</div>
                <div className="text-sm opacity-80">Response Time</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <MapPin className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-400 mb-2">50+</div>
                <div className="text-sm opacity-80">Mapped Locations</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-sm opacity-80">Live Tracking</div>
              </GlassCard>
            </div>

            {/* Medicine Verification & AR Shopping */}
            <div className="mt-16">
              <GlassCard className="hover-glow" data-testid="ar-medicine">
                <h3 className="text-2xl font-semibold mb-8 text-center flex items-center justify-center">
                  <Pill className="w-8 h-8 text-orange-400 mr-3" />
                  Medicine ID & Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-orange-400 mb-4">Scan & Verify Features:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>💊 Pill identification & authenticity check</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>⚠️ Drug interaction warnings</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>📅 Expiration date alerts</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>📋 Dosage recommendations</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-neon-cyan mb-4">AR Shopping Integration:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="w-5 h-5 text-neon-cyan" />
                        <span>🏪 Nearby pharmacy finder</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-neon-cyan" />
                        <span>📍 Medicine availability tracker</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-neon-cyan" />
                        <span>💰 Price comparison tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            {/* Future Vision */}
            <div className="mt-16">
              <GlassCard className="hover-glow" data-testid="ar-future">
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  🌟 Next-Gen AR Healthcare Vision
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🔬</div>
                    <h4 className="font-semibold text-neon-cyan mb-2">AI Surgical Guidance</h4>
                    <p className="text-xs opacity-80">AR-assisted precision surgery with real-time neural networks</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🧬</div>
                    <h4 className="font-semibold text-green-400 mb-2">DNA Visualization</h4>
                    <p className="text-xs opacity-80">3D genetic data visualization for personalized medicine</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🤖</div>
                    <h4 className="font-semibold text-neon-purple mb-2">AI Diagnosis</h4>
                    <p className="text-xs opacity-80">Real-time symptom analysis with 95%+ accuracy</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl mb-3">🌐</div>
                    <h4 className="font-semibold text-pink-400 mb-2">Global Health Network</h4>
                    <p className="text-xs opacity-80">Connected AR experiences across global healthcare systems</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}