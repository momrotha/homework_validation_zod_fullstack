"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formValidation = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
});

export default function LoginformComponent() {
  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formValidation>) {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Login successful!");

        // Redirect to home page after success
        router.push("/home");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-[400px] p-8 m-8 mx-auto bg-white shadow-md rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your Email" className="border rounded-2xl mb-5 p-2 w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your Password" className="border rounded-2xl mb-5 p-2 w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={loading}
            className="border rounded-2xl bg-blue-600 p-2 mb-5 w-full text-white font-semibold"
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
