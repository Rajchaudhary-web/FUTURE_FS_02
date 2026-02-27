import { useState } from "react";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Mail, Globe, Calendar, Trash2, 
  Send, MessageSquare, User
} from "lucide-react";
import { useLead, useUpdateLead, useDeleteLead, useCreateNote } from "@/hooks/use-leads";
import { StatusPill } from "@/components/StatusPill";
import { Navbar } from "@/components/Navbar";

export function LeadDetailsPage() {
  const [, params] = useRoute("/leads/:id");
  const leadId = parseInt(params?.id || "0", 10);
  
  const { data: lead, isLoading, error } = useLead(leadId);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const createNote = useCreateNote();
  
  const [noteText, setNoteText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLead.mutate({ id: leadId, status: e.target.value as any });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      setIsDeleting(true);
      await deleteLead.mutateAsync(leadId);
      window.location.href = "/";
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    await createNote.mutateAsync({ leadId, text: noteText });
    setNoteText("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto w-full mt-12 p-6 bg-white rounded-2xl shadow-sm border border-red-100 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Lead not found</h2>
          <Link href="/" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-12">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leads
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Lead Profile */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative"
            >
              <div className="h-24 bg-gradient-to-r from-green-500 to-primary"></div>
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-12 left-6 bg-white p-2 rounded-2xl shadow-md border border-slate-100">
                  <div className="bg-slate-100 w-16 h-16 rounded-xl flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="pt-8 flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-slate-900">{lead.name}</h1>
                    <div className="mt-2 inline-block">
                      <StatusPill status={lead.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center text-slate-600">
                    <Mail className="w-5 h-5 mr-3 text-slate-400" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary hover:underline transition-colors">
                      {lead.email}
                    </a>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Globe className="w-5 h-5 mr-3 text-slate-400" />
                    <span className="font-medium">{lead.source}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                    <span>Added {format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <h3 className="font-display font-bold text-lg mb-4 text-slate-800">Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Update Status</label>
                  <select
                    value={lead.status}
                    onChange={handleStatusChange}
                    disabled={updateLead.isPending}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none font-medium text-slate-700 disabled:opacity-50"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-semibold transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Deleting..." : "Delete Lead"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Notes / Activity */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-display font-bold text-slate-800">Activity & Notes</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {lead.notes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                    <p>No notes added yet.</p>
                  </div>
                ) : (
                  lead.notes.map((note, index) => (
                    <motion.div 
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-primary font-bold shadow-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        {index !== lead.notes.length - 1 && (
                          <div className="w-0.5 h-full bg-green-100 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group">
                        <p className="text-slate-700 whitespace-pre-wrap">{note.text}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-400">
                            {format(new Date(note.date), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                <form onSubmit={handleAddNote} className="relative flex items-end gap-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note or log activity..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none min-h-[80px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-700"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNote(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={createNote.isPending || !noteText.trim()}
                    className="absolute right-2 bottom-2 p-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition-colors shadow-sm"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
                <p className="text-xs text-slate-400 font-medium mt-2 text-center">Press Enter to save, Shift + Enter for new line</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
