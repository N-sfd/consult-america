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
import { acceptOffer, extendOffer } from "@/lib/recruiting/actions";
import { convertHire } from "@/lib/hr/actions";
import type { EmploymentType, WorkplaceType } from "@/types/organization";
import type { ApplicationStatus, Offer } from "@/types/recruiting";

const fieldClass =
  "mt-1.5 h-9 w-full border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--ca-blue)]";
const actionButtonClass =
  "mt-2 h-7 w-full border border-[var(--ca-blue)] bg-white px-1.5 text-xs font-medium text-[var(--ca-blue)] outline-none transition-colors hover:bg-[var(--ca-blue)] hover:text-white disabled:opacity-50";

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
  // The pipeline board seeds its card list from props only once (it also
  // does optimistic local patches on stage moves), so this holds its own
  // copy and updates it from each action's result rather than relying on
  // a prop refresh after revalidatePath.
  const [offer, setOffer] = useState(initialOffer);

  if (status !== "OFFER") return null;

  if (!offer) {
    return (
      <ExtendOfferDialog
        applicationId={applicationId}
        requisitionId={requisitionId}
        defaultEmploymentType={defaultEmploymentType}
        defaultWorkplaceType={defaultWorkplaceType}
        onExtended={setOffer}
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
    return <ConvertToEmployeeButton applicationId={applicationId} requisitionId={requisitionId} />;
  }

  return null;
}

function ExtendOfferDialog({
  applicationId,
  requisitionId,
  defaultEmploymentType,
  defaultWorkplaceType,
  onExtended,
}: {
  applicationId: string;
  requisitionId: string;
  defaultEmploymentType: EmploymentType;
  defaultWorkplaceType: WorkplaceType;
  onExtended: (offer: Offer) => void;
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
        onExtended(result.offer);
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button type="button" className={actionButtonClass} />}>
        Extend Offer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Offer</DialogTitle>
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
              {isPending ? "Extending…" : "Extend Offer"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
        {isPending ? "Accepting…" : "Accept Offer"}
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
        {isPending ? "Converting…" : "Convert to Employee"}
      </button>
      {error && <p className="mt-1 text-[0.65rem] text-[var(--ca-error)]">{error}</p>}
    </div>
  );
}
