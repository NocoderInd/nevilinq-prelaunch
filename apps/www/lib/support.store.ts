import type { Ticket, TicketComment, TicketStatus } from "./types";
import { rid } from "./id";

type Store = {
  tickets: Ticket[];
  comments: TicketComment[];
};

const store: Store = {
  tickets: [],
  comments: [],
};

export function listTickets(q?: { status?: TicketStatus; search?: string }) {
  let arr = [...store.tickets].sort((a,b)=> +new Date(b.updatedAt) - +new Date(a.updatedAt));
  if (q?.status) arr = arr.filter(t => t.status === q.status);
  if (q?.search) {
    const s = q.search.toLowerCase();
    arr = arr.filter(t => (t.title + " " + t.description).toLowerCase().includes(s));
  }
  return arr;
}

export function createTicket(partial: Partial<Ticket>): Ticket {
  const now = new Date().toISOString();
  const t: Ticket = {
    id: rid("t_"),
    createdAt: now,
    updatedAt: now,
    title: partial.title?.trim() || "Untitled",
    description: partial.description?.trim() || "",
    category: partial.category?.trim(),
    priority: partial.priority || "medium",
    status: "open",
    requesterId: partial.requesterId,
    requesterName: partial.requesterName,
    requesterEmail: partial.requesterEmail,
  };
  store.tickets.unshift(t);
  return t;
}

export function getTicket(id: string) {
  return store.tickets.find(t => t.id === id) || null;
}

export function updateTicket(id: string, patch: Partial<Ticket>) {
  const t = getTicket(id);
  if (!t) return null;
  Object.assign(t, patch, { updatedAt: new Date().toISOString() });
  return t;
}

export function listComments(ticketId: string) {
  return store.comments
    .filter(c => c.ticketId === ticketId)
    .sort((a,b)=> +new Date(a.createdAt) - +new Date(b.createdAt));
}

export function addComment(ticketId: string, author: "admin" | "user", message: string, authorName?: string) {
  const c: TicketComment = {
    id: rid("c_"),
    ticketId,
    createdAt: new Date().toISOString(),
    author,
    authorName,
    message: message.trim(),
  };
  store.comments.push(c);
  updateTicket(ticketId, {}); // bump updatedAt
  return c;
}
