import type {
  Employee,
  EmploymentAssignment,
  Person,
} from "@/types/hr";

const now = "2026-08-01T00:00:00.000Z";

/** Demo Core HR seed — not production employee records. */
export const seedPeople: Person[] = [
  {
    id: "person-demo-001",
    firstName: "Michael",
    lastName: "Brown",
    preferredName: "Michael",
    personalEmail: "michael.brown.demo@example.com",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "person-demo-002",
    firstName: "Jennifer",
    lastName: "Lee",
    preferredName: "Jen",
    personalEmail: "jennifer.lee.demo@example.com",
    createdAt: now,
    updatedAt: now,
  },
];

export const seedEmployees: Employee[] = [
  {
    id: "emp-demo-001",
    personId: "person-demo-001",
    employeeNumber: "CA-000001",
    hireDate: "2024-03-01",
    originalHireDate: "2024-03-01",
    employmentStatus: "ACTIVE",
    workEmail: "michael.brown@consultamerica.demo",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "emp-demo-002",
    personId: "person-demo-002",
    employeeNumber: "CA-000002",
    hireDate: "2025-01-15",
    originalHireDate: "2025-01-15",
    employmentStatus: "ACTIVE",
    workEmail: "jennifer.lee@consultamerica.demo",
    createdAt: now,
    updatedAt: now,
  },
];

export const seedAssignments: EmploymentAssignment[] = [
  {
    id: "asg-demo-001",
    employeeId: "emp-demo-001",
    legalEntityId: "le-ca-us",
    businessUnitId: "bu-technology",
    departmentId: "dept-oracle",
    positionId: "pos-oracle-fin-sr",
    locationId: "loc-md",
    employmentType: "FULL_TIME",
    workplaceType: "HYBRID",
    startDate: "2024-03-01",
    assignmentStatus: "ACTIVE",
    primaryAssignment: true,
    changeReason: "Initial hire",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "asg-demo-002",
    employeeId: "emp-demo-002",
    legalEntityId: "le-ca-us",
    businessUnitId: "bu-technology",
    departmentId: "dept-ai-data",
    positionId: "pos-ai-engineer",
    locationId: "loc-remote-us",
    managerEmployeeId: "emp-demo-001",
    employmentType: "FULL_TIME",
    workplaceType: "REMOTE",
    startDate: "2025-01-15",
    assignmentStatus: "ACTIVE",
    primaryAssignment: true,
    changeReason: "Initial hire",
    createdAt: now,
    updatedAt: now,
  },
];
