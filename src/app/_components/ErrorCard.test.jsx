import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorCard } from "./ErrorCard";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ErrorCard", () => {
  const mockOnReset = jest.fn();
  const mockRouterRefresh = jest.fn();

  it("renders error details correctly", () => {
    render(
      <ErrorCard
        publicErrorMessage="123-ab|Something went wrong"
        errorDigest="digest123"
        onReset={mockOnReset}
      />,
    );

    expect(screen.getByText("An error occurred")).toBeInTheDocument();
    expect(screen.getByText("Reference number")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("Error details")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders default error details when no publicErrorMessage is provided", () => {
    render(<ErrorCard onReset={mockOnReset} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getByText("Unknown error")).toBeInTheDocument();
  });

  it("calls refresh and onReset when 'Try again' is clicked", () => {
    render(<ErrorCard onReset={mockOnReset} />);

    const tryAgainButton = screen.getByText("Try again");
    fireEvent.click(tryAgainButton);

    expect(mockRouterRefresh).toHaveBeenCalled();
    expect(mockOnReset).toHaveBeenCalled();
  });

  it("renders support link with correct href", () => {
    render(
      <ErrorCard
        publicErrorMessage="123|Something went wrong"
        onReset={mockOnReset}
      />,
    );

    const supportLink = screen.getByText("Request support").closest("a");
    expect(supportLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
    expect(supportLink).toHaveAttribute(
      "href",
      expect.stringContaining("error 123"),
    );
  });

  it("renders additional info text", () => {
    render(<ErrorCard onReset={mockOnReset} />);

    expect(
      screen.getByText(
        "The details of this error have been logged automatically and we have been notified about it, so you don't need to report it.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "If you want to send an inquiry about this error to our customer support, please use the link below.",
      ),
    ).toBeInTheDocument();
  });
});
