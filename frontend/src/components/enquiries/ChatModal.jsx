import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import Modal from "../ui/Modal";
import Skeleton from "../ui/Skeleton";
import { listMessages, sendMessage } from "../../api/enquiries";
import { useToast } from "../../context/ToastContext";

const POLL_INTERVAL = 4000;

// Negotiation chat attached to a single enquiry — either the tenant who
// sent it or the property's host can read/post here (backend:
// EnquiryViewSet.messages / CanChatOnEnquiry). Polls rather than using a
// WebSocket, matching the rest of the app's TanStack Query data layer
// instead of adding a whole separate real-time stack for one feature.
export default function ChatModal({ open, onClose, enquiryId, title }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["enquiry-messages", enquiryId],
    queryFn: () => listMessages(enquiryId),
    enabled: open && Boolean(enquiryId),
    refetchInterval: open ? POLL_INTERVAL : false,
  });

  const sendMutation = useMutation({
    mutationFn: (body) => sendMessage(enquiryId, body),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["enquiry-messages", enquiryId] });
    },
    onError: () => showToast("Couldn't send that message. Please try again.", { type: "error" }),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  function handleSend(event) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sendMutation.isPending) return;
    sendMutation.mutate(body);
  }

  return (
    <Modal open={open} onClose={onClose} title={title || "Chat"}>
      <div className="flex h-96 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="ml-auto h-10 w-2/3" />
            </>
          ) : isError ? (
            <p className="text-sm text-error">Couldn't load this conversation.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-slate-400">No messages yet — say hello to start negotiating.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.is_mine ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.is_mine ? "bg-primary text-white" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {msg.body}
                </div>
                <span className="mt-1 px-1 text-[11px] text-slate-400">
                  {msg.is_mine ? "You" : msg.sender_name} ·{" "}
                  {new Date(msg.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="mt-3 flex items-end gap-2 border-t border-slate-100 pt-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSend(e);
            }}
            rows={1}
            placeholder="Type a message…"
            className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sendMutation.isPending}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </Modal>
  );
}
