
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Phone, Video, MoreVertical, Search, Paperclip, 
  Mic, User, Check, CheckCheck, Smile, PhoneOff, 
  VideoOff, Maximize2, Minimize2, Settings, UserPlus, 
  Circle, Lock, Camera, Volume2, Monitor, Bot, MessageSquare,
  MicOff, ScreenShare, ScreenShareOff, Trash2, BellOff, Info, File, X, Download, Image as ImageIcon,
  Clock, Copy, Bell, Keyboard
} from 'lucide-react';
import { UserRecord, Language } from '../types';

interface CommunicationProps {
  themeColor: string;
  t: any;
  currentUser: UserRecord;
  allUsers: UserRecord[];
  lang: Language;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  file?: { name: string; type: string; size: string };
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ActiveCall {
  user: UserRecord;
  type: 'voice' | 'video';
  status: 'incoming' | 'outgoing' | 'connected';
  startTime: number;
}

interface CommSettings {
  showReadReceipts: boolean;
  audioAlerts: boolean;
  enterToSend: boolean;
}

const EMOJIS = ['❤️', '👍', '🔥', '😂', '😮', '😢', '🙏', '✅', '🚀', '💯', '✨', '🤝'];

const Communication: React.FC<CommunicationProps> = ({ themeColor, t, currentUser, allUsers, lang }) => {
  const chatUsers = allUsers.filter(u => u.id !== currentUser.id && u.permissions.includes('COMMUNICATION'));
  
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(chatUsers[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');
  
  // Feature Toggles
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showCommSettings, setShowCommSettings] = useState(false);
  const [activeMsgMenu, setActiveMsgMenu] = useState<string | null>(null);
  
  // Settings State
  const [commSettings, setCommSettings] = useState<CommSettings>(() => {
    const saved = localStorage.getItem(`comm_settings_${currentUser.id}`);
    return saved ? JSON.parse(saved) : {
      showReadReceipts: true,
      audioAlerts: true,
      enterToSend: true
    };
  });

  useEffect(() => {
    localStorage.setItem(`comm_settings_${currentUser.id}`, JSON.stringify(commSettings));
  }, [commSettings, currentUser.id]);

  // Call Controls State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const msgMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedUser, isTyping]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
      if (msgMenuRef.current && !msgMenuRef.current.contains(e.target as Node)) {
        setActiveMsgMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Call Timer Effect
  useEffect(() => {
    let interval: any;
    if (activeCall?.status === 'connected') {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - activeCall.startTime) / 1000);
        const mins = Math.floor(diff / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        setCallDuration(`${mins}:${secs}`);
      }, 1000);
    } else {
      setCallDuration('00:00');
    }
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    const msgId = Date.now().toString();
    const newMsg: Message = {
      id: msgId,
      senderId: currentUser.id,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg]
    }));
    setMessage('');
    setShowEmojiPicker(false);

    // Simulate status transitions
    setTimeout(() => {
      updateMessageStatus(selectedUser.id, msgId, 'delivered');
      if (commSettings.showReadReceipts) {
        setTimeout(() => {
          updateMessageStatus(selectedUser.id, msgId, 'read');
          mockReply(selectedUser.id);
        }, 1200);
      } else {
        mockReply(selectedUser.id);
      }
    }, 600);
  };

  const updateMessageStatus = (userId: string, msgId: string, status: 'delivered' | 'read') => {
    setMessages(prev => {
      const userMsgs = prev[userId] || [];
      return {
        ...prev,
        [userId]: userMsgs.map(m => m.id === msgId ? { ...m, status } : m)
      };
    });
  };

  const deleteMessage = (msgId: string) => {
    if (!selectedUser) return;
    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: (prev[selectedUser.id] || []).filter(m => m.id !== msgId)
    }));
    setActiveMsgMenu(null);
  };

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedUser) {
      const msgId = Date.now().toString();
      const newMsg: Message = {
        id: msgId,
        senderId: currentUser.id,
        file: { name: file.name, type: file.type, size: `${(file.size / 1024).toFixed(1)} KB` },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMsg]
      }));

      setTimeout(() => {
        updateMessageStatus(selectedUser.id, msgId, 'delivered');
        setTimeout(() => {
          updateMessageStatus(selectedUser.id, msgId, 'read');
          mockReply(selectedUser.id, true);
        }, 1200);
      }, 600);
    }
  };

  const mockReply = (userId: string, isFile = false) => {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: userId,
          text: isFile 
            ? (lang === 'bn' ? `আমি ফাইলটি পেয়েছি, ধন্যবাদ!` : `I've received the file, thank you!`)
            : (lang === 'bn' ? `ধন্যবাদ, আমি আপনার মেসেজটি পেয়েছি।` : `Got your message, thanks!`),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        setMessages(prev => ({
          ...prev,
          [userId]: [...(prev[userId] || []), reply]
        }));
        setIsTyping(false);
      }, 1500);
    }, 1000);
  };

  const clearChat = () => {
    if (!selectedUser) return;
    if (confirm(lang === 'bn' ? 'সব মেসেজ মুছে ফেলতে চান?' : 'Clear all messages?')) {
      setMessages(prev => ({ ...prev, [selectedUser.id]: [] }));
      setShowMoreMenu(false);
    }
  };

  const startCall = (user: UserRecord, type: 'voice' | 'video') => {
    setActiveCall({ user, type, status: 'outgoing', startTime: Date.now() });
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setTimeout(() => setActiveCall(prev => prev ? { ...prev, status: 'connected', startTime: Date.now() } : null), 2500);
  };

  const endCall = () => {
    setActiveCall(null);
    setCallDuration('00:00');
  };

  const currentMessages = selectedUser ? messages[selectedUser.id] || [] : [];

  const renderStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
    // If showReadReceipts is OFF, we show delivered style for both delivered and read
    const isReadReceiptEnabled = commSettings.showReadReceipts;
    
    switch (status) {
      case 'sent':
        return <Check size={12} className="text-zinc-500" />;
      case 'delivered':
        return <CheckCheck size={12} className="text-zinc-500" />;
      case 'read':
        return <CheckCheck size={12} style={{ color: isReadReceiptEnabled ? themeColor : '#71717a' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md relative animate-fade-in">
      
      {/* Sidebar: User List */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/40">
        <div className="p-4 border-b border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: themeColor }}></span>
              {lang === 'bn' ? 'মেসেজ' : 'Messages'}
            </h3>
            <button 
              onClick={() => setShowCommSettings(true)}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder={lang === 'bn' ? 'সার্চ করুন...' : 'Search people...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chatUsers.length === 0 ? (
            <div className="p-8 text-center space-y-2 opacity-40">
              <Lock size={32} className="mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-widest">{lang === 'bn' ? 'কোনো কন্টাক্ট নেই' : 'No Contacts'}</p>
            </div>
          ) : (
            chatUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 relative group ${selectedUser?.id === user.id ? 'bg-zinc-800 border border-zinc-700 shadow-lg' : 'hover:bg-zinc-800/40 border border-transparent'}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-700 shadow-md transition-transform group-hover:scale-105">
                    <img src={`https://picsum.photos/seed/${user.id}/48/48`} alt={user.name} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-zinc-950 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-sm truncate text-white">{user.name}</p>
                    <span className="text-[9px] text-zinc-600 font-mono">10:45 AM</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {messages[user.id]?.slice(-1)[0]?.text || (messages[user.id]?.slice(-1)[0]?.file ? '📎 File' : user.role.replace('_', ' '))}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-zinc-900/20 relative overflow-hidden">
          {/* Chat Header */}
          <div className="h-20 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950/20 backdrop-blur-sm z-10">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setShowUserDetail(true)}>
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl group-hover:border-emerald-500/50 transition-all">
                <img src={`https://picsum.photos/seed/${selectedUser.id}/48/48`} alt={selectedUser.name} />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">{selectedUser.name}</h4>
                <div className="flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-emerald-500 font-black tracking-widest uppercase">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 relative">
              <button onClick={() => startCall(selectedUser, 'voice')} className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-2xl transition-all active:scale-95 group">
                <Phone size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
              <button onClick={() => startCall(selectedUser, 'video')} className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-2xl transition-all active:scale-95 group">
                <Video size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <div ref={moreMenuRef}>
                <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-2xl transition-all active:scale-95">
                  <MoreVertical size={20} />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-14 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-scale-in">
                    <button onClick={() => setShowUserDetail(true)} className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                      <Info size={16} /> <span>{lang === 'bn' ? 'প্রোফাইল' : 'View Profile'}</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors">
                      <BellOff size={16} /> <span>{lang === 'bn' ? 'মিউট' : 'Mute'}</span>
                    </button>
                    <div className="my-1 border-t border-zinc-800"></div>
                    <button onClick={clearChat} className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors">
                      <Trash2 size={16} /> <span>{lang === 'bn' ? 'মেসেজ মুছুন' : 'Clear Chat'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 relative custom-scrollbar">
            {currentMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center"><MessageSquare size={32} /></div>
                <p className="text-sm font-medium tracking-wide">Say hello to {selectedUser.name}!</p>
              </div>
            )}

            {currentMessages.map((msg, idx) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-scale-in relative`}>
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%] group/msg`}>
                    <div className={`p-4 rounded-3xl shadow-xl relative ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-100 rounded-tl-none'}`}>
                      {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                      {msg.file && (
                        <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-2xl border border-white/5">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><File size={20} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{msg.file.name}</p>
                            <p className="text-[10px] opacity-60 uppercase">{msg.file.size}</p>
                          </div>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Download size={16} /></button>
                        </div>
                      )}
                      <div className="flex items-center justify-end space-x-1.5 mt-1.5 opacity-80">
                        <span className="text-[9px] font-mono tracking-tighter">{msg.timestamp}</span>
                        {isMe && renderStatusIcon(msg.status)}
                      </div>

                      {/* Message Actions */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMsgMenu(activeMsgMenu === msg.id ? null : msg.id);
                        }}
                        className={`absolute top-2 ${isMe ? '-left-8' : '-right-8'} p-1.5 text-zinc-500 hover:text-white opacity-0 group-hover/msg:opacity-100 transition-opacity`}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {activeMsgMenu === msg.id && (
                        <div 
                          ref={msgMenuRef}
                          className={`absolute bottom-full mb-2 ${isMe ? 'right-0' : 'left-0'} w-32 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-50 animate-scale-in overflow-hidden`}
                        >
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text || '');
                              setActiveMsgMenu(null);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-[10px] font-bold text-zinc-300 hover:bg-zinc-800 transition-colors"
                          >
                            <Copy size={12} /> <span>Copy</span>
                          </button>
                          <button 
                            onClick={() => deleteMessage(msg.id)}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 size={12} /> <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-zinc-800/50 p-3 rounded-2xl flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-zinc-950/40 border-t border-zinc-800 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-24 left-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 grid grid-cols-6 gap-2 shadow-2xl animate-scale-in">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setMessage(prev => prev + e)} className="text-xl p-2 hover:bg-zinc-800 rounded-xl transition-all transform hover:scale-125">{e}</button>
                ))}
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleAttachFile} className="hidden" />
            
            <form onSubmit={handleSendMessage} className="flex items-end space-x-3 bg-zinc-900/50 p-2 rounded-3xl border border-zinc-800 focus-within:border-emerald-500/50 transition-all">
              <div className="flex items-center space-x-1">
                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2.5 rounded-xl transition-colors ${showEmojiPicker ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 hover:text-white'}`}><Smile size={20} /></button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-zinc-500 hover:text-white transition-colors"><Paperclip size={20} /></button>
              </div>
              <textarea 
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { 
                  if (commSettings.enterToSend && e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSendMessage(); 
                  } 
                }}
                placeholder={lang === 'bn' ? 'মেসেজ লিখুন...' : 'Type a message...'}
                className="flex-1 bg-transparent py-2.5 px-2 text-sm focus:outline-none resize-none max-h-32 text-white"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-all disabled:opacity-30 disabled:grayscale"
                style={{ backgroundColor: message.trim() ? themeColor : '#333' }}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-30">
          <MessageSquare size={80} className="text-zinc-700 mb-4" />
          <h3 className="text-2xl font-black uppercase tracking-[0.2em]">{lang === 'bn' ? 'সোলম্যাক কানেক্ট' : 'SolMak Connect'}</h3>
          <p className="text-sm font-medium">Select a team member to start chatting.</p>
        </div>
      )}

      {/* Global Communication Settings Modal */}
      {showCommSettings && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight">{lang === 'bn' ? 'মেসেজিং সেটিংস' : 'Chat Settings'}</h3>
              <button onClick={() => setShowCommSettings(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-zinc-950/40 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCheck size={18} /></div>
                  <span className="text-sm font-bold">{lang === 'bn' ? 'রিড রিসিপ্ট' : 'Read Receipts'}</span>
                </div>
                <button 
                  onClick={() => setCommSettings({...commSettings, showReadReceipts: !commSettings.showReadReceipts})}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${commSettings.showReadReceipts ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${commSettings.showReadReceipts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950/40 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Bell size={18} /></div>
                  <span className="text-sm font-bold">{lang === 'bn' ? 'অডিও নোটিফিকেশন' : 'Sound Alerts'}</span>
                </div>
                <button 
                  onClick={() => setCommSettings({...commSettings, audioAlerts: !commSettings.audioAlerts})}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${commSettings.audioAlerts ? 'bg-blue-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${commSettings.audioAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950/40 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Keyboard size={18} /></div>
                  <span className="text-sm font-bold">{lang === 'bn' ? 'এন্টার চাপলে সেন্ড' : 'Enter to Send'}</span>
                </div>
                <button 
                  onClick={() => setCommSettings({...commSettings, enterToSend: !commSettings.enterToSend})}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${commSettings.enterToSend ? 'bg-amber-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${commSettings.enterToSend ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCommSettings(false)}
              className="w-full mt-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-xl"
            >
              {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* User Detail Sidebar overlay */}
      {showUserDetail && selectedUser && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-zinc-950 border-l border-zinc-800 z-50 animate-fade-in shadow-2xl flex flex-col">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
            <h4 className="font-bold text-lg">{lang === 'bn' ? 'প্রোফাইল তথ্য' : 'Profile Detail'}</h4>
            <button onClick={() => setShowUserDetail(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"><X size={20} /></button>
          </div>
          <div className="p-8 flex flex-col items-center text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-zinc-800 shadow-2xl"><img src={`https://picsum.photos/seed/${selectedUser.id}/200/200`} className="w-full h-full object-cover" /></div>
            <div>
              <h3 className="text-2xl font-black text-white">{selectedUser.name}</h3>
              <p className="text-zinc-500 text-sm font-medium">{selectedUser.role.replace('_', ' ')}</p>
            </div>
            <div className="w-full space-y-4 pt-6 border-t border-zinc-800/50">
               <div className="flex items-center space-x-3 text-left bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Settings size={16} /></div>
                  <div><p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">ID Reference</p><p className="text-xs font-mono">{selectedUser.id}</p></div>
               </div>
               <div className="flex items-center space-x-3 text-left bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Monitor size={16} /></div>
                  <div><p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Permissions</p><p className="text-xs font-bold">{selectedUser.permissions.length} Modules</p></div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* REFINED CALL UI */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl animate-fade-in flex flex-col items-center justify-center p-8 overflow-hidden">
          
          {/* Status Header */}
          <div className="absolute top-12 left-0 right-0 flex flex-col items-center space-y-4">
            <div className={`flex items-center space-x-3 px-6 py-2.5 rounded-full border shadow-2xl transition-all ${activeCall.status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/50 border-zinc-800 animate-pulse'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${activeCall.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-zinc-600 animate-ping'}`}></div>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
                {activeCall.status === 'connected' ? (lang === 'bn' ? 'সংযুক্ত' : 'Connected') : (lang === 'bn' ? 'ডায়াল করা হচ্ছে...' : 'Dialing...')}
              </span>
            </div>
            {activeCall.status === 'connected' && (
              <div className="flex items-center space-x-2 text-zinc-500 font-mono text-sm font-bold bg-white/5 px-4 py-1.5 rounded-xl border border-white/5">
                <Clock size={14} className="text-emerald-500" />
                <span>{callDuration}</span>
              </div>
            )}
          </div>

          {/* Main User Display */}
          <div className="relative group mb-12">
            <div className={`w-56 h-56 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border-4 shadow-2xl transition-all duration-700 z-10 relative ${activeCall.status === 'connected' ? 'border-zinc-800' : 'border-zinc-800 scale-95 opacity-50'}`}>
              <img src={`https://picsum.photos/seed/${activeCall.user.id}/400/400`} className="w-full h-full object-cover" />
              
              {/* Overlay for remote side - simulate screen share or video off if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Indicators on Remote Avatar */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                 <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10"><Lock size={16} className="text-emerald-500" /></div>
              </div>
            </div>

            {/* Calling Animations */}
            {activeCall.status !== 'connected' && (
              <>
                <div className="absolute -inset-8 border-2 border-emerald-500/20 rounded-[5rem] animate-ping opacity-20"></div>
                <div className="absolute -inset-16 border-2 border-emerald-500/10 rounded-[6rem] animate-ping opacity-10" style={{ animationDelay: '0.5s' }}></div>
              </>
            )}
          </div>

          <div className="text-center space-y-4 mb-20">
            <h3 className="text-5xl font-black text-white tracking-tighter">{activeCall.user.name}</h3>
            <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">Secure solmak line</p>
          </div>

          {/* REFINED CONTROLS BAR */}
          <div className="flex items-center space-x-8 md:space-x-12 relative z-10">
            {/* Mic Toggle */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-2 transition-all active:scale-90 shadow-2xl ${isMuted ? 'bg-rose-600 border-rose-400 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
              >
                {isMuted ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{isMuted ? 'Unmute' : 'Mute'}</span>
            </div>

            {/* Video Toggle */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-2 transition-all active:scale-90 shadow-2xl ${isVideoOff ? 'bg-zinc-900 border-rose-500/20 text-rose-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
              >
                {isVideoOff ? <VideoOff size={32} /> : <Video size={32} />}
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{isVideoOff ? 'Cam On' : 'Cam Off'}</span>
            </div>

            {/* End Call Button */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={endCall}
                className="w-24 h-24 bg-rose-500 text-white rounded-[3rem] hover:bg-rose-600 transition-all hover:scale-110 active:scale-95 shadow-[0_20px_50px_rgba(244,63,94,0.4)] border-4 border-rose-400/20 flex items-center justify-center"
              >
                <PhoneOff size={44} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Terminate</span>
            </div>

            {/* Screen Share Toggle */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-2 transition-all active:scale-90 shadow-2xl ${isScreenSharing ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
              >
                {isScreenSharing ? <ScreenShareOff size={32} /> : <ScreenShare size={32} />}
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Share</span>
            </div>

            {/* Speaker Toggle (Simulation) */}
            <div className="flex flex-col items-center gap-4">
              <button className="w-20 h-20 bg-zinc-800 border-2 border-zinc-700 rounded-[2.5rem] text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center transition-all active:scale-90">
                <Volume2 size={32} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Speaker</span>
            </div>
          </div>

          {/* Picture-in-Picture Self Preview (PIP) */}
          <div className={`absolute bottom-12 right-12 w-40 h-56 bg-zinc-900 rounded-[2.5rem] overflow-hidden border-2 border-zinc-700 shadow-2xl transition-all duration-500 group/pip ${isVideoOff ? 'opacity-20 scale-90 grayscale' : 'opacity-100 hover:scale-105 active:scale-95'}`}>
              <img src={`https://picsum.photos/seed/${currentUser.id}/300/400`} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isVideoOff ? 'bg-zinc-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{lang === 'bn' ? 'আপনি' : 'You'}</span>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
