import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "../use-auth";

// --- mocks ---

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

// --- helpers ---

const noAnonWork = () => (getAnonWorkData as any).mockReturnValue(null);
const withAnonWork = (messages = [{ id: "1" }], fileSystemData = {}) =>
  (getAnonWorkData as any).mockReturnValue({ messages, fileSystemData });
const withProjects = (projects = [{ id: "proj-1" }]) =>
  (getProjects as any).mockResolvedValue(projects);
const noProjects = () => (getProjects as any).mockResolvedValue([]);
const withCreatedProject = (id = "new-proj") =>
  (createProject as any).mockResolvedValue({ id });

// --- tests ---

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    noAnonWork();
    withProjects();
    withCreatedProject();
  });

  // --- initial state ---

  test("isLoading starts false", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(false);
  });

  test("exposes signIn, signUp and isLoading", () => {
    const { result } = renderHook(() => useAuth());
    expect(typeof result.current.signIn).toBe("function");
    expect(typeof result.current.signUp).toBe("function");
    expect(typeof result.current.isLoading).toBe("boolean");
  });

  // --- signIn happy path ---

  describe("signIn", () => {
    test("calls signIn action with email and password", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "password123");
      });

      expect(signInAction).toHaveBeenCalledWith("user@test.com", "password123");
    });

    test("returns the result from signIn action", async () => {
      (signInAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.signIn("user@test.com", "pass");
      });

      expect(returnValue).toEqual({ success: true });
    });

    test("sets isLoading to true while signing in then resets to false", async () => {
      let resolveSignIn!: (v: any) => void;
      (signInAction as any).mockReturnValue(
        new Promise((r) => (resolveSignIn = r))
      );

      const { result } = renderHook(() => useAuth());

      // kick off but don't await — isLoading should flip to true
      let signInPromise: Promise<any>;
      act(() => { signInPromise = result.current.signIn("a@b.com", "pass"); });

      await waitFor(() => expect(result.current.isLoading).toBe(true));

      // resolve and confirm it resets
      await act(async () => {
        resolveSignIn({ success: false });
        await signInPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("resets isLoading to false on failure result", async () => {
      (signInAction as any).mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("bad@user.com", "wrong");
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("resets isLoading to false when action throws", async () => {
      (signInAction as any).mockRejectedValue(new Error("network error"));
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("a@b.com", "pass").catch(() => {});
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("does not navigate when sign-in fails", async () => {
      (signInAction as any).mockResolvedValue({
        success: false,
        error: "Invalid credentials",
      });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("a@b.com", "wrong");
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  // --- signUp happy path ---

  describe("signUp", () => {
    test("calls signUp action with email and password", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("new@user.com", "newpass123");
      });

      expect(signUpAction).toHaveBeenCalledWith("new@user.com", "newpass123");
    });

    test("returns the result from signUp action", async () => {
      (signUpAction as any).mockResolvedValue({
        success: false,
        error: "Email already registered",
      });
      const { result } = renderHook(() => useAuth());

      let returnValue: any;
      await act(async () => {
        returnValue = await result.current.signUp("taken@user.com", "pass");
      });

      expect(returnValue).toEqual({
        success: false,
        error: "Email already registered",
      });
    });

    test("resets isLoading to false after signUp", async () => {
      (signUpAction as any).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("new@user.com", "pass");
      });

      expect(result.current.isLoading).toBe(false);
    });

    test("resets isLoading to false when signUp action throws", async () => {
      (signUpAction as any).mockRejectedValue(new Error("db error"));
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("a@b.com", "pass").catch(() => {});
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  // --- post sign-in navigation ---

  describe("post sign-in navigation", () => {
    beforeEach(() => {
      (signInAction as any).mockResolvedValue({ success: true });
      (signUpAction as any).mockResolvedValue({ success: true });
    });

    test("redirects to anon work project when anon messages exist", async () => {
      withAnonWork([{ id: "msg-1" }], { "/App.jsx": {} });
      (createProject as any).mockResolvedValue({ id: "migrated-proj" });

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signIn("a@b.com", "pass");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringContaining("Design from"),
        messages: [{ id: "msg-1" }],
        data: { "/App.jsx": {} },
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/migrated-proj");
    });

    test("does not migrate anon work when messages array is empty", async () => {
      withAnonWork([], {});

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signIn("a@b.com", "pass");
      });

      expect(createProject).not.toHaveBeenCalledWith(
        expect.objectContaining({ messages: [] })
      );
      // should fall through to getProjects path
      expect(getProjects).toHaveBeenCalled();
    });

    test("redirects to most recent existing project when no anon work", async () => {
      noAnonWork();
      withProjects([{ id: "recent-proj" }, { id: "older-proj" }]);

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signIn("a@b.com", "pass");
      });

      expect(mockPush).toHaveBeenCalledWith("/recent-proj");
      expect(createProject).not.toHaveBeenCalled();
    });

    test("creates a new project and redirects when user has no projects", async () => {
      noAnonWork();
      noProjects();
      (createProject as any).mockResolvedValue({ id: "brand-new" });

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signIn("a@b.com", "pass");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #\d+/),
        messages: [],
        data: {},
      });
      expect(mockPush).toHaveBeenCalledWith("/brand-new");
    });

    test("post sign-in runs the same navigation logic for signUp", async () => {
      noAnonWork();
      withProjects([{ id: "signup-proj" }]);

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signUp("new@user.com", "pass");
      });

      expect(mockPush).toHaveBeenCalledWith("/signup-proj");
    });

    test("clears anon work before navigating to migrated project", async () => {
      withAnonWork([{ id: "m1" }], {});
      (createProject as any).mockResolvedValue({ id: "migrated" });

      const callOrder: string[] = [];
      (clearAnonWork as any).mockImplementation(() =>
        callOrder.push("clearAnonWork")
      );
      mockPush.mockImplementation(() => callOrder.push("push"));

      const { result } = renderHook(() => useAuth());
      await act(async () => {
        await result.current.signIn("a@b.com", "pass");
      });

      expect(callOrder).toEqual(["clearAnonWork", "push"]);
    });
  });
});
