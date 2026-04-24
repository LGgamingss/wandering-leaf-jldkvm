"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  ChevronDown, Shield, Zap, Globe, Cpu, Lock, 
  Mail, User, CheckCircle2, Play, Smartphone, Key, Star, ArrowRight, X, Eye, EyeOff
} from 'lucide-react';

const smoothSpring = { type: "spring", stiffness: 100, damping: 20, mass: 0.5 };

// Helper: PLN -> EUR rounded to nearest 0.5
function plnToEur(plnStr) {
  const num = parseFloat(plnStr);
  const eur = num / 4.25;
  const rounded = Math.round(eur * 2) / 2;
  return rounded % 1 === 0 ? `€${rounded.toFixed(0)}` : `€${rounded.toFixed(1)}`;
}

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 150, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const moveCursor = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-8 h-8 bg-white mix-blend-difference rounded-full pointer-events-none z-[999] hidden md:block"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    />
  );
};

const PRODUCTS = {
  Multimedia: [
    { id: 1, name: "Netflix Shared", period: "1 Month", pricePLN: 8.5, desc: "Shared access. Multiple users watching simultaneously. You receive login and password. Changing account data is strictly forbidden.", icon: <Play size={28} /> },
    { id: 2, name: "Netflix Full Access", period: "2-3 Months", pricePLN: 25, desc: "Private profile with your own PIN. 4 devices streaming. Minimum duration: 2-3 months. Changing login credentials is forbidden.", icon: <Star size={28} /> },
    { id: 3, name: "Disney+ Shared", period: "8-12 Months", pricePLN: 11, desc: "Long-term shared access. Works for approx. 8-12 months. Multiple users simultaneously. No data changes allowed.", icon: <Globe size={28} /> },
    { id: 4, name: "YouTube Premium", period: "1 Month", pricePLN: 12, desc: "Access to a full Google account just for you. Data changes allowed. Ad-free, background play, and YouTube Music included.", icon: <Smartphone size={28} /> },
    { id: 5, name: "Spotify Lifetime", period: "Activation Key", pricePLN: 50, desc: "Receive an activation key for your OWN Spotify account. Lifetime warranty. You must not have an active premium at the moment of activation.", icon: <Key size={28} /> },
    { id: 6, name: "HBO Max Shared", period: "3 Months", pricePLN: 11, desc: "Minimum 3 months guaranteed. Shared account access. Changing account data is strictly forbidden.", icon: <Play size={28} /> },
    { id: 7, name: "NBA League Pass", period: "Full Season", pricePLN: 18, desc: "Official NBA streams. Usually covers the full season. High quality with no regional blackouts.", icon: <Zap size={28} /> },
  ],
  AI: [
    { id: 8, name: "ChatGPT PRO FA", period: "1 Month", pricePLN: 35, desc: "Private access to Enterprise/Team workspace. Invitation sent directly to your e-mail.", icon: <Cpu size={28} /> },
    { id: 9, name: "ChatGPT PRO Lifetime", period: "1-2 Years", pricePLN: 130, desc: "Highest stability standard. Full Access account for 1-2 years. Premium support included.", icon: <Shield size={28} /> },
    { id: 10, name: "ChatGPT Plus FA", period: "1 Month", pricePLN: 30, desc: "Ready-to-use account (login + password) with active Plus subscription. Private Full Access.", icon: <Cpu size={28} /> },
    { id: 11, name: "ChatGPT Team Owner", period: "1 Month", pricePLN: 38, desc: "Owner-level access. Full control over business features on a ready-made account.", icon: <Shield size={28} /> },
    { id: 12, name: "ChatGPT GO FA", period: "Upgrade Key", pricePLN: 45, desc: "Activation key to enable PRO features on your own personal ChatGPT account.", icon: <Key size={28} /> },
    { id: 13, name: "Gemini Advanced", period: "4 Months", pricePLN: 40, desc: "Ready Full Access account for Gemini Advanced. Security data changes allowed.", icon: <Cpu size={28} /> },
    { id: 14, name: "Gemini Advanced", period: "12 Months", pricePLN: 65, desc: "Full year of Gemini Advanced on a private account. Complete data control provided.", icon: <Cpu size={28} /> },
  ],
  "VPN & Soft": [
    { id: 15, name: "CapCut Pro", period: "40 Days", pricePLN: 15, desc: "Unlock all premium filters and transitions. You receive login and password. Data changes not allowed.", icon: <Smartphone size={28} /> },
    { id: 16, name: "NordVPN Premium", period: "1 Year+", pricePLN: 25, desc: "Minimum 1 year guaranteed. Military-grade encryption. Login provided. Data changes forbidden.", icon: <Lock size={28} /> },
    { id: 17, name: "Adobe Creative Cloud", period: "2 Months", pricePLN: 45, desc: "Access to all Adobe apps (Photoshop, Premiere, etc.). Full Access - you can change all account data.", icon: <Star size={28} /> },
  ]
};

// Fake user storage (in-memory)
const USERS = {};

export default function BLMarket() {
  const [page, setPage] = useState('home'); 
  const [tab, setTab] = useState("Multimedia");
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // { email, name }

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      <CustomCursor />
      
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-2xl border-b border-white/[0.05] bg-black/40 px-8 md:px-16 py-8 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          onClick={() => setPage('home')} 
          className="text-2xl font-black tracking-[0.5em] cursor-pointer"
        >
          BL MARKET
        </motion.div>
        
        <div className="hidden md:flex gap-16 items-center">
          {['home', 'shop', 'about', 'contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => setPage(item)} 
              className={`text-sm uppercase tracking-[0.3em] transition-all font-bold relative group ${page === item ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {item}
              {page === item && <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 w-full h-px bg-white" />}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setPage('account')} 
          className="flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-90"
        >
          <User size={20} className={currentUser ? "text-green-400" : "text-white"} />
          <span className="text-sm uppercase tracking-widest font-black">{currentUser ? "Dashboard" : "Account"}</span>
        </button>
      </nav>

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.header 
            key="home" 
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }}
            transition={smoothSpring}
            className="pt-72 pb-40 px-6 text-center h-screen flex flex-col justify-center"
          >
            <motion.h1 
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, ...smoothSpring }}
              className="text-8xl md:text-[180px] font-extralight tracking-tighter leading-[0.85] mb-16"
            >
              Digital <br />
              <span className="italic font-serif text-zinc-700">Freedom.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row justify-center items-center gap-16"
            >
              <button 
                onClick={() => setPage('shop')} 
                className="group relative px-24 py-8 bg-white text-black rounded-full transition-all hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                <span className="text-sm font-black uppercase tracking-[0.5em]">Enter Market</span>
              </button>
              <div className="flex gap-20">
                <Stat label="Orders" value="200+" />
                <Stat label="Support" value="24/7" />
              </div>
            </motion.div>
          </motion.header>
        )}

        {page === 'shop' && (
          <motion.section 
            key="shop" 
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            transition={smoothSpring}
            className="pt-64 max-w-7xl mx-auto px-6 pb-40"
          >
            <div className="flex justify-center mb-24">
              <div className="flex bg-zinc-900/40 border border-white/5 p-3 rounded-full backdrop-blur-3xl">
                {Object.keys(PRODUCTS).map((category) => (
                  <button 
                    key={category} 
                    onClick={() => setTab(category)} 
                    className={`px-12 py-5 text-sm font-black uppercase tracking-widest transition-all rounded-full ${tab === category ? "bg-white text-black scale-105 shadow-xl" : "text-zinc-500 hover:text-white"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <motion.div layout className="grid gap-8">
              {PRODUCTS[tab].map((item) => (
                <ProductCard key={item.id} item={item} onSelect={setSelected} />
              ))}
            </motion.div>
          </motion.section>
        )}

        {page === 'about' && (
          <motion.section key="about" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={smoothSpring} className="pt-72 max-w-4xl mx-auto px-6 pb-40 text-center">
            <h2 className="text-8xl font-extralight mb-16 italic font-serif">Luxury Access.</h2>
            <p className="text-zinc-400 text-3xl font-light leading-relaxed mb-12">
              BL Market delivers premium digital goods with zero compromise on quality. Every order is backed by our 30-day "No-Questions" warranty.
            </p>
            <Shield size={100} className="mx-auto text-zinc-800" />
          </motion.section>
        )}

        {page === 'contact' && (
          <motion.section key="contact" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={smoothSpring} className="pt-72 max-w-6xl mx-auto px-6 pb-40 grid md:grid-cols-2 gap-12">
            <ContactCard title="Official Email" value="wiktorpoczta20@op.pl" link="mailto:wiktorpoczta20@op.pl" />
            <ContactCard title="Discord Community" value="Join Server" link="https://discord.gg/invite/blmarket" />
          </motion.section>
        )}

        {page === 'account' && (
          <motion.section key="account" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} className="pt-72 max-w-5xl mx-auto px-6 pb-40">
            {currentUser ? (
              <Dashboard user={currentUser} onSignOut={() => { setCurrentUser(null); }} />
            ) : (
              <AuthPanel onAuth={setCurrentUser} />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && <CheckoutModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

// --- AUTH PANEL (Login + Register) ---
function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!email.includes('@') || password.length < 4) {
      setError('Invalid email or password too short (min. 4 chars).');
      return;
    }
    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (USERS[email]) { setError('This email is already registered.'); return; }
      USERS[email] = { name, password };
      onAuth({ email, name });
    } else {
      const user = USERS[email];
      if (!user || user.password !== password) { setError('Wrong email or password.'); return; }
      onAuth({ email, name: user.name });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Mode switcher */}
      <div className="flex bg-zinc-900/40 border border-white/5 p-2 rounded-full mb-16 w-fit mx-auto">
        {['login', 'register'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(''); }}
            className={`px-12 py-4 text-sm font-black uppercase tracking-widest transition-all rounded-full ${mode === m ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
          >
            {m === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        ))}
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={smoothSpring}
        className="bg-zinc-900/20 border border-white/10 rounded-[60px] p-16 space-y-8"
      >
        <h2 className="text-5xl font-extralight mb-4">
          {mode === 'login' ? 'Welcome back.' : 'Create account.'}
        </h2>

        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-xs uppercase font-black text-zinc-500 tracking-widest block">Your Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
              className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[25px] outline-none text-white text-xl focus:border-white/20 transition-all font-light"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs uppercase font-black text-zinc-500 tracking-widest block">Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[25px] outline-none text-white text-xl focus:border-white/20 transition-all font-light"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-black text-zinc-500 tracking-widest block">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-white/5 border-2 border-white/5 p-6 rounded-[25px] outline-none text-white text-xl focus:border-white/20 transition-all font-light pr-16"
            />
            <button onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-all">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-black uppercase tracking-widest text-center">
            {error}
          </motion.p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full h-20 bg-white text-black font-black text-sm uppercase tracking-[0.5em] rounded-[25px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}

// --- DASHBOARD ---
function Dashboard({ user, onSignOut }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-end border-b border-white/5 pb-16 mb-16">
        <div>
          <h2 className="text-6xl font-extralight">Hello, {user.name}.</h2>
          <p className="text-zinc-600 mt-4 text-sm font-black uppercase tracking-widest">{user.email}</p>
        </div>
        <button onClick={onSignOut} className="text-lg font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all underline underline-offset-8">
          Sign Out
        </button>
      </div>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-12 bg-zinc-900/30 border border-white/10 rounded-[50px] flex justify-between items-center group hover:bg-zinc-900/50 transition-all cursor-pointer">
        <div>
          <p className="text-white text-3xl font-light">Netflix Premium</p>
          <p className="text-sm text-zinc-500 uppercase mt-4 font-black tracking-[0.2em]">ID: #9910 • ACTIVE</p>
        </div>
        <CheckCircle2 size={40} className="text-green-500" />
      </motion.div>
    </motion.div>
  );
}

// --- PRODUCT CARD ---
function ProductCard({ item, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const displayPrice = plnToEur(item.pricePLN);
  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-[50px] border-2 transition-all duration-700 ${isOpen ? 'bg-zinc-900/50 border-white/20' : 'bg-zinc-900/20 border-white/5 hover:border-white/10'}`}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="p-12 flex flex-wrap justify-between items-center cursor-pointer group">
        <div className="flex items-center gap-12">
          <motion.div whileHover={{ rotate: 10 }} className="w-20 h-20 bg-black rounded-[30px] flex items-center justify-center border border-white/10 text-white shadow-2xl">{item.icon}</motion.div>
          <div>
            <h3 className="text-4xl font-light text-white mb-2 group-hover:translate-x-2 transition-transform">{item.name}</h3>
            <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">{item.period}</p>
          </div>
        </div>
        <div className="flex items-center gap-16">
          <span className="text-4xl font-serif italic">{displayPrice}</span>
          <ChevronDown size={32} className={`text-zinc-800 transition-transform duration-700 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={smoothSpring} className="px-12 pb-12">
            <div className="pt-12 border-t border-white/10 grid md:grid-cols-4 gap-16">
              <div className="md:col-span-3">
                <p className="text-zinc-400 text-2xl font-light leading-relaxed mb-8">{item.desc}</p>
                <div className="flex gap-6">
                  <div className="bg-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">Auto-Delivery</div>
                  <div className="bg-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Warranty</div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); onSelect(item); }} 
                  className="w-full h-24 bg-white text-black text-sm font-black uppercase tracking-widest rounded-[30px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  Purchase Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- CHECKOUT MODAL ---
function CheckoutModal({ item, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('paypal');

  const cryptoAddress = "ltc1qjky5w575v7xjrlknhnr3zccj52ad0x2rxu2ank";
  const paypalEmail = "kulbiejwiktor@icloud.com";
  const displayPrice = plnToEur(item.pricePLN);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/95"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 100 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 100 }}
        transition={smoothSpring}
        className="bg-[#080808] border border-white/10 p-16 md:p-24 rounded-[80px] max-w-2xl w-full relative shadow-[0_0_100px_rgba(0,0,0,1)]"
      >
        <button onClick={onClose} className="absolute top-12 right-12 text-zinc-500 hover:text-white transition-all"><X size={32} /></button>
        
        {step === 1 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div>
              <h3 className="text-6xl font-extralight mb-4">{item.name}</h3>
              <p className="text-3xl font-serif italic text-zinc-600">{displayPrice}</p>
            </div>
            <div className="space-y-6">
              <label className="text-sm uppercase font-black text-zinc-500 block tracking-[0.4em]">Where to send the goods?</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ENTER YOUR EMAIL"
                className="w-full bg-white/5 border-2 border-white/5 p-8 rounded-[35px] outline-none text-white text-2xl focus:border-white/20 transition-all font-light"
              />
              <button 
                disabled={!email.includes('@')} onClick={() => setStep(2)}
                className="w-full h-24 bg-white text-black font-black text-sm uppercase tracking-[0.5em] rounded-[35px] disabled:opacity-20 transition-all flex items-center justify-center gap-6 group"
              >
                PROCEED TO PAYMENT <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        ) : step === 2 ? (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <h3 className="text-3xl font-light text-center mb-10">Select Method</h3>
            <div className="grid grid-cols-2 gap-6">
              <div onClick={() => setMethod('paypal')} className={`p-10 rounded-[40px] border-2 cursor-pointer text-center transition-all ${method === 'paypal' ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 text-zinc-700 hover:border-white/10'}`}>
                <span className="text-sm font-black uppercase tracking-widest">Paypal</span>
              </div>
              <div onClick={() => setMethod('crypto')} className={`p-10 rounded-[40px] border-2 cursor-pointer text-center transition-all ${method === 'crypto' ? 'bg-white/10 border-white/50 scale-105' : 'border-white/5 text-zinc-700 hover:border-white/10'}`}>
                <span className="text-sm font-black uppercase tracking-widest">LTC Crypto</span>
              </div>
            </div>
            <div className="bg-white/[0.02] p-10 rounded-[50px] border border-white/5">
              <p className="text-xs uppercase font-black text-zinc-500 mb-6 tracking-widest">
                {method === 'paypal' ? 'Send Friends & Family to:' : 'Send LTC to address:'}
              </p>
              <code className="text-base text-white break-all block bg-black p-8 rounded-[30px] border border-white/5 font-mono mb-6 text-center select-all leading-relaxed">
                {method === 'paypal' ? paypalEmail : cryptoAddress}
              </code>
              <p className="text-sm text-zinc-600 italic leading-relaxed text-center">
                Your order will be dispatched to <span className="text-white font-bold">{email}</span> <br /> immediately after network verification.
              </p>
            </div>
            <button onClick={() => setStep(3)} className="w-full h-24 bg-white text-black font-black uppercase tracking-[0.5em] rounded-[35px] active:scale-95 transition-all">I HAVE COMPLETED PAYMENT</button>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
            <CheckCircle2 size={100} className="text-green-500 mx-auto mb-12 shadow-2xl" />
            <h3 className="text-6xl font-extralight text-white mb-8">Verification...</h3>
            <p className="text-zinc-400 text-2xl font-light max-w-sm mx-auto leading-relaxed">
              Our automated system is checking the blockchain/bank. You will receive an email shortly at <span className="text-white font-bold underline">{email}</span>.
            </p>
            <button onClick={onClose} className="mt-20 text-xs font-black uppercase text-zinc-600 hover:text-white tracking-[0.8em] transition-all">CLOSE MARKET</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center group cursor-default">
      <motion.p whileHover={{ y: -5 }} className="text-6xl font-light text-white mb-2">{value}</motion.p>
      <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600">{label}</p>
    </div>
  );
}

function ContactCard({ title, value, link }) {
  return (
    <motion.a 
      whileHover={{ y: -10, borderColor: "rgba(255,255,255,0.2)" }}
      href={link} target="_blank" 
      className="p-16 bg-zinc-900/10 border-2 border-white/5 rounded-[80px] flex flex-col justify-between h-[420px] transition-all group overflow-hidden relative"
    >
      <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:scale-110 transition-all">
        {title.includes("Discord") ? <Zap size={40} /> : <Mail size={40} />}
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-black uppercase tracking-[0.5em] text-zinc-600 mb-6">{title}</h3>
        <p className="text-3xl md:text-4xl font-light text-white break-all group-hover:underline decoration-zinc-800 decoration-4 underline-offset-[16px] transition-all leading-snug">{value}</p>
      </div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all" />
    </motion.a>
  );
}