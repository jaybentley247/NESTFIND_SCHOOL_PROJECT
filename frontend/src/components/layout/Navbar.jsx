import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Heart, Mail, LayoutDashboard, Receipt } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

function navLinksFor(user) {
  const links = [
    { to: "/listings", label: "Browse Listings" },
    { to: "/hosts", label: "Find a Host" },
  ];
  if (user?.role === "host") links.push({ to: "/dashboard", label: "Host Dashboard" });
  if (user?.role === "tenant") {
    links.push({ to: "/saved", label: "Saved" }, { to: "/enquiries", label: "My Enquiries" });
  }
  return links;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navLinks = navLinksFor(user);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-surface/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src="/Arowwai-red.png" alt="NestFind" className="h-16 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-bold text-primary transition-colors hover:text-primary-strong ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="" loading="lazy" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-strong">
                    {user.full_name?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-medium text-slate-700">{user.full_name.split(" ")[0]}</span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-surface py-1 shadow-lg"
                >
                  {user.role === "tenant" && (
                    <>
                      <Link to="/saved" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Heart className="h-4 w-4" /> Saved Properties
                      </Link>
                      <Link to="/enquiries" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Mail className="h-4 w-4" /> My Enquiries
                      </Link>
                      <Link to="/payments" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <Receipt className="h-4 w-4" /> My Payments
                      </Link>
                    </>
                  )}
                  {user.role === "host" && (
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <LayoutDashboard className="h-4 w-4" /> Host Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2 text-sm text-error hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <ThemeToggle />
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-sm font-bold text-primary"
              >
                {link.label}
              </NavLink>
            ))}
            {user?.role === "tenant" && (
              <NavLink to="/payments" onClick={() => setOpen(false)} className="text-sm font-bold text-primary">
                My Payments
              </NavLink>
            )}
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="text-left text-sm font-medium text-error"
              >
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
