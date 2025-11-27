export default function HomePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to WD Computer
        </h1>
        <p className="mt-2 text-slate-300">
          A modern platform for computer components, peripherals, and custom PC
          builds. Backend and full feature set coming next.
        </p>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Status</h2>
        <p className="mt-1 text-sm text-slate-300">
          Initial scaffolding: Next.js frontend and NestJS backend skeleton
          (health endpoint) with PostgreSQL/Prisma planned.
        </p>
      </section>
    </div>
  );
}