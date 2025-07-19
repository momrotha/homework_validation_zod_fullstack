"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .refine((val) => /^\d{4}$/.test(val), { message: "Year must be 4 digits" }),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Price must be a number" }),
  description: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  image: z.string().url("Image must be a valid URL"),
});

type CarForm = z.infer<typeof carFormSchema>;

export default function CreateCarFormComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CarForm>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      description: "",
      color: "",
      image: "",
    },
  });

  const onSubmit = async (values: CarForm) => {
    const token = secureLocalStorage.getItem("authToken");
    if (!token) {
      alert("You must login first to create a car.");
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("https://car-nextjs-api.cheatdev.online/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          make: values.make,
          model: values.model,
          year: Number(values.year),
          price: Number(values.price),
          description: values.description,
          color: values.color,
          image: values.image,
        }),
      });

      if (response.status === 401) {
        alert("Unauthorized! Please login again.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Failed to create car"));
        return;
      }

      toast.success("Car created successfully!");
      router.push("/dashboard");
    } catch (error) {
      alert("Unexpected error: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a New Car</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "make", label: "Make", type: "string" },
            { name: "model", label: "Model", type: "string" },
            { name: "year", label: "Year", type: "number" },
            { name: "price", label: "Price ($)", type: "number" },
            { name: "description", label: "Description", type: "text" },
            { name: "color", label: "Color", type: "text" },
            { name: "image", label: "Image URL", type: "string" },
          ].map(({ name, label, type }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof CarForm}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input placeholder={label} type={type} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
