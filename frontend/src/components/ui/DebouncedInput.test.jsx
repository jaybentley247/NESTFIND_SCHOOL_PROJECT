import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DebouncedInput from "./DebouncedInput";

describe("DebouncedInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not call onChange immediately while typing", () => {
    const onChange = vi.fn();
    render(<DebouncedInput value="" onChange={onChange} delay={300} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Lagos" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange once, with the final value, after the debounce delay", () => {
    const onChange = vi.fn();
    render(<DebouncedInput value="" onChange={onChange} delay={300} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Lagos" } });
    vi.advanceTimersByTime(300);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("Lagos");
  });

  it("resets the debounce timer on each keystroke, only firing once after the last one settles", () => {
    const onChange = vi.fn();
    render(<DebouncedInput value="" onChange={onChange} delay={300} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "L" } });
    vi.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: "La" } });
    vi.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: "Lag" } });

    // Only 200ms since the last keystroke — debounce hasn't fired yet.
    vi.advanceTimersByTime(200);
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("Lag");
  });

  it("keeps the input responsive to typing even though onChange is delayed", () => {
    render(<DebouncedInput value="" onChange={vi.fn()} delay={300} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Ab" } });
    expect(input).toHaveValue("Ab");
  });
});
