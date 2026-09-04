import { isSupabaseConfigured } from "@/app/lib/supabase/server";
import { createMemoryCrmRepository } from "@/lib/crm/memory-repository";
import type { CrmRepository } from "@/lib/crm/repository";
import { createSupabaseCrmRepository } from "@/lib/crm/supabase-repository";

export const crmRepository: CrmRepository = isSupabaseConfigured()
  ? createSupabaseCrmRepository()
  : createMemoryCrmRepository();
