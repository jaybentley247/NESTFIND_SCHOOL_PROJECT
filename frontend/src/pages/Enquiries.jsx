import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MailOpen, ChevronDown, MessageCircle } from "lucide-react";
import { listEnquiries } from "../api/enquiries";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import ChatModal from "../components/enquiries/ChatModal";
import { formatDate } from "../utils/formatDate";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  responded: "bg-green-100 text-green-700",
};

// PRD page 7: table of enquiries from GET /api/enquiries/?sender=me.
// Columns: Property, Agent Name, Date Sent, Status. Clicking a row expands
// the original message. "Chat with Host" opens the negotiation thread.
export default function Enquiries() {
  const [expandedId, setExpandedId] = useState(null);
  const [chatEnquiry, setChatEnquiry] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["enquiries", "mine"],
    queryFn: () => listEnquiries({ sender: "me" }),
  });

  const results = data?.results ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">My Enquiries</h1>

      {isError ? (
        <div className="mt-6">
          <ErrorState message="Couldn't load your enquiries." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <MailOpen className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">No enquiries sent yet</p>
          <p className="mt-1 text-sm text-slate-500">Contact a host from any listing to see it here.</p>
          <Link
            to="/listings"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Agent Name</th>
                <th className="px-4 py-3">Date Sent</th>
                <th className="px-4 py-3">Status</th>
                <th className="w-8 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((enquiry) => {
                const expanded = expandedId === enquiry.id;
                return (
                  <Fragment key={enquiry.id}>
                    <tr
                      onClick={() => setExpandedId(expanded ? null : enquiry.id)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <td className="flex items-center gap-3 px-4 py-3">
                        <img
                          src={enquiry.property_cover_image}
                          alt=""
                          loading="lazy"
                          className="h-10 w-14 shrink-0 rounded object-cover"
                        />
                        <Link
                          to={`/listings/${enquiry.property}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-slate-900 hover:text-primary"
                        >
                          {enquiry.property_title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{enquiry.host_name}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(enquiry.created_at)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[enquiry.status]}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronDown
                          className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={5} className="bg-slate-50 px-4 py-4 text-sm text-slate-600">
                          <p className="font-semibold text-slate-800">Your message</p>
                          <p className="mt-1 whitespace-pre-line">{enquiry.message}</p>
                          {enquiry.visit_date && (
                            <p className="mt-2 text-xs text-slate-500">
                              Preferred visit date: {formatDate(enquiry.visit_date)}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatEnquiry(enquiry);
                            }}
                            className="mt-3 flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700"
                          >
                            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            Chat with {enquiry.host_name}
                          </button>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ChatModal
        open={Boolean(chatEnquiry)}
        onClose={() => setChatEnquiry(null)}
        enquiryId={chatEnquiry?.id}
        title={chatEnquiry ? `Chat with ${chatEnquiry.host_name}` : ""}
      />
    </div>
  );
}
