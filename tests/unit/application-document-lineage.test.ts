import { describe, expect, it } from "vitest";

import { decideApplicationDocumentLink } from "@/lib/documents/application-document-lineage";

describe("submitted application document lineage", () => {
  it("attaches the first resume to an application", () => {
    expect(
      decideApplicationDocumentLink({
        requestedDocumentId: "doc-v1",
      }),
    ).toEqual({ action: "attach", documentId: "doc-v1" });
  });

  it("keeps the same submitted resume when linked again", () => {
    expect(
      decideApplicationDocumentLink({
        existingDocumentId: "doc-v1",
        requestedDocumentId: "doc-v1",
      }),
    ).toEqual({ action: "keep", documentId: "doc-v1" });
  });

  it("does not replace Job A resume when the candidate uploads V2", () => {
    const decision = decideApplicationDocumentLink({
      existingDocumentId: "doc-v1",
      requestedDocumentId: "doc-v2",
    });
    expect(decision.action).toBe("reject");
    expect(decision.documentId).toBe("doc-v1");
  });
});
