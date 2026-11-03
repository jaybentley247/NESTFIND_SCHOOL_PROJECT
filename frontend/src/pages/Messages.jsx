import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessagesSquare } from "lucide-react";
import { listConversations } from "../api/enquiries";
import Skeleton from "../components/ui/Skeleton";
import ErrorState from "../components/ui/ErrorState";
import ChatModal from "../components/enquiries/ChatModal";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  responded: "bg-green-100 text-green-700",
};

// Every chat thread the current user is a party to — as the tenant who
// sent the enquiry, or as the host who owns the property — in one inbox,
// regardless of role. Not part of the original PRD routing table; added
// on request so negotiation history is easy to find from anywhere.
export default function Messages() {
  const [activeConversation, setActiveConversation] = useState(null);

  const { data: conversations, isLoading, isError, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    refetchInterval: 10_000,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
      <p className="mt-1 text-sm text-slate-500">Your negotiation conversations with hosts and tenants.</p>

      {isError ? (
        <div className="mt-6">
          <ErrorState message="Couldn't load your messages." onRetry={refetch} />
        </div>
      ) : isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <MessagesSquare className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-900">No conversations yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Send an enquiry from any listing, or reply to one you've received, to start chatting.
          </p>
          <Link
            to="/listings"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-surface">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveConversation(conversation)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
            >
              <img
                src={conversation.property_cover_image}
                alt=""
                loading="lazy"
                className="h-12 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-slate-900">{conversation.counterpart_name}</p>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="truncate text-xs text-slate-500">{conversation.property_title}</p>
                <p className="mt-0.5 truncate text-sm text-slate-600">{conversation.last_message}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[conversation.status]}`}
              >
                {conversation.status}
              </span>
            </button>
          ))}
        </div>
      )}

      <ChatModal
        open={Boolean(activeConversation)}
        onClose={() => setActiveConversation(null)}
        enquiryId={activeConversation?.id}
        title={activeConversation ? `Chat with ${activeConversation.counterpart_name}` : ""}
      />
    </div>
  );
}
