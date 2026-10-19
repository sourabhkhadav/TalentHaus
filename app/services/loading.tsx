import React from "react";
import { Minimal12BarSpinner } from "@/components/ui/Minimal12BarSpinner";

export default function ServicesLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Minimal12BarSpinner size={50} />
    </div>
  );
}
