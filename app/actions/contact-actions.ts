"use server";

import { saveContactSubmission } from "@/lib/marketing/contact-store";

export type ContactActionResult = {
  ok: boolean;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactAction(input: {
  name: string;
  email: string;
  company: string;
  message: string;
  source?: string;
}): Promise<ContactActionResult> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const company = input.company?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (!name || !email || !company) {
    return { ok: false, message: "Please fill in your name, email, and company." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  saveContactSubmission({ name, email, company, message, source: input.source });

  return { ok: true, message: "Thank you. Your submission has been received." };
}
