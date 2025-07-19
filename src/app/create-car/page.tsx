
import CreateCarFormComponent from "@/app/components/CreateCarFormCoponent";

export default function CreateCarPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create New Car</h1>
      <CreateCarFormComponent />
    </div>
  );
}
