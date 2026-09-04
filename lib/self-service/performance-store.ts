import {
  seedGoals,
  seedPerformanceReviews,
  seedReviewCycles,
} from "@/data/self-service/seed";
import type { Goal, GoalStatus, PerformanceReview, ReviewCycle } from "@/types/self-service";

const goals: Goal[] = structuredClone(seedGoals);
const reviewCycles: ReviewCycle[] = structuredClone(seedReviewCycles);
const performanceReviews: PerformanceReview[] = structuredClone(seedPerformanceReviews);

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function listGoals(employeeId: string) {
  return goals
    .filter((goal) => goal.employeeId === employeeId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getGoalById(goalId: string) {
  return goals.find((goal) => goal.id === goalId);
}

export function createGoal(input: {
  employeeId: string;
  title: string;
  description?: string;
  targetDate?: string;
}) {
  if (!input.title.trim()) throw new Error("Goal title is required");

  const now = nowIso();
  const goal: Goal = {
    id: createId("goal"),
    employeeId: input.employeeId,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    targetDate: input.targetDate || undefined,
    status: "NOT_STARTED",
    progressPercent: 0,
    createdAt: now,
    updatedAt: now,
  };
  goals.push(goal);
  return goal;
}

export function updateGoalProgress(input: {
  goalId: string;
  employeeId: string;
  status: GoalStatus;
  progressPercent: number;
}) {
  const goal = getGoalById(input.goalId);
  if (!goal) throw new Error("Goal not found");
  if (goal.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot update another employee's goal");
  }
  if (input.progressPercent < 0 || input.progressPercent > 100) {
    throw new Error("Progress must be between 0 and 100");
  }

  goal.status = input.status;
  goal.progressPercent = input.progressPercent;
  goal.updatedAt = nowIso();
  return goal;
}

export function listReviewCycles() {
  return reviewCycles;
}

export function listReviewsForEmployee(employeeId: string) {
  return performanceReviews
    .filter((review) => review.employeeId === employeeId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listReviewsForManager(managerEmployeeId: string) {
  return performanceReviews.filter(
    (review) => review.managerEmployeeId === managerEmployeeId,
  );
}

export function getReviewById(reviewId: string) {
  return performanceReviews.find((review) => review.id === reviewId);
}

export function submitSelfAssessment(input: {
  reviewId: string;
  employeeId: string;
  selfAssessment: string;
}) {
  const review = getReviewById(input.reviewId);
  if (!review) throw new Error("Review not found");
  if (review.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot update another employee's review");
  }
  if (!input.selfAssessment.trim()) {
    throw new Error("Self-assessment cannot be empty");
  }

  const now = nowIso();
  review.selfAssessment = input.selfAssessment.trim();
  review.selfSubmittedAt = now;
  review.updatedAt = now;
  return review;
}

export function submitManagerAssessment(input: {
  reviewId: string;
  managerEmployeeId: string;
  managerAssessment: string;
  rating: number;
}) {
  const review = getReviewById(input.reviewId);
  if (!review) throw new Error("Review not found");
  if (review.managerEmployeeId !== input.managerEmployeeId) {
    throw new Error("Forbidden: not the assigned manager for this review");
  }
  if (!input.managerAssessment.trim()) {
    throw new Error("Manager assessment cannot be empty");
  }
  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const now = nowIso();
  review.managerAssessment = input.managerAssessment.trim();
  review.rating = input.rating;
  review.managerSubmittedAt = now;
  review.status = "SUBMITTED";
  review.updatedAt = now;
  return review;
}

export function acknowledgeReview(input: { reviewId: string; employeeId: string }) {
  const review = getReviewById(input.reviewId);
  if (!review) throw new Error("Review not found");
  if (review.employeeId !== input.employeeId) {
    throw new Error("Forbidden: cannot acknowledge another employee's review");
  }
  if (review.status !== "SUBMITTED") {
    throw new Error("Only a submitted review can be acknowledged");
  }

  const now = nowIso();
  review.status = "ACKNOWLEDGED";
  review.acknowledgedAt = now;
  review.updatedAt = now;
  return review;
}

export function getPerformanceStoreSnapshot() {
  return { goals, reviewCycles, performanceReviews };
}

/** Test-only: restore performance store to seed state. */
export function resetPerformanceStoreForTests() {
  goals.splice(0, goals.length, ...structuredClone(seedGoals));
  reviewCycles.splice(0, reviewCycles.length, ...structuredClone(seedReviewCycles));
  performanceReviews.splice(
    0,
    performanceReviews.length,
    ...structuredClone(seedPerformanceReviews),
  );
}
