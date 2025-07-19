// "use client";

// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();

//   function handleLogout() {
//     fetch("/api/logout", { method: "POST" })
//       .then(() => {
//         toast.success("Logged out successfully");
//         router.push("/login");
//       })
//       .catch(() => {
//         toast.error("Logout failed");
//       });
//   }

//   function goToDashboard() {
//     router.push("/dashboard");
//   }

//   function goToCreateCar() {
//     router.push("/cars");
//   }

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-4">
//         <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
//         <p>You are successfully logged in.</p>

//         <Button
//           onClick={goToDashboard}
//           className="w-full bg-green-600 text-white rounded-xl"
//         >
//           Go to Dashboard
//         </Button>

//         <Button
//           onClick={goToCreateCar}
//           className="w-full bg-purple-600 text-white rounded-xl"
//         >
//           Go to Create Car
//         </Button>

//         <Button
//           onClick={handleLogout}
//           className="w-full bg-blue-600 text-white rounded-xl"
//         >
//           Sign Out
//         </Button>
//       </div>
//     </main>
//   );
// }


"use client";

import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();

  function handleLogout() {
    fetch("/api/logout", { method: "POST" })
      .then(() => {
        toast.success("Logged out successfully");
        router.push("/login");
      })
      .catch(() => {
        toast.error("Logout failed");
      });
  }

  function goToDashboard() {
    router.push("/dashboard");
  }

  function goToCreateCar() {
    router.push("/create-car");
  }
  function goToUpdateCar() {
    router.push("/update-car");
  }

  function goToDeleteCar() {
    router.push("/delete-car");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <p>You are successfully logged in.</p>

        <Button onClick={goToDashboard} className="w-full bg-green-600 text-white rounded-xl">
          Go to Dashboard
        </Button>

        <Button onClick={goToCreateCar} className="w-full bg-purple-600 text-white rounded-xl">
          Go to Create Car
        </Button>
        <Button onClick={goToUpdateCar} className="w-full bg-pink-700 text-white rounded-xl">
          Go to Update Car
        </Button>

        <Button onClick={goToDeleteCar} className="w-full bg-blue-600 text-white rounded-xl">
          Go to Delete Car
        </Button>

        <Button onClick={handleLogout} className="w-full bg-blue-600 text-white rounded-xl">
          Sign Out
        </Button>
      </div>
    </main>
  );
}

