
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, Language } from '../types';

interface SupportAIProps {
  themeColor: string;
  t: any;
  lang: Language;
}

const SupportAI: React.FC<SupportAIProps> = ({ themeColor, t, lang }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-initialize or translate initial message
    setMessages([
      { role: 'assistant', content: t.support_ai.welcome }
    ]);
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInst = lang === 'bn' 
        ? "আপনি এমারেল্ড ইআরপি-র একজন প্রফেশনাল সহকারী। ফাইন্যান্স, ইনভেন্টরি, এইচআর এবং সেলস মডিউল নেভিগেট করতে ব্যবহারকারীকে সাহায্য করুন। সংক্ষেপে, পেশাদারভাবে এবং সহজ বাংলায় উত্তর দিন।"
        : "You are a professional assistant for Emerald ERP. Help users navigate modules like Finance, Inventory, HR, and Sales. Be concise and professional.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: systemInst,
          temperature: 0.7,
        }
      });

      const assistantContent = response.text || (lang === 'bn' ? "দুঃখিত, আমি এটি প্রসেস করতে পারছি না।" : "I'm sorry, I couldn't process that request.");
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'bn' ? "এআই সার্ভিসে সংযোগ করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।" : "Error connecting to AI service. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in backdrop-blur-sm">
      <div className="p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 shadow-inner">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{t.modules.SUPPORT_AI}</h3>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-zinc-500 font-medium">{t.support_ai.ready}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-500/80 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
          <Sparkles size={14} className="animate-pulse" />
          <span>{t.support_ai.powered_by}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in opacity-0`} style={{animationDelay: '100ms', animationFillMode: 'forwards'}}>
            <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 ${
                msg.role === 'user' ? 'bg-zinc-700' : 'bg-emerald-500 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-lg border ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none border-emerald-500' 
                  : 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-bl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-end space-x-3 max-w-[75%]">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center animate-pulse">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 rounded-bl-none shadow-md">
                <div className="flex space-x-1.5 items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-zinc-800 bg-zinc-950/40">
        <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.support_ai.placeholder}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl px-5 py-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner group-hover:border-zinc-700"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-300 active:scale-90 ${
              isLoading || !input.trim() ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50' : 'text-white hover:scale-105 shadow-lg'
            }`}
            style={!isLoading && input.trim() ? { backgroundColor: themeColor } : {}}
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center text-zinc-600 mt-4 font-medium tracking-wide uppercase">
          {t.support_ai.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default SupportAI;
