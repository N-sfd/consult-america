/**
 * One-time Supabase seed runner for the Recruiting + Core HR domains.
 *
 * Run via `npm run seed:supabase` after applying db/schema/*.sql to a real
 * Supabase project and setting NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
 * in .env.local. Safe to re-run — every insert is an upsert keyed on `id`.
 *
 * Not part of the build/test path — this script may exit loudly on missing
 * config, unlike app code which must degrade gracefully.
 */

import { createClient } from "@supabase/supabase-js";

import {
  seedBusinessUnits,
  seedDepartments,
  seedLegalEntities,
  seedLocations,
  seedPositions,
  seedPostings,
  seedRequisitions,
} from "@/data/recruiting/seed";
import { seedAssignments, seedEmployees, seedPeople } from "@/data/hr/seed";
import type {
  ApplicationStatus,
  InterviewStatus,
  InterviewType,
  OfferStatus,
} from "@/types/recruiting";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. " +
      "Set them in .env.local (or pass --env-file) before running npm run seed:supabase.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

async function upsert(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`Upsert into ${table} failed: ${error.message}`);
  console.log(`  ${table}: ${rows.length} row(s)`);
}

const now = "2026-08-01T00:00:00.000Z";

async function seedOrganizationAndRecruiting() {
  console.log("Seeding organization reference data…");
  await upsert(
    "legal_entities",
    seedLegalEntities.map((e) => ({
      id: e.id,
      code: e.code,
      name: e.name,
      country: e.country,
      status: e.status,
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    })),
  );
  await upsert(
    "business_units",
    seedBusinessUnits.map((b) => ({
      id: b.id,
      legal_entity_id: b.legalEntityId,
      code: b.code,
      name: b.name,
      description: b.description,
      status: b.status,
      created_at: b.createdAt,
      updated_at: b.updatedAt,
    })),
  );
  await upsert(
    "departments",
    seedDepartments.map((d) => ({
      id: d.id,
      business_unit_id: d.businessUnitId,
      code: d.code,
      name: d.name,
      status: d.status,
      effective_start_date: d.effectiveStartDate,
      created_at: d.createdAt,
      updated_at: d.updatedAt,
    })),
  );
  await upsert(
    "locations",
    seedLocations.map((l) => ({
      id: l.id,
      code: l.code,
      name: l.name,
      city: l.city,
      state: l.state,
      country: l.country,
      timezone: l.timezone,
      status: l.status,
      created_at: l.createdAt,
      updated_at: l.updatedAt,
    })),
  );
  await upsert(
    "positions",
    seedPositions.map((p) => ({
      id: p.id,
      department_id: p.departmentId,
      code: p.code,
      title: p.title,
      job_family: p.jobFamily,
      job_level: p.jobLevel,
      employment_type: p.employmentType,
      status: p.status,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    })),
  );

  console.log("Seeding requisitions + postings…");
  await upsert(
    "job_requisitions",
    seedRequisitions.map((r) => ({
      id: r.id,
      requisition_number: r.requisitionNumber,
      title: r.title,
      department_id: r.departmentId,
      position_id: r.positionId,
      location_id: r.locationId,
      employment_type: r.employmentType,
      workplace_type: r.workplaceType,
      career_area: r.careerArea,
      openings: r.openings,
      currency: r.currency,
      description: r.description,
      responsibilities: r.responsibilities,
      qualifications: r.qualifications,
      preferred_qualifications: r.preferredQualifications,
      status: r.status,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    })),
  );
  await upsert(
    "job_postings",
    seedPostings.map((p) => ({
      id: p.id,
      requisition_id: p.requisitionId,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description,
      career_area: p.careerArea,
      department_name: p.departmentName,
      location_name: p.locationName,
      workplace_type: p.workplaceType,
      employment_type: p.employmentType,
      responsibilities: p.responsibilities,
      qualifications: p.qualifications,
      preferred_qualifications: p.preferredQualifications,
      status: p.status,
      published_at: p.publishedAt,
      is_demo: p.isDemo,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    })),
  );
}

async function seedEmployeesAndPeople() {
  console.log("Seeding people + employees + assignments…");
  await upsert(
    "people",
    seedPeople.map((p) => ({
      id: p.id,
      first_name: p.firstName,
      last_name: p.lastName,
      preferred_name: p.preferredName,
      personal_email: p.personalEmail,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    })),
  );
  await upsert(
    "employees",
    seedEmployees.map((e) => ({
      id: e.id,
      person_id: e.personId,
      employee_number: e.employeeNumber,
      hire_date: e.hireDate,
      original_hire_date: e.originalHireDate,
      employment_status: e.employmentStatus,
      work_email: e.workEmail,
      created_at: e.createdAt,
      updated_at: e.updatedAt,
    })),
  );
  await upsert(
    "employment_assignments",
    seedAssignments.map((a) => ({
      id: a.id,
      employee_id: a.employeeId,
      legal_entity_id: a.legalEntityId,
      business_unit_id: a.businessUnitId,
      department_id: a.departmentId,
      position_id: a.positionId,
      location_id: a.locationId,
      manager_employee_id: a.managerEmployeeId,
      employment_type: a.employmentType,
      workplace_type: a.workplaceType,
      start_date: a.startDate,
      assignment_status: a.assignmentStatus,
      primary_assignment: a.primaryAssignment,
      change_reason: a.changeReason,
      created_at: a.createdAt,
      updated_at: a.updatedAt,
    })),
  );
}

type SeedCandidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workAuthorization: string;
  source: string;
};

const seedCandidates: SeedCandidate[] = [
  { id: "cand-seed-001", firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson.demo@example.com", phone: "555-0101", workAuthorization: "Authorized", source: "Referral" },
  { id: "cand-seed-002", firstName: "Michael", lastName: "Lee", email: "michael.lee.demo@example.com", phone: "555-0102", workAuthorization: "Authorized", source: "LinkedIn" },
  { id: "cand-seed-003", firstName: "Ana", lastName: "Martinez", email: "ana.martinez.demo@example.com", phone: "555-0103", workAuthorization: "Authorized", source: "Job Board" },
  { id: "cand-seed-004", firstName: "Rachel", lastName: "Patel", email: "rachel.patel.demo@example.com", phone: "555-0104", workAuthorization: "Authorized", source: "Referral" },
  { id: "cand-seed-005", firstName: "David", lastName: "Kim", email: "david.kim.demo@example.com", phone: "555-0105", workAuthorization: "Authorized", source: "Job Board" },
  { id: "cand-seed-006", firstName: "Jordan", lastName: "Blake", email: "jordan.blake.demo@example.com", phone: "555-0106", workAuthorization: "Authorized", source: "LinkedIn" },
  { id: "cand-seed-007", firstName: "Priya", lastName: "Nair", email: "priya.nair.demo@example.com", phone: "555-0107", workAuthorization: "Authorized", source: "Referral" },
  { id: "cand-seed-008", firstName: "Chris", lastName: "Alvarez", email: "chris.alvarez.demo@example.com", phone: "555-0108", workAuthorization: "Authorized", source: "Job Board" },
  { id: "cand-seed-009", firstName: "Maya", lastName: "Chen", email: "maya.chen.demo@example.com", phone: "555-0109", workAuthorization: "Authorized", source: "LinkedIn" },
  { id: "cand-seed-010", firstName: "Tom", lastName: "Nguyen", email: "tom.nguyen.demo@example.com", phone: "555-0110", workAuthorization: "Authorized", source: "Referral" },
  { id: "cand-seed-011", firstName: "Lauren", lastName: "Scott", email: "lauren.scott.demo@example.com", phone: "555-0111", workAuthorization: "Authorized", source: "Job Board" },
];

type SeedApplication = {
  id: string;
  candidateId: string;
  requisitionId: string;
  postingId: string;
  status: ApplicationStatus;
  appliedAt: string;
};

const seedApplications: SeedApplication[] = [
  { id: "app-seed-001", candidateId: "cand-seed-001", requisitionId: "req-demo-001", postingId: "post-req-demo-001", status: "INTERVIEW", appliedAt: "2026-08-03T00:00:00.000Z" },
  { id: "app-seed-002", candidateId: "cand-seed-002", requisitionId: "req-demo-002", postingId: "post-req-demo-002", status: "INTERVIEW", appliedAt: "2026-08-06T00:00:00.000Z" },
  { id: "app-seed-003", candidateId: "cand-seed-003", requisitionId: "req-demo-003", postingId: "post-req-demo-003", status: "OFFER", appliedAt: "2026-08-11T00:00:00.000Z" },
  { id: "app-seed-004", candidateId: "cand-seed-004", requisitionId: "req-demo-004", postingId: "post-req-demo-004", status: "APPLIED", appliedAt: "2026-08-13T00:00:00.000Z" },
  { id: "app-seed-005", candidateId: "cand-seed-005", requisitionId: "req-demo-005", postingId: "post-req-demo-005", status: "APPLIED", appliedAt: "2026-08-16T00:00:00.000Z" },
  { id: "app-seed-006", candidateId: "cand-seed-006", requisitionId: "req-demo-002", postingId: "post-req-demo-002", status: "HIRED", appliedAt: "2026-07-20T00:00:00.000Z" },
  { id: "app-seed-007", candidateId: "cand-seed-007", requisitionId: "req-demo-001", postingId: "post-req-demo-001", status: "REVIEW", appliedAt: "2026-08-19T00:00:00.000Z" },
  { id: "app-seed-008", candidateId: "cand-seed-008", requisitionId: "req-demo-006", postingId: "post-req-demo-006", status: "REVIEW", appliedAt: "2026-08-19T00:00:00.000Z" },
  { id: "app-seed-009", candidateId: "cand-seed-009", requisitionId: "req-demo-003", postingId: "post-req-demo-003", status: "RECRUITER_SCREEN", appliedAt: "2026-08-14T00:00:00.000Z" },
  { id: "app-seed-010", candidateId: "cand-seed-010", requisitionId: "req-demo-004", postingId: "post-req-demo-004", status: "RECRUITER_SCREEN", appliedAt: "2026-08-15T00:00:00.000Z" },
  { id: "app-seed-011", candidateId: "cand-seed-011", requisitionId: "req-demo-005", postingId: "post-req-demo-005", status: "REJECTED", appliedAt: "2026-08-02T00:00:00.000Z" },
];

type SeedInterview = {
  id: string;
  applicationId: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  durationMinutes: number;
};

const seedInterviews: SeedInterview[] = [
  { id: "int-seed-001", applicationId: "app-seed-001", interviewType: "VIDEO", status: "SCHEDULED", scheduledAt: "2026-08-27T15:00:00.000Z", durationMinutes: 45 },
  { id: "int-seed-002", applicationId: "app-seed-002", interviewType: "PANEL", status: "SCHEDULED", scheduledAt: "2026-08-28T17:00:00.000Z", durationMinutes: 60 },
  { id: "int-seed-003", applicationId: "app-seed-003", interviewType: "FINAL", status: "COMPLETED", scheduledAt: "2026-08-18T16:00:00.000Z", durationMinutes: 60 },
  { id: "int-seed-004", applicationId: "app-seed-006", interviewType: "ONSITE", status: "COMPLETED", scheduledAt: "2026-07-25T14:00:00.000Z", durationMinutes: 90 },
];

type SeedOffer = {
  id: string;
  applicationId: string;
  offerNumber: string;
  status: OfferStatus;
  startDate: string;
};

const seedOffers: SeedOffer[] = [
  { id: "offer-seed-001", applicationId: "app-seed-003", offerNumber: "OFR-2026-0001", status: "EXTENDED", startDate: "2026-09-15" },
  { id: "offer-seed-002", applicationId: "app-seed-006", offerNumber: "OFR-2026-0002", status: "ACCEPTED", startDate: "2026-08-25" },
];

async function seedRecruitingActivity() {
  console.log("Seeding candidates + applications + interviews + offers…");
  await upsert(
    "candidates",
    seedCandidates.map((c) => ({
      id: c.id,
      first_name: c.firstName,
      last_name: c.lastName,
      email: c.email,
      phone: c.phone,
      work_authorization: c.workAuthorization,
      source: c.source,
      created_at: now,
      updated_at: now,
    })),
  );
  await upsert(
    "applications",
    seedApplications.map((a, i) => ({
      id: a.id,
      application_number: `APP-2026-${String(i + 1).padStart(4, "0")}`,
      candidate_id: a.candidateId,
      requisition_id: a.requisitionId,
      posting_id: a.postingId,
      status: a.status,
      applied_at: a.appliedAt,
      updated_at: a.appliedAt,
    })),
  );
  await upsert(
    "interviews",
    seedInterviews.map((i) => ({
      id: i.id,
      application_id: i.applicationId,
      interview_type: i.interviewType,
      status: i.status,
      scheduled_at: i.scheduledAt,
      duration_minutes: i.durationMinutes,
      created_at: now,
      updated_at: now,
    })),
  );
  await upsert(
    "offers",
    seedOffers.map((o) => ({
      id: o.id,
      application_id: o.applicationId,
      offer_number: o.offerNumber,
      status: o.status,
      currency: "USD",
      employment_type: "FULL_TIME",
      workplace_type: "HYBRID",
      start_date: o.startDate,
      created_at: now,
      updated_at: now,
    })),
  );
}

async function main() {
  console.log(`Seeding Supabase project at ${url}\n`);
  await seedOrganizationAndRecruiting();
  await seedEmployeesAndPeople();
  await seedRecruitingActivity();
  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
