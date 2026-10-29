"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // 3D Card Effect Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Unable to sign in. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center text-white">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 via-emerald-900/30 to-black" />
      
      {/* Top radial glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-emerald-400/15 blur-[80px]" />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-emerald-500/10 blur-[60px]"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 px-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Glass card background */}
            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-2xl overflow-hidden">
              
              {/* Logo and header */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center relative overflow-hidden text-emerald-400 font-bold"
                >
                  K
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                >
                  Welcome to KIRA
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  Your business finances, all in one place.
                </motion.p>
              </div>

              {/* Error Banner */}
              {error && (
                <div role="alert" className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              {/* Login form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div className="space-y-3">
                  
                  {/* Email input */}
                  <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10 focus-within:border-emerald-400/70 transition-all">
                    <Mail className="absolute left-3 w-4 h-4 text-white/40" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent border-none text-white placeholder:text-white/30 h-10 pl-10 pr-3 focus-visible:ring-0"
                    />
                  </div>

                  {/* Password input */}
                  <div className="relative flex items-center overflow-hidden rounded-lg bg-white/5 border border-white/10 focus-within:border-emerald-400/70 transition-all">
                    <Lock className="absolute left-3 w-4 h-4 text-white/40" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent border-none text-white placeholder:text-white/30 h-10 pl-10 pr-10 focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 cursor-pointer text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 rounded border border-white/20 bg-white/5 accent-emerald-500"
                    />
                    <span className="text-white/60">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-emerald-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign in button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative bg-emerald-400 text-black font-medium h-10 rounded-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-sm font-semibold">
                        Sign In
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Sign up link */}
                <p className="text-center text-xs text-white/60 pt-2">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-emerald-400 hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}