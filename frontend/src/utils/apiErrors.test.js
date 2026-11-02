import { describe, it, expect, vi } from "vitest";
import { applyServerErrors } from "./apiErrors";

function makeError(data) {
  return { response: { data } };
}

describe("applyServerErrors", () => {
  it("maps a DRF field error onto the form via setError", () => {
    const setError = vi.fn();
    const showToast = vi.fn();
    applyServerErrors(makeError({ email: ["A user with this email already exists."] }), { setError, showToast });

    expect(setError).toHaveBeenCalledWith("email", { message: "A user with this email already exists." });
    expect(showToast).not.toHaveBeenCalled();
  });

  it("toasts a {detail} auth/permission error instead of setting a field", () => {
    const setError = vi.fn();
    const showToast = vi.fn();
    applyServerErrors(makeError({ detail: "No active account found with the given credentials" }), {
      setError,
      showToast,
    });

    expect(setError).not.toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith("No active account found with the given credentials", { type: "error" });
  });

  it("toasts non_field_errors", () => {
    const showToast = vi.fn();
    applyServerErrors(makeError({ non_field_errors: ["Passwords do not match."] }), { showToast });
    expect(showToast).toHaveBeenCalledWith("Passwords do not match.", { type: "error" });
  });

  it("falls back to a generic toast when there is no response body (network error)", () => {
    const showToast = vi.fn();
    applyServerErrors(new Error("Network Error"), { showToast });
    expect(showToast).toHaveBeenCalledWith("Network Error", { type: "error" });
  });

  it("works without a setError callback (e.g. login page has no per-field form)", () => {
    const showToast = vi.fn();
    expect(() => applyServerErrors(makeError({ detail: "Invalid credentials" }), { showToast })).not.toThrow();
    expect(showToast).toHaveBeenCalledWith("Invalid credentials", { type: "error" });
  });
});
