"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="text-sm font-medium text-mint-700 underline underline-offset-2 hover:text-mint-600"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
    >
      Sign out
    </button>
  );
}
