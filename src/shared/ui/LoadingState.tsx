import { LoadingStateProps } from "@/src/types/types";

// Loading state component shown while data is being fetched
export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">{message}</div>
        </div>
      </div>
    </div>
  );
}
