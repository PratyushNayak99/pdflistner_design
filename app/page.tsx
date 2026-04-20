'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, HelpCircle, Bell, Upload, Library, 
  FileAudio, Search, Mic, Layers, User, Plus, 
  FileText, Headphones, Clock, ChevronLeft, Moon, Sun, 
  HardDrive, LogOut, Play, Pause, FastForward, Rewind, Bookmark, Trash2, Settings, Info, CreditCard, ExternalLink, Activity
} from 'lucide-react';

export type FileItem = { id: string; title: string; size: string; duration: string; date: string; };
export type NotificationItem = { id: string; title: string; message: string; time: string; unread: boolean; };

const INITIAL_FILES: FileItem[] = [
  { id: '1', title: "Design_Document_v2.pdf", size: "4.2 MB", duration: "12m", date: "Today" },
  { id: '2', title: "Product_Strategy_Q3.pdf", size: "2.1 MB", duration: "8m", date: "Yesterday" },
  { id: '3', title: "Marketing_Plan_2025.pdf", size: "3.4 MB", duration: "17m", date: "4 days ago" },
  { id: '4', title: "Employee_Handbook.pdf", size: "12.4 MB", duration: "45m", date: "Sep 28" }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: "Conversion Complete", message: "Marketing_Plan_2025.pdf is ready to listen.", time: "2m ago", unread: true },
  { id: 'n2', title: "Storage Warning", message: "You have used 80% of your free storage.", time: "1h ago", unread: true },
  { id: 'n3', title: "New Feature Available", message: "Dark mode has arrived! Try it out in settings.", time: "2d ago", unread: false },
  { id: 'n4', title: "Weekly Report", message: "You spent 4.2 hours listening this week.", time: "1w ago", unread: false },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'home' | 'settings' | 'upload' | 'processing' | 'player' | 'library' | 'help' | 'notifications'>('login');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className={`min-h-screen bg-neutral-200 flex items-center justify-center py-10 px-4 font-sans drop-shadow-2xl ${isDarkMode ? 'dark' : ''}`}>
      {/* Phone Hardware Mockup Wrapper */}
      <div className={`relative w-[390px] h-[844px] ${isDarkMode ? 'bg-[#000000] border-[#333333]' : 'bg-[#F8F9FB] border-[#1C1C1E]'} rounded-[55px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border-[14px] shrink-0 transition-colors duration-500`}>
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 inset-x-0 flex justify-center z-50">
          <div className="w-[126px] h-[32px] bg-[#1C1C1E] rounded-b-3xl relative">
            {/* Camera dot */}
            <div className="absolute right-4 top-2.5 w-2 h-2 rounded-full bg-black/80 ring-1 ring-white/10" />
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className={`w-full h-full relative overflow-y-auto overflow-x-hidden no-scrollbar ${isDarkMode ? 'bg-[#000000] text-white' : 'bg-[#F8F9FB] text-black'} transition-colors duration-500`}>
          <AnimatePresence mode="wait">
            {currentScreen === 'login' && (
              <LoginScreen key="login" onLogin={() => setCurrentScreen('home')} isDarkMode={isDarkMode} />
            )}
            {currentScreen === 'home' && (
              <HomeScreen key="home" onSettings={() => setCurrentScreen('settings')} onNavigate={setCurrentScreen} isDarkMode={isDarkMode} files={files} notifications={notifications} />
            )}
            {currentScreen === 'settings' && (
              <SettingsScreen key="settings" onBack={() => setCurrentScreen('home')} onLogout={() => setCurrentScreen('login')} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
            )}
            {currentScreen === 'upload' && (
              <UploadScreen key="upload" onBack={() => setCurrentScreen('home')} onUpload={() => setCurrentScreen('processing')} isDarkMode={isDarkMode} files={files} />
            )}
            {currentScreen === 'processing' && (
              <ProcessingScreen key="processing" onComplete={() => setCurrentScreen('player')} isDarkMode={isDarkMode} />
            )}
            {currentScreen === 'player' && (
              <PlayerScreen key="player" onBack={() => setCurrentScreen('home')} isDarkMode={isDarkMode} />
            )}
            {currentScreen === 'library' && (
              <LibraryScreen key="library" onBack={() => setCurrentScreen('home')} onPlay={() => setCurrentScreen('player')} isDarkMode={isDarkMode} files={files} onDelete={handleDeleteFile} />
            )}
            {currentScreen === 'help' && (
              <HelpScreen key="help" onBack={() => setCurrentScreen('home')} isDarkMode={isDarkMode} />
            )}
            {currentScreen === 'notifications' && (
              <NotificationsScreen key="notifications" onBack={() => setCurrentScreen('home')} isDarkMode={isDarkMode} notifications={notifications} onMarkAllRead={handleMarkAllRead} />
            )}
          </AnimatePresence>
        </div>

        {/* Swipe Home Indicator */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className={`w-[130px] h-[5px] ${isDarkMode ? 'bg-white' : 'bg-[#1C1C1E]'} rounded-full opacity-80`}></div>
        </div>
        
        {/* Hardware Buttons (Decorative) */}
        <div className="absolute top-[120px] -left-[16px] w-[3px] h-[32px] bg-[#444] rounded-l-md" />
        <div className="absolute top-[170px] -left-[16px] w-[3px] h-[60px] bg-[#444] rounded-l-md" />
        <div className="absolute top-[240px] -left-[16px] w-[3px] h-[60px] bg-[#444] rounded-l-md" />
        <div className="absolute top-[180px] -right-[16px] w-[3px] h-[80px] bg-[#444] rounded-r-md" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 1. LOGIN / ONBOARDING SCREEN
// ---------------------------------------------------------
function LoginScreen({ onLogin, isDarkMode }: { onLogin: () => void, isDarkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ duration: 0.4 }}
      className={`h-full w-full flex flex-col relative ${isDarkMode ? 'bg-[#000000]' : 'bg-white'} transition-colors duration-500`}
    >
      {/* Decorative clean line background */}
      <svg className="absolute inset-0 w-full h-[50%] pointer-events-none opacity-40" viewBox="0 0 300 300" preserveAspectRatio="none">
        <path d="M 50 150 Q 200 100 300 150" fill="none" stroke={isDarkMode ? '#333' : '#E5E7EB'} strokeWidth="2" />
        <path d="M 0 180 Q 150 130 300 180" fill="none" stroke={isDarkMode ? '#333' : '#E5E7EB'} strokeWidth="2" />
        <path d="M -50 210 Q 100 160 300 210" fill="none" stroke={isDarkMode ? '#333' : '#E5E7EB'} strokeWidth="2" />
      </svg>

      <div className="pt-[110px] px-8 flex-1 flex flex-col z-10">
        
        {/* Giant Quirky Typography */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-[48px] font-medium leading-[0.95] tracking-tighter ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} transition-colors`}
        >
          Listen to<br />documents<br />anytime with<br />PDF Audio
        </motion.h1>

        {/* Minimalist Graphic Illustration */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="flex-1 flex items-center justify-center mt-8 mb-12 relative"
        >
          <div className="relative w-52 h-60 flex items-center justify-center">
            
            {/* Document Card Base */}
            <div className={`absolute inset-0 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-600 shadow-[10px_10px_0px_rgba(255,255,255,0.1)]' : 'bg-white border-[#1C1C1E] shadow-[10px_10px_0px_#1C1C1E]'} border-[5px] rounded-[36px] flex flex-col items-center justify-center p-6 transition-colors`}>
              <FileText size={64} strokeWidth={1.5} className={`${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-6`} />
              
              {/* Animated Audio Waveform inside the Doc */}
              <div className="flex items-end justify-center w-full gap-[6px] h-12">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.2, 
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                    className={`w-2.5 rounded-full ${i === 2 || i === 4 ? "bg-[#5B8DEF]" : (isDarkMode ? 'bg-white' : 'bg-[#1C1C1E]')}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Detail (Headphones) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className={`absolute -bottom-6 -right-6 w-[88px] h-[88px] ${isDarkMode ? 'bg-black border-gray-600 shadow-[6px_6px_0px_rgba(255,255,255,0.1)]' : 'bg-[#F8F9FB] border-[#1C1C1E] shadow-[6px_6px_0px_#1C1C1E]'} border-[5px] rounded-full flex items-center justify-center transition-colors`}
            >
              <Headphones size={36} strokeWidth={2} className={isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} />
            </motion.div>

          </div>
        </motion.div>

        {/* Call to Action Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pb-[60px] mt-auto"
        >
          <button 
            onClick={onLogin} 
            className={`w-full ${isDarkMode ? 'bg-white text-black' : 'bg-[#1C1C1E] text-white'} active:scale-95 rounded-[24px] px-7 py-[22px] flex items-center justify-between group transition-all duration-300 shadow-xl`}
          >
            <span className="text-[19px] font-medium tracking-tight">Get Started</span>
            <ArrowRight size={24} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <p className="text-center text-[15px] text-gray-400 mt-6 font-medium">
            Read and listen to any document.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}


// ---------------------------------------------------------
// 2. MAIN DASHBOARD / HOME SCREEN
// ---------------------------------------------------------
function HomeScreen({ onSettings, onNavigate, isDarkMode, files, notifications }: { onSettings: () => void, onNavigate: (screen: any) => void, isDarkMode: boolean, files: FileItem[], notifications: NotificationItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFiles = searchQuery 
    ? files.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} flex flex-col pt-[60px] pb-0 relative transition-colors duration-500 overflow-hidden`}
    >
      {/* Top App Bar */}
      <div className="px-6 flex justify-between items-start mb-8">
        <button 
          onClick={() => onNavigate('help')}
          className={`w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}
        >
          <HelpCircle size={24} strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => onNavigate('notifications')}
          className={`relative w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}>
          <Bell size={24} strokeWidth={1.5} />
          {/* Notification Dot */}
          {unreadCount > 0 && (
            <span className={`absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[12px] font-bold w-[24px] h-[24px] flex items-center justify-center rounded-full border-[3px] ${isDarkMode ? 'border-black' : 'border-[#F2F2F7]'}`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Greeting (Like Image 1) */}
      <div className="px-6 mb-6">
        <h2 className="text-[40px] font-bold tracking-tight leading-[1] text-gray-400 mb-1">
          Hi Alex,
        </h2>
        <h2 className={`text-[40px] font-bold tracking-tight leading-[1.02] ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} transition-colors`}>
          What are we<br/>listening to today?
        </h2>
      </div>

      {/* Global Search & Voice */}
      <div className="px-6 mb-8 relative z-10 shrink-0">
        <div className={`w-full ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 focus-within:ring-white/20' : 'bg-white border-gray-100 focus-within:ring-[#1C1C1E]/20'} rounded-[28px] h-[64px] flex items-center px-5 shadow-sm border focus-within:ring-2 transition-all`}>
          <Search size={22} className="text-gray-400 mr-3 shrink-0" strokeWidth={2} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..." 
            className={`flex-1 min-w-0 bg-transparent ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} text-[17px] outline-none placeholder:text-gray-400 font-medium`} 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              ✕
            </button>
          )}
          <button className={`w-10 h-10 ml-2 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors shrink-0`}>
            <Mic size={20} className={isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-[100px]">
        {searchQuery ? (
          <div className="px-6 flex flex-col gap-4">
             <h3 className={`font-bold text-[18px] mb-2 ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'}`}>Search Results</h3>
             {filteredFiles.length > 0 ? filteredFiles.map((file, i) => (
                <div key={i} className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100'} p-4 rounded-[24px] shadow-sm border flex items-center justify-between group transition-colors`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-[48px] h-[48px] ${isDarkMode ? 'bg-black border-gray-800 text-[#5B8DEF]' : 'bg-[#F8F9FB] border-gray-50 text-[#1C1C1E]'} rounded-[16px] flex items-center justify-center shrink-0 border transition-colors duration-300`}>
                      <FileText size={22} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[15px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} truncate mb-0.5 transition-colors`}>{file.title}</h4>
                      <p className="text-[12px] text-gray-400 font-medium">{file.size} • {file.duration}</p>
                    </div>
                  </div>
                  <button onClick={() => onNavigate('player')} className={`w-10 h-10 ml-3 ${isDarkMode ? 'bg-black hover:bg-white hover:text-black' : 'bg-[#F2F2F7] hover:bg-[#1C1C1E] hover:text-white'} rounded-full flex items-center justify-center transition-colors shadow-sm`}>
                    <Play size={18} className="ml-0.5" strokeWidth={1.5} />
                  </button>
               </div>
             )) : (
               <div className="text-center py-10">
                 <p className="text-gray-400 font-medium tracking-tight">No documents found matching "{searchQuery}"</p>
               </div>
             )}
          </div>
        ) : (
          <div className="px-6 grid grid-cols-2 gap-4 pb-4">
            <ActionCard 
              title="Convert" 
              subtitle="PDF, DOCX, Images..." 
              icon={<Upload size={26} strokeWidth={1.5} className={isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} />} 
              delay={0.1}
              onClick={() => onNavigate('upload')}
              isDarkMode={isDarkMode}
              centered={true}
              className="col-span-2"
            />
            <ActionCard 
              title="Library" 
              subtitle="Your saved audio" 
              icon={<Library size={26} strokeWidth={1.5} className={isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} />} 
              delay={0.2}
              onClick={() => onNavigate('library')}
              isDarkMode={isDarkMode}
            />
            <ActionCard 
              title="Recent" 
              subtitle="Continue listening" 
              icon={<Clock size={26} strokeWidth={1.5} className={isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} />} 
              delay={0.3}
              onClick={() => onNavigate('player')}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>

      {/* Floating Bottom Nav */}
      <div className="absolute bottom-[36px] left-[24px] right-[24px] flex justify-between items-center pointer-events-auto z-50">
        
        {/* Layered Profile & Menu widget */}
        <div 
          onClick={onSettings}
          className={`${isDarkMode ? 'bg-white' : 'bg-[#1C1C1E]'} p-1.5 rounded-[36px] flex items-center shadow-xl shadow-black/10 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all w-[114px]`}
        >
          <div className={`${isDarkMode ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-full w-[52px] h-[52px] flex items-center justify-center shadow-sm shrink-0`}>
            <Settings size={28} className={isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} strokeWidth={1.5} />
          </div>
          <div className="flex-1 h-[52px] flex items-center justify-center relative">
            <User size={24} className={isDarkMode ? 'text-[#1C1C1E]' : 'text-white'} strokeWidth={1.5} />
            <div className={`absolute top-3 right-3 w-2 h-2 bg-[#5B8DEF] rounded-full border-2 ${isDarkMode ? 'border-white' : 'border-[#1C1C1E]'}`}></div>
          </div>
        </div>
        
        {/* Play/Add FAB */}
        <button 
          onClick={() => onNavigate('upload')}
          className={`w-[64px] h-[64px] ${isDarkMode ? 'bg-white text-[#1C1C1E]' : 'bg-[#1C1C1E] text-white'} rounded-full flex items-center justify-center shadow-2xl shadow-[#1C1C1E]/30 hover:scale-105 active:scale-95 transition-all`}
        >
          <Plus size={32} strokeWidth={1.5} />
        </button>

      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// REUSABLE DASHBOARD CARD
// ---------------------------------------------------------
function ActionCard({ title, subtitle, icon, delay, onClick, isDarkMode, centered = false, className = "" }: { title: string, subtitle: string, icon: React.ReactNode, delay: number, onClick?: () => void, isDarkMode?: boolean, centered?: boolean, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100/50'} p-[22px] rounded-[32px] shadow-sm border flex flex-col ${centered ? 'items-center justify-center text-center' : 'items-start'} h-[160px] hover:shadow-md transition-all cursor-pointer active:scale-95 duration-200 ${className}`}
    >
      <div className={`w-[52px] h-[52px] ${centered ? 'mb-3' : 'mb-auto'} ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} rounded-[16px] border flex items-center justify-center transition-colors shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-bold text-[18px] tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-1 transition-colors`}>{title}</h3>
        <p className="text-[13px] text-gray-400 font-medium leading-tight">{subtitle}</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 3. SETTINGS / PROFILE SCREEN
// ---------------------------------------------------------
function SettingsScreen({ onBack, onLogout, isDarkMode, onToggleDarkMode }: { onBack: () => void, onLogout: () => void, isDarkMode: boolean, onToggleDarkMode: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userName, setUserName] = useState('Alex Carter');
  const [userEmail, setUserEmail] = useState('alex@example.com');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} flex flex-col pt-[60px] pb-10 relative overflow-y-auto no-scrollbar transition-colors duration-500`}
    >
      {/* Header */}
      <div className="px-6 flex items-center mb-8">
        <button 
          onClick={onBack}
          className={`w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className={`text-[26px] tracking-tight font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} ml-4 transition-colors`}>Settings</h2>
      </div>

      <div className="px-6 flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100/50'} rounded-[32px] p-6 shadow-sm border transition-colors`}>
          <div className="flex justify-between items-start mb-5">
            <div className={`w-[64px] h-[64px] ${isDarkMode ? 'bg-black text-[#5B8DEF] border border-gray-800' : 'bg-[#1C1C1E] text-white'} rounded-[20px] flex items-center justify-center shadow-md transition-colors`}>
              <User size={32} strokeWidth={1.5} />
            </div>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`text-[15px] font-bold px-4 py-2 rounded-full active:scale-95 transition-all ${isEditingProfile ? (isDarkMode ? 'bg-white text-black' : 'bg-[#1C1C1E] text-white') : (isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-[#F2F2F7] text-[#1C1C1E] hover:bg-gray-200')}`}
            >
              {isEditingProfile ? 'Save' : 'Edit'}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {isEditingProfile ? (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-black border-gray-800 text-white focus:border-[#5B8DEF]' : 'bg-[#F8F9FB] border-gray-200 text-[#1C1C1E] focus:border-[#5B8DEF]'} rounded-[16px] px-4 py-3.5 text-[17px] font-bold outline-none transition-colors border`}
                />
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-black border-gray-800 text-gray-400 focus:border-[#5B8DEF]' : 'bg-[#F8F9FB] border-gray-200 text-gray-500 focus:border-[#5B8DEF]'} rounded-[16px] px-4 py-3.5 text-[15px] font-medium outline-none transition-colors border`}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className={`text-[22px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-0.5 transition-colors`}>{userName}</h3>
                <p className="text-[15px] text-gray-400 font-medium">{userEmail}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* App Preferences */}
        <div>
          <h4 className="text-[14px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-3">Preferences</h4>
          <div className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100/50'} rounded-[32px] shadow-sm border overflow-hidden transition-colors`}>
            {/* Dark Mode */}
            <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[16px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F8F9FB] text-[#1C1C1E]'} flex items-center justify-center transition-colors`}>
                  {isDarkMode ? <Moon size={22} strokeWidth={1.5} /> : <Sun size={22} strokeWidth={1.5} />}
                </div>
                <span className={`text-[17px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} transition-colors`}>Dark Mode</span>
              </div>
              <button 
                onClick={onToggleDarkMode}
                className={`w-[56px] h-[32px] rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-[#5B8DEF]' : 'bg-[#E5E7EB]'}`}
              >
                <motion.div 
                  className="w-[24px] h-[24px] bg-white rounded-full shadow-md"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            {/* Notifications */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[16px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F8F9FB] text-[#1C1C1E]'} flex items-center justify-center transition-colors`}>
                  <Bell size={22} strokeWidth={1.5} />
                </div>
                <span className={`text-[17px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} transition-colors`}>Notifications</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-[56px] h-[32px] rounded-full p-1 transition-colors duration-300 ${notifications ? 'bg-[#5B8DEF]' : (isDarkMode ? 'bg-gray-800' : 'bg-[#E5E7EB]')}`}
              >
                <motion.div 
                  className="w-[24px] h-[24px] bg-white rounded-full shadow-md"
                  animate={{ x: notifications ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div>
          <h4 className="text-[14px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-3">Storage Usage</h4>
          <div className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100/50'} rounded-[32px] p-6 shadow-sm border transition-colors`}>
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[12px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F8F9FB] text-[#1C1C1E]'} flex items-center justify-center transition-colors`}>
                  <HardDrive size={20} strokeWidth={1.5} />
                </div>
                <span className={`text-[17px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} transition-colors`}>Audio Files</span>
              </div>
              <span className="text-[15px] font-bold text-[#5B8DEF]">1.2 GB <span className="text-gray-400 font-medium">/ 5 GB</span></span>
            </div>
            {/* Storage Bar */}
            <div className={`w-full h-[10px] ${isDarkMode ? 'bg-gray-800' : 'bg-[#F2F2F7]'} rounded-full overflow-hidden transition-colors`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "24%" }}
                transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                className="h-full bg-[#5B8DEF] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Log Out */}
        <button 
          onClick={onLogout}
          className={`mt-2 w-full ${isDarkMode ? 'bg-black border-red-900 shadow-none hover:bg-red-950' : 'bg-white border-red-50 hover:bg-[#FFF5F5]'} rounded-[32px] p-5 shadow-sm border flex items-center justify-center gap-3 text-[#FF3B30] transition-colors active:scale-95`}
        >
          <LogOut size={22} strokeWidth={1.5} />
          <span className="text-[18px] font-bold tracking-tight">Sign Out</span>
        </button>

      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 4. UPLOAD SCREEN
// ---------------------------------------------------------
function UploadScreen({ onBack, onUpload, isDarkMode, files }: { onBack: () => void, onUpload: () => void, isDarkMode: boolean, files: FileItem[] }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload();
    }
  };

  const recentFile = files.length > 0 ? files[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F8F9FB]'} flex flex-col pt-[60px] pb-10 relative transition-colors duration-500`}
    >
      <div className="px-6 flex items-center mb-8">
        <button onClick={onBack} className={`w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}>
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className={`text-[26px] tracking-tight font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} ml-4 transition-colors`}>PDF Listener</h2>
      </div>
      <div className="flex-1 px-6 flex flex-col items-center justify-center pb-20">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.doc,.docx" 
          onChange={handleFileChange} 
        />
        <div 
          onClick={handleUploadClick}
          className={`w-full ${isDarkMode ? 'bg-[#1C1C1E] border-gray-700 hover:border-[#5B8DEF] hover:bg-gray-800' : 'bg-white border-gray-300 hover:border-[#1C1C1E]/30 hover:bg-gray-50'} border-2 border-dashed rounded-[40px] flex flex-col items-center justify-center py-20 cursor-pointer active:scale-[0.98] transition-all shadow-sm group`}
        >
          <div className={`w-[88px] h-[88px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F2F2F7] text-[#1C1C1E]'} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all`}>
            <Upload size={36} strokeWidth={1.5} />
          </div>
          <h3 className={`text-[22px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-2 transition-colors`}>Upload your PDF</h3>
          <p className="text-[15px] font-medium text-gray-400">Tap to browse or drag file</p>
        </div>
        
        {/* Recent file inline view */}
        {recentFile && (
          <div className="w-full mt-10">
            <div className="flex justify-between items-center mb-4">
               <h4 className="text-[15px] font-bold text-gray-400 uppercase tracking-widest px-2">Recent Listens</h4>
            </div>
            <div className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100'} rounded-[24px] p-4 shadow-sm border flex items-center justify-between transition-colors`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F2F2F7] text-[#1C1C1E]'} rounded-[14px] flex items-center justify-center transition-colors`}>
                  <FileText size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} text-[15px] transition-colors truncate max-w-[180px]`}>{recentFile.title}</h4>
                  <p className="text-gray-400 text-[13px] font-medium">{recentFile.duration} • {recentFile.date}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 5. PROCESSING SCREEN
// ---------------------------------------------------------
function ProcessingScreen({ onComplete, isDarkMode }: { onComplete: () => void, isDarkMode: boolean }) {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`h-full w-full flex flex-col items-center justify-center relative ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F8F9FB]'} transition-colors duration-500`}
    >
      <div className="w-32 h-32 relative flex items-center justify-center mb-8">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 border-[3px] ${isDarkMode ? 'border-white' : 'border-[#1C1C1E]'} rounded-full transition-colors`}
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.6, ease: "easeInOut" }}
          />
        ))}
        <div className={`w-16 h-16 ${isDarkMode ? 'bg-white' : 'bg-[#1C1C1E]'} rounded-full flex items-center justify-center shadow-lg transition-colors`}>
           <FileAudio size={28} className={isDarkMode ? 'text-black' : 'text-white'} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className={`text-[22px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} transition-colors`}>Converting your PDF...</h3>
      <p className="text-gray-400 font-medium text-[15px] mt-2">Extracting audio tracks</p>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 6. AUDIO PLAYER SCREEN
// ---------------------------------------------------------
function PlayerScreen({ onBack, isDarkMode }: { onBack: () => void, isDarkMode: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(252); // seconds (04:12)
  const totalDuration = 765; // seconds (12:45)

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < totalDuration) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 1, totalDuration));
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, speed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (progress / totalDuration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#1C1C1E]'} text-white flex flex-col pt-[60px] pb-10 px-6 rounded-b-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-20 transition-colors duration-500`}
    >
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className={`w-12 h-12 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'} active:scale-95 transition-all rounded-full flex items-center justify-center`}>
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <div className="text-[13px] font-bold tracking-widest uppercase text-white/50">Now Playing</div>
        <button className={`w-12 h-12 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'} active:scale-95 transition-all rounded-full flex items-center justify-center`}>
          <Settings size={22} strokeWidth={1.5} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ scale: isPlaying ? 1.05 : 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-[280px] h-[280px] bg-white/5 rounded-[48px] flex items-center justify-center mb-10 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Animated decorative waves inside card */}
          {isPlaying && [...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-2 bg-white/10 rounded-full"
               initial={{ height: 20 }}
               animate={{ height: ["20%", "80%", "20%"] }}
               transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
               style={{ left: `${20 + i * 15}%` }}
             />
          ))}
          <Headphones size={80} className={`transform transition-all duration-500 z-10 ${isPlaying ? 'text-white' : 'text-white/40'}`} strokeWidth={1.5} />
        </motion.div>
        
        <h2 className="text-[28px] font-bold tracking-tight mb-2 text-center leading-tight">Design_Document_v2.pdf</h2>
        <p className="text-[#5B8DEF] text-[16px] font-bold">Chapter 1 - Introduction</p>
      </div>
      
      <div className="mt-6 mb-8 w-full">
        <div className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPercent = clickX / rect.width;
          setProgress(newPercent * totalDuration);
        }}>
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-white rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[14px] text-white/50 font-medium mt-4">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full pb-4">
        <button onClick={() => setSpeed(s => s === 1 ? 1.5 : (s === 1.5 ? 2 : 1))} className={`text-[15px] font-bold ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/20'} px-4 py-3 rounded-[16px] w-[64px] text-center transition-all active:scale-95`}>
          {speed}x
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => setProgress(p => Math.max(0, p - 15))} className="active:scale-90 transition-transform">
            <Rewind size={32} className="text-white hover:text-white/80 transition-colors" strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-[84px] h-[84px] bg-white rounded-full flex items-center justify-center active:scale-95 transition-all text-[#1C1C1E] ${isDarkMode ? 'shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]' : 'shadow-xl hover:scale-105'}`}
          >
            {isPlaying ? <Pause size={36} strokeWidth={1.5} /> : <Play size={36} className="ml-1" strokeWidth={1.5} />}
          </button>
          <button onClick={() => setProgress(p => Math.min(totalDuration, p + 15))} className="active:scale-90 transition-transform">
            <FastForward size={32} className="text-white hover:text-white/80 transition-colors" strokeWidth={1.5} />
          </button>
        </div>
        <button onClick={() => setBookmarked(!bookmarked)} className={`w-14 h-14 rounded-[16px] flex items-center justify-center transition-all active:scale-95 ${bookmarked ? 'bg-[#5B8DEF] text-white' : (isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white/80' : 'bg-white/10 text-white/80 hover:bg-white/20')}`}>
          <Bookmark size={22} strokeWidth={1.5} className={bookmarked ? "fill-white" : ""} />
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 7. LIBRARY SCREEN
// ---------------------------------------------------------
function LibraryScreen({ onBack, onPlay, isDarkMode, files, onDelete }: { onBack: () => void, onPlay: () => void, isDarkMode: boolean, files: FileItem[], onDelete: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} flex flex-col pt-[60px] pb-10 relative overflow-y-auto no-scrollbar transition-colors duration-500`}
    >
      <div className={`px-6 flex items-center mb-8 sticky top-0 ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} z-10 pb-4 transition-colors duration-500`}>
        <button onClick={onBack} className={`w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}>
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className={`text-[26px] tracking-tight font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} ml-4 transition-colors`}>Library</h2>
      </div>
      
      <div className="px-6 flex flex-col gap-4">
        <AnimatePresence>
          {files.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <p className="text-gray-400 font-medium tracking-tight">Your library is empty.</p>
            </motion.div>
          ) : files.map((file, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              key={file.id} 
              className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100'} p-5 rounded-[24px] shadow-sm border flex items-center justify-between group transition-colors`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-[52px] h-[52px] ${isDarkMode ? 'bg-black border-gray-800 group-hover:bg-gray-800 group-hover:text-[#5B8DEF]' : 'bg-[#F8F9FB] border-gray-50 group-hover:bg-[#1C1C1E] group-hover:text-white'} rounded-[16px] flex items-center justify-center shrink-0 border transition-colors duration-300 relative overflow-hidden`}>
                  <FileText size={24} strokeWidth={1.5} className={`z-10 relative ${isDarkMode ? 'text-[#5B8DEF]' : 'text-[#1C1C1E]'} group-hover:text-[inherit]`} />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className={`text-[16px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} truncate mb-0.5 transition-colors`}>{file.title}</h4>
                  <p className="text-[13px] text-gray-400 font-medium">{file.size} • {file.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => onDelete(file.id)}
                  className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors active:scale-95"
                >
                  <Trash2 size={20} strokeWidth={1.5} />
                </button>
                <button 
                  onClick={onPlay} 
                  className={`w-12 h-12 ${isDarkMode ? 'bg-black hover:bg-white hover:text-black' : 'bg-[#F2F2F7] hover:bg-[#1C1C1E] hover:text-white'} rounded-full flex items-center justify-center transition-colors active:scale-95`}
                >
                  <Play size={22} className="ml-0.5" strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 8. HELP & SUPPORT SCREEN
// ---------------------------------------------------------
function HelpScreen({ onBack, isDarkMode }: { onBack: () => void, isDarkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} flex flex-col pt-[60px] pb-10 relative overflow-y-auto no-scrollbar transition-colors duration-500`}
    >
      <div className={`px-6 flex items-center mb-8 sticky top-0 ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} z-10 pb-4 transition-colors duration-500`}>
        <button onClick={onBack} className={`w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}>
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <h2 className={`text-[26px] tracking-tight font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} ml-4 transition-colors`}>Help & Support</h2>
      </div>

      <div className="px-6 flex flex-col gap-6">
        {/* Support Options */}
        <div>
           <div className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100'} rounded-[32px] p-2 shadow-sm border flex flex-col transition-colors`}>
              <button className="flex items-center gap-4 p-4 active:scale-[0.98] transition-transform">
                <div className={`w-12 h-12 rounded-[16px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F8F9FB] text-[#1C1C1E]'} flex items-center justify-center shrink-0 border border-black/5`}>
                   <Info size={22} strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                   <h3 className={`font-bold text-[16px] tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-0.5`}>FAQ</h3>
                   <p className="text-[13px] text-gray-400 font-medium">Common questions about formats</p>
                </div>
              </button>
              <div className={`h-[1px] w-[calc(100%-32px)] mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
              <button className="flex items-center gap-4 p-4 active:scale-[0.98] transition-transform">
                <div className={`w-12 h-12 rounded-[16px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F8F9FB] text-[#1C1C1E]'} flex items-center justify-center shrink-0 border border-black/5`}>
                   <CreditCard size={22} strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                   <h3 className={`font-bold text-[16px] tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-0.5`}>Billing Support</h3>
                   <p className="text-[13px] text-gray-400 font-medium">Manage your subscription</p>
                </div>
              </button>
              <div className={`h-[1px] w-[calc(100%-32px)] mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
              <button className="flex items-center gap-4 p-4 active:scale-[0.98] transition-transform">
                <div className={`w-12 h-12 rounded-[16px] ${isDarkMode ? 'bg-black text-[#5B8DEF]' : 'bg-[#F8F9FB] text-[#1C1C1E]'} flex items-center justify-center shrink-0 border border-black/5`}>
                   <HelpCircle size={22} strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                   <h3 className={`font-bold text-[16px] tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-0.5`}>Contact Us</h3>
                   <p className="text-[13px] text-gray-400 font-medium">Email our support team directly</p>
                </div>
              </button>
           </div>
        </div>
        
        {/* About App */}
        <div className="px-2 mt-4 text-center">
           <h4 className="text-[15px] font-bold text-gray-400 mb-2 mt-4">ABOUT</h4>
           <div className={`mx-auto w-[88px] h-[88px] ${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} rounded-[24px] border flex items-center justify-center shadow-sm mb-4`}>
              <Headphones size={40} className={isDarkMode ? 'text-[#5B8DEF]' : 'text-[#1C1C1E]'} strokeWidth={1.5} />
           </div>
           <h4 className={`text-[18px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-1`}>PDF Listener App</h4>
           <p className="text-[14px] text-gray-400 font-medium">Version 2.0.4 (Build 492)</p>
           <button className="text-[#5B8DEF] font-bold text-[14px] mt-4 flex items-center justify-center gap-2 mx-auto">
             View Privacy Policy <ExternalLink size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------
// 9. NOTIFICATIONS SCREEN
// ---------------------------------------------------------
function NotificationsScreen({ onBack, isDarkMode, notifications, onMarkAllRead }: { onBack: () => void, isDarkMode: boolean, notifications: NotificationItem[], onMarkAllRead: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`h-full w-full ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} flex flex-col pt-[60px] pb-10 relative overflow-y-auto no-scrollbar transition-colors duration-500`}
    >
      <div className={`px-6 flex items-center justify-between mb-8 sticky top-0 ${isDarkMode ? 'bg-[#000000]' : 'bg-[#F2F2F7]'} z-10 pb-4 transition-colors duration-500`}>
        <div className="flex items-center">
          <button onClick={onBack} className={`w-12 h-12 ${isDarkMode ? 'bg-[#1C1C1E] border-gray-800 text-white hover:bg-gray-800' : 'bg-white border-gray-200 text-[#1C1C1E] hover:bg-gray-50'} rounded-full border flex items-center justify-center shadow-sm active:scale-95 transition-all`}>
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <h2 className={`text-[26px] tracking-tight font-bold ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} ml-4 transition-colors`}>Updates</h2>
        </div>
        <button onClick={onMarkAllRead} className="text-[14px] font-bold text-[#5B8DEF] hover:opacity-80 transition-opacity">Mark All Read</button>
      </div>

      <div className="px-6 flex flex-col gap-4">
        {notifications.map((notif, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={notif.id} 
            className={`${isDarkMode ? 'bg-[#1C1C1E] border-gray-800' : 'bg-white border-gray-100'} p-5 rounded-[24px] shadow-sm border flex items-start group relative transition-colors`}
          >
            {notif.unread && (
              <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#5B8DEF] rounded-full shadow-[0_0_8px_#5B8DEF]" />
            )}
            <div className={`w-[48px] h-[48px] ${notif.unread ? 'bg-[#5B8DEF]/10' : (isDarkMode ? 'bg-black border-gray-800' : 'bg-[#F8F9FB] border-gray-50')} rounded-[16px] flex items-center justify-center shrink-0 border mr-4 transition-colors duration-300`}>
              {notif.title.includes("Complete") ? (
                <FileAudio size={22} strokeWidth={1.5} className={notif.unread ? "text-[#5B8DEF]" : isDarkMode ? "text-gray-400" : "text-[#1C1C1E]"} />
              ) : notif.title.includes("Storage") ? (
                <HardDrive size={22} strokeWidth={1.5} className={notif.unread ? "text-[#5B8DEF]" : isDarkMode ? "text-gray-400" : "text-[#1C1C1E]"} />
              ) : notif.title.includes("Feature") ? (
                <Moon size={22} strokeWidth={1.5} className={notif.unread ? "text-[#5B8DEF]" : isDarkMode ? "text-gray-400" : "text-[#1C1C1E]"} />
              ) : (
                <Activity size={22} strokeWidth={1.5} className={notif.unread ? "text-[#5B8DEF]" : isDarkMode ? "text-gray-400" : "text-[#1C1C1E]"} />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5 pr-4">
              <h4 className={`text-[16px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1C1C1E]'} mb-1 transition-colors ${notif.unread ? '' : 'opacity-80'}`}>{notif.title}</h4>
              <p className={`text-[14px] ${notif.unread ? (isDarkMode ? 'text-gray-300' : 'text-gray-600') : 'text-gray-400'} font-medium leading-snug mb-2`}>{notif.message}</p>
              <span className={`text-[12px] font-bold uppercase tracking-widest ${notif.unread ? 'text-[#5B8DEF]' : 'text-gray-400'}`}>{notif.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
