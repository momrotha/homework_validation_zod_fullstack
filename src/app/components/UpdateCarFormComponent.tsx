"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";

const carSchema = z.object({
  id: z.string(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  color: z.string(),
  image: z.string().url(),
});

type CarFormData = z.infer<typeof carSchema>;

export default function UpdateCarFormComponent({
  defaultValues,
}: {
  defaultValues: CarFormData;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues,
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `https://car-nextjs-api.cheatdev.online/cars/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update car");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 max-w-xl mx-auto"
    >
      {Object.keys(defaultValues).map((key) => {
        if (key === "description") {
          return (
            <div key={key}>
              <Label htmlFor={key}>Description</Label>
              <Textarea
                {...form.register(key as keyof CarFormData)}
                placeholder="Description"
              />
            </div>
          );
        }

        return (
          <div key={key}>
            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
            <Input
              type={key === "year" || key === "price" || key === "mileage" ? "number" : "text"}
              {...form.register(key as keyof CarFormData)}
              disabled={key === "id"} // prevent editing id
            />
          </div>
        );
      })}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Car"}
      </Button>
    </form>
  );
}
