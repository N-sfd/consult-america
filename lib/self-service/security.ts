import { hrRepository } from "@/lib/hr";
import { writeAuditLog } from "@/lib/self-service/audit-store";
import { hasPermission } from "@/lib/self-service/permissions";
import {
  getEmployeeSession,
  getHrSession,
  getManagerSession,
  type PortalSession,
} from "@/lib/self-service/session";
import { seedEmployeeDocuments } from "@/data/self-service/seed";
import type { SelfServicePermission } from "@/types/security";

export class SecurityError extends Error {
  readonly code = "FORBIDDEN";

  constructor(message: string) {
    super(message);
    this.name = "SecurityError";
  }
}

export type PortalActor = {
  session: PortalSession;
  role: "EMPLOYEE" | "MANAGER" | "HR";
};

function deny(
  actor: PortalActor,
  permission: SelfServicePermission | "resource",
  detail: string,
): never {
  writeAuditLog({
    eventType: "ACCESS_DENIED",
    actorEmployeeId: actor.session.employeeId,
    actorRole: actor.role,
    summary: `Denied ${permission}: ${detail}`,
    metadata: { detail },
  });
  throw new SecurityError(detail);
}

export function requireEmployeeActor(): PortalActor {
  return { session: getEmployeeSession(), role: "EMPLOYEE" };
}

export function requireManagerActor(): PortalActor {
  const session = getManagerSession();
  if (!session.isManager) {
    throw new SecurityError("Manager role required");
  }
  return { session, role: "MANAGER" };
}

export function requireHrActor(): PortalActor {
  const session = getHrSession();
  if (!session.isHr) {
    throw new SecurityError("HR role required");
  }
  return { session, role: "HR" };
}

export function requirePermission(
  actor: PortalActor,
  permission: SelfServicePermission,
) {
  if (!hasPermission(actor.role, permission)) {
    deny(actor, permission, `Missing permission ${permission}`);
  }
}

export async function assertSelfAccess(
  actorEmployeeId: string,
  resourceEmployeeId: string,
) {
  if (actorEmployeeId !== resourceEmployeeId) {
    throw new SecurityError(
      "Forbidden: employees may only access their own records",
    );
  }
}

export async function assertTeamAccess(
  managerEmployeeId: string,
  resourceEmployeeId: string,
) {
  if (managerEmployeeId === resourceEmployeeId) return;

  const assignment =
    await hrRepository.getPrimaryAssignment(resourceEmployeeId);
  if (assignment?.managerEmployeeId !== managerEmployeeId) {
    throw new SecurityError(
      "Forbidden: manager is not authorized for this employee",
    );
  }
}

export async function requireSelfResource(
  actor: PortalActor,
  resourceEmployeeId: string,
) {
  if (actor.session.employeeId !== resourceEmployeeId) {
    deny(
      actor,
      "resource",
      "Forbidden: employees may only access their own records",
    );
  }
}

export async function requireTeamResource(
  actor: PortalActor,
  resourceEmployeeId: string,
) {
  try {
    await assertTeamAccess(actor.session.employeeId, resourceEmployeeId);
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "Forbidden: manager is not authorized for this employee";
    deny(actor, "resource", detail);
  }
}

/** Employee document access — never trust a document id alone. */
export function getAuthorizedEmployeeDocument(
  actor: PortalActor,
  documentId: string,
) {
  requirePermission(actor, "self.documents.read");

  const document = seedEmployeeDocuments.find((item) => item.id === documentId);
  if (!document) {
    deny(actor, "resource", "Document not found");
  }

  if (document.employeeId !== actor.session.employeeId) {
    deny(actor, "resource", "Forbidden: cannot access another employee's document");
  }

  if (
    document.visibility !== "EMPLOYEE" &&
    document.visibility !== "MANAGER_AND_HR"
  ) {
    deny(actor, "resource", "Forbidden: document is not employee-visible");
  }

  writeAuditLog({
    eventType: "DOCUMENT_VIEWED",
    actorEmployeeId: actor.session.employeeId,
    actorRole: actor.role,
    targetEmployeeId: document.employeeId,
    resourceType: "DOCUMENT",
    resourceId: document.id,
    summary: `Viewed ${document.fileName}`,
  });

  return document;
}

export function toActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof SecurityError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}
