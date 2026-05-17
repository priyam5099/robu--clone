"use client";

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hi! I'm your Robu AI Assistant. How can I help you build today?", isBot: true }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/products/chat', { message: userMessage });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server right now.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      
      {/* The Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-[#e31837] p-4 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#e31837] p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold leading-tight">Robu AI Support</h3>
                <p className="text-xs text-rose-200 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.isBot ? 'bg-[#e31837] text-white' : 'bg-gray-800 text-white'}`}>
                  {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.isBot ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm' : 'bg-gray-800 text-white rounded-tr-none shadow-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-[#e31837] text-white flex items-center justify-center shrink-0 mt-1"><Bot size={16} /></div>
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about components, shipping..." 
              className="flex-grow bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all border border-transparent focus:border-[#e31837]"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-[#e31837] text-white p-3 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-[#e31837] transition-colors flex items-center justify-center"
            >
              {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" />}
            </button>
          </form>
        </div>
      )}

      {/* The Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#e31837] hover:bg-red-700 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group border-4 border-white active:scale-95"
        >
          <MessageSquare size={24} />
          <span className="font-bold pr-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">Chat with AI</span>
        </button>
      )}
    </div>
  );
}