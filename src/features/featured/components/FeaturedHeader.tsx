import { Star } from "lucide-react";
import BackButton from "@/src/shared/ui/BackButton";
import type { FeaturedHeaderProps } from "../types";

// Component for the header of the featured products section
export function FeaturedHeader({ featuredCount }: FeaturedHeaderProps) {
  return (
    <div className="mb-8 flex flex-col">
      <BackButton />
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-amber-600 to-yellow-600 dark:from-amber-200 dark:to-yellow-600 bg-clip-text text-transparent">
            Featured Products
          </span>
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Manage which products appear in the homepage featured section
        </p>
        <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-bold text-amber-400">{featuredCount}</span>{" "}
            featured products
          </span>
        </div>
      </div>
    </div>
  );
}
