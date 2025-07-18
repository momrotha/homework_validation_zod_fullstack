"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formValidation = z.object({
  carName: z.string().min(2, { message: "Car name is required" }),
  model: z.string().min(2, { message: "Model is required" }),
  year: z.number().min(1900, { message: "Year must be valid" }),
  color: z.string().min(2, { message: "Color is required" }),
});

export default function CreateCarForm() {
  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      carName: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formValidation>) {
    try {
      const res = await fetch("https://car-nextjs-api.cheatdev.online/car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.carName,
          model: values.model,
          year: values.year,
          color: values.color,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Car created successfully!");
        form.reset();
      } else {
        toast.error(data.message || "Failed to create car.");
      }
    } catch (error) {
      console.error("Create car error:", error);
      toast.error("Network error. Please try again later.");
    }
  }

  return (
    <div className="w-[400px] p-8 m-8 mx-auto bg-white shadow-md rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="carName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter car name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter model" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input {...field} type="number" placeholder="Enter year" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter color" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="border rounded-2xl bg-blue-600 p-2 mb-5 w-full text-white font-semibold"
          >
            Create Car
          </Button>
        </form>
      </Form>
    </div>
  );
}
