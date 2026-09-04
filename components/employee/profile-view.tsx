"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import {
  updateContactInfoAction,
  updateEmergencyContactAction,
} from "@/app/actions/profile-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import type { EmployeeProfileView } from "@/lib/self-service";

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[var(--ca-platform-ink)]">{value || "—"}</dd>
    </div>
  );
}

function RequestChangeLink() {
  return (
    <Link
      href="/employee/requests#new-request"
      className="text-xs font-medium text-[var(--ca-platform-mid)] hover:underline"
    >
      Request change
    </Link>
  );
}

export default function ProfileView({
  profile,
}: {
  profile: EmployeeProfileView;
}) {
  const [contactOpen, setContactOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const { person, employee } = profile;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 ca-platform-card p-5">
        <Avatar className="size-14">
          <AvatarFallback className="text-base font-semibold">
            {initials(person.firstName, person.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-[-0.03em]">
            {person.firstName} {person.lastName}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--ca-platform-muted)]">
            {profile.positionTitle}
            {profile.departmentName ? ` · ${profile.departmentName}` : ""}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-[var(--ca-platform-muted)]">
              {employee.employeeNumber}
            </span>
            <Badge
              variant="outline"
              className="border-transparent bg-[rgba(23,106,99,0.12)] text-[var(--ca-platform-deep)]"
            >
              {profile.statusLabel}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTab value="personal">Personal</TabsTab>
          <TabsTab value="contact">Contact</TabsTab>
          <TabsTab value="employment">Employment</TabsTab>
          <TabsTab value="emergency">Emergency Contact</TabsTab>
        </TabsList>

        <TabsPanel value="personal">
          <div className="ca-platform-card p-5 sm:p-6">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[var(--ca-platform-muted)]">
                    Legal Name
                  </dt>
                  <RequestChangeLink />
                </div>
                <dd className="mt-1 text-sm font-medium text-[var(--ca-platform-ink)]">
                  {person.firstName} {person.lastName}
                </dd>
              </div>
              <Field label="Preferred Name" value={person.preferredName} />
            </dl>
          </div>
        </TabsPanel>

        <TabsPanel value="contact">
          <div className="ca-platform-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="ca-platform-kpi-label">Contact Information</h2>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="text-xs font-medium text-[var(--ca-platform-mid)] hover:underline"
              >
                Edit
              </button>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Field label="Personal Email" value={person.personalEmail} />
              <Field label="Phone" value={person.personalPhone} />
              <Field label="Mailing Address" value={person.mailingAddress} />
            </dl>
          </div>
        </TabsPanel>

        <TabsPanel value="employment">
          <div className="ca-platform-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="ca-platform-kpi-label">Employment</h2>
              <RequestChangeLink />
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Employee ID" value={employee.employeeNumber} />
              <Field label="Position" value={profile.positionTitle} />
              <Field label="Department" value={profile.departmentName} />
              <Field label="Manager" value={profile.managerName} />
              <Field label="Location" value={profile.locationName} />
              <Field
                label="Employment Type"
                value={profile.employmentTypeLabel}
              />
              <Field
                label="Work Arrangement"
                value={profile.workplaceTypeLabel}
              />
              <Field label="Hire Date" value={employee.hireDate} />
              <Field label="Work Email" value={employee.workEmail} />
            </dl>
            <p className="mt-4 text-xs text-[var(--ca-platform-muted)]">
              Employment details are set by HR. Use &ldquo;Request
              change&rdquo; to update them.
            </p>
          </div>
        </TabsPanel>

        <TabsPanel value="emergency">
          <div className="ca-platform-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="ca-platform-kpi-label">Emergency Contact</h2>
              <button
                type="button"
                onClick={() => setEmergencyOpen(true)}
                className="text-xs font-medium text-[var(--ca-platform-mid)] hover:underline"
              >
                Edit
              </button>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Field label="Name" value={person.emergencyContactName} />
              <Field
                label="Relationship"
                value={person.emergencyContactRelationship}
              />
              <Field label="Phone" value={person.emergencyContactPhone} />
            </dl>
          </div>
        </TabsPanel>
      </Tabs>

      <ContactEditSheet
        key={contactOpen ? "contact-open" : "contact-closed"}
        open={contactOpen}
        onOpenChange={setContactOpen}
        person={person}
      />
      <EmergencyContactEditSheet
        key={emergencyOpen ? "emergency-open" : "emergency-closed"}
        open={emergencyOpen}
        onOpenChange={setEmergencyOpen}
        person={person}
      />
    </div>
  );
}

function ContactEditSheet({
  open,
  onOpenChange,
  person,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: EmployeeProfileView["person"];
}) {
  const [email, setEmail] = useState(person.personalEmail ?? "");
  const [phone, setPhone] = useState(person.personalPhone ?? "");
  const [address, setAddress] = useState(person.mailingAddress ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateContactInfoAction({
        personalEmail: email,
        personalPhone: phone,
        mailingAddress: address,
      });
      if (result.ok) onOpenChange(false);
      else setError(result.message);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Contact Information</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <label className="block text-sm">
            <span className="text-black/55">Personal Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-black/55">Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-black/55">Address</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
        <SheetFooter className="flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Save Changes
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function EmergencyContactEditSheet({
  open,
  onOpenChange,
  person,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: EmployeeProfileView["person"];
}) {
  const [name, setName] = useState(person.emergencyContactName ?? "");
  const [relationship, setRelationship] = useState(
    person.emergencyContactRelationship ?? "",
  );
  const [phone, setPhone] = useState(person.emergencyContactPhone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateEmergencyContactAction({
        name,
        relationship,
        phone,
      });
      if (result.ok) onOpenChange(false);
      else setError(result.message);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Emergency Contact</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <label className="block text-sm">
            <span className="text-black/55">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-black/55">Relationship</span>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-black/55">Phone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
        <SheetFooter className="flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.03]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="rounded-md bg-[var(--ca-blue)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Save Changes
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
