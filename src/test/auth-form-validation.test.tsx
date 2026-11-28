import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SignupPage from "@/routes/signup";

describe("Signup form validation", () => {
  it("shows Yup validation errors and blocks an incomplete submission", async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("First name is required.")).toBeInTheDocument();
  });
});
