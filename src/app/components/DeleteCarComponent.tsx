// components/DeleteCarButton.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteCarButtonProps {
  id: string;
}

export function DeleteCarButton({ id }: DeleteCarButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this car?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://car-nextjs-api.cheatdev.online/cars/${id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Car deleted successfully");
      router.refresh(); // Refresh current page
    } catch (error) {
      toast.error("Error deleting car");
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="bg-red-600 text-white rounded-xl"
    >
      Delete
    </Button>
  );
}
