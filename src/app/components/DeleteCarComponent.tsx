"use client";

import { useState, useEffect } from "react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
}

export default function DeleteCarComponent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_BASE_URL_PUBLIC_API || "https://car-nextjs-api.cheatdev.online";

  // Fetch car list
  async function fetchCars() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/cars`);
      if (!res.ok) throw new Error("Failed to fetch cars");
      const data = await res.json();
      setCars(data);
    } catch (err: any) {
      setError(err.message || "Error fetching cars");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCars();
  }, []);

  // Delete car by ID
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this car?")) return;

    setDeletingId(id);
    setError(null);

    try {
      const token = localStorage.getItem("authToken"); // or secureLocalStorage.getItem
      if (!token) {
        setError("You must be logged in to delete cars.");
        setDeletingId(null);
        return;
      }

      const res = await fetch(`${API_BASE}/cars/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete car");
      }

      // Remove deleted car from list immediately
      setCars((prev) => prev.filter((car) => car.id !== id));
    } catch (err: any) {
      setError(err.message || "Error deleting car");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Car List</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
      )}

      {loading ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        <ul className="space-y-4">
          {cars.map((car) => (
            <li
              key={car.id}
              className="flex justify-between items-center border p-4 rounded shadow"
            >
              <div>
                <strong>{car.make} {car.model}</strong> - {car.year}
              </div>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={deletingId === car.id}
                onClick={() => handleDelete(car.id)}
              >
                {deletingId === car.id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
