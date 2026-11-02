// DRF validation errors come back as {"field_name": ["message", ...]} (or
// {"detail": "message"} for auth failures / permission errors). Maps them
// onto React Hook Form fields where possible, falling back to a toast —
// PRD section 9: "Toast notifications ... including DRF validation errors
// surfaced field-by-field."
export function applyServerErrors(error, { setError, showToast }) {
  const data = error.response?.data;

  if (!data) {
    showToast(error.message || "Something went wrong. Please try again.", { type: "error" });
    return;
  }

  if (data.detail) {
    showToast(data.detail, { type: "error" });
    return;
  }

  let handledAsFieldError = false;
  Object.entries(data).forEach(([field, messages]) => {
    if (field === "non_field_errors") return;
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (setError) {
      setError(field, { message });
      handledAsFieldError = true;
    }
  });

  if (data.non_field_errors) {
    showToast(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors, { type: "error" });
    return;
  }

  if (!handledAsFieldError) {
    showToast("Something went wrong. Please try again.", { type: "error" });
  }
}
