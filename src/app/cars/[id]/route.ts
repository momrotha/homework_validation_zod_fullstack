
import { NextResponse } from "next/server";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description?: string;
  color: string;
  image: string;
}

let cars: Car[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    price: 25000,
    description: "Reliable sedan",
    color: "White",
    image: "https://i.pinimg.com/1200x/54/3a/fe/543afe36a39309aa7b6cf1e18f661648.jpg",
  },

];

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();


  const index = cars.findIndex((car) => car.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  cars[index] = { ...cars[index], ...body };

  return NextResponse.json({ message: "Car updated successfully", car: cars[index] });
}
