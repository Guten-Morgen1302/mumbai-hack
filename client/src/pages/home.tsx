import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ThemeToggle from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg text-white dark:text-white overflow-x-hidden">
      <Navigation />
      <ThemeToggle />
      <HeroSection />
      
      {/* Enhanced Footer */}
      <footer className="py-16 px-6 border-t border-white/10 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-neon-cyan rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-neon-purple rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto text-center relative">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center mr-4 animate-pulse-glow">
              <span className="text-2xl font-bold">MH</span>
            </div>
            <span className="text-2xl font-bold text-glow">MumbaiHacks AI Health</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-neon-cyan mb-3">Quick Access</h3>
              <div className="space-y-2 text-sm">
                <div className="hover:text-neon-cyan cursor-pointer transition-colors">Emergency Booking</div>
                <div className="hover:text-neon-cyan cursor-pointer transition-colors">Find Hospitals</div>
                <div className="hover:text-neon-cyan cursor-pointer transition-colors">Health Advisor</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-neon-purple mb-3">Live Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="text-green-400">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospitals Online:</span>
                  <span className="text-neon-cyan">47/47</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span className="text-orange-400">2.3s</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-neon-blue mb-3">Connect</h3>
              <div className="space-y-2 text-sm">
                <div className="hover:text-neon-blue cursor-pointer transition-colors">📧 support@mumbaihacks.ai</div>
                <div className="hover:text-neon-blue cursor-pointer transition-colors">📱 +91 98765 43210</div>
                <div className="hover:text-neon-blue cursor-pointer transition-colors">🔔 Emergency Hotline</div>
              </div>
            </div>
          </div>
          
          <p className="text-lg mb-4">AI-Powered Healthcare Revolution for Mumbai</p>
          <p className="opacity-70 mb-6">Built with ❤️ for healthcare heroes. Powered by cutting-edge artificial intelligence.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">All AI agents operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
              <span>API Response: 99.9% uptime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
              <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10 text-xs opacity-60">
            © 2024 MumbaiHacks AI Health. Revolutionizing healthcare through technology. 
            <br />
            <span className="text-neon-cyan">Hackathon Project</span> • <span className="text-neon-purple">Demo Version</span> • <span className="text-green-400">Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
