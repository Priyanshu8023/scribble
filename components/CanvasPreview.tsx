"use client";

import { motion } from "framer-motion";

export function CanvasPreview() {
  return (
    <div className="relative w-full max-w-lg aspect-[4/3] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-900 mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-300">
      {/* Browser-like header */}
      <div className="w-full h-10 bg-slate-100 border-b-4 border-slate-900 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="mx-auto text-xs font-bold text-slate-500 tracking-widest uppercase">
          Room: ABCD
        </div>
      </div>

      {/* Canvas Fake Content */}
      <div className="flex-1 w-full h-[calc(100%-2.5rem)] relative cursor-crosshair bg-[#fdfbf7] overflow-hidden">
        {/* Animated word hint */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
          <div className="flex gap-2 text-2xl font-black text-slate-800 font-comic-neue tracking-[0.3em]">
            <span>D</span>
            <span>O</span>
            <span>_</span>
          </div>
        </div>

        {/* Animated Drawing Container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 mt-8">
          <motion.svg
            viewBox="0 0 200 200"
            className="w-full h-full max-w-[280px]"
            initial="hidden"
            animate="visible"
          >
            {/* Outline / Face */}
            <motion.path
              d="M 50 100 C 50 40, 150 40, 150 100 C 150 160, 50 160, 50 100 Z"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
            />
            {/* Left Ear */}
            <motion.path
              d="M 60 70 L 40 40 L 80 60"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
            />
            {/* Right Ear */}
            <motion.path
              d="M 140 70 L 160 40 L 120 60"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 2.0, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
            />
            {/* Left Eye */}
            <motion.circle
              cx="80" cy="90" r="8" fill="#1e293b"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 2.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 3.2 }}
            />
            {/* Right Eye */}
            <motion.circle
              cx="120" cy="90" r="8" fill="#1e293b"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 2.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 3.1 }}
            />
            {/* Nose */}
            <motion.path
              d="M 95 105 L 105 105 L 100 115 Z"
              fill="#ec4899"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.9, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.8 }}
            />
            {/* Smile / Mouth */}
            <motion.path
              d="M 90 120 Q 100 130 110 120"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 3.2, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.5 }}
            />
            {/* Pink blush */}
            <motion.circle
              cx="65" cy="110" r="10" fill="#fbcfe8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.3, delay: 3.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.2 }}
            />
            <motion.circle
              cx="135" cy="110" r="10" fill="#fbcfe8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ duration: 0.3, delay: 3.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2.2 }}
            />
          </motion.svg>

          {/* Hand drawing cursor effect */}
          <motion.div
            className="absolute z-10"
            initial={{ x: -80, y: -40, opacity: 0 }}
            animate={{
              x: [-80, 20, 20, -40, -40, 20, 0, -20, 0, 80],
              y: [-40, -40, 40, 40, -40, -40, -10, -10, 20, 80],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          >
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-900 shadow-lg flex items-center justify-center overflow-hidden transform rotate-[-45deg] origin-bottom-left">
              <div className="w-1 h-4 bg-yellow-500 -mt-2 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Fake color palette */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-white rounded-2xl shadow-lg border-2 border-slate-200 z-10 w-max">
          <div className="w-7 h-7 bg-black rounded-full shadow-sm ring-2 ring-blue-500 scale-110 cursor-pointer"></div>
          <div className="w-7 h-7 bg-red-500 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="w-7 h-7 bg-blue-500 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="w-7 h-7 bg-yellow-500 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="w-7 h-7 bg-green-500 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
          <div className="w-7 h-7 bg-pink-500 rounded-full shadow-sm cursor-pointer hover:scale-110 transition-transform"></div>
        </div>

        {/* Floating guess popup 1 */}
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 4 }}
          className="absolute top-1/4 left-4 bg-white px-3 py-2 rounded-xl shadow-lg border-2 border-slate-900 z-20"
        >
          <div className="text-sm font-bold flex items-center gap-2">
            <span className="text-slate-500">P1:</span>
            <span className="text-slate-800">Cat?</span>
          </div>
        </motion.div>

        {/* Floating guess popup 2 */}
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
          className="absolute top-[40%] right-4 bg-white px-3 py-2 rounded-xl shadow-lg border-2 border-slate-900 z-20"
        >
          <div className="text-sm font-bold flex items-center gap-2">
            <span className="text-slate-500">P2:</span>
            <span className="text-slate-800">Mouse?</span>
          </div>
        </motion.div>

        {/* Correct answer plugin */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 3.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          className="absolute top-10 right-8 bg-[#ecfdf5] px-4 py-2 rounded-xl shadow-lg border-2 border-green-500 z-20 transform rotate-3"
        >
          <div className="text-sm font-bold flex items-center gap-2">
            <span className="text-green-600">P3 guessed the word!</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
