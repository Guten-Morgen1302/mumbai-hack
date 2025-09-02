import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import GlassCard from "./glass-card";
import { 
  MapPin, Layers, Camera, Ambulance, Hospital as HospitalIcon, Waves, AlertTriangle, 
  Activity, Users, BedDouble, Zap, Eye, Navigation, Gauge, TrendingUp,
  Shield, Clock, Phone, Settings, Volume2, Target
} from "lucide-react";
import type { Hospital, DashboardStats } from "@shared/schema";

interface HospitalMarker {
  id: string;
  name: string;
  position: { top: string; left?: string; right?: string };
  realPosition: { lat: number; lng: number };
  status: 'good' | 'moderate' | 'critical';
  beds: number;
  icu: string;
  surge: string;
}

interface LayerState {
  hospitalLoad: boolean;
  pollution: boolean;
  outbreaks: boolean;
  ambulances: boolean;
  surgeZones: boolean;
  flowLines: boolean;
}

export default function MumbaiMap() {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [detailsModal, setDetailsModal] = useState<string | null>(null);
  const [arMode, setArMode] = useState(false);
  const [qrDetected, setQrDetected] = useState<string | null>(null);
  const [arNavigation, setArNavigation] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    hospitalLoad: true,
    pollution: false,
    outbreaks: false,
    ambulances: true,
    surgeZones: true,
    flowLines: true
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Data queries for all the advanced features
  const { data: hospitals } = useQuery<Hospital[]>({
    queryKey: ['/api/hospitals'],
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard-stats'],
  });

  const { data: heatmapData } = useQuery({
    queryKey: ['/api/map-heatmap'],
  });

  const { data: surgeZones } = useQuery({
    queryKey: ['/api/surge-zones'],
  });

  const { data: hospitalFlows } = useQuery({
    queryKey: ['/api/hospital-flows'],
    refetchInterval: 3000, // Update flows every 3 seconds
  });

  const { data: ambulances } = useQuery({
    queryKey: ['/api/ambulance-tracking'],
    refetchInterval: 2000, // Update ambulance positions every 2 seconds
  });

  const { data: hospitalSimulation } = useQuery({
    queryKey: ['/api/hospital-simulation', detailsModal],
    enabled: !!detailsModal,
  });

  // Hospital markers in extreme corners to avoid overlap
  const hospitalMarkers: HospitalMarker[] = [
    {
      id: '1',
      name: 'Kokilaben Hospital',
      position: { top: '10%', left: '5%' },
      realPosition: { lat: 19.0728, lng: 72.8826 },
      status: 'good',
      beds: 23,
      icu: 'Good',
      surge: '+12%'
    },
    {
      id: '2',
      name: 'Hinduja Hospital',
      position: { top: '10%', right: '5%' },
      realPosition: { lat: 19.0330, lng: 72.8697 },
      status: 'moderate',
      beds: 7,
      icu: 'Moderate',
      surge: '+28%'
    },
    {
      id: '3',
      name: 'Breach Candy Hospital',
      position: { top: '65%', left: '5%' },
      realPosition: { lat: 19.0176, lng: 72.8562 },
      status: 'good',
      beds: 31,
      icu: 'Excellent',
      surge: '+8%'
    },
    {
      id: '4',
      name: 'Jupiter Hospital',
      position: { top: '65%', right: '5%' },
      realPosition: { lat: 19.0456, lng: 72.8735 },
      status: 'critical',
      beds: 2,
      icu: 'Critical',
      surge: '+45%'
    }
  ];

  // AR Mode camera access - no automatic QR detection
  useEffect(() => {
    if (arMode) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      }).then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }).catch(() => {
        // Fallback for demo - keep AR mode but show demo overlay
        console.log("Camera not available - showing demo AR mode");
      });
    }
    
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [arMode]);

  // Handle QR code scanning with loading
  const startQrScan = () => {
    setIsScanning(true);
    
    // Show loading for 3-4 seconds then simulate QR detection
    setTimeout(() => {
      const qrTypes = [
        'hospital-kokilaben',
        'department-emergency', 
        'department-icu',
        'health-tips'
      ];
      const randomQR = qrTypes[Math.floor(Math.random() * qrTypes.length)];
      setIsScanning(false);
      setQrDetected(randomQR);
    }, 3500); // 3.5 seconds
  };

  // Handle QR code actions
  const handleQrAction = (qrCode: string) => {
    if (qrCode.startsWith('hospital-')) {
      const hospitalId = qrCode.split('-')[1];
      setDetailsModal('1'); // Show hospital details modal
      setQrDetected(null);
    } else if (qrCode.startsWith('department-')) {
      const dept = qrCode.split('-')[1];
      setArNavigation(dept);
      setQrDetected(null);
    } else if (qrCode === 'health-tips') {
      // Redirect to patient advisory
      window.open('/advisory', '_blank');
      setQrDetected(null);
    }
  };

  // Convert real coordinates to map position
  const coordToPosition = (lat: number, lng: number) => {
    // Mumbai bounds: lat 19.0-19.3, lng 72.7-73.0
    const latPercent = ((lat - 19.0) / 0.3) * 100;
    const lngPercent = ((lng - 72.7) / 0.3) * 100;
    return {
      top: `${Math.max(0, Math.min(100, 100 - latPercent))}%`,
      left: `${Math.max(0, Math.min(100, lngPercent))}%`
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-400';
      case 'moderate': return 'bg-orange-400';
      case 'critical': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'moderate': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const toggleLayer = (layerName: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  return (
    <section id="map" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Futuristic Header */}
        <div className="text-center mb-16" data-testid="map-header">
          <h2 className="text-5xl font-bold mb-4 text-glow">🧠 AI Health Command Center</h2>
          <p className="text-xl opacity-80">Advanced Predictive Intelligence & Emergency Response System</p>
        </div>

        {/* Fullscreen AR Mode - Outside all containers for true fullscreen */}
        {arMode && (
          <div className="fixed inset-0 z-[9999] bg-black">
            {/* Camera Feed or Demo Background */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Demo fallback background - cleaner, less blurry */}
            {!videoRef.current?.srcObject && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                <div className="absolute inset-0 opacity-60">
                  <img 
                    src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
                    alt="Hospital corridor view" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            
            {/* AR Overlays */}
            <div className="absolute inset-0">
              
              {/* Top UI Bar */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
                <div className="glass-dark rounded-xl p-3 flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold">AR Health Mode</span>
                  <Camera className="w-5 h-5 text-neon-cyan" />
                </div>
                
                <button
                  onClick={() => setArMode(false)}
                  className="glass-dark rounded-xl p-3 text-white hover:bg-red-500/20 transition-all"
                  data-testid="ar-exit-button"
                >
                  ✕
                </button>
              </div>

              {/* AR Hospital Markers - Tiny cards in corners */}
              {hospitalMarkers.map((hospital) => (
                <div 
                  key={`ar-${hospital.id}`}
                  className="absolute z-20"
                  style={{
                    top: hospital.position.top,
                    left: hospital.position.left || 'auto',
                    right: hospital.position.right || 'auto'
                  }}
                >
                  <div className="glass-dark rounded-md p-1.5 border border-neon-cyan/50 w-24">
                    <div className="flex items-center mb-1">
                      <HospitalIcon className={`w-2.5 h-2.5 mr-1 ${getStatusTextColor(hospital.status)}`} />
                      <div className="text-white font-bold text-xs truncate">{hospital.name.split(' ')[0]}</div>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="flex justify-between text-gray-300">
                        <span>Beds:</span>
                        <span className={getStatusTextColor(hospital.status)}>{hospital.beds}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>ICU:</span>
                        <span className={getStatusTextColor(hospital.status)}>{hospital.icu}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* QR Scanner - Main scan button */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                <button 
                  onClick={startQrScan}
                  disabled={isScanning}
                  className="glass-dark rounded-full px-6 py-3 border border-neon-purple hover:border-neon-cyan transition-all flex items-center space-x-3 disabled:opacity-50"
                >
                  <div className="w-8 h-8 border-2 border-neon-purple rounded-lg flex items-center justify-center animate-pulse">
                    <div className="text-lg">📱</div>
                  </div>
                  <div className="text-white font-bold">{isScanning ? 'Scanning...' : 'Scan QR Code'}</div>
                </button>
              </div>

              {/* QR Scanning Loading Screen */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="glass-dark rounded-2xl p-8 max-w-sm border border-neon-purple animate-slide-up">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 relative">
                        <div className="absolute inset-0 border-4 border-neon-purple/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-neon-purple rounded-full animate-spin"></div>
                        <div className="absolute inset-4 flex items-center justify-center">
                          <div className="text-2xl">🔍</div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-neon-purple mb-2">Scanning QR Code...</h3>
                      <p className="text-gray-300 text-sm">Hold your device steady</p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Detection Popup - Higher z-index to appear above everything */}
              {qrDetected && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="glass-dark rounded-2xl p-6 max-w-md border border-neon-cyan animate-slide-up">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-cyan rounded-full mb-4 animate-pulse-glow">
                        ✓
                      </div>
                      <h3 className="text-xl font-bold text-neon-cyan mb-2">QR Code Detected!</h3>
                      
                      {qrDetected.startsWith('hospital-') && (
                        <div>
                          <p className="text-gray-300 mb-4">Hospital information detected</p>
                          <button 
                            onClick={() => handleQrAction(qrDetected)}
                            className="w-full p-3 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all text-white font-bold"
                          >
                            View Live Hospital Status
                          </button>
                        </div>
                      )}
                      
                      {qrDetected.startsWith('department-') && (
                        <div>
                          <p className="text-gray-300 mb-4">Department navigation requested</p>
                          <button 
                            onClick={() => handleQrAction(qrDetected)}
                            className="w-full p-3 bg-green-400/20 border border-green-400 rounded-lg hover:bg-green-400/30 transition-all text-white font-bold"
                          >
                            Start AR Navigation
                          </button>
                        </div>
                      )}

                      {qrDetected === 'health-tips' && (
                        <div>
                          <p className="text-gray-300 mb-4">Health advisory information</p>
                          <button 
                            onClick={() => handleQrAction(qrDetected)}
                            className="w-full p-3 bg-purple-400/20 border border-purple-400 rounded-lg hover:bg-purple-400/30 transition-all text-white font-bold"
                          >
                            Open Patient Advisory
                          </button>
                        </div>
                      )}

                      <button 
                        onClick={() => setQrDetected(null)}
                        className="mt-3 text-gray-400 hover:text-white transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* AR Navigation Overlay - Better positioning and z-index */}
              {arNavigation && (
                <div className="absolute inset-0 flex items-center justify-center z-40">
                  <div className="glass-dark rounded-2xl p-6 max-w-md border border-green-400">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🧭</div>
                      <h3 className="text-2xl font-bold text-green-400 mb-4">AR Navigation Active</h3>
                      <p className="text-gray-300 mb-6">Follow the glowing arrows to reach the {arNavigation.toUpperCase()}</p>
                      
                      {/* Simulated AR Direction Arrows */}
                      <div className="relative h-32 mb-6">
                        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 text-green-400 text-4xl animate-bounce">↑</div>
                        <div className="absolute left-1/2 top-8 transform -translate-x-1/2 text-green-400 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>↑</div>
                        <div className="absolute left-1/2 top-16 transform -translate-x-1/2 text-green-400 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>↑</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Distance:</span>
                          <span className="text-green-400 font-bold">47 meters</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">ETA:</span>
                          <span className="text-green-400 font-bold">2 minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Next Turn:</span>
                          <span className="text-green-400 font-bold">Right in 15m</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setArNavigation(null)}
                        className="mt-6 w-full p-3 bg-gray-600/20 border border-gray-400 rounded-lg hover:bg-gray-600/30 transition-all text-white"
                      >
                        End Navigation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Layer Controls Panel */}
          <div className="xl:col-span-1 space-y-4">
            <GlassCard className="hover-glow" data-testid="layer-controls">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-neon-cyan" />
                Multi-Layer Controls
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => toggleLayer('hospitalLoad')}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    layers.hospitalLoad ? 'bg-neon-cyan/20 border border-neon-cyan' : 'bg-gray-800/50'
                  }`}
                  data-testid="layer-hospital-load"
                >
                  <div className="flex items-center">
                    <HospitalIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">Hospital Load</span>
                  </div>
                  {layers.hospitalLoad && <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>}
                </button>

                <button
                  onClick={() => toggleLayer('pollution')}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    layers.pollution ? 'bg-orange-400/20 border border-orange-400' : 'bg-gray-800/50'
                  }`}
                  data-testid="layer-pollution"
                >
                  <div className="flex items-center">
                    <Waves className="w-4 h-4 mr-2" />
                    <span className="text-sm">Pollution/AQI</span>
                  </div>
                  {layers.pollution && <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>}
                </button>

                <button
                  onClick={() => toggleLayer('outbreaks')}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    layers.outbreaks ? 'bg-red-400/20 border border-red-400' : 'bg-gray-800/50'
                  }`}
                  data-testid="layer-outbreaks"
                >
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Disease Outbreaks</span>
                  </div>
                  {layers.outbreaks && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>}
                </button>

                <button
                  onClick={() => toggleLayer('ambulances')}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    layers.ambulances ? 'bg-blue-400/20 border border-blue-400' : 'bg-gray-800/50'
                  }`}
                  data-testid="layer-ambulances"
                >
                  <div className="flex items-center">
                    <Ambulance className="w-4 h-4 mr-2" />
                    <span className="text-sm">Live Ambulances</span>
                  </div>
                  {layers.ambulances && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                </button>

                <button
                  onClick={() => toggleLayer('surgeZones')}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    layers.surgeZones ? 'bg-purple-400/20 border border-purple-400' : 'bg-gray-800/50'
                  }`}
                  data-testid="layer-surge-zones"
                >
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-sm">Surge Zones</span>
                  </div>
                  {layers.surgeZones && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
                </button>

                <button
                  onClick={() => toggleLayer('flowLines')}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    layers.flowLines ? 'bg-green-400/20 border border-green-400' : 'bg-gray-800/50'
                  }`}
                  data-testid="layer-flow-lines"
                >
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    <span className="text-sm">Flow Lines</span>
                  </div>
                  {layers.flowLines && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                </button>
              </div>

              {/* AR Mode Toggle */}
              <div className="mt-6 pt-4 border-t border-gray-600">
                <button
                  onClick={() => setArMode(!arMode)}
                  className={`w-full p-4 rounded-lg flex items-center justify-center space-x-3 transition-all ${
                    arMode ? 'bg-neon-purple/30 border border-neon-purple animate-pulse-glow' : 'bg-gray-800/50 hover:bg-neon-purple/10'
                  }`}
                  data-testid="ar-mode-toggle"
                >
                  <Camera className="w-5 h-5" />
                  <span className="font-bold">{arMode ? 'Exit AR Mode' : 'Enter AR Mode'}</span>
                </button>
              </div>
            </GlassCard>

            {/* Emergency Stats */}
            <GlassCard className="hover-glow">
              <h4 className="font-bold mb-3 text-neon-cyan flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Emergency Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Alerts:</span>
                  <span className="text-red-400 font-bold">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Ambulances Active:</span>
                  <span className="text-blue-400 font-bold">{Array.isArray(ambulances) ? ambulances.filter((a: any) => a.status !== 'available').length : 8}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-green-400 font-bold">12 min</span>
                </div>
                <div className="flex justify-between">
                  <span>Surge Risk:</span>
                  <span className="text-orange-400 font-bold">Medium</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Main Map Display */}
          <div className="xl:col-span-3">
            <GlassCard className="hover-glow relative" data-testid="map-container">

              {/* Regular Map View */}
              {!arMode && (
                <div className="relative bg-space-900 rounded-2xl overflow-hidden h-96 md:h-[700px]">
                  
                  {/* Enhanced Mumbai Background */}
                  <div className="absolute inset-0">
                    <img 
                      src="https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=800" 
                      alt="Mumbai AI Health Command Center" 
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-space-900/50 to-space-900/70"></div>
                    
                    {/* Futuristic Grid Overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10"></div>
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                      }}></div>
                    </div>
                  </div>

                  {/* AI Heatmap Layers */}
                  {layers.pollution && Array.isArray(heatmapData?.pollution) && heatmapData.pollution.map((point: any, idx: number) => {
                    const pos = coordToPosition(point.lat, point.lng);
                    return (
                      <div
                        key={`pollution-${idx}`}
                        className="absolute rounded-full animate-pulse opacity-70"
                        style={{
                          ...pos,
                          width: `${point.radius * 800}px`,
                          height: `${point.radius * 800}px`,
                          background: `radial-gradient(circle, rgba(239, 68, 68, ${point.intensity * 0.6}) 0%, transparent 80%)`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 5
                        }}
                      />
                    );
                  })}

                  {layers.outbreaks && Array.isArray(heatmapData?.outbreaks) && heatmapData.outbreaks.map((point: any, idx: number) => {
                    const pos = coordToPosition(point.lat, point.lng);
                    return (
                      <div
                        key={`outbreak-${idx}`}
                        className="absolute rounded-full animate-pulse opacity-50"
                        style={{
                          ...pos,
                          width: `${point.radius * 900}px`,
                          height: `${point.radius * 900}px`,
                          background: `radial-gradient(circle, rgba(147, 51, 234, ${point.intensity * 0.5}) 0%, transparent 85%)`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 6
                        }}
                      />
                    );
                  })}

                  {/* Predictive Surge Zones */}
                  {layers.surgeZones && Array.isArray(surgeZones) && surgeZones.map((zone: any) => {
                    const centerLat = zone.coordinates.reduce((sum: number, coord: any) => sum + coord.lat, 0) / zone.coordinates.length;
                    const centerLng = zone.coordinates.reduce((sum: number, coord: any) => sum + coord.lng, 0) / zone.coordinates.length;
                    const pos = coordToPosition(centerLat, centerLng);
                    
                    return (
                      <div
                        key={zone.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ ...pos, zIndex: 8 }}
                      >
                        <div className={`
                          w-28 h-28 rounded-full animate-pulse-glow border-3 border-dashed
                          ${zone.riskLevel === 'high' ? 'border-red-400 bg-red-400/15' : 
                            zone.riskLevel === 'medium' ? 'border-orange-400 bg-orange-400/15' : 
                            'border-yellow-400 bg-yellow-400/15'}
                        `}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-xs font-bold">{zone.name}</div>
                              <div className="text-xs">{zone.surgePrediction}</div>
                              <div className="text-xs opacity-70">{zone.timeframe}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Hospital Flow Lines */}
                  {layers.flowLines && Array.isArray(hospitalFlows) && hospitalFlows.map((flow: any, idx: number) => {
                    const fromPos = coordToPosition(flow.from.lat, flow.from.lng);
                    const toPos = coordToPosition(flow.to.lat, flow.to.lng);
                    
                    return (
                      <svg
                        key={`flow-${idx}`}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ zIndex: 12 }}
                      >
                        <defs>
                          <linearGradient id={`flowGradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={flow.urgency === 'high' ? '#EF4444' : flow.urgency === 'medium' ? '#F59E0B' : '#10B981'} />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        <line
                          x1={fromPos.left}
                          y1={fromPos.top}
                          x2={toPos.left}
                          y2={toPos.top}
                          stroke={`url(#flowGradient-${idx})`}
                          strokeWidth="3"
                          strokeDasharray="10,5"
                          className="animate-pulse"
                        />
                        
                        {/* Flow Animation */}
                        <circle
                          r="4"
                          fill={flow.urgency === 'high' ? '#EF4444' : flow.urgency === 'medium' ? '#F59E0B' : '#10B981'}
                          className="animate-pulse"
                        >
                          <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path={`M${fromPos.left},${fromPos.top} L${toPos.left},${toPos.top}`}
                          />
                        </circle>
                      </svg>
                    );
                  })}

                  {/* Live Ambulance Tracking */}
                  {layers.ambulances && Array.isArray(ambulances) && ambulances.map((ambulance: any) => {
                    const pos = coordToPosition(ambulance.currentPosition.lat, ambulance.currentPosition.lng);
                    
                    return (
                      <div
                        key={ambulance.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ ...pos, zIndex: 25 }}
                      >
                        <div className={`
                          p-1 rounded-full animate-pulse-glow
                          ${ambulance.priority === 'critical' ? 'bg-red-500' : 
                            ambulance.priority === 'high' ? 'bg-orange-500' : 
                            'bg-green-500'}
                        `}>
                          <Ambulance className="w-4 h-4 text-white" />
                        </div>
                        
                        {ambulance.status === 'emergency' && (
                          <div className="absolute -top-8 -left-6 bg-red-500 text-white px-2 py-1 rounded text-xs animate-bounce">
                            {ambulance.eta}min
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Enhanced Hospital Markers */}
                  {hospitalMarkers.map((hospital) => (
                    <div 
                      key={hospital.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ ...hospital.position, zIndex: 30 }}
                    >
                      <div 
                        className="relative cursor-pointer group"
                        onMouseEnter={() => setSelectedHospital(hospital.id)}
                        onMouseLeave={() => setSelectedHospital(null)}
                        onClick={() => setDetailsModal(hospital.id)}
                        data-testid={`hospital-marker-${hospital.id}`}
                      >
                        {/* Pulsing Glow Ring */}
                        <div className={`absolute inset-0 w-12 h-12 ${getStatusColor(hospital.status).replace('bg-', 'border-')} border-2 rounded-full animate-ping opacity-30`}></div>
                        
                        {/* Main Marker */}
                        <div className={`relative w-8 h-8 ${getStatusColor(hospital.status)} rounded-full animate-pulse-glow group-hover:scale-125 transition-all duration-300 flex items-center justify-center border-2 border-white/50`}>
                          <HospitalIcon className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Hover Popup */}
                        {selectedHospital === hospital.id && (
                          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-40">
                            <GlassCard 
                              variant="glass-dark" 
                              className="min-w-64 text-sm animate-slide-up border border-neon-cyan"
                              data-testid={`hospital-popup-${hospital.id}`}
                            >
                              <div className="flex items-center mb-3">
                                <HospitalIcon className={`w-5 h-5 mr-2 ${getStatusTextColor(hospital.status)}`} />
                                <h4 className={`font-semibold ${getStatusTextColor(hospital.status)}`}>
                                  {hospital.name}
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="text-xs text-gray-400">Available Beds</div>
                                  <div className={`font-bold ${getStatusTextColor(hospital.status)}`}>
                                    {hospital.beds}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">ICU Status</div>
                                  <div className={getStatusTextColor(hospital.status)}>
                                    {hospital.icu}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">AI Prediction</div>
                                  <div className="text-neon-cyan font-bold">{hospital.surge}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">Load Status</div>
                                  <div className={getStatusTextColor(hospital.status)}>
                                    {hospital.status.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetailsModal(hospital.id);
                                }}
                                className="w-full mt-3 p-2 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all text-xs font-bold"
                              >
                                Open Live Simulation
                              </button>
                            </GlassCard>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Enhanced Legend */}
                  <div className="absolute bottom-6 left-6 glass-dark rounded-xl p-4 border border-neon-cyan/30" data-testid="map-legend">
                    <h4 className="font-semibold mb-3 text-sm text-neon-cyan flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Intelligence Layers
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Good Capacity</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Moderate Load</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Critical Status</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                        <span>Live Ambulances</span>
                      </div>
                    </div>
                  </div>

                  {/* Live City Stats */}
                  <div className="absolute top-6 right-6 glass-dark rounded-xl p-4 border border-neon-purple/30" data-testid="city-stats">
                    <h4 className="font-semibold mb-3 text-sm text-neon-purple flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Live City Metrics
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Active Hospitals:</span>
                        <span className="text-neon-cyan font-bold">{stats?.cityOverview?.totalHospitals || '47'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Beds:</span>
                        <span className="text-green-400 font-bold">{stats?.cityOverview?.availableBeds || '1,247'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ICU Utilization:</span>
                        <span className="text-orange-400 font-bold">{stats?.cityOverview?.icuCapacity || '73'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Risk Level:</span>
                        <span className="text-red-400 font-bold animate-pulse">{stats?.cityOverview?.alertLevel || 'Medium'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="text-neon-cyan font-bold">12 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Hospital Simulation Modal */}
        {detailsModal && hospitalSimulation && hospitalSimulation.realTimeData && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassCard className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-neon-cyan">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neon-cyan flex items-center">
                  <Activity className="w-6 h-6 mr-3" />
                  Live Hospital Simulation
                </h3>
                <button 
                  onClick={() => setDetailsModal(null)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Bed Usage */}
                <GlassCard variant="glass-dark" className="border border-blue-400/30">
                  <h4 className="font-bold mb-4 text-blue-400 flex items-center">
                    <BedDouble className="w-5 h-5 mr-2" />
                    Bed Utilization
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Occupied</span>
                        <span className="text-blue-400 font-bold">{hospitalSimulation?.realTimeData?.bedUsage?.occupied || 0}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 h-3 rounded-full animate-pulse"
                          style={{ width: `${((hospitalSimulation?.realTimeData?.bedUsage?.occupied || 0) / (hospitalSimulation?.realTimeData?.bedUsage?.total || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Available</span>
                        <span className="text-green-400 font-bold">{hospitalSimulation?.realTimeData?.bedUsage?.available || 0}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full"
                          style={{ width: `${((hospitalSimulation?.realTimeData?.bedUsage?.available || 0) / (hospitalSimulation?.realTimeData?.bedUsage?.total || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Staff Workload */}
                <GlassCard variant="glass-dark" className="border border-green-400/30">
                  <h4 className="font-bold mb-4 text-green-400 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Staff Workload
                  </h4>
                  <div className="space-y-4">
                    {hospitalSimulation?.realTimeData?.staffWorkload && Object.entries(hospitalSimulation.realTimeData.staffWorkload).map(([role, data]: [string, any]) => (
                      <div key={role}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{role}</span>
                          <span className="text-green-400 font-bold">{data.workload}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${data.workload > 90 ? 'bg-red-400' : data.workload > 70 ? 'bg-orange-400' : 'bg-green-400'}`}
                            style={{ width: `${data.workload}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {data.current}/{data.required} staff
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Emergency Queue */}
                <GlassCard variant="glass-dark" className="border border-orange-400/30">
                  <h4 className="font-bold mb-4 text-orange-400 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Emergency Queue
                  </h4>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{hospitalSimulation?.realTimeData?.emergencyQueue?.waiting || 0}</div>
                      <div className="text-sm text-gray-400">Patients Waiting</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{hospitalSimulation?.realTimeData?.emergencyQueue?.avgWaitTime || 0}min</div>
                      <div className="text-sm text-gray-400">Avg Wait Time</div>
                    </div>

                    <div className="space-y-2">
                      {hospitalSimulation?.realTimeData?.emergencyQueue?.priority && Object.entries(hospitalSimulation.realTimeData.emergencyQueue.priority).map(([priority, count]: [string, any]) => (
                        <div key={priority} className="flex justify-between text-sm">
                          <span className="capitalize">{priority}:</span>
                          <span className={`font-bold ${priority === 'critical' ? 'text-red-400' : priority === 'high' ? 'text-orange-400' : 'text-yellow-400'}`}>
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* AI Predictions */}
              <div className="mt-6">
                <GlassCard variant="glass-dark" className="border border-purple-400/30">
                  <h4 className="font-bold mb-4 text-purple-400 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    AI Predictions & Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">{hospitalSimulation?.predictions?.nextHourInflow || 0}</div>
                      <div className="text-sm text-gray-400">Next Hour Inflow</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-400">{hospitalSimulation?.predictions?.surgeProbability || 0}%</div>
                      <div className="text-sm text-gray-400">Surge Probability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">+{hospitalSimulation?.predictions?.resourceNeeds?.extraStaff || 0}</div>
                      <div className="text-sm text-gray-400">Staff Needed</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
