export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  source?: string;
  createdAt: string;
}

const contactSubmissions: ContactSubmission[] = [];

function createId() {
  return `lead-${crypto.randomUUID()}`;
}

export function saveContactSubmission(input: {
  name: string;
  email: string;
  company: string;
  message: string;
  source?: string;
}): ContactSubmission {
  const submission: ContactSubmission = {
    id: createId(),
    name: input.name,
    email: input.email,
    company: input.company,
    message: input.message,
    source: input.source,
    createdAt: new Date().toISOString(),
  };
  contactSubmissions.unshift(submission);
  return submission;
}

export function listContactSubmissions(limit = 100) {
  return contactSubmissions.slice(0, limit);
}

/** Test-only: clear the in-memory store between test runs. */
export function resetContactStoreForTests() {
  contactSubmissions.splice(0, contactSubmissions.length);
}
