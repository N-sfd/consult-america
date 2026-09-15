import { getSupabaseServiceClient, isSupabaseConfigured } from "@/app/lib/supabase/server";
import {
  memoryGetEnrollmentMeta,
  memorySetEnrollmentStatus,
} from "@/lib/clientflow/memory-store";
import type { ServiceEnrollmentStatus } from "@/lib/clientflow/types";
import { SERVICE_ENROLLMENT_STATUSES } from "@/lib/clientflow/types";
import { dispatchClientFlowTrigger } from "@/lib/clientflow/workflow-engine";

export function nextEnrollmentStatus(
  current: ServiceEnrollmentStatus,
): ServiceEnrollmentStatus | null {
  const idx = SERVICE_ENROLLMENT_STATUSES.indexOf(current);
  if (idx < 0 || idx >= SERVICE_ENROLLMENT_STATUSES.length - 1) return null;
  return SERVICE_ENROLLMENT_STATUSES[idx + 1]!;
}

export async function setServiceEnrollmentStatus(input: {
  enrollmentId: string;
  status: ServiceEnrollmentStatus;
  actorUserId?: string;
  /** When true, skip automation dispatch (internal workflow action). */
  skipWorkflowDispatch?: boolean;
}): Promise<{ ok: true; status: ServiceEnrollmentStatus } | { ok: false; error: string }> {
  if (!SERVICE_ENROLLMENT_STATUSES.includes(input.status)) {
    return { ok: false, error: "Invalid enrollment status." };
  }

  if (!isSupabaseConfigured() || !getSupabaseServiceClient()) {
    const result = memorySetEnrollmentStatus(
      input.enrollmentId,
      input.status,
      input.actorUserId,
    );
    if (!result.ok) return result;
    const meta = memoryGetEnrollmentMeta(input.enrollmentId);
    if (!input.skipWorkflowDispatch && meta) {
      try {
        await dispatchClientFlowTrigger({
          type: "enrollment_status_changed",
          contactId: meta.contactId,
          accountId: meta.accountId,
          inquiryId: meta.sourceInquiryId,
          enrollmentId: input.enrollmentId,
          context: {
            "enrollment.status": input.status,
            "service.key": meta.serviceKey,
            "service.name": meta.serviceName,
          },
        });
      } catch (err) {
        console.error(
          "[clientflow] enrollment_status_changed dispatch failed",
          err instanceof Error ? err.message : err,
        );
      }
    }
    return result;
  }

  const client = getSupabaseServiceClient()!;
  const { data: before } = await client
    .from("crm_service_enrollments")
    .select("contact_id, account_id, source_inquiry_id, service_id, crm_services(key, name)")
    .eq("id", input.enrollmentId)
    .maybeSingle();

  const { data, error } = await client.rpc("clientflow_set_enrollment_status", {
    p_enrollment_id: input.enrollmentId,
    p_new_status: input.status,
    p_actor_user_id:
      input.actorUserId ??
      process.env.CLIENTFLOW_OWNER_USER_ID ??
      "profile-clientflow-system",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const payload = data as { ok?: boolean; status?: ServiceEnrollmentStatus };
  if (!payload?.ok || !payload.status) {
    return { ok: false, error: "Enrollment status update failed." };
  }

  if (!input.skipWorkflowDispatch && before) {
    const svc = before.crm_services as { key?: string; name?: string } | null;
    try {
      await dispatchClientFlowTrigger({
        type: "enrollment_status_changed",
        contactId: before.contact_id as string,
        accountId: before.account_id as string,
        inquiryId: (before.source_inquiry_id as string) ?? undefined,
        enrollmentId: input.enrollmentId,
        context: {
          "enrollment.status": payload.status,
          "service.key": svc?.key,
          "service.name": svc?.name,
        },
      });
    } catch (err) {
      console.error(
        "[clientflow] enrollment_status_changed dispatch failed",
        err instanceof Error ? err.message : err,
      );
    }
  }

  return { ok: true, status: payload.status };
}
