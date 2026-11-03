import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Receipt from "./Receipt";
import { getReceipt } from "../api/payments";

vi.mock("../api/payments", () => ({ getReceipt: vi.fn() }));

function renderReceipt() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/payments/42/receipt"]}>
        <Routes>
          <Route path="/payments/:id/receipt" element={<Receipt />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Receipt", () => {
  it("shows the receipt details for a paid payment", async () => {
    getReceipt.mockResolvedValue({
      id: 42,
      receipt_number: "NF-2026-000042",
      paid_at: "2026-11-03T10:15:00Z",
      purpose: "rent",
      purpose_display: "Rent",
      amount: "1200000.00",
      currency: "NGN",
      payment_method: "bank_transfer",
      tx_ref: "nestfind-abc123",
      flw_transaction_id: "987654",
      payer: { name: "Ngozi Eze", email: "ngozi@example.com" },
      property: { id: 7, title: "2-Bed Flat, GRA", city: "Benin City", state: "Edo", host_name: "Tunde Bakare" },
    });

    renderReceipt();

    expect(await screen.findByText("NF-2026-000042")).toBeInTheDocument();
    expect(getReceipt).toHaveBeenCalledWith("42");
    expect(screen.getByText("₦1,200,000")).toBeInTheDocument();
    expect(screen.getByText("2-Bed Flat, GRA")).toBeInTheDocument();
    expect(screen.getByText("Ngozi Eze")).toBeInTheDocument();
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /print/i })).toBeInTheDocument();
  });
});
