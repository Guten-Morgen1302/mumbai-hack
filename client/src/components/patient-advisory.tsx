import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GlassCard from "./glass-card";
import AiChatbot from "./ai-chatbot";
import { AlertTriangle, Thermometer, Pill, Bell } from "lucide-react";
import type { HealthAdvisory } from "@shared/schema";

export default function PatientAdvisory() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const { data: advisories, isLoading } = useQuery<HealthAdvisory[]>({
    queryKey: ['/api/health-advisories'],
  });

  const getAdvisoryIcon = (type: string) => {
    switch (type) {
      case 'aqi':
        return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'temperature':
        return <Thermometer className="w-6 h-6 text-neon-cyan" />;
      case 'medical':
        return <Pill className="w-6 h-6 text-green-400" />;
      default:
        return <Bell className="w-6 h-6 text-neon-purple" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'text-orange-400';
      case 'medium':
        return 'text-neon-cyan';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  return (
    <section id="advisory" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16" data-testid="advisory-header">
          <h2 className="text-4xl font-bold mb-4 text-glow">Patient Advisory Portal</h2>
          <p className="text-xl opacity-80">Real-time health advisories powered by AI analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Advisories */}
          <GlassCard className="hover-glow" data-testid="advisories-card">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse-glow"></span>
              Live Health Advisories
            </h3>
            
            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar" data-testid="advisories-list">
              {isLoading ? (
                <div className="text-center py-8">Loading advisories...</div>
              ) : (
                advisories?.map((advisory) => (
                  <GlassCard 
                    key={advisory.id} 
                    variant="glass-dark" 
                    className="hover-glow animate-slide-up"
                    data-testid={`advisory-${advisory.type}`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getAdvisoryIcon(advisory.type)}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold mb-1 capitalize ${getSeverityColor(advisory.severity)}`}>
                          {advisory.type} {advisory.severity === 'high' ? 'Alert' : 'Advisory'}
                          {advisory.location && ` - ${advisory.location}`}
                        </div>
                        <p className="text-sm mb-2">{advisory.message}</p>
                        <div className="text-xs text-neon-purple">
                          📍 Updated {new Date(advisory.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>

            {/* Subscription Modal Trigger */}
            <div className="mt-6 text-center">
              <button 
                className="glass-dark px-6 py-3 rounded-full hover-glow neon-border"
                onClick={() => setShowSubscriptionModal(true)}
                data-testid="subscribe-button"
              >
                📱 Subscribe to SMS/Email Alerts
              </button>
            </div>
          </GlassCard>

          {/* AI Chatbot */}
          <AiChatbot />
        </div>

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSubscriptionModal(false)}
            data-testid="subscription-modal"
          >
            <GlassCard 
              className="max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Subscribe to Health Alerts</h3>
              <p className="text-sm mb-6 opacity-80">
                Get real-time notifications about health advisories in your area.
              </p>
              <div className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full glass-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  data-testid="email-input"
                />
                <input 
                  type="tel" 
                  placeholder="Enter your phone number"
                  className="w-full glass-dark rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  data-testid="phone-input"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  className="flex-1 glass-dark px-4 py-2 rounded-lg hover-glow"
                  onClick={() => setShowSubscriptionModal(false)}
                  data-testid="cancel-subscription"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 bg-neon-cyan text-black px-4 py-2 rounded-lg hover-glow font-semibold"
                  onClick={() => setShowSubscriptionModal(false)}
                  data-testid="confirm-subscription"
                >
                  Subscribe
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
