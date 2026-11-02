import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, LayoutGrid, MessageSquare, ListChecks } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useProperties } from "../hooks/useProperties";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { deleteProperty } from "../api/properties";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";
import StatCard from "../components/dashboard/StatCard";
import EnquiriesFeed from "../components/dashboard/EnquiriesFeed";
import AnalyticsChart from "../components/dashboard/AnalyticsChart";
import ListingsGrid from "../components/dashboard/ListingsGrid";

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const { results: listings, totalPages, isLoading, isError, refetch } = useProperties({ host: user.id, page });
  const { data: stats } = useDashboardStats();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const enquiriesByProperty = Object.fromEntries((stats?.listings || []).map((l) => [l.id, l.enquiries_count]));

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProperty(deleteTarget.id);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      showToast(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    } catch {
      showToast("Couldn't delete this listing.", { type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Host Dashboard</h1>
        <Link
          to="/dashboard/listings/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add New Listing
        </Link>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={LayoutGrid} label="Total Listings" value={stats?.total_listings ?? "—"} />
        <StatCard icon={ListChecks} label="Active Listings" value={stats?.active_listings ?? "—"} />
        <StatCard icon={MessageSquare} label="Total Enquiries" value={stats?.total_enquiries ?? "—"} />
        <StatCard icon={Eye} label="Total Views" value={stats?.total_views ?? "—"} />
      </div>

      {/* Analytics */}
      {stats && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
          <div className="mt-4">
            <AnalyticsChart enquiriesTrend={stats.enquiries_trend} viewsByListing={stats.views_by_listing} />
          </div>
        </div>
      )}

      {/* Enquiries feed */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">Recent Enquiries</h2>
        <div className="mt-4">
          <EnquiriesFeed />
        </div>
      </div>

      {/* Listings grid */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">My Listings</h2>

        {isError ? (
          <div className="mt-4">
            <ErrorState message="Couldn't load your listings." onRetry={refetch} />
          </div>
        ) : isLoading ? (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">You haven't listed any properties yet.</p>
            <Link
              to="/dashboard/listings/new"
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Add your first listing
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <ListingsGrid listings={listings} enquiriesByProperty={enquiriesByProperty} onDeleteRequest={setDeleteTarget} />
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete listing"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This can't be undone.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
