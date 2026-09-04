"use server";

import { revalidatePath } from "next/cache";

import {
  acknowledgeReview,
  createGoal,
  getReviewById,
  submitManagerAssessment,
  submitSelfAssessment,
  updateGoalProgress,
} from "@/lib/self-service/performance-store";
import {
  requireEmployeeActor,
  requireManagerActor,
  requirePermission,
  requireTeamResource,
  toActionErrorMessage,
} from "@/lib/self-service/security";
import type { GoalStatus } from "@/types/self-service";

export type PerformanceActionResult = {
  ok: boolean;
  message: string;
};

function revalidatePerformancePaths() {
  revalidatePath("/employee/goals");
  revalidatePath("/employee/performance");
  revalidatePath("/employee");
  revalidatePath("/manager/team");
}

export async function createGoalAction(input: {
  title: string;
  description?: string;
  targetDate?: string;
}): Promise<PerformanceActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.goals.manage");

    createGoal({
      employeeId: actor.session.employeeId,
      title: input.title,
      description: input.description,
      targetDate: input.targetDate,
    });

    revalidatePerformancePaths();
    return { ok: true, message: "Goal added." };
  } catch (error) {
    return { ok: false, message: toActionErrorMessage(error, "Unable to add goal.") };
  }
}

export async function updateGoalProgressAction(input: {
  goalId: string;
  status: GoalStatus;
  progressPercent: number;
}): Promise<PerformanceActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.goals.manage");

    updateGoalProgress({
      goalId: input.goalId,
      employeeId: actor.session.employeeId,
      status: input.status,
      progressPercent: input.progressPercent,
    });

    revalidatePerformancePaths();
    return { ok: true, message: "Goal updated." };
  } catch (error) {
    return { ok: false, message: toActionErrorMessage(error, "Unable to update goal.") };
  }
}

export async function submitSelfAssessmentAction(input: {
  reviewId: string;
  selfAssessment: string;
}): Promise<PerformanceActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.performance.submit");

    submitSelfAssessment({
      reviewId: input.reviewId,
      employeeId: actor.session.employeeId,
      selfAssessment: input.selfAssessment,
    });

    revalidatePerformancePaths();
    return { ok: true, message: "Self-assessment submitted." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to submit self-assessment."),
    };
  }
}

export async function acknowledgeReviewAction(input: {
  reviewId: string;
}): Promise<PerformanceActionResult> {
  try {
    const actor = await requireEmployeeActor();
    requirePermission(actor, "self.performance.read");

    acknowledgeReview({ reviewId: input.reviewId, employeeId: actor.session.employeeId });

    revalidatePerformancePaths();
    return { ok: true, message: "Review acknowledged." };
  } catch (error) {
    return { ok: false, message: toActionErrorMessage(error, "Unable to acknowledge review.") };
  }
}

export async function submitManagerAssessmentAction(input: {
  reviewId: string;
  managerAssessment: string;
  rating: number;
}): Promise<PerformanceActionResult> {
  try {
    const actor = await requireManagerActor();
    requirePermission(actor, "team.performance.manage");

    const existing = getReviewById(input.reviewId);
    if (!existing) throw new Error("Review not found");
    await requireTeamResource(actor, existing.employeeId);

    submitManagerAssessment({
      reviewId: input.reviewId,
      managerEmployeeId: actor.session.employeeId,
      managerAssessment: input.managerAssessment,
      rating: input.rating,
    });

    revalidatePerformancePaths();
    return { ok: true, message: "Assessment submitted to employee." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to submit assessment."),
    };
  }
}
