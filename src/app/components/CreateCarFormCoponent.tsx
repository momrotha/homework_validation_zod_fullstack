"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useRouter } from "next/navigation";

const carFormSchema = z.object({
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z
    .coerce.number()
    .int()
    .gte(1886, { message: "Year must be at least 1886" })
    .lte(new Date().getFullYear(), {
      message: `Year cannot be greater than ${new Date().getFullYear()}`,
    }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  mileage: z.coerce.number().nonnegative({ message: "Mileage cannot be negative" }),
  description: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  fuel_type: z.string().min(1, { message: "Fuel type is required" }),
  transmission: z.string().min(1, { message: "Transmission is required" }),
  image: z.string().url({ message: "Must be a valid image URL" }),
});

export default function CreateCarFormComponent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_PUBLIC_API || "";

  useEffect(() => {
    const token = secureLocalStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to create a car");
    }
  }, []);

  const form = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema) as any,
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      description: "",
      color: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof carFormSchema>) {
    setIsLoading(true);
    setMessage("");

    try {
      const token = secureLocalStorage.getItem("authToken") as string;
      console.log("Token:", token);

      if (!token) {
        setMessage("Please login first");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        const text = await res.text();
        console.error("Failed to parse JSON:", jsonError, text);
        setMessage("Server error: Invalid response format");        
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        if (res.status === 401) {
          setMessage("Unauthorized. Please login again.");
          setIsAuthenticated(false);
        } else {
          setMessage(data.message || "Failed to create car");
        }
        setIsLoading(false);
        return;
      }

      setMessage("Car created successfully!");
      form.reset();

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while creating the car");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800 mb-2">You need to login to create a car.</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes("success")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {[
            "make",
            "model",
            "year",
            "price",
            "color",
            "image",
          ].map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as keyof z.infer<typeof carFormSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{fieldName.replace(/_/g, " ")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={["year", "price", "mileage"].includes(fieldName) ? "number" : "text"}
                      placeholder={`Enter ${fieldName.replace(/_/g, " ")}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe the car..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading || !isAuthenticated}>
            {isLoading ? "Creating..." : "Create Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
