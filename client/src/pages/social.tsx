import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import GlassCard from "@/components/glass-card";
import { 
  MessageCircle, Users, Trophy, Medal, Award, Star, ThumbsUp, Heart, Share2, 
  TrendingUp, Target, Zap, Calendar, BookOpen, Gift, Crown, Shield, 
  Activity, Clock, MapPin, Phone, UserPlus, MessageSquare, Bell
} from "lucide-react";

export default function Social() {
  const [activeTab, setActiveTab] = useState<'forums' | 'challenges' | 'rewards' | 'leaderboard'>('forums');
  const [userPoints, setUserPoints] = useState(2847);
  const [userLevel, setUserLevel] = useState(12);
  const [userBadges, setUserBadges] = useState(['Early Adopter', 'Health Champion', 'Community Helper']);
  const [notifications, setNotifications] = useState(3);

  // Community Forums Data
  const forumTopics = [
    {
      id: 1,
      title: "Best hospitals for cardiac surgery in Mumbai?",
      author: "Priya S.",
      replies: 47,
      likes: 123,
      category: "Healthcare Advice",
      timestamp: "2 hours ago",
      trending: true
    },
    {
      id: 2, 
      title: "Air quality impact on respiratory health - personal experiences",
      author: "Dr. Rajesh K.",
      replies: 89,
      likes: 234,
      category: "Environmental Health",
      timestamp: "5 hours ago",
      verified: true
    },
    {
      id: 3,
      title: "Mental health support during medical treatment",
      author: "Ananya M.",
      replies: 31,
      likes: 156,
      category: "Mental Health",
      timestamp: "1 day ago",
      featured: true
    },
    {
      id: 4,
      title: "Vaccination drive updates - Bandra West",
      author: "Mumbai Health Dept",
      replies: 67,
      likes: 189,
      category: "Public Health",
      timestamp: "2 days ago",
      official: true
    }
  ];

  // Health Challenges Data
  const healthChallenges = [
    {
      id: 1,
      title: "Mumbai Walking Challenge",
      description: "Walk 10,000 steps daily for 30 days",
      participants: 2847,
      prize: "₹5000 voucher + Health checkup",
      progress: 67,
      daysLeft: 18,
      category: "Fitness",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Mental Wellness Week",
      description: "Complete meditation sessions and mental health activities",
      participants: 1523,
      prize: "Wellness retreat + ₹3000",
      progress: 45,
      daysLeft: 5,
      category: "Mental Health",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Healthy Eating Mumbai",
      description: "Log nutritious meals and share healthy recipes",
      participants: 892,
      prize: "Nutrition consultation + ₹2000",
      progress: 23,
      daysLeft: 12,
      category: "Nutrition",
      difficulty: "Easy"
    }
  ];

  // Leaderboard Data
  const leaderboard = [
    {
      rank: 1,
      name: "Arjun Patel",
      points: 15847,
      level: 28,
      badge: "Health Guardian",
      activity: "Completed 15 challenges",
      location: "Andheri West"
    },
    {
      rank: 2,
      name: "Dr. Kavya Sharma", 
      points: 14562,
      level: 26,
      badge: "Medical Expert",
      activity: "Helped 200+ users",
      location: "Bandra East",
      verified: true
    },
    {
      rank: 3,
      name: "Ravi Kumar",
      points: 12934,
      level: 24,
      badge: "Fitness Champion",
      activity: "30-day streak",
      location: "Malad West"
    },
    {
      rank: 4,
      name: "You",
      points: userPoints,
      level: userLevel,
      badge: "Community Helper", 
      activity: "Active member",
      location: "Mumbai",
      isCurrentUser: true
    }
  ];

  // Rewards & Redemption Data
  const rewards = [
    {
      id: 1,
      name: "Free Health Checkup",
      points: 5000,
      description: "Complete health screening at partner hospitals",
      category: "Health Services",
      available: 45,
      redeemed: 12,
      partner: "Apollo Hospitals"
    },
    {
      id: 2,
      name: "Pharmacy Discount Voucher",
      points: 1000,
      description: "25% off on medicines at partner pharmacies",
      category: "Discounts",
      available: 156,
      redeemed: 67,
      partner: "Apollo Pharmacy"
    },
    {
      id: 3,
      name: "Fitness Tracker",
      points: 8000,
      description: "Premium fitness tracking device",
      category: "Gadgets",
      available: 8,
      redeemed: 3,
      partner: "Fitbit"
    },
    {
      id: 4,
      name: "Nutrition Consultation",
      points: 3000,
      description: "1-on-1 session with certified nutritionist",
      category: "Consultations",
      available: 23,
      redeemed: 15,
      partner: "Nutrition Experts"
    }
  ];

  const redeemReward = (rewardId: number, cost: number) => {
    if (userPoints >= cost) {
      setUserPoints(prev => prev - cost);
      alert(`🎉 Reward redeemed successfully! New balance: ${userPoints - cost} points`);
    } else {
      alert(`❌ Insufficient points. You need ${cost - userPoints} more points.`);
    }
  };

  const joinChallenge = (challengeId: number) => {
    alert(`🚀 Successfully joined challenge! Good luck on your health journey!`);
  };

  return (
    <div className="min-h-screen gradient-bg text-white overflow-x-hidden">
      <Navigation />
      <div className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-glow">🌟 Mumbai Health Community</h2>
              <p className="text-xl opacity-80">Connect, compete, and achieve wellness goals together</p>
            </div>

            {/* User Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <GlassCard className="text-center hover-glow">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">{userLevel}</div>
                <div className="text-sm opacity-80">Level</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <Star className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                <div className="text-2xl font-bold text-neon-cyan">{userPoints.toLocaleString()}</div>
                <div className="text-sm opacity-80">Points</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{userBadges.length}</div>
                <div className="text-sm opacity-80">Badges</div>
              </GlassCard>
              
              <GlassCard className="text-center hover-glow">
                <Bell className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-400">{notifications}</div>
                <div className="text-sm opacity-80">Notifications</div>
              </GlassCard>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button 
                onClick={() => setActiveTab('forums')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeTab === 'forums' ? 'border-2 border-neon-cyan' : 'border border-gray-500'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Community Forums</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('challenges')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeTab === 'challenges' ? 'border-2 border-green-400' : 'border border-gray-500'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Health Challenges</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeTab === 'leaderboard' ? 'border-2 border-yellow-400' : 'border border-gray-500'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>Leaderboard</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('rewards')}
                className={`px-6 py-3 rounded-full glass-dark hover-glow transition-all flex items-center space-x-2 ${
                  activeTab === 'rewards' ? 'border-2 border-neon-purple' : 'border border-gray-500'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span>Rewards Store</span>
              </button>
            </div>

            {/* Community Forums */}
            {activeTab === 'forums' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">💬 Community Forums</h3>
                  <p className="text-lg opacity-80">Share experiences, get advice, and support each other</p>
                </div>
                
                {forumTopics.map(topic => (
                  <GlassCard key={topic.id} className="hover-glow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {topic.trending && <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">🔥 Trending</div>}
                          {topic.featured && <div className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">⭐ Featured</div>}
                          {topic.verified && <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">✓ Verified</div>}
                          {topic.official && <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">🏛️ Official</div>}
                          <div className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">{topic.category}</div>
                        </div>
                        <h4 className="text-xl font-bold text-neon-cyan mb-2">{topic.title}</h4>
                        <div className="flex items-center space-x-4 text-sm opacity-70">
                          <span>By {topic.author}</span>
                          <span>•</span>
                          <span>{topic.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>{topic.replies} replies</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>{topic.likes} likes</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-all">
                          Read
                        </button>
                        <button className="px-4 py-2 bg-green-400/20 border border-green-400 rounded-lg hover:bg-green-400/30 transition-all">
                          Reply
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {/* Health Challenges */}
            {activeTab === 'challenges' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">🎯 Health Challenges</h3>
                  <p className="text-lg opacity-80">Join community challenges and win amazing prizes</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {healthChallenges.map(challenge => (
                    <GlassCard key={challenge.id} className="hover-glow">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-xl font-bold text-neon-cyan mb-2">{challenge.title}</h4>
                            <p className="text-sm opacity-80 mb-2">{challenge.description}</p>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            challenge.difficulty === 'Beginner' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {challenge.difficulty}
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Participants:</span>
                            <span className="text-neon-cyan font-bold">{challenge.participants.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Prize:</span>
                            <span className="text-yellow-400 font-bold">{challenge.prize}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Days left:</span>
                            <span className="text-orange-400 font-bold">{challenge.daysLeft} days</span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Your Progress:</span>
                              <span className="text-green-400">{challenge.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-400 h-2 rounded-full transition-all"
                                style={{ width: `${challenge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => joinChallenge(challenge.id)}
                          className="w-full p-3 bg-green-400/20 border border-green-400 rounded-lg hover:bg-green-400/30 transition-all text-white font-bold"
                        >
                          {challenge.progress > 0 ? 'Continue Challenge' : 'Join Challenge'}
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">🏆 Community Leaderboard</h3>
                  <p className="text-lg opacity-80">Top health champions in Mumbai</p>
                </div>
                
                <div className="space-y-4">
                  {leaderboard.map(user => (
                    <GlassCard 
                      key={user.rank} 
                      className={`hover-glow transition-all ${
                        user.isCurrentUser ? 'border-2 border-neon-cyan bg-neon-cyan/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            user.rank === 1 ? 'bg-yellow-400 text-black' :
                            user.rank === 2 ? 'bg-gray-400 text-black' :
                            user.rank === 3 ? 'bg-orange-400 text-black' :
                            'bg-neon-cyan/20 text-neon-cyan'
                          }`}>
                            {user.rank === 1 ? '👑' : 
                             user.rank === 2 ? '🥈' :
                             user.rank === 3 ? '🥉' : 
                             user.rank}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-bold text-lg ${user.isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                                {user.name}
                              </h4>
                              {user.verified && <div className="text-blue-400">✓</div>}
                              {user.isCurrentUser && <div className="text-neon-cyan">(You)</div>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm opacity-70">
                              <span>{user.activity}</span>
                              <span>•</span>
                              <span>📍 {user.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-neon-cyan">{user.points.toLocaleString()}</div>
                          <div className="text-sm opacity-70">Level {user.level}</div>
                          <div className="text-xs text-yellow-400">{user.badge}</div>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards Store */}
            {activeTab === 'rewards' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">🎁 Rewards Store</h3>
                  <p className="text-lg opacity-80">Redeem your points for amazing health benefits</p>
                  <div className="mt-4 text-neon-cyan text-xl font-bold">
                    💰 Your Balance: {userPoints.toLocaleString()} points
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {rewards.map(reward => (
                    <GlassCard key={reward.id} className="hover-glow">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-neon-cyan mb-2">{reward.name}</h4>
                        <p className="text-sm opacity-80 mb-4">{reward.description}</p>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span className="text-yellow-400 font-bold">{reward.points.toLocaleString()} points</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="text-neon-purple">{reward.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Partner:</span>
                            <span className="text-green-400">{reward.partner}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Available:</span>
                            <span className="text-orange-400">{reward.available - reward.redeemed} left</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => redeemReward(reward.id, reward.points)}
                          disabled={userPoints < reward.points || reward.available === reward.redeemed}
                          className={`w-full p-3 rounded-lg font-bold transition-all ${
                            userPoints >= reward.points && reward.available > reward.redeemed
                              ? 'bg-neon-purple/20 border border-neon-purple hover:bg-neon-purple/30 text-white'
                              : 'bg-gray-600/20 border border-gray-600 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {userPoints < reward.points 
                            ? `Need ${(reward.points - userPoints).toLocaleString()} more points`
                            : reward.available === reward.redeemed 
                            ? 'Out of Stock'
                            : 'Redeem Now'
                          }
                        </button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      </div>
    </div>
  );
}