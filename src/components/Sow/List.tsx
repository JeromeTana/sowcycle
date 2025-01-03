import { Sow } from "@/types/sow";
import SowCard from "./Card";

export default function SowList({ sows }: { sows: Sow[] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {sows.map((sow, index) => (
        <SowCard key={index} sow={sow} />
      ))}
    </div>
  );
}
