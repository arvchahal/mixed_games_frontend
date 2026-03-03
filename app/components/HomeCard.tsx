import React from "react";

interface HomeCardProps {
  header: React.ReactNode;
  context: React.ReactNode;
}
export default function HomeCard({ header, context }: HomeCardProps) {
  return (
    <div className="p-8">
      <div className="p-6 rounded-lg border-6 border-indigo-500 text-gray-200 bg-[#1e1e2e] w-100">
        <h1 className="text-xl font-bold">{header}</h1>
          <hr className="mt-2 border-gray-300 pb-3" />
        <span className="text-base">{context}</span>
      </div>
    </div>
  );
}
