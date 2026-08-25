import {
  seedHrRequestMessages,
  seedHrRequests,
} from "@/data/self-service/seed";
import type {
  HrRequest,
  HrRequestCategory,
  HrRequestMessage,
  HrRequestStatus,
} from "@/types/self-service";
import { pushNotification } from "@/lib/self-service/workflow-store";

const requests: HrRequest[] = structuredClone(seedHrRequests);
const messages: HrRequestMessage[] = structuredClone(seedHrRequestMessages);

/** Demo HR actor for assignment / replies until a dedicated HR employee exists. */
export const DEMO_HR_ACTOR_EMPLOYEE_ID = "emp-demo-001";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

function nextRequestNumber() {
  const year = new Date().getFullYear();
  const prefix = `HR-${year}-`;
  let max = 0;

  for (const request of requests) {
    if (!request.requestNumber.startsWith(prefix)) continue;
    const seq = Number(request.requestNumber.slice(prefix.length));
    if (Number.isFinite(seq) && seq > max) max = seq;
  }

  return `${prefix}${String(max + 1).padStart(6, "0")}`;
}

export function listHrRequestsForEmployee(employeeId: string) {
  return requests
    .filter((request) => request.employeeId === employeeId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listAllHrRequests() {
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listHrRequestsForQueue(
  filter: "OPEN" | "ASSIGNED" | "WAITING" | "RESOLVED" | "ALL",
  hrEmployeeId: string,
) {
  return listAllHrRequests().filter((request) => {
    if (filter === "ALL") return true;
    if (filter === "OPEN") {
      return request.status === "OPEN" || request.status === "IN_PROGRESS";
    }
    if (filter === "ASSIGNED") {
      return (
        request.assignedToEmployeeId === hrEmployeeId &&
        request.status !== "RESOLVED" &&
        request.status !== "CLOSED"
      );
    }
    if (filter === "WAITING") {
      return request.status === "WAITING_FOR_EMPLOYEE";
    }
    return request.status === "RESOLVED" || request.status === "CLOSED";
  });
}

export function getHrRequestById(requestId: string) {
  return requests.find((request) => request.id === requestId);
}

export function listHrRequestMessages(hrRequestId: string) {
  return messages
    .filter((item) => item.hrRequestId === hrRequestId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createHrRequest(input: {
  employeeId: string;
  category: HrRequestCategory;
  subject: string;
  description: string;
  priority?: "LOW" | "NORMAL" | "HIGH";
}) {
  const subject = input.subject.trim();
  const description = input.description.trim();

  if (!subject) throw new Error("Subject is required");
  if (!description) throw new Error("Description is required");
  if (subject.length > 120) throw new Error("Subject must be 120 characters or fewer");

  const createdAt = nowIso();
  const request: HrRequest = {
    id: createId("hrr"),
    employeeId: input.employeeId,
    requestNumber: nextRequestNumber(),
    category: input.category,
    subject,
    description,
    priority: input.priority ?? "NORMAL",
    status: "OPEN",
    assignedToEmployeeId: DEMO_HR_ACTOR_EMPLOYEE_ID,
    createdAt,
  };

  requests.push(request);

  messages.push({
    id: createId("hrm"),
    hrRequestId: request.id,
    authorEmployeeId: input.employeeId,
    authorRole: "EMPLOYEE",
    message: description,
    createdAt,
  });

  pushNotification({
    employeeId: DEMO_HR_ACTOR_EMPLOYEE_ID,
    type: "HR_REQUEST_CREATED",
    title: "New HR request",
    message: `${request.requestNumber} · ${request.subject}`,
    actionUrl: `/hr/requests/${request.id}`,
    createdAt,
  });

  return request;
}

export function addEmployeeMessage(input: {
  hrRequestId: string;
  employeeId: string;
  message: string;
}) {
  const request = getHrRequestById(input.hrRequestId);
  if (!request) throw new Error("HR request not found");
  if (request.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot message another employee's request");
  }
  if (request.status === "RESOLVED" || request.status === "CLOSED") {
    throw new Error("This request is closed to new employee messages");
  }

  const text = input.message.trim();
  if (!text) throw new Error("Message is required");

  const createdAt = nowIso();
  const entry: HrRequestMessage = {
    id: createId("hrm"),
    hrRequestId: request.id,
    authorEmployeeId: input.employeeId,
    authorRole: "EMPLOYEE",
    message: text,
    createdAt,
  };
  messages.push(entry);

  if (request.status === "WAITING_FOR_EMPLOYEE" || request.status === "OPEN") {
    request.status = "IN_PROGRESS";
  }

  const notifyId = request.assignedToEmployeeId ?? DEMO_HR_ACTOR_EMPLOYEE_ID;
  pushNotification({
    employeeId: notifyId,
    type: "HR_REQUEST_EMPLOYEE_REPLY",
    title: "Employee replied",
    message: `${request.requestNumber} · ${request.subject}`,
    actionUrl: `/hr/requests/${request.id}`,
    createdAt,
  });

  return { request, message: entry };
}

export function addHrMessage(input: {
  hrRequestId: string;
  hrEmployeeId: string;
  message: string;
}) {
  const request = getHrRequestById(input.hrRequestId);
  if (!request) throw new Error("HR request not found");
  if (request.status === "CLOSED") {
    throw new Error("Closed requests cannot accept new messages");
  }

  const text = input.message.trim();
  if (!text) throw new Error("Message is required");

  const createdAt = nowIso();
  if (!request.assignedToEmployeeId) {
    request.assignedToEmployeeId = input.hrEmployeeId;
  }
  if (request.status === "OPEN") {
    request.status = "IN_PROGRESS";
  }

  const entry: HrRequestMessage = {
    id: createId("hrm"),
    hrRequestId: request.id,
    authorEmployeeId: input.hrEmployeeId,
    authorRole: "HR",
    message: text,
    createdAt,
  };
  messages.push(entry);

  pushNotification({
    employeeId: request.employeeId,
    type: "HR_REQUEST_HR_REPLY",
    title: "HR replied to your request",
    message: `${request.requestNumber} · ${request.subject}`,
    actionUrl: `/employee/requests/${request.id}`,
    createdAt,
  });

  return { request, message: entry };
}

export function updateHrRequestStatus(input: {
  hrRequestId: string;
  hrEmployeeId: string;
  status: HrRequestStatus;
}) {
  const request = getHrRequestById(input.hrRequestId);
  if (!request) throw new Error("HR request not found");

  const actedAt = nowIso();
  request.status = input.status;
  if (!request.assignedToEmployeeId) {
    request.assignedToEmployeeId = input.hrEmployeeId;
  }

  if (input.status === "RESOLVED" || input.status === "CLOSED") {
    request.resolvedAt = actedAt;
  } else {
    request.resolvedAt = undefined;
  }

  pushNotification({
    employeeId: request.employeeId,
    type: "HR_REQUEST_STATUS",
    title: "HR request updated",
    message: `${request.requestNumber} is now ${input.status.replaceAll("_", " ").toLowerCase()}.`,
    actionUrl: `/employee/requests/${request.id}`,
    createdAt: actedAt,
  });

  return request;
}

export function getHrRequestStoreSnapshot() {
  return { requests, messages };
}

/** Test-only: restore HR request store to seed state. */
export function resetHrRequestStoreForTests() {
  requests.splice(0, requests.length, ...structuredClone(seedHrRequests));
  messages.splice(
    0,
    messages.length,
    ...structuredClone(seedHrRequestMessages),
  );
}
