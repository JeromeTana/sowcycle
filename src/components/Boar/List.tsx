import { Boar } from "@/types/boar";
import BoarCard from "./Card";

export default function BoarList({ boars }: { boars: Boar[] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {boars.length > 0 ? (
        boars.map((boar, index) => <BoarCard key={index} boar={boar} />)
      ) : (
        <div className="text-gray-400 my-72">ไม่พบข้อมูล</div>
      )}
    </div>
  );
}
