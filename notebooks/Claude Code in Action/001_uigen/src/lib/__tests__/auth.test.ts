// @vitest-environment node
import { test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("server-only", () => ({}));

const cookieStore = {
  _data: new Map<string, string>(),
  get(name: string) {
    const value = this._data.get(name);
    return value !== undefined ? { value } : undefined;
  },
  set(name: string, value: string) {
    this._data.set(name, value);
  },
  delete(name: string) {
    this._data.delete(name);
  },
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookieStore)),
}));

const { createSession } = await import("../auth");

beforeEach(() => {
  cookieStore._data.clear();
});

afterEach(() => {
  cookieStore._data.clear();
});

test("createSession sets an auth-token cookie", async () => {
  await createSession("user-1", "user@example.com");

  expect(cookieStore._data.has("auth-token")).toBe(true);
  expect(cookieStore._data.get("auth-token")).toBeTruthy();
});

test("createSession token encodes userId and email", async () => {
  await createSession("user-42", "hello@test.com");

  const token = cookieStore._data.get("auth-token")!;
  const payload = JSON.parse(atob(token.split(".")[1]));

  expect(payload.userId).toBe("user-42");
  expect(payload.email).toBe("hello@test.com");
});

test("createSession sets a 7-day expiry", async () => {
  const before = Date.now();
  await createSession("user-1", "user@example.com");
  const after = Date.now();

  const token = cookieStore._data.get("auth-token")!;
  const payload = JSON.parse(atob(token.split(".")[1]));

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(payload.expiresAt).getTime();

  expect(expiresAt).toBeGreaterThanOrEqual(before + sevenDaysMs - 1000);
  expect(expiresAt).toBeLessThanOrEqual(after + sevenDaysMs + 1000);
});

test("createSession with different users produces different tokens", async () => {
  await createSession("user-1", "alice@test.com");
  const token1 = cookieStore._data.get("auth-token");

  cookieStore._data.clear();
  await createSession("user-2", "bob@test.com");
  const token2 = cookieStore._data.get("auth-token");

  expect(token1).not.toBe(token2);
});
