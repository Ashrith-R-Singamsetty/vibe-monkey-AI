import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanCard } from './KanbanCard';
import { Badge } from '@/components/ui/badge';

interface Feature {
  name: string;
  description: string;
  userStory: string;
  acceptanceCriteria: string[];
  priority: "high" | "medium" | "low";
  complexity: "simple" | "moderate" | "complex";
  estimatedHours: number;
  isMVP: boolean;
  dependencies: string[];
}

type Id = string | number;

interface Column {
  id: Id;
  title: string;
}

type Task = Feature & { id: string };

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[350px] h-[500px] bg-muted rounded-lg border-2 border-purple-500 opacity-60"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-full min-h-[500px] flex flex-col bg-muted/50 rounded-lg"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-card text-md font-bold p-3 rounded-t-lg border-b flex items-center justify-between cursor-grab"
      >
        {column.title}
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <div className="flex flex-grow flex-col gap-2 p-2 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={{...task, columnId: column.id}} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
