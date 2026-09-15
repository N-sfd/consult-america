import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/shared";
import { crmRepository } from "@/lib/crm";

export const metadata: Metadata = {
  title: "Contacts | CRM Workspace",
};

export const dynamic = "force-dynamic";

export default async function CrmContactsPage() {
  const contacts = await crmRepository.listContacts();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contacts"
        description="ClientFlow contacts across accounts — Talk to Expert inquiries land here."
      />

      {contacts.length === 0 ? (
        <EmptyState
          title="No contacts yet"
          description="Contacts appear here once you add them to an account."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
          <ul className="divide-y divide-black/5">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <Link
                  href={`/crm/contacts/${contact.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div>
                    <p className="font-medium">
                      {contact.name}
                      {contact.isPrimary && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Primary
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-black/55">
                      {[contact.title, contact.email].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm text-black/45">
                    {contact.accountName}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
