// src/app/api/cars/[id]/route.ts
import { NextResponse } from "next/server";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description?: string;
  color: string;
  fuel_type: string;
  transmission: string;
  image: string;
}

// Example: in-memory "database"
let cars: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 25000,
    mileage: 50000,
    description: "Reliable sedan",
    color: "White",
    fuel_type: "Gasoline",
    transmission: "Automatic",
    image: "https://example.com/car1.jpg",
  },
  // add more cars here...
];

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  // Find index of car to update
  const index = cars.findIndex((car) => car.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  // Update car info (basic validation could be added here)
  cars[index] = { ...cars[index], ...body };

  return NextResponse.json({ message: "Car updated successfully", car: cars[index] });
}
