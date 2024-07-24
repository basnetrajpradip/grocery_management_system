import { Loader } from "lucide-react";

export default function UserLoading() {
  return (
    <div className="flex justify-center">
      <Loader className="size-14 animate-spin text-primary" />
    </div>
  );
}
