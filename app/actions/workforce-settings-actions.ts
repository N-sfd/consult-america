"use server";

import { revalidatePath } from "next/cache";

import { upsertNotificationPreference } from "@/lib/workforce/operations";
import { getWorkforceSession } from "@/lib/workforce/session";

export type WorkforceSettingsActionResult = {
  ok: boolean;
  message: string;
};

export async function updateNotificationPreferenceAction(input: {
  notificationType: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}): Promise<WorkforceSettingsActionResult> {
  try {
    const session = await getWorkforceSession();
    if (!session.roles.includes("ADMIN") && !session.roles.includes("HR")) {
      return { ok: false, message: "Not authorized." };
    }
    if (!session.profileId) {
      return { ok: false, message: "No platform profile linked to this session." };
    }

    await upsertNotificationPreference({
      profileId: session.profileId,
      notificationType: input.notificationType,
      inAppEnabled: input.inAppEnabled,
      emailEnabled: input.emailEnabled,
    });

    revalidatePath("/workforce/settings");
    return { ok: true, message: "Preference saved." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to save preference.",
    };
  }
}
