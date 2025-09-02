import { useState } from "react";
import { Send, Calendar, MapPin, Phone, Clock } from "lucide-react";
import GlassCard from "./glass-card";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export default function AiChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI health assistant for MumbaiHacks AI Health. I can help with medical advice, hospital booking, and health queries. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      actions: [
        { label: "Book Appointment", action: "book" },
        { label: "Find Nearest Hospital", action: "hospital" },
        { label: "Health Advice", action: "advice" }
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleActionClick = (action: string) => {
    let responseText = "";
    let hasActions = false;
    let actions: Array<{ label: string; action: string }> = [];

    switch (action) {
      case "book":
        responseText = "I can help you book an appointment! Here are available options:";
        hasActions = true;
        actions = [
          { label: "Emergency (Available Now)", action: "emergency" },
          { label: "General Consultation (Today 3 PM)", action: "general" },
          { label: "Specialist (Tomorrow 10 AM)", action: "specialist" }
        ];
        break;
      case "hospital":
        responseText = "Based on your location, here are the nearest hospitals with availability:";
        hasActions = true;
        actions = [
          { label: "Kokilaben Hospital (2.3 km) - 23 beds", action: "kokilaben" },
          { label: "Hinduja Hospital (3.1 km) - 7 beds", action: "hinduja" },
          { label: "Breach Candy (4.2 km) - 31 beds", action: "breach" }
        ];
        break;
      case "advice":
        responseText = "I can provide health guidance. What's your concern?";
        hasActions = true;
        actions = [
          { label: "Fever & Cold", action: "fever" },
          { label: "Chest Pain", action: "chest" },
          { label: "Breathing Issues", action: "breathing" }
        ];
        break;
      case "emergency":
        responseText = "🚨 Emergency appointment booked! Dr. Sharma is available now in Emergency Room 201. Estimated wait: 5 minutes. Please arrive immediately.";
        break;
      case "general":
        responseText = "📅 General consultation booked for today 3:00 PM with Dr. Patel. Room 305. Please arrive 15 minutes early.";
        break;
      case "specialist":
        responseText = "🩺 Specialist appointment with Dr. Mehta scheduled for tomorrow 10:00 AM. Cardiology Department, Room 412.";
        break;
      case "fever":
        responseText = "For fever and cold symptoms: 1) Rest and stay hydrated 2) Monitor temperature 3) If fever >101°F for 48+ hours, visit ER 4) Current AQI is high - stay indoors";
        break;
      case "chest":
        responseText = "⚠️ Chest pain requires immediate attention. I recommend visiting the Emergency Room now. Would you like me to book an emergency appointment?";
        hasActions = true;
        actions = [{ label: "Book Emergency Now", action: "emergency" }];
        break;
      default:
        responseText = "I'm here to help with your healthcare needs. Please select an option or ask me anything!";
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: `Action: ${action}`,
      isBot: false,
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      isBot: true,
      timestamp: new Date(),
      actions: hasActions ? actions : undefined
    };

    setMessages(prev => [...prev, newMessage, aiResponse]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    // Simulate AI response with medical context
    setTimeout(() => {
      const medicalResponses = [
        "Based on current health data in Mumbai, I recommend checking AQI levels before outdoor activities. Current AQI: 284 (Poor). Would you like me to find indoor exercise alternatives?",
        "I can help you with that health concern. For accurate diagnosis, I recommend booking a consultation. The nearest available doctor is Dr. Sharma at Kokilaben Hospital.",
        "Your symptoms suggest monitoring is needed. I can schedule a follow-up appointment or connect you with our on-call nurse for immediate guidance.",
        "Based on your location and current hospital capacity, I recommend Breach Candy Hospital (4.2 km away) which has good availability. Would you like me to book an appointment?"
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: medicalResponses[Math.floor(Math.random() * medicalResponses.length)],
        isBot: true,
        timestamp: new Date(),
        actions: [
          { label: "Book Appointment", action: "book" },
          { label: "Find Hospital", action: "hospital" }
        ]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <GlassCard className="hover-glow" data-testid="ai-chatbot">
      <h3 className="text-2xl font-semibold mb-6 flex items-center">
        <span className="w-3 h-3 bg-neon-purple rounded-full mr-3 animate-pulse-glow"></span>
        AI Health Assistant
      </h3>

      {/* Chat Messages */}
      <div className="space-y-4 h-64 overflow-y-auto mb-4 custom-scrollbar" data-testid="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start ${message.isBot ? '' : 'justify-end'}`}>
            {message.isBot && (
              <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-sm">🤖</span>
              </div>
            )}
            <div className={`rounded-2xl p-3 max-w-xs animate-slide-up ${
              message.isBot 
                ? 'glass-dark rounded-tl-none' 
                : 'bg-neon-cyan/20 rounded-tr-none'
            }`}>
              <p className="text-sm" data-testid={`message-${message.id}`}>{message.text}</p>
              
              {/* Action Buttons */}
              {message.actions && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {message.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action.action)}
                      className="text-xs px-3 py-1 bg-neon-cyan/20 hover:bg-neon-cyan/30 rounded-full border border-neon-cyan/30 hover:border-neon-cyan transition-all"
                      data-testid={`action-${action.action}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="glass-dark rounded-2xl rounded-tl-none p-3" data-testid="typing-indicator">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Ask about health conditions, symptoms, or advice..."
            className="w-full glass-dark rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            data-testid="chat-input"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse-glow"></div>
          </div>
        </div>
        <button 
          className="glass-dark p-3 rounded-full hover-glow neon-border" 
          onClick={handleSendMessage}
          data-testid="send-message"
        >
          <Send className="w-5 h-5 text-neon-cyan" />
        </button>
      </div>
    </GlassCard>
  );
}
