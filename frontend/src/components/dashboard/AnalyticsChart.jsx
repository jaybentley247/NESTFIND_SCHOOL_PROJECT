import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// PRD page 8: "Views/enquiries per listing over 30 days — aggregated
// server-side with Django ORM annotations, rendered with Recharts."
// enquiriesTrend carries the real time dimension (daily counts via
// TruncDate); viewsByListing carries the per-listing dimension.
export default function AnalyticsChart({ enquiriesTrend, viewsByListing }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-surface p-4">
        <h3 className="text-sm font-semibold text-slate-700">Enquiries — last 30 days</h3>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enquiriesTrend}>
              <defs>
                <linearGradient id="enquiriesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                interval={4}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                formatter={(value) => [value, "Enquiries"]}
              />
              <Area type="monotone" dataKey="count" stroke="#DC2626" strokeWidth={2} fill="url(#enquiriesFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-surface p-4">
        <h3 className="text-sm font-semibold text-slate-700">Views by listing</h3>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={viewsByListing} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.3} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="title"
                width={110}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => (value.length > 16 ? `${value.slice(0, 16)}…` : value)}
              />
              <Tooltip formatter={(value) => [value, "Views"]} />
              <Bar dataKey="views" fill="#DC2626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
