import { describe, it, expect } from "vitest";
import { buildQueryString } from "./buildQueryString";

describe("buildQueryString", () => {
  it("builds a query string matching the PRD's example filter shape", () => {
    const qs = buildQueryString({
      city: "Lagos",
      type: "apartment",
      listing_type: "rent",
      min_price: 1000000,
      max_price: 3000000,
      bedrooms: 3,
      ordering: "-created_at",
      page: 2,
    });
    const params = new URLSearchParams(qs);
    expect(params.get("city")).toBe("Lagos");
    expect(params.get("type")).toBe("apartment");
    expect(params.get("min_price")).toBe("1000000");
    expect(params.get("page")).toBe("2");
  });

  it("joins array values (amenities) with commas", () => {
    expect(buildQueryString({ amenities: ["wifi", "parking"] })).toBe("amenities=wifi%2Cparking");
  });

  it("drops empty, null, and undefined values entirely", () => {
    expect(buildQueryString({ city: "", type: undefined, bedrooms: null, page: 1 })).toBe("page=1");
  });

  it("drops an empty array entirely rather than emitting an empty param", () => {
    expect(buildQueryString({ amenities: [] })).toBe("");
  });

  it("returns an empty string for no filters", () => {
    expect(buildQueryString()).toBe("");
    expect(buildQueryString({})).toBe("");
  });
});
