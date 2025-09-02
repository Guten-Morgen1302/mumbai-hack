import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import GlassCard from "@/components/glass-card";
import { 
  Video, Phone, MessageCircle, Calendar, Clock, User, Heart, 
  Stethoscope, Pill, FileText, Camera, Mic, Shield, 
  Truck, Package, AlertCircle, CheckCircle, Star, 
  Monitor, Activity, Wifi, Signal, Battery, Volume2
} from "lucide-react";

export default function Telemedicine() {
  const [activeService, setActiveService] = useState<'consultation' | 'monitoring' | 'pharmacy' | 'ai-triage'>('consultation');
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 72,
    bloodPressure: "120/80",
    oxygenSat: 98,
    temperature: 98.6,
    respiratoryRate: 16
  });

  // AI Triage System
  const [symptoms, setSymptoms] = useState('');
  const [triageResult, setTriageResult] = useState<any>(null);
  const [triageLoading, setTriageLoading] = useState(false);

  // Remote monitoring data
  const [monitoringDevices, setMonitoringDevices] = useState([
    {
      id: 1,
      name: "Smart Blood Pressure Monitor",
      status: "connected",
      batteryLevel: 85,
      lastReading: "2 minutes ago",
      value: "118/78 mmHg"
    },
    {
      id: 2,
      name: "Pulse Oximeter",
      status: "connected", 
      batteryLevel: 92,
      lastReading: "1 minute ago",
      value: "98% SpO2"
    },
    {
      id: 3,
      name: "Smart Thermometer",
      status: "disconnected",
      batteryLevel: 23,
      lastReading: "1 hour ago",
      value: "98.6°F"
    }
  ]);

  // Available doctors for consultation
  const availableDoctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "General Physician",
      rating: 4.9,
      experience: "12 years",
      consultationFee: 500,
      availability: "Available now",
      languages: ["English", "Hindi", "Gujarati"],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Rajesh Mehta",
      specialty: "Cardiologist", 
      rating: 4.8,
      experience: "18 years",
      consultationFee: 800,
      availability: "Next: 15 mins",
      languages: ["English", "Hindi", "Marathi"],
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Dr. Kavita Patel",
      specialty: "Pediatrician",
      rating: 4.9,
      experience: "10 years", 
      consultationFee: 600,
      availability: "Next: 8 mins",
      languages: ["English", "Hindi", "Gujarati"],
      image: "https://images.unsplash.com/photo-1594824172103-2c9ad45dd004?w=150&h=150&fit=crop&crop=face"
    }
  ];

  // Prescription delivery tracking
  const [prescriptionDelivery, setPrescriptionDelivery] = useState({
    orderId: "RX-2024-001",
    status: "In Transit",
    estimatedDelivery: "45 minutes", 
    deliveryPartner: "PharmEasy",
    trackingSteps: [
      { status: "Order Placed", time: "2:30 PM", completed: true },
      { status: "Pharmacy Processing", time: "2:45 PM", completed: true },
      { status: "Out for Delivery", time: "3:15 PM", completed: true },
      { status: "Delivered", time: "4:00 PM (estimated)", completed: false }
    ]
  });

  // AI Triage Analysis
  const runAITriage = async () => {
    if (!symptoms.trim()) {
      alert("Please describe your symptoms");
      return;
    }

    setTriageLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        urgencyLevel: symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('difficulty breathing') 
          ? 'HIGH' : symptoms.toLowerCase().includes('fever') || symptoms.toLowerCase().includes('headache')
          ? 'MEDIUM' : 'LOW',
        recommendations: symptoms.toLowerCase().includes('chest pain') 
          ? ["Seek immediate emergency care", "Call ambulance if symptoms worsen", "Take prescribed nitroglycerin if available"]
          : symptoms.toLowerCase().includes('fever')
          ? ["Schedule consultation within 24 hours", "Monitor temperature", "Stay hydrated", "Rest"]  
          : ["Schedule routine consultation", "Monitor symptoms", "Home care measures sufficient"],
        estimatedWaitTime: symptoms.toLowerCase().includes('chest pain') ? "Emergency - 0 minutes" : "15-30 minutes",
        suggestedSpecialist: symptoms.toLowerCase().includes('chest pain') ? "Cardiologist" : "General Physician",
        confidence: 94
      };
      
      setTriageResult(mockResults);
      setTriageLoading(false);
    }, 3000);
  };

  // Start video call simulation
  const startCall = (doctorName: string) => {
    setIsInCall(true);
    setCallDuration(0);
    alert(`📞 Connecting to ${doctorName}...\\n\\n🔒 End-to-end encrypted call\\n📹 HD video quality\\n🎤 Clear audio`);
  };

  const endCall = () => {
    setIsInCall(false);
    setCallDuration(0);
    alert("Call ended. Consultation summary and prescription will be sent to your email.");
  };

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-glow">🏥 Advanced Telemedicine Suite</h2>
              <p className="text-xl opacity-80">AI-powered healthcare delivery with remote monitoring and prescription management</p>
            </div>

            {/* Service Selection */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                onClick={() => setActiveService('ai-triage')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeService === 'ai-triage' ? 'border-2 border-neon-purple' : 'border border-gray-500'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>AI Triage</span>
              </button>
              
              <button 
                onClick={() => setActiveService('consultation')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeService === 'consultation' ? 'border-2 border-neon-cyan' : 'border border-gray-500'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Video Consultation</span>
              </button>
              
              <button 
                onClick={() => setActiveService('monitoring')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeService === 'monitoring' ? 'border-2 border-green-400' : 'border border-gray-500'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span>Remote Monitoring</span>
              </button>
              
              <button 
                onClick={() => setActiveService('pharmacy')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeService === 'pharmacy' ? 'border-2 border-orange-400' : 'border border-gray-500'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span>Prescription Delivery</span>
              </button>
            </div>

            {/* AI Triage System */}
            {activeService === 'ai-triage' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">🤖 AI-Powered Medical Triage</h3>
                  <p className="text-lg opacity-80">Describe your symptoms for instant AI analysis and priority assessment</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <GlassCard className="hover-glow">
                    <h4 className="text-xl font-bold text-neon-purple mb-4">Symptom Analysis</h4>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Describe your symptoms in detail:</label>
                        <textarea
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="w-full p-4 glass-dark rounded-lg border border-neon-purple/30 bg-black/20 text-white resize-none"
                          rows={4}
                          placeholder="e.g., I have been experiencing chest pain and shortness of breath for the last 2 hours..."
                        />
                      </div>
                      
                      <button
                        onClick={runAITriage}
                        disabled={triageLoading || !symptoms.trim()}
                        className="w-full p-3 bg-neon-purple/20 border border-neon-purple rounded-lg hover:bg-neon-purple/30 transition-all text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {triageLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing symptoms...</span>
                          </div>
                        ) : (
                          '🧠 Run AI Analysis'
                        )}
                      </button>
                    </div>
                  </GlassCard>
                  
                  {triageResult && (
                    <GlassCard className="hover-glow">
                      <h4 className="text-xl font-bold text-green-400 mb-4">AI Triage Results</h4>
                      
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${
                          triageResult.urgencyLevel === 'HIGH' ? 'bg-red-500/20 border-red-500' :
                          triageResult.urgencyLevel === 'MEDIUM' ? 'bg-orange-500/20 border-orange-500' :
                          'bg-green-500/20 border-green-500'
                        }`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold">Urgency Level:</span>
                            <span className={`font-bold ${
                              triageResult.urgencyLevel === 'HIGH' ? 'text-red-400' :
                              triageResult.urgencyLevel === 'MEDIUM' ? 'text-orange-400' :
                              'text-green-400'
                            }`}>
                              {triageResult.urgencyLevel}
                            </span>
                          </div>
                          <div className="text-sm opacity-80">
                            Estimated Wait Time: {triageResult.estimatedWaitTime}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-bold mb-2">Recommendations:</h5>
                          <ul className="space-y-1 text-sm">
                            {triageResult.recommendations.map((rec: string, idx: number) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>Suggested Specialist:</span>
                          <span className="text-neon-cyan font-bold">{triageResult.suggestedSpecialist}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span>AI Confidence:</span>
                          <span className="text-green-400 font-bold">{triageResult.confidence}%</span>
                        </div>
                        
                        {triageResult.urgencyLevel !== 'LOW' && (
                          <button
                            className="w-full p-3 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all text-white font-bold"
                            onClick={() => setActiveService('consultation')}
                          >
                            🚀 Book Immediate Consultation
                          </button>
                        )}
                      </div>
                    </GlassCard>
                  )}
                </div>
              </div>
            )}

            {/* Video Consultation */}
            {activeService === 'consultation' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">📹 Video Consultation</h3>
                  <p className="text-lg opacity-80">Connect with qualified doctors instantly</p>
                </div>
                
                {isInCall ? (
                  /* Active Call Interface */
                  <GlassCard className="hover-glow">
                    <div className="text-center mb-6">
                      <div className="w-32 h-32 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Video className="w-16 h-16 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-neon-cyan mb-2">Dr. Priya Sharma</h4>
                      <p className="text-lg opacity-80">General Physician</p>
                      <div className="text-xl font-mono text-green-400 mt-4">
                        {formatCallTime(callDuration)}
                      </div>
                    </div>
                    
                    {/* Call Controls */}
                    <div className="flex justify-center space-x-6">
                      <button className="w-14 h-14 bg-gray-600/20 border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600/30 transition-all">
                        <Mic className="w-6 h-6" />
                      </button>
                      <button className="w-14 h-14 bg-gray-600/20 border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600/30 transition-all">
                        <Camera className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={endCall}
                        className="w-14 h-14 bg-red-500/20 border border-red-500 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-all"
                      >
                        <Phone className="w-6 h-6" />
                      </button>
                      <button className="w-14 h-14 bg-gray-600/20 border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-600/30 transition-all">
                        <MessageCircle className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Connection Status */}
                    <div className="flex justify-center items-center space-x-4 mt-6 text-sm text-green-400">
                      <Wifi className="w-4 h-4" />
                      <span>Connection: Excellent</span>
                      <Signal className="w-4 h-4" />
                      <span>HD Quality</span>
                      <Shield className="w-4 h-4" />
                      <span>Encrypted</span>
                    </div>
                  </GlassCard>
                ) : (
                  /* Available Doctors */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {availableDoctors.map(doctor => (
                      <GlassCard key={doctor.id} className="hover-glow">
                        <div className="text-center mb-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-neon-cyan"
                          />
                          <h4 className="text-xl font-bold text-neon-cyan mb-1">{doctor.name}</h4>
                          <p className="text-sm text-neon-purple mb-2">{doctor.specialty}</p>
                          <div className="flex items-center justify-center space-x-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{doctor.rating} ({doctor.experience})</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6 text-sm">
                          <div className="flex justify-between">
                            <span>Consultation Fee:</span>
                            <span className="text-green-400 font-bold">₹{doctor.consultationFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Availability:</span>
                            <span className="text-orange-400 font-bold">{doctor.availability}</span>
                          </div>
                          <div>
                            <span>Languages: </span>
                            <span className="text-neon-cyan">{doctor.languages.join(", ")}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => startCall(doctor.name)}
                          className="w-full p-3 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all text-white font-bold"
                        >
                          📹 Start Video Call
                        </button>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Remote Monitoring */}
            {activeService === 'monitoring' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">📊 Remote Health Monitoring</h3>
                  <p className="text-lg opacity-80">Real-time vital signs tracking with connected devices</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Current Vital Signs */}
                  <GlassCard className="hover-glow">
                    <h4 className="text-xl font-bold text-green-400 mb-6">Current Vital Signs</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 glass-dark rounded-lg">
                        <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-400">{vitalSigns.heartRate}</div>
                        <div className="text-sm opacity-70">BPM</div>
                      </div>
                      
                      <div className="text-center p-4 glass-dark rounded-lg">
                        <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400">{vitalSigns.bloodPressure}</div>
                        <div className="text-sm opacity-70">mmHg</div>
                      </div>
                      
                      <div className="text-center p-4 glass-dark rounded-lg">
                        <Volume2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-400">{vitalSigns.oxygenSat}%</div>
                        <div className="text-sm opacity-70">SpO2</div>
                      </div>
                      
                      <div className="text-center p-4 glass-dark rounded-lg">
                        <Stethoscope className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-400">{vitalSigns.temperature}°F</div>
                        <div className="text-sm opacity-70">Temperature</div>
                      </div>
                    </div>
                    
                    <div className="text-center text-green-400 font-bold">
                      ✅ All vitals within normal range
                    </div>
                  </GlassCard>
                  
                  {/* Connected Devices */}
                  <GlassCard className="hover-glow">
                    <h4 className="text-xl font-bold text-neon-cyan mb-6">Connected Devices</h4>
                    
                    <div className="space-y-4">
                      {monitoringDevices.map(device => (
                        <div key={device.id} className="p-4 glass-dark rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold">{device.name}</h5>
                            <div className={`w-3 h-3 rounded-full ${
                              device.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className={device.status === 'connected' ? 'text-green-400' : 'text-red-400'}>
                                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span>Battery:</span>
                              <div className="flex items-center space-x-2">
                                <Battery className={`w-4 h-4 ${
                                  device.batteryLevel > 50 ? 'text-green-400' : 
                                  device.batteryLevel > 20 ? 'text-orange-400' : 'text-red-400'
                                }`} />
                                <span>{device.batteryLevel}%</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <span>Last Reading:</span>
                              <span className="text-neon-cyan">{device.lastReading}</span>
                            </div>
                            
                            <div className="flex justify-between font-bold">
                              <span>Value:</span>
                              <span className="text-green-400">{device.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full mt-6 p-3 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all text-white font-bold">
                      📱 Add New Device
                    </button>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* Prescription Delivery */}
            {activeService === 'pharmacy' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">🚚 Prescription Delivery</h3>
                  <p className="text-lg opacity-80">Track your medicine delivery in real-time</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Delivery Tracking */}
                  <GlassCard className="hover-glow">
                    <h4 className="text-xl font-bold text-orange-400 mb-6">Delivery Tracking</h4>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Order ID:</span>
                        <span className="text-neon-cyan">{prescriptionDelivery.orderId}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Status:</span>
                        <span className="text-green-400 font-bold">{prescriptionDelivery.status}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-bold">ETA:</span>
                        <span className="text-orange-400 font-bold">{prescriptionDelivery.estimatedDelivery}</span>
                      </div>
                      
                      {/* Delivery Progress */}
                      <div className="space-y-4">
                        {prescriptionDelivery.trackingSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center space-x-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-green-400 text-black' : 'bg-gray-600 text-white'
                            }`}>
                              {step.completed ? '✓' : idx + 1}
                            </div>
                            
                            <div className="flex-1">
                              <div className={`font-semibold ${step.completed ? 'text-green-400' : 'text-gray-400'}`}>
                                {step.status}
                              </div>
                              <div className="text-sm opacity-70">{step.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full p-3 bg-orange-400/20 border border-orange-400 rounded-lg hover:bg-orange-400/30 transition-all text-white font-bold">
                      📞 Contact Delivery Partner
                    </button>
                  </GlassCard>
                  
                  {/* Order Details */}
                  <GlassCard className="hover-glow">
                    <h4 className="text-xl font-bold text-neon-purple mb-6">Order Details</h4>
                    
                    <div className="space-y-4 mb-6">
                      <div className="p-4 glass-dark rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Pill className="w-6 h-6 text-neon-purple" />
                          <div>
                            <div className="font-bold">Paracetamol 500mg</div>
                            <div className="text-sm opacity-70">Qty: 20 tablets</div>
                          </div>
                        </div>
                        <div className="text-green-400 font-bold">₹45.00</div>
                      </div>
                      
                      <div className="p-4 glass-dark rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <Pill className="w-6 h-6 text-neon-purple" />
                          <div>
                            <div className="font-bold">Amoxicillin 250mg</div>
                            <div className="text-sm opacity-70">Qty: 10 capsules</div>
                          </div>
                        </div>
                        <div className="text-green-400 font-bold">₹125.00</div>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount:</span>
                          <span className="text-green-400">₹170.00</span>
                        </div>
                        <div className="flex justify-between text-sm opacity-70">
                          <span>Delivery Fee:</span>
                          <span>Free</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full p-3 bg-neon-purple/20 border border-neon-purple rounded-lg hover:bg-neon-purple/30 transition-all text-white font-bold">
                      📋 View Prescription
                    </button>
                  </GlassCard>
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </div>
  );
}