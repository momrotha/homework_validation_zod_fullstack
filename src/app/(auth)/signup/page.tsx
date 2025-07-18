
import RegisterformComponent from "@/app/components/AuthComponents/RegisterformComponent";

import { Toaster } from "sonner";
export default function page() {
  return (
    <div>
      <Toaster />
      <RegisterformComponent/>
    </div>
  )
}
