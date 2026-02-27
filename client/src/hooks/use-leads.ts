import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiFetch } from "@/lib/api";
import { z } from "zod";

// --- Queries ---

export function useLeads() {
  return useQuery({
    queryKey: [api.leads.list.path],
    queryFn: async () => {
      const res = await apiFetch(api.leads.list.path);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      // Zod doesn't auto-coerce dates in nested arrays effectively without complex schemas, 
      // so we use the custom validation hint.
      return api.leads.list.responses[200].parse(data);
    },
  });
}

export function useLead(id: number) {
  const url = buildUrl(api.leads.get.path, { id });
  return useQuery({
    queryKey: [api.leads.get.path, id],
    queryFn: async () => {
      const res = await apiFetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch lead");
      return api.leads.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// --- Mutations ---

type CreateLeadInput = z.infer<typeof api.leads.create.input>;
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLeadInput) => {
      const res = await apiFetch(api.leads.create.path, {
        method: api.leads.create.method,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create lead");
      return api.leads.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.leads.list.path] }),
  });
}

type UpdateLeadInput = z.infer<typeof api.leads.update.input>;
export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateLeadInput) => {
      const url = buildUrl(api.leads.update.path, { id });
      const res = await apiFetch(url, {
        method: api.leads.update.method,
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update lead");
      return api.leads.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.leads.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.leads.get.path, variables.id] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.leads.delete.path, { id });
      const res = await apiFetch(url, { method: api.leads.delete.method });
      if (!res.ok) throw new Error("Failed to delete lead");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.leads.list.path] });
    },
  });
}

type CreateNoteInput = z.infer<typeof api.notes.create.input>;
export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, ...data }: { leadId: number } & CreateNoteInput) => {
      const url = buildUrl(api.notes.create.path, { id: leadId });
      const res = await apiFetch(url, {
        method: api.notes.create.method,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.leads.get.path, variables.leadId] });
      queryClient.invalidateQueries({ queryKey: [api.leads.list.path] });
    },
  });
}
