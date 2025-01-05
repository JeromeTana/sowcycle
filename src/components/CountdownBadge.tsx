import React from "react";

export default function CountdownBadge({ date }: { date: any }) {
  return (
    <p className="text-sm inline-flex gap-1 items-center bg-pink-500 text-white py-1 px-2 rounded-full">
      คลอดใน{" "}
      {Math.ceil(
        (new Date(date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )}{" "}
      วัน
    </p>
  );
}
