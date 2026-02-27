import { Link } from "wouter";
import { LogOut, Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary/10 text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl text-slate-800 tracking-tight">
              Mini<span className="text-primary">CRM</span>
            </span>
          </Link>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
