export default function Home() {
  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-emerald-50 to-white px-6 py-16">
      <section className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-white/90 p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Inventory Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          Welcome back! Manage your inventory with confidence.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          Track stock, organize categories, and keep products updated in one place.
          Please sign in to start managing your store items.
        </p>

        <footer className="mt-10 text-sm text-slate-500">
          Built to keep your grocery operations simple and efficient.
        </footer>
      </section>
    </main>
  );
}