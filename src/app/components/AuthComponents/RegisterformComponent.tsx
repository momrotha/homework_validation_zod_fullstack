"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

const formValidation = z
  .object({
    username: z.string().min(2, { message: "At least input 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    confirmed_password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: "Password and Confirm Password didn't match",
    path: ["confirmed_password"],
  });

export default function RegisterformComponent() {
  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmed_password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formValidation>) {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Register successfully", {
          action: {
            label: "Undo",
            onClick: () => console.log("Undo clicked"),
          },
        });
        form.reset();
      } else {
        toast.error(data.message || "Failed to register user");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Network error, please try again later.");
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your username" className="border rounded-2xl p-2 mb-5 w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmed_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmed password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your confirmed password" className="border rounded-2xl mb-5 p-2 w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="outline"
            type="submit"
            className="border rounded-2xl bg-blue-600 p-2 mb-5 w-full text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Link href="/login" className="text-blue-600 font-semibold text-center block">
            Login
          </Link>
        </form>
      </Form>
    </div>
  );
}
