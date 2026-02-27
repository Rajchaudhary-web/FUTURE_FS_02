import { useState } from "react";
import { motion } from "framer-motion";
import { useLogin, useRegister, useAuth } from "@/hooks/use-auth";
import { Leaf, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const login = useLogin();
  const register = useRegister();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isRegister) {
        await register.mutateAsync({ username, password });
      } else {
        await login.mutateAsync({ username, password });
      }
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const isPending = login.isPending || register.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      {/* Dark gradient wash to make the white card pop against the abstract background */}
      <div className="absolute inset-0 bg-green-900/20 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-white p-3 rounded-2xl shadow-lg shadow-primary/30 mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800">
            Mini<span className="text-primary">CRM</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isRegister ? "Create your account to get started" : "Welcome back, please sign in"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 pl-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-premium bg-white/80"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium bg-white/80"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full mt-2 text-lg h-14"
          >
            {isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {isRegister ? "Sign Up" : "Sign In"}
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 font-medium">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              {isRegister ? "Sign in instead" : "Create one now"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
