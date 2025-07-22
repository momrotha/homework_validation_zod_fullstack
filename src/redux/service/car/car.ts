import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CarResponseType } from "@/lib/cars/CarResponse"; // adjust as needed
import { headers } from "next/headers";
import { CarCreateType,CarUpdateType } from "@/lib/cars/CarResponse";
export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_PUBLIC_API,
  }),
  endpoints: (builder) => ({
    getCars: builder.query<CarResponseType[], { page: number; limit: number }>({
      query: ({ page, limit }) => `cars?skip=${page}&limit=${limit}`,
    }),
    getCarById: builder.query<CarResponseType, string>({
      query: (id) => `cars/${id}`,
    }),
    // create car 
    createCar: builder.mutation<CarResponseType, { newCar: CarCreateType; accessToken: string }>({
    query: ({ newCar, accessToken }) => ({
    url: 'cars',
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: newCar,
        }),
    }),
    // update car
    updateCar: builder.mutation<CarResponseType, { updateCar: CarUpdateType; accessToken: string,id:string}>({
    query: ({ updateCar, accessToken,id }) => ({
    url: `cars/${id}`,
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: updateCar,
        }),
    }),
    // delete car
    deleteCar: builder.mutation<CarResponseType, {accessToken: string,id:string}>({
    query: ({accessToken,id }) => ({
    url: `cars/${id}`,
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
        }),
    }),
    
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation
} = carApi;
