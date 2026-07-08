"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import styles from "./DraggableVideoCard.module.css";

const CLICK_THRESHOLD_PX = 5;

export default function DraggableVideoCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragState = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, active: false, moved: 0 });

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
      active: true,
      moved: 0,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    dragState.current.moved = Math.max(dragState.current.moved, Math.hypot(dx, dy));
    setOffset({ x: dragState.current.originX + dx, y: dragState.current.originY + dy });
  };

  const handlePointerUp = () => {
    const wasClick = dragState.current.moved < CLICK_THRESHOLD_PX;
    dragState.current.active = false;
    setDragging(false);
    if (wasClick) onClick?.();
  };

  return (
    <div
      className={`${className ?? ""} ${styles.draggable} ${dragging ? styles.dragging : ""}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </div>
  );
}
