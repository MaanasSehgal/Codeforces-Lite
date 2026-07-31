import React, { useState, useCallback, useEffect, useRef } from "react";

interface ResizablePanelProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
  initialHeight?: number;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  top,
  bottom,
  initialHeight = 60,
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add("user-select-none");
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove("user-select-none");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerHeight = containerRect.height;
        const relativeY = e.clientY - containerRect.top;
        const newHeight = (relativeY / containerHeight) * 100;
        setHeight(Math.min(Math.max(10, newHeight), 80));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div ref={containerRef} className="flex flex-col w-full h-full relative">
      <div style={{ height: `${height}%` }} className="w-full overflow-auto">
        {top}
      </div>
      <div
        className="h-1 w-full cursor-row-resize bg-gray-300 hover:bg-blue-500 active:bg-blue-700"
        onMouseDown={handleMouseDown}
      />
      <div style={{ height: `${100 - height}%` }} className="w-full overflow-auto">
        {bottom}
      </div>
    </div>
  );
};
