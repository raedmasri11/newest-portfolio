/** Shared between the existing five-step wizard and its submission endpoint. */
export const projectTypes = ["Long-form / YouTube", "Short-form", "Motion design", "Not sure yet"] as const;
export const budgets = ["Under $300", "$300 – $600", "$600 – $1,200", "$1,200+", "Not sure yet"] as const;
export const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
export const CLIENT_COOLDOWN_KEY = "raed:project-request:last-success:v1";

export type ProjectRequestData = {
  projectType: string;
  name: string;
  contact: string;
  email: string;
  budget: string;
  reference: string;
  details: string;
};
export type FieldKey = keyof ProjectRequestData;
export type ValidationErrors = Partial<Record<FieldKey, string>>;
export const initialProjectRequest: ProjectRequestData = {
  projectType: "", name: "", contact: "", email: "", budget: "", reference: "", details: "",
};

export function normalizedContact(value: string) {
  return value.replace(/[\s()\-\.]/g, "");
}

export function isValidContact(input: string) {
  const value = input.trim();
  if (!value || value.length > 240) return false;
  if (/^https?:\/\//i.test(value)) {
    try {
      const u = new URL(value);
      return /^https?:$/.test(u.protocol) && u.hostname.includes(".") && !/\s/.test(value) && !u.username && !u.password;
    } catch { return false; }
  }
  if (/^@[\p{L}\p{N}_.-]{2,80}$/u.test(value)) return true;
  // Numbers with spaces, parentheses, dashes and an optional leading + are welcome.
  if (/^[+\d\s()\-.]+$/.test(value)) {
    const normalized = normalizedContact(value);
    return /^\+?\d{7,15}$/.test(normalized);
  }
  return false;
}

export function isValidEmail(input: string) {
  const value = input.trim();
  if (!value || value.length > 254 || /\s/.test(value)) return false;
  // Basic mailbox rules without excluding legitimate international/local-part names.
  const match = /^([^@]+)@([^@]+)$/.exec(value);
  if (!match) return false;
  const [, local, domain] = match;
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[\p{L}\p{N}!#$%&'*+/=?^_`{|}~.-]+$/u.test(local)) return false;
  const parts = domain.split(".");
  return parts.length >= 2 && parts.every((part) => part.length > 0 && part.length <= 63 && /^[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?$/u.test(part)) && parts.at(-1)!.length >= 2;
}

export function validateProjectRequest(data: ProjectRequestData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!(projectTypes as readonly string[]).includes(data.projectType)) errors.projectType = "Please choose the type of project.";
  if (!data.name.trim()) errors.name = "Please tell me your name.";
  else if (data.name.trim().length > 120) errors.name = "Please use a shorter name.";
  if (!isValidContact(data.contact)) errors.contact = "Please enter a valid WhatsApp number, @handle or social link.";
  if (data.email.trim() && !isValidEmail(data.email)) errors.email = "That email doesn’t look quite right.";
  if (!(budgets as readonly string[]).includes(data.budget)) errors.budget = "Please select your budget range.";
  if (data.reference.length > 800) errors.reference = "Please shorten your reference to 800 characters.";
  if (!data.details.trim()) errors.details = "Please tell me a little about the project.";
  else if (data.details.length > 1200) errors.details = "Please shorten your project details to 1,200 characters.";
  return errors;
}

export function errorsForStep(data: ProjectRequestData, step: number) {
  const all = validateProjectRequest(data);
  const names: FieldKey[][] = [["projectType"], ["name"], ["contact", "email"], ["budget", "reference"], ["details"]];
  return Object.fromEntries((names[step] ?? []).filter((key) => all[key]).map((key) => [key, all[key]])) as ValidationErrors;
}

export function normalizedContactIdentity(data: ProjectRequestData) {
  const value = data.contact.trim();
  const contact = /^\+?[\d\s()\-.]+$/.test(value) ? normalizedContact(value) : value.toLowerCase().replace(/\/$/, "");
  return contact;
}
