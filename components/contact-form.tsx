"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      >
        <label className="grid gap-1.5 text-sm font-medium">
          Name
          <Input name="name" required placeholder="Your name" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Work email
          <Input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          How can we help?
          <Input name="topic" required placeholder="Oracle, AI, or a program" />
        </label>
        <Button type="submit" className="justify-self-start">
          Send message
        </Button>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message received</DialogTitle>
            <DialogDescription>
              Thanks for reaching out. This form is a local preview—connect it
              to your inbox or CRM when you are ready.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  );
}
