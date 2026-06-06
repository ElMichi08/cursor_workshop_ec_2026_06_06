import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { AuthHeader } from "@/components/marketlab/auth-header";
import { Header } from "@/components/marketlab/header";

vi.mock("@/components/marketlab/auth-header-section", () => ({
  AuthHeaderSection: () => null,
}));

vi.mock("@/components/marketlab/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Theme toggle</button>,
}));

describe("AuthHeader", () => {
  it("renders sign-in and sign-up actions when signed out", () => {
    const html = renderToStaticMarkup(
      <AuthHeader user={null} profile={null} />,
    );

    expect(html).toContain("Sign in");
    expect(html).toContain("Sign up");
    expect(html).not.toContain("Sign out");
  });

  it("renders fake balance and sign-out when signed in with profile", () => {
    const html = renderToStaticMarkup(
      <AuthHeader
        user={{ id: "user-1", email: "test@example.com" }}
        profile={{
          first_name: "Ada",
          last_name: "Lovelace",
          balance_cents: 1000000,
        }}
      />,
    );

    expect(html).toContain("$10,000.00 fake");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Sign up");
  });

  it("renders balance unavailable when signed in without profile", () => {
    const html = renderToStaticMarkup(
      <AuthHeader
        user={{ id: "user-1", email: "test@example.com" }}
        profile={null}
      />,
    );

    expect(html).toContain("Balance unavailable");
    expect(html).toContain("Sign out");
    expect(html).not.toContain("Sign in");
    expect(html).not.toContain("Sign up");
  });

  it("renders balance unavailable when profile fetch failed", () => {
    const html = renderToStaticMarkup(
      <AuthHeader
        user={{ id: "user-1", email: "test@example.com" }}
        profile={null}
        profileError="Could not load profile"
      />,
    );

    expect(html).toContain("Balance unavailable");
    expect(html).toContain("Sign out");
  });
});

describe("Header", () => {
  it("still renders markets navigation and theme toggle", () => {
    const html = renderToStaticMarkup(<Header />);

    expect(html).toContain("MarketLab");
    expect(html).toContain("Markets");
    expect(html).toContain("Theme toggle");
  });
});
