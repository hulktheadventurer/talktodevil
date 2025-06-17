export default function Legal() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-800 px-6 py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md border border-neutral-300">
        <h1 className="text-4xl font-serif font-bold mb-6 text-black">Legal & Disclaimer</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Disclaimer</h2>
          <p className="leading-relaxed">
            Confessly is an AI-powered spiritual experience. It does not provide professional therapy,
            religious confession, or emergency support. All guidance is fictional and symbolic, designed
            to offer comfort — not certified advice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Privacy Policy</h2>
          <p className="leading-relaxed">
            We collect no identifying information. Confessions are anonymous. We may log content to
            improve the experience, but no names, emails, or IPs are stored.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Terms of Use</h2>
          <p className="leading-relaxed">
            By using Confessly, you agree to behave respectfully. Do not use it for illegal, hateful,
            or abusive content. The service is offered “as is,” and may not always respond as expected.
          </p>
        </section>

        <p className="text-sm text-neutral-500 text-center italic mt-6">
          Last updated: June 2025 • Be gentle with yourself and others.
        </p>
      </div>
    </main>
  );
}
