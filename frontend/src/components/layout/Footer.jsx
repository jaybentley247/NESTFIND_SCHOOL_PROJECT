import { Link } from "react-router-dom";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse Listings", to: "/listings" },
      { label: "List Your Property", to: "/register" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", to: "/login" },
      { label: "Sign Up", to: "/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-2">
          <img src="/Arowwai-red.png" alt="NestFind" loading="lazy" className="h-14 w-auto" />
          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Find your next home or short-let. List, discover, connect.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-500 hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} NestFind. Built for portfolio & learning purposes.
      </div>
    </footer>
  );
}
