"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string;
  color: string;
}

export default function DashboardPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = secureLocalStorage.getItem("authToken");
        if (!token) {
          alert("No token found, please login");
          router.push("/login"); // redirect to login if no token
          return;
        }

        const res = await fetch("https://car-nextjs-api.cheatdev.online/cars", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          alert("Failed to load cars");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCars(data);
      } catch (error) {
        alert("Error loading cars");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [router]);

  if (loading) return <p>Loading cars...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Car List</h1>
      {cars.length === 0 ? (
        <p>No cars found. Please add some cars.</p>
      ) : (
        <ul className="space-y-4">
          {cars.map((car) => (
            <li key={car.id} className="border p-4 rounded shadow flex items-center gap-4">
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className="w-24 h-16 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
                <p>Year: {car.year}</p>
                <p>Price: ${car.price}</p>
                <p>Color: {car.color}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
