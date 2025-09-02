import { useState } from "react";
import Navigation from "@/components/navigation";
import GlassCard from "@/components/glass-card";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Edit, LogOut, Save, X, Shield, Activity, Calendar, Award } from "lucide-react";

export default function Profile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleUpdateProfile = async () => {
    if (!newDisplayName.trim()) return;
    
    setLoading(true);
    try {
      await updateUserProfile(newDisplayName);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const memberSince = new Date(currentUser?.metadata.creationTime || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen gradient-bg text-white">
      <Navigation />
      <div className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-glow">👤 User Profile</h2>
              <p className="text-xl opacity-80">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <GlassCard className="hover-glow">
                  <div className="text-center mb-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
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

                    {/* Name Section */}
                    {isEditing ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          className="text-2xl font-bold text-center bg-black/30 border border-neon-cyan/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                          placeholder="Enter your name"
                        />
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-lg hover:bg-green-500/30 transition-all text-white font-bold flex items-center space-x-2 disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{loading ? "Saving..." : "Save"}</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setNewDisplayName(currentUser?.displayName || "");
                            }}
                            className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-all text-white font-bold flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-3xl font-bold text-neon-cyan mb-2">
                          {currentUser?.displayName || "User"}
                        </h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center space-x-2 text-neon-purple hover:text-white transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Name</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 glass-dark rounded-lg">
                      <Mail className="w-6 h-6 text-neon-cyan" />
                      <div>
                        <div className="text-sm text-gray-400">Email Address</div>
                        <div className="font-semibold">{currentUser?.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 glass-dark rounded-lg">
                      <Calendar className="w-6 h-6 text-neon-purple" />
                      <div>
                        <div className="text-sm text-gray-400">Member Since</div>
                        <div className="font-semibold">{memberSince}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 glass-dark rounded-lg">
                      <Shield className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="text-sm text-gray-400">Account Status</div>
                        <div className="font-semibold text-green-400">
                          {currentUser?.emailVerified ? "Verified" : "Unverified"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 glass-dark rounded-lg">
                      <User className="w-6 h-6 text-orange-400" />
                      <div>
                        <div className="text-sm text-gray-400">User ID</div>
                        <div className="font-mono text-sm opacity-70">{currentUser?.uid.substring(0, 12)}...</div>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="mt-8 pt-6 border-t border-gray-600">
                    <button
                      onClick={handleLogout}
                      className="w-full p-4 bg-red-500/20 border border-red-500 rounded-lg hover:bg-red-500/30 transition-all text-white font-bold flex items-center justify-center space-x-3 group"
                    >
                      <LogOut className="w-5 h-5 group-hover:animate-pulse" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </GlassCard>
              </div>

              {/* Stats & Achievements */}
              <div className="space-y-6">
                <GlassCard className="hover-glow">
                  <h4 className="text-xl font-bold text-neon-cyan mb-6 flex items-center space-x-2">
                    <Activity className="w-6 h-6" />
                    <span>Activity Stats</span>
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold text-neon-cyan">15</div>
                      <div className="text-sm opacity-70">Dashboard Views</div>
                    </div>
                    
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold text-green-400">7</div>
                      <div className="text-sm opacity-70">Health Checks</div>
                    </div>
                    
                    <div className="text-center p-4 glass-dark rounded-lg">
                      <div className="text-2xl font-bold text-neon-purple">3</div>
                      <div className="text-sm opacity-70">AR Sessions</div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="hover-glow">
                  <h4 className="text-xl font-bold text-yellow-400 mb-6 flex items-center space-x-2">
                    <Award className="w-6 h-6" />
                    <span>Achievements</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 glass-dark rounded-lg">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm">🏆</span>
                      </div>
                      <div>
                        <div className="font-semibold text-green-400">Early Adopter</div>
                        <div className="text-xs opacity-70">Joined in beta phase</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 glass-dark rounded-lg">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm">🔬</span>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-400">Health Explorer</div>
                        <div className="text-xs opacity-70">Explored all features</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 glass-dark rounded-lg opacity-50">
                      <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                        <span className="text-sm">🎯</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-400">Power User</div>
                        <div className="text-xs opacity-70">Use app for 30 days</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

            </div>

          </div>
        </section>
      </div>
    </div>
  );
}