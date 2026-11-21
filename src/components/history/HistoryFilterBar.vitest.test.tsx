import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HistoryFilterBar } from "./HistoryFilterBar";

describe("HistoryFilterBar Component", () => {
  it("renders inputs for search, asset type, status, participant, and date range", () => {
    const value = { kind: "all" as const };
    render(<HistoryFilterBar value={value} onChange={vi.fn()} />);

    expect(screen.getByRole("search")).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by asset/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by participant/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter from date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filter to date/i)).toBeInTheDocument();
  });

  it("calls onChange when asset filter is modified", () => {
    const onChange = vi.fn();
    render(<HistoryFilterBar value={{ kind: "all" }} onChange={onChange} />);

    const select = screen.getByLabelText(/filter by asset/i);
    fireEvent.change(select, { target: { value: "USDC" } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ assetCode: "USDC" })
    );
  });

  it("calls onChange when start and end dates are specified", () => {
    const onChange = vi.fn();
    render(<HistoryFilterBar value={{ kind: "all" }} onChange={onChange} />);

    const fromInput = screen.getByLabelText(/filter from date/i);
    const toInput = screen.getByLabelText(/filter to date/i);

    fireEvent.change(fromInput, { target: { value: "2026-01-01" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ fromDate: "2026-01-01" })
    );

    fireEvent.change(toInput, { target: { value: "2026-01-31" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ toDate: "2026-01-31" })
    );
  });

  it("allows clearing all filters when active", () => {
    const onChange = vi.fn();
    render(
      <HistoryFilterBar
        value={{ kind: "all", assetCode: "XLM", fromDate: "2026-01-01" }}
        onChange={onChange}
      />
    );

    const clearBtn = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearBtn);

    expect(onChange).toHaveBeenCalledWith({ kind: "all" });
  });
});
