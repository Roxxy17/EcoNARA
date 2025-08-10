"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TransitionPage from "@/components/ui/transition-page";

const EXCLUDED_PATHS = ["/login", "/register", "/dashboard"]; // tambahkan path yang ingin dikecualikan

export default function TransitionWrapper() {
  const [showTransition, setShowTransition] = useState(false);
  const pathname = usePathname();

  // Cek apakah path sekarang termasuk yang dikecualikan
  const isExcluded = EXCLUDED_PATHS.includes(pathname);

  useEffect(() => {
    if (isExcluded) {
      setShowTransition(false);
      return;
    }
    setShowTransition(true);
    const timer = setTimeout(() => setShowTransition(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname, isExcluded]);

  return showTransition ? (
    <TransitionPage type="navigating" duration={2000} />
  ) : null;
}