// Shared placeholder for routes not yet built out. Each page below renders
// this today and gets replaced with real UI on its scheduled PRD week.
export default function ComingSoon({ title, week }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {week ? `Scheduled for build in ${week}.` : "Coming soon."}
      </p>
    </div>
  );
}
