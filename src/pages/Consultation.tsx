import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Clock, AlertTriangle, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'astrologer' | 'system';
  text: string;
  timestamp: string;
}

export const Consultation: React.FC = () => {
  const location = useLocation();
  const astrologer = location.state?.astrologer || {
    name: 'Acharya Sharma',
    specialty: 'Vedic Kundali, Career',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  };

  // Timer: 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'system', text: 'Session initiated successfully. Welcome to VedaAstro Consultation.', timestamp: 'Just now' },
    { id: 2, sender: 'astrologer', text: `Pranam. I am ${astrologer.name}. I am analyzing your birth details now. What guidance do you seek today?`, timestamp: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown clock effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate Astrologer reply after 3s
    setTimeout(() => {
      let replyText = "Based on your chart, the alignment of Saturn indicates a transition period. Continue your spiritual practices, and clarity will arise soon.";
      if (inputText.toLowerCase().includes('job') || inputText.toLowerCase().includes('career')) {
        replyText = "I see Jupiter entering your 10th house of career in three months. This brings auspicious new openings and growth opportunities.";
      } else if (inputText.toLowerCase().includes('marriage') || inputText.toLowerCase().includes('love') || inputText.toLowerCase().includes('relation')) {
        replyText = "Venus is aspecting your 7th house, indicating romantic stability. However, minor conflict with Ketu calls for patience.";
      } else if (inputText.toLowerCase().includes('remedy') || inputText.toLowerCase().includes('pujas')) {
        replyText = "I recommend booking a Rahu-Ketu Shanti Puja or wearing a yellow sapphire (Pukhraj) to balance your planetary energies.";
      }

      const astrologerReply: Message = {
        id: messages.length + 2,
        sender: 'astrologer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, astrologerReply]);
    }, 2500);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      gap: '24px',
      height: 'calc(100vh - 180px)',
      maxHeight: '700px',
      alignItems: 'stretch',
      textAlign: 'left'
    }}>
      
      {/* Left Column: Session Status & Details */}
      <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'space-between' }}>
        <div>
          {/* Timer Card */}
          <div style={{
            background: 'rgba(212,175,55,0.05)',
            border: '1px solid var(--color-border-gold)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-accent-gold)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>
              <Clock size={16} /> SESSION TIMER
            </p>
            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', fontFamily: 'monospace', color: timeLeft < 120 ? '#ef4444' : '#fff' }}>
              {formatTime(timeLeft)}
            </p>
            {timeLeft < 120 && (
              <p style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', marginTop: '6px' }}>
                <AlertTriangle size={12} /> Less than 2 min left!
              </p>
            )}
          </div>

          {/* Expert Details */}
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--color-border-glass)', paddingBottom: '20px' }}>
            <img src={astrologer.image} alt={astrologer.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border-gold)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{astrologer.name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-accent-gold-light)', fontWeight: 500 }}>{astrologer.specialty}</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => {
            if (window.confirm('Do you want to extend this session by 15 mins?')) {
              setTimeLeft((prev) => prev + 900);
            }
          }}
          className="btn-gold" 
          style={{ width: '100%', fontSize: '0.8rem' }}
        >
          Extend Session
        </button>
      </div>

      {/* Right Column: Chat Layout */}
      <div className="cosmic-card" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        
        {/* Chat Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border-glass)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <div>
            <p style={{ fontWeight: 600, color: '#fff' }}>{astrologer.name} (Online)</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Vedic Advisor</p>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : msg.sender === 'astrologer' ? 'flex-start' : 'center',
                maxWidth: msg.sender === 'system' ? '90%' : '70%',
                background: msg.sender === 'user' ? 'rgba(212,175,55,0.15)' : msg.sender === 'astrologer' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${msg.sender === 'user' ? 'var(--color-border-gold)' : 'var(--color-border-glass)'}`,
                borderRadius: '12px',
                padding: msg.sender === 'system' ? '6px 16px' : '12px 16px',
                textAlign: msg.sender === 'system' ? 'center' : 'left'
              }}
            >
              {msg.sender === 'system' ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{msg.text}</p>
              ) : (
                <div>
                  <p style={{ fontSize: '0.95rem', color: '#fff' }}>{msg.text}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    {msg.timestamp} {msg.sender === 'user' && <CheckCheck size={12} color="var(--color-accent-gold)" />}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} style={{
          padding: '20px',
          borderTop: '1px solid var(--color-border-glass)',
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your query here..."
            style={{
              flex: 1,
              background: 'rgba(5, 6, 15, 0.8)',
              border: '1px solid var(--color-border-glass)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '0.95rem',
              color: '#fff'
            }}
          />
          <button type="submit" className="btn-gold" style={{ padding: '12px 20px', borderRadius: '8px' }} disabled={!inputText.trim()}>
            <Send size={16} />
          </button>
        </form>

      </div>

    </div>
  );
};
