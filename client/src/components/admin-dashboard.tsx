import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import GlassCard from "./glass-card";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, AlertTriangle, Users, Package, TrendingUp, TrendingDown, 
  Volume2, VolumeX, Trophy, Medal, Award, Zap, Target, Clock, Brain,
  ChevronUp, ChevronDown, Siren
} from "lucide-react";
import type { DashboardStats, AiPrediction } from "@shared/schema";
import { 
  LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Bar
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Chart configurations
const chartConfig = {
  predicted: { label: "Predicted", color: "hsl(var(--chart-1))" },
  confidence: { label: "Confidence", color: "hsl(var(--chart-2))" },
  upperBound: { label: "Upper Bound", color: "hsl(var(--chart-3))" },
  lowerBound: { label: "Lower Bound", color: "hsl(var(--chart-4))" }
};

export default function AdminDashboard() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentUser } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard-stats'],
  });

  const { data: forecast } = useQuery<any[]>({
    queryKey: ['/api/surge-forecast'],
  });

  const { data: leaderboard } = useQuery<any[]>({
    queryKey: ['/api/hospital-leaderboard'],
  });

  const { data: optimization } = useQuery<any>({
    queryKey: ['/api/resource-optimization'],
  });

  const { data: emergencyAlerts } = useQuery<any[]>({
    queryKey: ['/api/emergency-alerts'],
    refetchInterval: 5000, // Check for new alerts every 5 seconds
  });

  // Sound alert system
  useEffect(() => {
    if (emergencyAlerts && emergencyAlerts.length > 0 && soundEnabled) {
      const newCriticalAlerts = emergencyAlerts.filter(
        (alert: any) => alert.level === 'critical' && alert.soundAlert
      ) || [];
      
      if (newCriticalAlerts.length > criticalAlerts.length) {
        // Play alert sound for new critical alerts
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
        setCriticalAlerts(newCriticalAlerts);
      }
    }
  }, [emergencyAlerts, soundEnabled, criticalAlerts.length]);

  // Radar chart data for hospital performance
  const radarData = [
    { metric: 'Efficiency', score: 85, fullMark: 100 },
    { metric: 'Patient Satisfaction', score: 92, fullMark: 100 },
    { metric: 'Response Time', score: 78, fullMark: 100 },
    { metric: 'Resource Usage', score: 88, fullMark: 100 },
    { metric: 'Safety Score', score: 95, fullMark: 100 },
    { metric: 'Technology', score: 82, fullMark: 100 }
  ];

  return (
    <section id="dashboard" className="py-20 px-6">
      <div className="container mx-auto">
        {/* Emergency Alert Audio */}
        <audio ref={audioRef} preload="auto">
          <source src="data:audio/mpeg;base64,//uQRAAAAWMSLwUIYAAsYkXgQgAOGFkCAwgFAwsJBwmAyCPnGhIAME4AHwgABGpMwQAIEBgIBJ4AJAkJEAAAGAQgQGBgIDA4AAAGAQgQGBgIDA4AAAGAQgQGBgIDA4AAAGAQgQGBgI" type="audio/mpeg" />
        </audio>

        {/* Header with Welcome Message and Sound Toggle */}
        <div className="text-center mb-16" data-testid="dashboard-header">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <div className="text-2xl text-neon-cyan font-semibold mb-2">
                Welcome back, {currentUser?.displayName || 'User'}! 🔥
              </div>
              <div className="text-lg">
                <span className="text-green-400 font-bold">System Preparedness: 92%</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-orange-400">3 Active Alerts</span>
              </div>
            </div>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-full glass-dark hover-glow transition-all border ${
                soundEnabled ? 'text-neon-cyan border-neon-cyan' : 'text-gray-500 border-gray-500'
              }`}
              data-testid="sound-toggle"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>
          
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-4xl font-bold text-glow">🧠 AI Command Center</h2>
          </div>
          <p className="text-xl opacity-80">Advanced Healthcare Intelligence & Predictive Analytics</p>
        </div>

        {/* Critical Emergency Alerts Banner */}
        {emergencyAlerts && emergencyAlerts.filter((alert: any) => alert.level === 'critical').length > 0 && (
          <div className="mb-8" data-testid="critical-alerts-banner">
            <GlassCard className="border-red-500 border-2 bg-red-900/20 animate-pulse">
              <div className="flex items-center space-x-4">
                <Siren className="w-8 h-8 text-red-400 animate-spin" />
                <div>
                  <h3 className="text-xl font-bold text-red-400">CRITICAL ALERT ACTIVE</h3>
                  <p className="text-red-200">
                    {emergencyAlerts && emergencyAlerts.filter((alert: any) => alert.level === 'critical')[0]?.message}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Predictive Analytics */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* 7-Day Surge Forecast with Confidence Intervals */}
            <GlassCard className="hover-glow" data-testid="surge-forecast-card">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Brain className="w-6 h-6 text-neon-cyan mr-3" />
                🔮 AI Surge Prediction Timeline
              </h3>
              
              <div className="h-80 w-full">
                <ResponsiveContainer>
                  <ComposedChart data={forecast || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid #06B6D4',
                        borderRadius: '8px'
                      }}
                    />
                    
                    {/* Confidence Interval Area */}
                    <Area 
                      type="monotone" 
                      dataKey="upperBound" 
                      stackId="1"
                      stroke="none"
                      fill="rgba(6, 182, 212, 0.1)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lowerBound" 
                      stackId="1"
                      stroke="none"
                      fill="rgba(6, 182, 212, 0.1)"
                    />
                    
                    {/* Main Prediction Line */}
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                    />
                    
                    {/* Confidence Bar */}
                    <Bar dataKey="confidence" fill="#A855F7" opacity={0.6} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-neon-cyan font-bold">Next 24h</div>
                  <div className="text-orange-400">Medium Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-neon-purple font-bold">Avg Confidence</div>
                  <div className="text-green-400">87%</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold">Peak Expected</div>
                  <div className="text-red-400">Day 6-7</div>
                </div>
              </div>
            </GlassCard>

            {/* Resource Optimization Engine */}
            <GlassCard className="hover-glow" data-testid="resource-optimization-card">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Target className="w-6 h-6 text-orange-400 mr-3" />
                🎯 AI Resource Optimization
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Staffing Optimization */}
                <div>
                  <h4 className="font-bold text-neon-cyan mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Staffing
                  </h4>
                  <div className="space-y-3">
                    {optimization && optimization.staffing && optimization.staffing.map((item: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                        item.urgency === 'high' ? 'border-red-400 bg-red-900/20' : 'border-yellow-400 bg-yellow-900/20'
                      }`}>
                        <div className="font-semibold text-sm">{item.department}</div>
                        <div className="text-xs text-gray-300">{item.action}</div>
                        <div className="text-xs text-neon-purple mt-1">{item.impact}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment Optimization */}
                <div>
                  <h4 className="font-bold text-neon-purple mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Equipment
                  </h4>
                  <div className="space-y-3">
                    {optimization && optimization.equipment && optimization.equipment.map((item: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                        item.urgency === 'critical' ? 'border-red-400 bg-red-900/20' : 'border-orange-400 bg-orange-900/20'
                      }`}>
                        <div className="font-semibold text-sm">{item.item}</div>
                        <div className="text-xs text-gray-300">{item.current} → {item.recommended}</div>
                        <div className="text-xs text-neon-cyan mt-1">ETA: {item.eta}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bed Optimization */}
                <div>
                  <h4 className="font-bold text-green-400 mb-3 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Beds
                  </h4>
                  <div className="space-y-3">
                    {optimization && optimization.beds && optimization.beds.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg border-l-4 border-green-400 bg-green-900/20">
                        <div className="font-semibold text-sm">{item.type} Beds</div>
                        <div className="text-xs text-gray-300">{item.current}% → {item.recommended}%</div>
                        <div className="text-xs text-green-400 mt-1">{item.action}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Real-time Patient Flow with Multiple Chart Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Line Chart - Patient Inflow Trends */}
              <GlassCard className="hover-glow" data-testid="patient-flow-chart">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-neon-cyan mr-2" />
                  Patient Flow Trends
                </h3>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <LineChart data={[
                      { time: '6AM', emergency: 8, icu: 5, general: 12 },
                      { time: '9AM', emergency: 15, icu: 8, general: 23 },
                      { time: '12PM', emergency: 22, icu: 12, general: 31 },
                      { time: '3PM', emergency: 18, icu: 10, general: 28 },
                      { time: '6PM', emergency: 25, icu: 15, general: 35 },
                      { time: '9PM', emergency: 12, icu: 8, general: 20 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Line type="monotone" dataKey="emergency" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="icu" stroke="#06B6D4" strokeWidth={2} />
                      <Line type="monotone" dataKey="general" stroke="#A855F7" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Radar Chart - Hospital Performance */}
              <GlassCard className="hover-glow" data-testid="performance-radar">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-neon-purple mr-2" />
                  Performance Radar
                </h3>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      />
                      <Radar
                        name="Performance"
                        dataKey="score"
                        stroke="#06B6D4"
                        fill="#06B6D4"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column - Hospital Leaderboard & Emergency Alerts */}
          <div className="space-y-8">
            
            {/* Hospital Performance Leaderboard */}
            <GlassCard className="hover-glow" data-testid="hospital-leaderboard">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
                🏆 Hospital Leaderboard
              </h3>
              
              <div className="space-y-4">
                {leaderboard && leaderboard.slice(0, 8).map((hospital: any, idx: number) => (
                  <div key={hospital.id} className={`p-4 rounded-lg ${
                    idx === 0 ? 'bg-yellow-900/30 border border-yellow-400' :
                    idx === 1 ? 'bg-gray-800/30 border border-gray-400' :
                    idx === 2 ? 'bg-orange-900/30 border border-orange-400' :
                    'bg-gray-800/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        {idx === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                        {idx === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                        {idx === 2 && <Award className="w-5 h-5 text-orange-400" />}
                        <div>
                          <div className="font-semibold text-sm">{hospital.name}</div>
                          <div className="text-xs text-gray-400">
                            Efficiency: {hospital.efficiency}% | Response: {hospital.responseTime}min
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg font-bold text-neon-cyan">{hospital.score}</span>
                          {hospital.trend === 'up' ? 
                            <ChevronUp className="w-4 h-4 text-green-400" /> :
                            <ChevronDown className="w-4 h-4 text-red-400" />
                          }
                        </div>
                        <div className="text-xs text-gray-400">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Emergency Alert System */}
            <GlassCard className="hover-glow" data-testid="emergency-alerts">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                🚨 Emergency Alerts
              </h3>
              
              <div className="space-y-4">
                {emergencyAlerts && emergencyAlerts.map((alert: any) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.level === 'critical' ? 'border-red-400 bg-red-900/30 animate-pulse' :
                      alert.level === 'high' ? 'border-orange-400 bg-orange-900/20' :
                      'border-yellow-400 bg-yellow-900/20'
                    }`}
                    data-testid={`alert-${alert.type}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {alert.level === 'critical' && <Siren className="w-5 h-5 text-red-400 mr-2 animate-spin" />}
                          <span className={`font-bold text-sm ${
                            alert.level === 'critical' ? 'text-red-400' :
                            alert.level === 'high' ? 'text-orange-400' :
                            'text-yellow-400'
                          }`}>
                            {alert.type.toUpperCase()} - {alert.level.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-200 mb-2">{alert.message}</p>
                        <div className="text-xs text-gray-400">
                          {alert.hospital} • {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Real-time Metrics */}
            <GlassCard className="hover-glow" data-testid="realtime-metrics">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Zap className="w-5 h-5 text-neon-cyan mr-2" />
                Live Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Patients</span>
                  <span className="text-neon-cyan font-bold" data-testid="total-patients">
                    {stats?.patientInflow?.current || 47}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AQI Level</span>
                  <span className={`font-bold ${
                    (stats?.currentAqi || 284) > 200 ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    {stats?.currentAqi || 284}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Preparedness</span>
                  <span className="text-green-400 font-bold">{stats?.preparednessScore || 78}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Surge</span>
                  <span className="text-orange-400 font-bold">{stats?.nextSurge || '18% Rise'}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
