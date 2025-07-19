import LoginformComponent from "@/app/components/AuthComponents/LoginformComponent";


import { Toaster } from "sonner";

export default function page() {
  return (
    <div>
      <Toaster />
      <LoginformComponent/>
    </div>
  )
}
