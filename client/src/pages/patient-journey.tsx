import Navigation from "@/components/navigation";
import GlassCard from "@/components/glass-card";
import { ArrowRight, User, Calendar, FileText, TestTube, CheckCircle, Activity } from "lucide-react";

export default function PatientJourney() {
  const journeySteps = [
    {
      id: 1,
      title: "Registration",
      icon: <User className="w-8 h-8" />,
      description: "Patient arrives and registers with AI-powered intake system",
      duration: "2-3 mins",
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/20"
    },
    {
      id: 2,
      title: "AI Triage",
      icon: <Activity className="w-8 h-8" />,
      description: "AI analyzes symptoms and assigns priority level",
      duration: "30 seconds",
      color: "text-neon-purple",
      bgColor: "bg-neon-purple/20"
    },
    {
      id: 3,
      title: "Appointment",
      icon: <Calendar className="w-8 h-8" />,
      description: "Smart scheduling based on urgency and doctor availability",
      duration: "1-2 mins",
      color: "text-neon-blue",
      bgColor: "bg-neon-blue/20"
    },
    {
      id: 4,
      title: "Consultation",
      icon: <FileText className="w-8 h-8" />,
      description: "Doctor consultation with AI-assisted diagnosis support",
      duration: "10-15 mins",
      color: "text-green-400",
      bgColor: "bg-green-400/20"
    },
    {
      id: 5,
      title: "Tests/Imaging",
      icon: <TestTube className="w-8 h-8" />,
      description: "AI-recommended tests and real-time processing",
      duration: "5-30 mins",
      color: "text-orange-400",
      bgColor: "bg-orange-400/20"
    },
    {
      id: 6,
      title: "Results & Discharge",
      icon: <CheckCircle className="w-8 h-8" />,
      description: "AI-generated report with follow-up recommendations",
      duration: "2-5 mins",
      color: "text-pink-400",
      bgColor: "bg-pink-400/20"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16" data-testid="journey-header">
              <h2 className="text-4xl font-bold mb-4 text-glow">AI-Powered Patient Journey</h2>
              <p className="text-xl opacity-80">Seamless healthcare experience from registration to discharge</p>
            </div>

            {/* Journey Flowchart */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="journey-steps">
                {journeySteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <GlassCard 
                      className={`hover-glow animate-slide-up ${step.bgColor} border-2 border-transparent hover:border-current transition-all duration-300`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      data-testid={`journey-step-${step.id}`}
                    >
                      <div className={`${step.color} mb-4`}>
                        {step.icon}
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${step.color}`}>
                        Step {step.id}: {step.title}
                      </h3>
                      <p className="text-sm mb-4 opacity-90">
                        {step.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neon-purple">⏱️ {step.duration}</span>
                        <div className="w-3 h-3 bg-current rounded-full animate-pulse-glow"></div>
                      </div>
                    </GlassCard>
                    
                    {/* Arrow connector */}
                    {index < journeySteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-6 h-6 text-neon-cyan animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16" data-testid="journey-stats">
              <GlassCard className="text-center hover-glow">
                <div className="text-3xl font-bold text-neon-cyan mb-2">78%</div>
                <div className="text-sm opacity-80">Faster Patient Processing</div>
                <div className="mt-2 text-xs text-neon-purple">🤖 AI Optimization</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                <div className="text-sm opacity-80">Patient Satisfaction</div>
                <div className="mt-2 text-xs text-neon-purple">📊 Real-time Feedback</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <div className="text-3xl font-bold text-orange-400 mb-2">15min</div>
                <div className="text-sm opacity-80">Average Wait Time</div>
                <div className="mt-2 text-xs text-neon-purple">⚡ AI Scheduling</div>
              </GlassCard>
            </div>

            {/* Journey Optimization */}
            <div className="mt-16">
              <GlassCard className="hover-glow" data-testid="journey-optimization">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="w-3 h-3 bg-neon-cyan rounded-full mr-3 animate-pulse-glow"></span>
                  AI Journey Optimization
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-neon-purple">Real-time Adaptations</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-sm">Dynamic queue management</span>
                        <span className="text-green-400 text-xs">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-sm">Predictive resource allocation</span>
                        <span className="text-green-400 text-xs">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-sm">Automated follow-up scheduling</span>
                        <span className="text-green-400 text-xs">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-neon-purple">Patient Experience Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-sm">Mobile wait time updates</span>
                        <span className="text-neon-cyan text-xs">📱 SMS/App</span>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-sm">Multi-language AI support</span>
                        <span className="text-neon-cyan text-xs">🗣️ 8 Languages</span>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-dark rounded-lg">
                        <span className="text-sm">Digital payment integration</span>
                        <span className="text-neon-cyan text-xs">💳 Contactless</span>
                      </div>
                    </div>
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