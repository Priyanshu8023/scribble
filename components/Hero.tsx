"use client";

import { motion } from "framer-motion";
import { Play, Users, Trophy, UsersRound, ArrowRight, Paintbrush, Smile, Star } from "lucide-react";
import { CanvasPreview } from "./CanvasPreview";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-12 overflow-hidden bg-slate-50">

      {/* Background Gradients & Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-pink-400/20 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-yellow-400/20 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      {/* Floating Emojis / Background Elements */}
      <FloatingElements />

      <div className="relative z-10 grid max-w-7xl grid-cols-1 gap-12 mx-auto lg:grid-cols-2 lg:gap-8 items-center w-full">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start text-left space-y-8">

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 font-bold text-purple-700 bg-purple-100 rounded-full shadow-sm"
          >
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
            </span>
            Players Online: 123
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Draw. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Guess.
              </span> <br />
              Win!
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-semibold text-slate-600 max-w-lg leading-relaxed">
              Play real-time drawing & guessing games with friends or players worldwide.
            </p>
            <p className="mt-4 text-lg text-slate-500 max-w-md">
              Join a room, draw words, guess fast, and climb the leaderboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
          >
            <button className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-4 text-xl font-black text-white transition-all bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-[0_8px_0_theme(colors.blue.700)] hover:shadow-[0_4px_0_theme(colors.blue.700)] hover:translate-y-1 active:shadow-[0_0px_0_theme(colors.blue.700)] active:translate-y-2">
              <Play fill="currentColor" className="w-6 h-6" />
              Play Now
            </button>

            <button className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-4 text-lg font-bold text-slate-700 transition-all bg-white border-2 border-slate-200 rounded-2xl shadow-[0_6px_0_theme(colors.slate.200)] hover:shadow-[0_3px_0_theme(colors.slate.200)] hover:translate-y-1 active:shadow-[0_0px_0_theme(colors.slate.200)] active:translate-y-2 hover:bg-slate-50">
              <Users className="w-5 h-5" />
              Create Room
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-3 w-full max-w-md mt-4 p-5 bg-white rounded-3xl shadow-xl border border-slate-100"
          >
            <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-pink-500" />
              Have a room code?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Code (e.g. ABCD)"
                className="flex-1 px-4 py-3 font-bold uppercase tracking-wider text-slate-800 placeholder-slate-400 bg-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
                maxLength={6}
              />
              <button className="px-5 py-3 font-bold text-white bg-pink-500 rounded-xl hover:bg-pink-600 shadow-[0_4px_0_theme(colors.pink.700)] hover:shadow-[0_2px_0_theme(colors.pink.700)] hover:translate-y-0.5 active:shadow-none active:translate-y-1 transition-all">
                Join
              </button>
            </div>
          </motion.div>

        </div>

        {/* Right Side: Illustration / Interactive Canvas */}
        <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center">
          <CanvasPreview />

          {/* Mini Leaderboard floating card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 6 }}
            transition={{ duration: 0.7, delay: 0.6, type: "spring" }}
            className="absolute bottom-10 right-0 sm:-right-4 lg:-right-10 w-64 p-4 bg-white rounded-2xl shadow-2xl border-2 border-yellow-400 z-20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-slate-800">Top Guesser</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">1</div>
                  <span className="font-bold text-sm text-slate-700">DoodleKing</span>
                </div>
                <span className="font-black text-blue-600">4,250</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">2</div>
                  <span className="font-bold text-sm text-slate-600">ArtNinja</span>
                </div>
                <span className="font-black text-slate-500">3,120</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FloatingElements() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[10%] text-5xl opacity-80"
      >
        🎨
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -15, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-[5%] text-4xl opacity-70"
      >
        ✏️
      </motion.div>
      <motion.div
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-40 right-[40%] text-6xl opacity-40 blur-[2px]"
      >
        😂
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-20 right-[15%] text-5xl opacity-90"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-32 right-[8%] text-5xl opacity-80"
      >
        🏆
      </motion.div>

      {/* Floating Avatars */}
      <motion.img
        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4"
        alt="Avatar"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[45%] w-16 h-16 rounded-full border-4 border-white shadow-xl opacity-90 z-0"
      />
      <motion.img
        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffdfbf"
        alt="Avatar"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[35%] w-14 h-14 rounded-full border-4 border-white shadow-xl opacity-80 z-0"
      />
    </>
  );
}
