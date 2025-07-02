import { Heart } from "lucide-react";
import SowList from "@/components/Sow/List";
import type { Sow } from "@/types/sow";

interface PregnantSowsSectionProps {
  sows: Sow[];
}

export function PregnantSowsSection({ sows }: PregnantSowsSectionProps) {
  if (sows.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-pink-500" />
        <h2 className="text-xl font-semibold">
          แม่พันธุ์ตั้งครรภ์ ({sows.length})
        </h2>
      </div>
      <SowList sows={sows} />
    </div>
  );
}