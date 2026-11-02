import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, MessageCircle } from "lucide-react";
import { listEnquiries, updateEnquiryStatus } from "../../api/enquiries";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../utils/formatDate";
import Skeleton from "../ui/Skeleton";
import ChatModal from "../enquiries/ChatModal";

const RECENT_COUNT = 5;

// PRD page 8: "Enquiries Feed — Recent enquiries; 'Mark as Responded' calls
// PATCH /api/enquiries/{id}/." The backend already scopes GET /api/enquiries/
// to the logged-in host's own properties when no ?sender= filter is given.
export default function EnquiriesFeed() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [chatEnquiry, setChatEnquiry] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries", "host-feed"],
    queryFn: () => listEnquiries(),
  });

  const respondMutation = useMutation({
    mutationFn: (id) => updateEnquiryStatus(id, "responded"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      showToast("Marked as responded.");
    },
    onError: () => showToast("Couldn't update this enquiry.", { type: "error" }),
  });

  const recent = (data?.results ?? []).slice(0, RECENT_COUNT);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-10 text-center">
        <MessageSquare className="h-8 w-8 text-slate-300" aria-hidden="true" />
        <p className="mt-2 text-sm text-slate-500">No enquiries yet.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {recent.map((enquiry) => (
          <li key={enquiry.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{enquiry.full_name}</p>
              <p className="truncate text-xs text-slate-500">
                {enquiry.property_title} · {formatDate(enquiry.created_at)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {enquiry.sender && (
                <button
                  type="button"
                  onClick={() => setChatEnquiry(enquiry)}
                  aria-label={`Chat with ${enquiry.full_name}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Chat
                </button>
              )}
              {enquiry.status === "pending" ? (
                <button
                  type="button"
                  onClick={() => respondMutation.mutate(enquiry.id)}
                  disabled={respondMutation.isPending}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  Mark as Responded
                </button>
              ) : (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  Responded
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <ChatModal
        open={Boolean(chatEnquiry)}
        onClose={() => setChatEnquiry(null)}
        enquiryId={chatEnquiry?.id}
        title={chatEnquiry ? `Chat with ${chatEnquiry.full_name}` : ""}
      />
    </>
  );
}
