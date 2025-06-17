export default function TermsPage() {
  return (
    <main className="min-h-screen bg-amber-50 text-gray-800 px-6 py-20 text-lg">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-amber-700">Terms & Privacy</h1>

        <h2 className="text-2xl font-semibold text-amber-600">1. Usage Terms</h2>
        <p>
          Confessly is provided for anonymous emotional expression, spiritual reflection, and entertainment.
          By using this site, you agree to not submit harmful, illegal, or hateful content.
        </p>

        <h2 className="text-2xl font-semibold text-amber-600">2. Privacy Policy</h2>
        <p>
          We do not collect names, emails, or IP addresses. All confessions are stored anonymously and used solely to improve the experience.
          Public confessions may be displayed on the Wall if you choose "Post to Wall."
        </p>

        <h2 className="text-2xl font-semibold text-amber-600">3. AI Responses</h2>
        <p>
          All responses are AI-generated and should be understood as fictional and reflective rather than factual.
          We are not responsible for any actions taken based on AI replies.
        </p>

        <h2 className="text-2xl font-semibold text-amber-600">4. Changes</h2>
        <p>
          Terms and policies may be updated without notice. Continued use of Confessly indicates your acceptance of any updates.
        </p>
      </div>
    </main>
  );
}
