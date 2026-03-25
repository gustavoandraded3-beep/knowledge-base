"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ articleId }: { articleId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    fetch(`/api/views/${articleId}`, { method: "POST" }).catch(() => {});
  }, [articleId]);

  return null;
}