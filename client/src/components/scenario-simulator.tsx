import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import GlassCard from "./glass-card";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Factory, Worm, Activity, Users, Bed, AlertCircle, TrendingUp, Clock, MapPin, Bell } from "lucide-react";

interface SimulationResult {
  increase: string;
  timeframe: string;
  staff: {
    doctors: string;
    nurses: string;
    techs: string;
  };
  supplies: {
    oxygen: string;
    iv: string;
    vents: string;
  };
}

interface LiveMetrics {
  confidence: number;
  patientFlow: number;
  bedOccupancy: number;
  responseTime: number;
  criticalAlerts: number;
}

interface Notification {
  id: string;
  type: 'warning' | 'critical' | 'success';
  message: string;
  timestamp: string;
}

export default function ScenarioSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    confidence: 87,
    patientFlow: 245,
    bedOccupancy: 73,
    responseTime: 2.4,
    criticalAlerts: 3
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hospitalLayout, setHospitalLayout] = useState({
    emergency: { occupied: 18, total: 25, status: 'high' },
    icu: { occupied: 8, total: 12, status: 'critical' },
    general: { occupied: 142, total: 200, status: 'moderate' },
    surgery: { occupied: 3, total: 8, status: 'low' }
  });

  const simulationMutation = useMutation({
    mutationFn: async (scenario: string) => {
      const res = await apiRequest("POST", "/api/simulate-scenario", { scenario });
      return res.json();
    },
    onSuccess: (data) => {
      setSimulationResult(data);
    },
  });

  // Simulate live metrics updates
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        confidence: Math.max(70, Math.min(95, prev.confidence + (Math.random() - 0.5) * 4)),
        patientFlow: Math.max(200, Math.min(400, prev.patientFlow + (Math.random() - 0.5) * 20)),
        bedOccupancy: Math.max(60, Math.min(95, prev.bedOccupancy + (Math.random() - 0.5) * 3)),
        responseTime: Math.max(1.5, Math.min(4.0, prev.responseTime + (Math.random() - 0.5) * 0.3)),
        criticalAlerts: Math.max(0, Math.min(8, prev.criticalAlerts + Math.floor((Math.random() - 0.7) * 2)))
      }));
      
      // Random notifications
      if (Math.random() < 0.3) {
        const messages = [
          { type: 'warning' as const, message: 'ICU capacity approaching 90%' },
          { type: 'critical' as const, message: 'Emergency department overcrowded' },
          { type: 'success' as const, message: 'Additional staff deployed successfully' },
          { type: 'warning' as const, message: 'Oxygen supply running low in Ward 3' }
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...randomMsg,
          timestamp: new Date().toLocaleTimeString()
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario);
    setIsSimulating(true);
    simulationMutation.mutate(scenario);
    
    // Update hospital layout based on scenario
    setTimeout(() => {
      const layouts = {
        festival: {
          emergency: { occupied: 22, total: 25, status: 'critical' },
          icu: { occupied: 10, total: 12, status: 'critical' },
          general: { occupied: 180, total: 200, status: 'high' },
          surgery: { occupied: 6, total: 8, status: 'high' }
        },
        pollution: {
          emergency: { occupied: 20, total: 25, status: 'critical' },
          icu: { occupied: 9, total: 12, status: 'critical' },
          general: { occupied: 165, total: 200, status: 'high' },
          surgery: { occupied: 4, total: 8, status: 'moderate' }
        },
        epidemic: {
          emergency: { occupied: 24, total: 25, status: 'critical' },
          icu: { occupied: 11, total: 12, status: 'critical' },
          general: { occupied: 195, total: 200, status: 'critical' },
          surgery: { occupied: 7, total: 8, status: 'high' }
        }
      };
      setHospitalLayout(layouts[scenario as keyof typeof layouts] || layouts.festival);
    }, 1500);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getNotificationColor = (type: string) => {
    switch(type) {
      case 'critical': return 'border-red-500 text-red-400';
      case 'warning': return 'border-orange-500 text-orange-400';
      case 'success': return 'border-green-500 text-green-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  return (
    <section id="simulator" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16" data-testid="simulator-header">
          <h2 className="text-4xl font-bold mb-4 text-glow">AI Scenario Simulator</h2>
          <p className="text-xl opacity-80">Test surge management strategies with predictive modeling</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Live Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <GlassCard className="text-center p-4">
              <Activity className="w-6 h-6 mx-auto mb-2 text-neon-cyan" />
              <div className="text-2xl font-bold text-neon-cyan">{liveMetrics.confidence}%</div>
              <div className="text-xs opacity-70">AI Confidence</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-green-400">{liveMetrics.patientFlow}</div>
              <div className="text-xs opacity-70">Patient Flow/hr</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <Bed className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-orange-400">{liveMetrics.bedOccupancy}%</div>
              <div className="text-xs opacity-70">Bed Occupancy</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-purple-400">{liveMetrics.responseTime}s</div>
              <div className="text-xs opacity-70">Response Time</div>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold text-red-400">{liveMetrics.criticalAlerts}</div>
              <div className="text-xs opacity-70">Critical Alerts</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Scenario Selector */}
            <div className="lg:col-span-2">
              <GlassCard className="text-center" data-testid="scenario-selector">
                <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center">
                  <MapPin className="w-6 h-6 mr-2 text-neon-cyan" />
                  Emergency Scenario Simulator
                </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className={`glass-dark rounded-xl p-6 hover-glow neon-border transition-all ${
                  selectedScenario === 'festival' ? 'bg-neon-cyan/20' : ''
                }`}
                onClick={() => handleScenarioSelect('festival')}
                data-testid="scenario-festival"
              >
                <Calendar className="w-8 h-8 mx-auto mb-3 text-neon-cyan" />
                <div className="font-semibold">Festival Surge</div>
                <div className="text-sm opacity-70 mt-2">Ganesh Chaturthi weekend</div>
              </button>
              
              <button 
                className={`glass-dark rounded-xl p-6 hover-glow neon-border transition-all ${
                  selectedScenario === 'pollution' ? 'bg-neon-cyan/20' : ''
                }`}
                onClick={() => handleScenarioSelect('pollution')}
                data-testid="scenario-pollution"
              >
                <Factory className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                <div className="font-semibold">Pollution Spike</div>
                <div className="text-sm opacity-70 mt-2">AQI {'>'}400 emergency</div>
              </button>
              
              <button 
                className={`glass-dark rounded-xl p-6 hover-glow neon-border transition-all ${
                  selectedScenario === 'epidemic' ? 'bg-neon-cyan/20' : ''
                }`}
                onClick={() => handleScenarioSelect('epidemic')}
                data-testid="scenario-epidemic"
              >
                <Worm className="w-8 h-8 mx-auto mb-3 text-red-400" />
                <div className="font-semibold">Epidemic</div>
                <div className="text-sm opacity-70 mt-2">Viral outbreak scenario</div>
              </button>
            </div>
              </GlassCard>
            </div>

            {/* Live Notifications */}
            <div>
              <GlassCard className="h-full">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-neon-purple" />
                  Live Alerts
                  {notifications.length > 0 && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">No active alerts</div>
                      <div className="text-xs opacity-70">System monitoring...</div>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`glass-dark rounded-lg p-3 border-l-4 ${getNotificationColor(notification.type)} animate-slide-up`}
                      >
                        <div className="font-semibold text-sm">{notification.message}</div>
                        <div className="text-xs opacity-70 mt-1">{notification.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Interactive Hospital Layout */}
          <GlassCard className="mb-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Bed className="w-6 h-6 mr-2 text-neon-cyan" />
              Real-time Hospital Layout
              {isSimulating && <span className="ml-2 text-xs text-neon-cyan animate-pulse">● LIVE</span>}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(hospitalLayout).map(([dept, data]) => (
                <div key={dept} className="glass-dark rounded-lg p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold capitalize">{dept}</div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)} animate-pulse`}></div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{data.occupied}/{data.total}</div>
                  <div className="text-xs opacity-70 mb-3">beds occupied</div>
                  
                  {/* Animated bed visualization */}
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: Math.min(12, data.total) }).map((_, i) => (
                      <div 
                        key={i}
                        className={`w-2 h-2 rounded-sm transition-all duration-500 ${
                          i < data.occupied 
                            ? `${getStatusColor(data.status)} animate-pulse` 
                            : 'bg-gray-600'
                        }`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Occupancy percentage */}
                  <div className="mt-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span>Occupancy</span>
                      <span className="font-bold">{Math.round((data.occupied / data.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-1000 ${getStatusColor(data.status)}`}
                        style={{ width: `${(data.occupied / data.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Enhanced Simulation Results */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ${
              simulationResult ? 'opacity-100 animate-slide-up' : 'opacity-50'
            }`}
            data-testid="simulation-results"
          >
            {/* Prediction Card */}
            <GlassCard className="hover-glow" data-testid="prediction-card">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-3">📈</span>
                Predicted Patient Increase
              </h4>
              <div className="relative mb-4 rounded-lg overflow-hidden h-32">
                <img 
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                  alt="Healthcare data analytics dashboard" 
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
              <div className="text-3xl font-bold text-neon-cyan mb-2" data-testid="increase-percentage">
                {simulationResult?.increase || '+45%'}
              </div>
              <div className="text-sm opacity-70" data-testid="increase-timeframe">
                {simulationResult?.timeframe || 'Peak in 6-12 hours'}
              </div>
              <div className="mt-3 text-xs text-neon-purple">🤖 ML Model: EpiSurge v2.1</div>
            </GlassCard>

            {/* Staff Requirements */}
            <GlassCard className="hover-glow" data-testid="staff-card">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-3">👥</span>
                Staff Needed
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>ER Doctors</span>
                  <span className="text-neon-cyan font-bold" data-testid="doctors-needed">
                    {simulationResult?.staff?.doctors || '+6'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nurses</span>
                  <span className="text-neon-cyan font-bold" data-testid="nurses-needed">
                    {simulationResult?.staff?.nurses || '+12'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Technicians</span>
                  <span className="text-neon-cyan font-bold" data-testid="techs-needed">
                    {simulationResult?.staff?.techs || '+4'}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-xs text-neon-purple">📋 Schedule optimized</div>
            </GlassCard>

            {/* Supply Requirements */}
            <GlassCard className="hover-glow" data-testid="supplies-card">
              <h4 className="font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-3">📦</span>
                Supplies Required
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Oxygen Cylinders</span>
                  <span className="text-orange-400 font-bold" data-testid="oxygen-needed">
                    {simulationResult?.supplies?.oxygen || '25'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>IV Bags</span>
                  <span className="text-orange-400 font-bold" data-testid="iv-needed">
                    {simulationResult?.supplies?.iv || '150'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ventilators</span>
                  <span className="text-orange-400 font-bold" data-testid="vents-needed">
                    {simulationResult?.supplies?.vents || '3'}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-xs text-neon-purple">🚚 Auto-order initiated</div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
