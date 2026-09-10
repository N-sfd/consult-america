/** mammoth ships no types; declaring the minimal surface this project uses. */
declare module "mammoth" {
  export function extractRawText(input: { buffer: Buffer }): Promise<{
    value: string;
    messages: unknown[];
  }>;
}
