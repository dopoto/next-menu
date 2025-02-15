"use client";

import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { type AdminRoute } from "../_domain/routes";
import { createPortal } from "react-dom";

export function CollapsibleNavItem({
  activeRoute,
  siblings,
}: {
  activeRoute: AdminRoute & { displayMode: "link" | "text" };
  siblings: AdminRoute[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [leftOffset, setLeftOffset] = useState(0);

  const updateLeftOffset = useCallback(() => {
    if (parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setLeftOffset(rect.left);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    updateLeftOffset();

    // Update the offset when the window resizes
    window.addEventListener("resize", updateLeftOffset);
    return () => {
      window.removeEventListener("resize", updateLeftOffset);
    };
  }, [updateLeftOffset]);

  const collapsibleContent = (
    <CollapsibleContent
      ref={contentRef}
      className="bg-popover absolute top-12 z-50 mt-1 w-fit space-y-2 rounded-md border p-2 shadow-md"
      style={{
        left: `${leftOffset}px`,
        minWidth: contentRef.current?.offsetWidth ?? undefined,
      }}
    >
      {siblings.map((s) => (
        <div
          key={s.path}
          className="hover:bg-secondary/50 px-4 py-2 font-mono text-sm"
        >
          <Link href={s.path}>{s.name}</Link>
        </div>
      ))}
    </CollapsibleContent>
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="relative font-mono"
      ref={parentRef}
    >
      <div className="flex items-center justify-between space-x-2">
        <h4 className="text-sm font-semibold">
          {activeRoute.displayMode === "link" ? (
            <Link href={activeRoute.path}>{activeRoute.name}</Link>
          ) : (
            <>{activeRoute.name}</>
          )}
        </h4>
        {siblings.length > 0 && (
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        )}
      </div>
      {isMounted && createPortal(collapsibleContent, document.body)}
    </Collapsible>
  );
}
