import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// PRD section 7: "Protect authenticated routes with a <ProtectedRoute/>
// wrapper that checks AuthContext, and gate host-only routes with a second
// check on user.role === 'host'." This is a UX convenience only — the real
// security boundary is DRF permissions once the backend exists.
export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="py-24 text-center text-sm text-slate-400">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
