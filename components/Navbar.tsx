"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="flex items-center justify-between w-full max-w-6xl px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200/50"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-inner transform -rotate-12">
            <Pencil className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800 font-nunito">
            Scribble<span className="text-blue-500">.</span><span className="text-pink-500">io</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-bold text-slate-600">
          <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
          <a href="#" className="hover:text-pink-500 transition-colors">How to Play</a>
        </div>
      </motion.div>
    </nav>
  );
}
