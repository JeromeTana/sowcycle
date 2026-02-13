import React from "react";

export default function CountdownBadge({ date }: { date: any }) {
  return (
    <span className="text-sm inline-flex gap-1 items-center bg-primary text-white py-1 px-2 rounded-full">
      คลอดใน{" "}
      {Math.floor(
        (new Date(date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1}{" "}
      วัน
    </span>
  );
}
