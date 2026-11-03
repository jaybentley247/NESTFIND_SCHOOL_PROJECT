import { describe, it, expect } from "vitest";
import { formatPrice, formatMoney } from "./formatPrice";

describe("formatPrice", () => {
  it("formats a plain amount as Naira with no decimals", () => {
    expect(formatPrice(4500000)).toBe("₦4,500,000");
  });

  it("appends /yr for yearly billing", () => {
    expect(formatPrice(4500000, { billingPeriod: "yearly" })).toBe("₦4,500,000/yr");
  });

  it("appends /mo for monthly billing", () => {
    expect(formatPrice(65000, { billingPeriod: "monthly" })).toBe("₦65,000/mo");
  });

  it("accepts a numeric string, as DRF's DecimalField serializes prices", () => {
    expect(formatPrice("1000000.00")).toBe("₦1,000,000");
  });

  it("omits the period suffix for sale listings (empty billing_period)", () => {
    expect(formatPrice(85000000, { billingPeriod: "" })).toBe("₦85,000,000");
  });
});

describe("formatMoney", () => {
  it("drops .00 on whole amounts", () => {
    expect(formatMoney("1200000.00")).toBe("₦1,200,000");
  });

  it("keeps kobo when the amount has them", () => {
    expect(formatMoney("3200000.50")).toBe("₦3,200,000.50");
  });
});
