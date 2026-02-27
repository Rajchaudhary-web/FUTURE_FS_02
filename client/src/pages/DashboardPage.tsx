import { useState } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Plus, Search, ChevronRight, UserCircle, Leaf } from "lucide-react";
import { useLeads } from "@/hooks/use-leads";
import { StatusPill } from "@/components/StatusPill";
import { AddLeadModal } from "@/components/AddLeadModal";
import { Navbar } from "@/components/Navbar";

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: leads, isLoading, error } = useLeads();

  const filteredLeads = leads?.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Leads Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage and track your customer relationships.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center justify-center font-medium">
            Error loading leads. Please try again.
          </div>
        ) : filteredLeads.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-dashed border-green-200 p-12 flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center text-primary mb-6">
              <Leaf className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">No leads found</h3>
            <p className="text-slate-500 max-w-sm mb-8">
              {search ? "No leads match your search criteria." : "You haven't added any leads yet. Start building your pipeline today!"}
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Lead
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Added</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead, idx) => (
                    <motion.tr 
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-green-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{lead.name}</div>
                            <div className="text-sm text-slate-500">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/leads/${lead.id}`}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-green-100 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-30 p-4 rounded-full bg-primary text-white shadow-[0_8px_30px_rgb(22,163,74,0.3)] hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      >
        <Plus className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-slate-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Add New Lead
        </span>
      </button>

      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
