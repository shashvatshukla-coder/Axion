import { useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KanbanColumn {
  id: string;
  title: string;
}

interface KanbanBoardProps<T extends { id: string }> {
  columns: KanbanColumn[];
  items: T[];
  getColumn: (item: T) => string;
  getTitle: (item: T) => string;
  onMove: (item: T, columnId: string) => void;
  renderCard: (item: T) => ReactNode;
  columnWidth?: string;
}

/**
 * Drag-and-drop board built on native HTML5 drag events.
 * Touch and keyboard users can use the "Move to" select on each card instead of dragging.
 */
export function KanbanBoard<T extends { id: string }>({
  columns,
  items,
  getColumn,
  getTitle,
  onMove,
  renderCard,
  columnWidth = "w-72",
}: KanbanBoardProps<T>) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  const handleDrop = (e: DragEvent<HTMLElement>, columnId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    const item = items.find((i) => i.id === id);
    if (item && getColumn(item) !== columnId) onMove(item, columnId);
    setDragId(null);
    setOverColumn(null);
  };

  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      {columns.map((col) => {
        const colItems = items.filter((i) => getColumn(i) === col.id);
        const isOver = overColumn === col.id;
        return (
          <section
            key={col.id}
            aria-label={col.title}
            className={cn(
              "flex max-h-[70vh] shrink-0 flex-col rounded-2xl border bg-surface2/50 transition-colors",
              columnWidth,
              isOver ? "border-accent bg-accent/5" : "border-line",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              if (overColumn !== col.id) setOverColumn(col.id);
            }}
            onDragLeave={() => setOverColumn((c) => (c === col.id ? null : c))}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <header className="flex items-center justify-between px-3.5 py-3">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <span className="rounded-md bg-surface px-1.5 font-mono text-[11px] text-muted">
                {colItems.length}
              </span>
            </header>
            <div className="flex-1 space-y-2.5 overflow-y-auto px-2.5 pb-2.5">
              {colItems.length === 0 && (
                <p className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-xs text-muted">
                  Drop a card here
                </p>
              )}
              {colItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDragId(item.id);
                  }}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverColumn(null);
                  }}
                  className={cn(
                    "cursor-grab rounded-xl border border-line bg-surface p-3 text-sm shadow-sm active:cursor-grabbing",
                    dragId === item.id && "opacity-40",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">{renderCard(item)}</div>
                  </div>
                  <select
                    aria-label={`Move ${getTitle(item)} to another column`}
                    value={col.id}
                    onChange={(e) => onMove(item, e.target.value)}
                    className="mt-3 h-8 w-full rounded-lg border border-line bg-surface2 px-2 text-xs text-muted focus:outline-none focus:ring-2 focus:ring-accent/25"
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>
                        Move to: {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
