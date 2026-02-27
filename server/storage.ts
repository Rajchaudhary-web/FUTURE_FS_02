import { db } from "./db";
import {
  leads, users, notes,
  type InsertUser, type User,
  type InsertLead, type Lead, type LeadWithNotes,
  type InsertNote, type Note
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getLeads(): Promise<LeadWithNotes[]>;
  getLead(id: number): Promise<LeadWithNotes | undefined>;
  createLead(lead: InsertLead): Promise<LeadWithNotes>;
  updateLead(id: number, updates: Partial<InsertLead>): Promise<LeadWithNotes | undefined>;
  deleteLead(id: number): Promise<void>;

  addNote(leadId: number, note: InsertNote): Promise<Note>;
}

export class DatabaseStorage implements IStorage {
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getLeads(): Promise<LeadWithNotes[]> {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    const allNotes = await db.select().from(notes);

    return allLeads.map(lead => ({
      ...lead,
      notes: allNotes.filter(n => n.leadId === lead.id)
    }));
  }

  async getLead(id: number): Promise<LeadWithNotes | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!lead) return undefined;

    const leadNotes = await db.select().from(notes).where(eq(notes.leadId, id));
    return { ...lead, notes: leadNotes };
  }

  async createLead(lead: InsertLead): Promise<LeadWithNotes> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return { ...newLead, notes: [] };
  }

  async updateLead(id: number, updates: Partial<InsertLead>): Promise<LeadWithNotes | undefined> {
    const [updated] = await db.update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();
    if (!updated) return undefined;

    const leadNotes = await db.select().from(notes).where(eq(notes.leadId, id));
    return { ...updated, notes: leadNotes };
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async addNote(leadId: number, note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values({ ...note, leadId }).returning();
    return newNote;
  }
}

export const storage = new DatabaseStorage();
