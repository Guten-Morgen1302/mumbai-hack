import { useState } from "react";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [location] = useLocation();
  const { currentUser, logout } = useAuth();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location === path;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'alert',
      message: '⚠️ Surge Alert: 28% rise in respiratory cases',
      time: '2 mins ago',
      urgent: true
    },
    {
      id: 2,
      type: 'system',
      message: '🤖 AI Model updated with new data',
      time: '1 hour ago',
      urgent: false
    },
    {
      id: 3,
      type: 'health',
      message: '🌡️ Air Quality Alert: AQI 285 (Very Poor)',
      time: '3 hours ago',
      urgent: true
    }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass p-4" data-testid="navigation">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3" data-testid="brand-logo">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">MH</span>
          </div>
          <span className="text-xl font-bold text-glow">MumbaiHacks AI Health</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8" data-testid="desktop-menu">
          <Link
            href="/home"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/home') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-home"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/dashboard') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-dashboard"
          >
            Dashboard
          </Link>
          <Link
            href="/simulator"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/simulator') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-simulator"
          >
            Simulator
          </Link>
          <Link
            href="/advisory"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/advisory') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-advisory"
          >
            Advisory
          </Link>
          <Link
            href="/map"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/map') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-map"
          >
            Map
          </Link>
          <Link
            href="/patient-journey"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/patient-journey') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-journey"
          >
            Journey
          </Link>
          <Link
            href="/ar-vision"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/ar-vision') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-ar"
          >
            AR Vision
          </Link>
          <Link
            href="/social"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/social') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-social"
          >
            Community
          </Link>
          <Link
            href="/telemedicine"
            className={`hover:text-neon-cyan transition-colors ${
              isActiveRoute('/telemedicine') ? 'text-neon-cyan' : ''
            }`}
            data-testid="nav-telemedicine"
          >
            Telemedicine
          </Link>
          
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:text-neon-cyan transition-colors"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-dark border border-neon-cyan/30 rounded-lg p-4 z-50">
                <h3 className="font-bold text-neon-cyan mb-3">AI Health Alerts</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`p-3 rounded-lg ${
                      notif.urgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-gray-500/10 border border-gray-500/30'
                    }`}>
                      <div className="text-sm font-medium">{notif.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden lg:block">
              <div className="text-sm font-semibold">Welcome back,</div>
              <div className="text-xs text-neon-cyan">{currentUser?.displayName || 'User'}</div>
            </div>
            
            <div className="relative group">
              <Link href="/profile">
                <div className="w-10 h-10 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center text-sm font-bold text-white hover:scale-110 transition-transform cursor-pointer">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(currentUser?.displayName || currentUser?.email || "User")
                  )}
                </div>
              </Link>
              
              {/* Quick Actions Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 glass-dark border border-neon-purple/30 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link href="/profile" className="flex items-center space-x-2 p-2 hover:bg-neon-purple/20 rounded-lg transition-all">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 p-2 hover:bg-red-500/20 rounded-lg transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          className="md:hidden text-neon-cyan"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-dark p-6 space-y-4" data-testid="mobile-menu">
          <Link
            href="/"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-home"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/dashboard') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-dashboard"
          >
            Dashboard
          </Link>
          <Link
            href="/simulator"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/simulator') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-simulator"
          >
            Simulator
          </Link>
          <Link
            href="/advisory"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/advisory') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-advisory"
          >
            Advisory
          </Link>
          <Link
            href="/map"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/map') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-map"
          >
            Map
          </Link>
          <Link
            href="/patient-journey"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/patient-journey') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-journey"
          >
            Patient Journey
          </Link>
          <Link
            href="/ar-vision"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/ar-vision') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-ar"
          >
            AR Vision
          </Link>
          <Link
            href="/social"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/social') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-social"
          >
            Community
          </Link>
          <Link
            href="/telemedicine"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/telemedicine') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-telemedicine"
          >
            Telemedicine
          </Link>
          <Link
            href="/profile"
            onClick={closeMenu}
            className={`block hover:text-neon-cyan transition-colors ${
              isActiveRoute('/profile') ? 'text-neon-cyan' : ''
            }`}
            data-testid="mobile-nav-profile"
          >
            Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
