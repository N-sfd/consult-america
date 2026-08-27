"use server";

import { revalidatePath } from "next/cache";

import { hrRepository } from "@/lib/hr";
import {
  requireEmployeeActor,
  requirePermission,
  toActionErrorMessage,
} from "@/lib/self-service/security";

export type ProfileActionResult = {
  ok: boolean;
  message: string;
};

export async function updateContactInfoAction(input: {
  personalEmail?: string;
  personalPhone?: string;
  mailingAddress?: string;
}): Promise<ProfileActionResult> {
  try {
    const actor = requireEmployeeActor();
    requirePermission(actor, "self.profile.update_limited");

    const employee = await hrRepository.getEmployeeById(actor.session.employeeId);
    if (!employee) throw new Error("Employee not found");

    await hrRepository.updatePersonContact(employee.personId, {
      personalEmail: input.personalEmail?.trim(),
      personalPhone: input.personalPhone?.trim(),
      mailingAddress: input.mailingAddress?.trim(),
    });

    revalidatePath("/employee/profile");
    revalidatePath("/employee");
    return { ok: true, message: "Contact information updated." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to update contact information."),
    };
  }
}

export async function updateEmergencyContactAction(input: {
  name: string;
  relationship?: string;
  phone: string;
}): Promise<ProfileActionResult> {
  try {
    const actor = requireEmployeeActor();
    requirePermission(actor, "self.profile.update_limited");

    const name = input.name.trim();
    const phone = input.phone.trim();
    if (!name) throw new Error("Emergency contact name is required");
    if (!phone) throw new Error("Emergency contact phone is required");

    const employee = await hrRepository.getEmployeeById(actor.session.employeeId);
    if (!employee) throw new Error("Employee not found");

    await hrRepository.updatePersonContact(employee.personId, {
      emergencyContactName: name,
      emergencyContactRelationship: input.relationship?.trim(),
      emergencyContactPhone: phone,
    });

    revalidatePath("/employee/profile");
    revalidatePath("/employee");
    return { ok: true, message: "Emergency contact updated." };
  } catch (error) {
    return {
      ok: false,
      message: toActionErrorMessage(error, "Unable to update emergency contact."),
    };
  }
}
