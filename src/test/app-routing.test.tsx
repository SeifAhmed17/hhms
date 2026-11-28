import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "@/App";
import { session } from "@/api";

describe("App routing", () => {
  beforeEach(() => {
    session.clear();
    window.history.replaceState({}, "", "/");
  });

  afterEach(cleanup);

  it("redirects an unauthenticated visit to the login page", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Log in" })).toBeInTheDocument();
  });
});
