import { createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listSaved, saveProperty, unsaveProperty } from "../api/saved";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./ToastContext";

const SavedContext = createContext(null);

// PRD section 8: "Saved properties list — SavedContext, synced with the
// /api/saved/ endpoint." Keeps a propertyId -> savedId map so any
// PropertyCard anywhere in the app can show/toggle the heart without each
// one independently re-fetching the whole saved list.
export function SavedProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["saved", "all"],
    queryFn: () => listSaved({ page_size: 100 }),
    enabled: Boolean(user),
  });

  const savedMap = useMemo(() => {
    const map = new Map();
    (data?.results || []).forEach((entry) => map.set(entry.property, entry.id));
    return map;
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: saveProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved"] }),
    onError: () => showToast("Couldn't save this property.", { type: "error" }),
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved"] }),
    onError: () => showToast("Couldn't remove this saved property.", { type: "error" }),
  });

  function isSaved(propertyId) {
    return savedMap.has(propertyId);
  }

  async function toggleSave(propertyId) {
    if (!user) {
      showToast("Log in to save properties.", { type: "error" });
      return;
    }
    if (savedMap.has(propertyId)) {
      await unsaveMutation.mutateAsync(savedMap.get(propertyId));
      showToast("Removed from saved properties.");
    } else {
      await saveMutation.mutateAsync(propertyId);
      showToast("Saved!");
    }
  }

  return (
    <SavedContext.Provider value={{ isSaved, toggleSave, isLoading, savedCount: savedMap.size }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within a SavedProvider");
  return ctx;
}
