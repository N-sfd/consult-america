"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { acceptOffer, extendOffer, sendOffer } from "@/lib/recruiting/actions";
import { convertHire } from "@/lib/hr/actions";
import type { EmploymentType, WorkplaceType } from "@/types/organization";
import type { ApplicationStatus, Offer } from "@/types/recruiting";

const fieldClass =
  "mt-1.5 h-9 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";
const actionButtonClass =
  "mt-2 h-7 w-full border border-[var(--ca-blue)] bg-white px-1.5 text-xs font-medium text-[var(--ca-blue)] outline-none transition-colors hover:bg-[var(--ca-blue)] hover:text-white disabled:opacity-50";

const OFFER_CREATE_STATUSES: ApplicationStatus[] = [
  "INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
];

export default function OfferActions({
  applicationId,
  requisitionId,
  status,
  offer: initialOffer,
  defaultEmploymentType,
  defaultWorkplaceType,
}: {
  applicationId: string;
  requisitionId: string;
  status: ApplicationStatus;
  offer?: Offer;
  defaultEmploymentType: EmploymentType;
  defaultWorkplaceType: WorkplaceType;
}) {
  const [offer, setOffer] = useState(initialOffer);

  if (!offer && !OFFER_CREATE_STATUSES.includes(status)) return null;

  if (!offer) {
    return (
      <CreateOfferDialog
        applicationId={applicationId}
        requisitionId={requisitionId}
        defaultEmploymentType={defaultEmploymentType}
        defaultWorkplaceType={defaultWorkplaceType}
        onCreated={setOffer}
      />
    );
  }

  if (offer.status === "DRAFT" || offer.status === "PENDING_APPROVAL") {
    return (
      <SendOfferButton
        applicationId={applicationId}
        requisitionId={requisitionId}
        onSent={setOffer}
      />
    );
  }

  if (offer.status === "EXTENDED") {
    return (
      <AcceptOfferButton
        applicationId={applicationId}
        requisitionId={requisitionId}
        onAccepted={setOffer}
      />
    );
  }

  if (offer.status === "ACCEPTED") {
    return (
      <ConvertToEmployeeButton
        applicationId={applicationId}
        requisitionId={requisitionId}
      />
    );
  }

  return null;
}

function CreateOfferDialog({
  applicationId,
  requisitionId,
  defaultEmploymentType,
  defaultWorkplaceType,
  onCreated,
}: {
  applicationId: string;
  requisitionId: string;
  defaultEmploymentType: EmploymentType;
  defaultWorkplaceType: WorkplaceType;
  onCreated: (offer: Offer) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const baseSalary = formData.get("baseSalary");
    const hourlyRate = formData.get("hourlyRate");
    const startDate = formData.get("startDate") as string;

    setError(null);
    startTransition(async () => {
      const result = await extendOffer({
        applicationId,
        requisitionId,
        baseSalary: baseSalary ? Number(baseSalary) : undefined,
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
        startDate,
        employmentType: defaultEmploymentType,
        workplaceType: defaultWorkplaceType,
      });
      if (result.ok) {
        onCreated(result.offer);
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button type="button" className={actionButtonClass} />}>
        Create Offer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Offer</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-black/60">Base Salary (annual)</span>
            <input name="baseSalary" type="number" min={0} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-black/60">Or Hourly Rate</span>
            <input name="hourlyRate" type="number" min={0} className={fieldClass} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-black/60">Start Date</span>
            <input name="startDate" type="date" required className={fieldClass} />
          </label>
          {error && <p className="text-xs text-[var(--ca-error)]">{error}</p>}
          <DialogFooter>
            <button
              type="submit"
              disabled={isPending}
              className="h-9 border border-[var(--ca-blue)] bg-[var(--ca-blue)] px-4 text-sm font-medium text-white disabled:opacity-50"
            >
              {isPending ? "Creating…" : "Create Draft Offer"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SendOfferButton({
  applicationId,
  requisitionId,
  onSent,
}: {
  applicationId: string;
  requisitionId: string;
  onSent: (offer: Offer) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        className={actionButtonClass}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await sendOffer(applicationId, requisitionId);
            if (result.ok) {
              onSent(result.offer);
            } else {
              setError(result.error);
            }
          });
        }}
      >
        {isPending ? "Sending…" : "Approve & Send Offer"}
      </button>
      {error && <p className="mt-1 text-[0.65rem] text-[var(--ca-error)]">{error}</p>}
    </div>
  );
}

function AcceptOfferButton({
  applicationId,
  requisitionId,
  onAccepted,
}: {
  applicationId: string;
  requisitionId: string;
  onAccepted: (offer: Offer) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        className={actionButtonClass}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await acceptOffer(applicationId, requisitionId);
            if (result.ok) {
              onAccepted(result.offer);
            } else {
              setError(result.error);
            }
          });
        }}
      >
        {isPending ? "Accepting…" : "Mark Accepted"}
      </button>
      {error && <p className="mt-1 text-[0.65rem] text-[var(--ca-error)]">{error}</p>}
    </div>
  );
}

function ConvertToEmployeeButton({
  applicationId,
  requisitionId,
}: {
  applicationId: string;
  requisitionId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [employeeNumber, setEmployeeNumber] = useState<string | null>(null);

  if (employeeNumber) {
    return (
      <p className="mt-2 text-[0.65rem] font-medium text-[var(--ca-success,#16865b)]">
        Hired as {employeeNumber}
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        className={actionButtonClass}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await convertHire(applicationId, requisitionId);
            if (result.ok) {
              setEmployeeNumber(result.employeeNumber);
            } else {
              setError(result.error);
            }
          });
        }}
      >
        {isPending ? "Hiring…" : "Hire Candidate"}
      </button>
      {error && <p className="mt-1 text-[0.65rem] text-[var(--ca-error)]">{error}</p>}
    </div>
  );
}
