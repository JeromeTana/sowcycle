import { Sow } from "@/types/sow";
import SowCard from "./Card";
import { FadeIn } from "../animations/FadeIn";

export default function SowList({ sows }: { sows: Sow[] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sows.length > 0 ? (
        sows.map((sow, index) => (
          <FadeIn key={index} delay={index * 0.1} className="w-full">
            <SowCard sow={sow} />
          </FadeIn>
        ))
      ) : (
        <div className="text-gray-400 my-72">ไม่พบข้อมูล</div>
      )}
    </div>
  );
}
