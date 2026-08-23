import Container from "@/components/layout/container";

export default function Home() {
  return (
    <main>
      <section className="min-h-screen bg-[var(--ca-off-white)] pt-40">
        <Container>
          <p className="ca-eyebrow text-[var(--ca-muted)]">
            CONSULTAMERICA
          </p>

          <h1 className="ca-display mt-8 max-w-5xl">
            Technology that moves business forward.
          </h1>

          <p className="ca-body-lg mt-8 max-w-2xl">
            Scroll the page to test the global header behavior.
          </p>
        </Container>
      </section>

      <section className="min-h-screen bg-white py-32">
        <Container>
          <h2 className="ca-h2 max-w-4xl">
            Enterprise transformation built for execution.
          </h2>
        </Container>
      </section>
    </main>
  );
}
