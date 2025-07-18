
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function handleLogout() {
    // Clear token logic here (if using cookies, you'd call an API route to clear it)
    fetch("/api/logout", { method: "POST" })
      .then(() => {
        toast.success("Logged out successfully");
        router.push("/login");
      })
      .catch(() => {
        toast.error("Logout failed");
      });
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="mb-6">You are successfully logged in.</p>

        <Button
          onClick={handleLogout}
          className="w-full bg-blue-600 text-white rounded-xl"
        >
          Logout
        </Button>
      </div>
    </main>
  );
}
