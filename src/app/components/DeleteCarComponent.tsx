"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const deleteCarSchema = z.object({
  id: z.string().min(1, { message: "Car ID is required" }),
});

export default function DeleteCarFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureLocalStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to delete a car");
    }
  }, []);

  const form = useForm<z.infer<typeof deleteCarSchema>>({
    resolver: zodResolver(deleteCarSchema),
    defaultValues: {
      id: "",
    },
  });

  async function onSubmit(values: z.infer<typeof deleteCarSchema>) {
    setIsLoading(true);
    setMessage("");

    try {
      const token = secureLocalStorage.getItem("authToken") as string;

      if (!token) {
        setMessage("Please login first");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/delete", {
        method: "DELETE",
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
        const textResponse = await res.text();
        console.error("Failed to parse JSON response:", jsonError);
        console.error("Response text:", textResponse);
        setMessage("Server error: Invalid response format");
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        let errorMessage = data.message || "Failed to delete car";
        if (res.status === 403) {
          errorMessage = "Lub Car bos yg create.";
        } else if (res.status === 404) {
          errorMessage = "Car not found. It may have already been deleted.";
        } else if (res.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        }

        setMessage(errorMessage);
        setIsLoading(false);
        return;
      }

      setMessage("Car deleted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while deleting the car");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800 mb-2">
            You need to login to delete a car.
          </p>
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

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Car ID
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Car ID"
                    className="border-gray-300 focus:ring-2 focus:ring-red-500 rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? "Deleting..." : "Delete Car"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
