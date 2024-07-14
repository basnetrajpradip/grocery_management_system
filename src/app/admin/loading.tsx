import { Loader } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex justify-center">
      <Loader className="size-14 animate-spin text-primary" />
    </div>
  );
}
