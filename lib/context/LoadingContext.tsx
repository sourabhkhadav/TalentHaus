"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Minimal12BarSpinner } from "@/components/ui/Minimal12BarSpinner";

interface LoadingContextType {
  isLoading: boolean;
  showLoader: (title?: string, message?: string) => void;
  hideLoader: (success?: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showLoader = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        showLoader,
        hideLoader,
      }}
    >
      {children}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center animate-in fade-in duration-100"
        >
          <Minimal12BarSpinner size={50} />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
