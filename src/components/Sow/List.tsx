import { Sow } from "@/types/sow";
import SowCard from "./Card";

export default function SowList({ sows }: { sows: Sow[] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sows.length > 0 ? (
        sows.map((sow, index) => <SowCard key={index} sow={sow} />)
      ) : (
        <div className="text-gray-400 my-72">ไม่พบข้อมูล</div>
      )}
    </div>
  );
}
