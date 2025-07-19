"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

const updateCarSchema = z.object({
  id: z.string().min(1, { message: "Make is required" }),
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.coerce
    .number()
    .gte(1886)
    .lte(new Date().getFullYear(), {
      message: `Year must be between 1886 and ${new Date().getFullYear()}`,
    }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  mileage: z.coerce.number().nonnegative({ message: "Mileage cannot be negative" }),
  description: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  fuel_type: z.string().min(1, { message: "Fuel type is required" }),
  transmission: z.string().min(1, { message: "Transmission is required" }),
  image: z.string().url({ message: "Must be a valid image URL" }),
});

export default function UpdateCarFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureLocalStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to update a car");
    }
  }, []);

  const form = useForm<z.infer<typeof updateCarSchema>>({
    resolver: zodResolver(updateCarSchema),
    defaultValues: {
      id: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      description: "",
      color: "",
      image: "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateCarSchema>) {
    setIsLoading(true);
    setMessage("");

    try {
      const token = secureLocalStorage.getItem("authToken") as string;

      if (!token) {
        setMessage("Please login first");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to update car");
        setIsLoading(false);
        return;
      }

      setMessage("Car updated successfully!");
    } catch (error) {
      setMessage("An error occurred while updating the car");
    } finally {
      setIsLoading(false);
    }
  }

  const fields = [
    "id",
    "make",
    "model",
    "year",
    "price",
    "color",
    "image",
  ] as const;

  return (
    <div className="max-w-xl mx-auto">
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800 mb-2">You need to login to update a car.</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          {message && (
            <div
              className={`p-3 rounded-md ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {fields.map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                      {fieldName.replace("_", " ")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={
                          ["year", "price", "mileage"].includes(fieldName)
                            ? "number"
                            : "text"
                        }
                        placeholder={` ${fieldName}`}
                        className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the car..."
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? "Updating..." : "Update Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
