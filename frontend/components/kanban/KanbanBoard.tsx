import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { createPortal } from 'react-dom';

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

interface KanbanBoardProps {
  phases: { phase: string; features: string[] }[];
  allFeatures: Feature[];
}

type Id = string | number;

interface Column {
  id: Id;
  title: string;
}

type Task = Feature & { id: string };

export function KanbanBoard({ phases, allFeatures }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Record<Id, Task[]>>({});
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const initialColumns: Column[] = [
      ...phases.map(p => ({ id: p.phase, title: p.phase })),
      { id: 'done', title: 'Done' }
    ];
    setColumns(initialColumns);

    const featureMap = new Map(allFeatures.map(f => [f.name, { ...f, id: f.name }]));
    const initialTasks: Record<Id, Task[]> = {};
    initialColumns.forEach(col => initialTasks[col.id] = []);

    phases.forEach(phase => {
      initialTasks[phase.phase] = phase.features
        .map(featureName => featureMap.get(featureName))
        .filter((f): f is Task => !!f);
    });

    setTasks(initialTasks);
  }, [phases, allFeatures]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    if (!isActiveATask) return;

    const activeColumnId = active.data.current?.task.columnId;
    const overColumnId = over.data.current?.task?.columnId || over.id;

    if (activeColumnId === overColumnId) {
      // Reordering within the same column
      setTasks(prev => {
        const taskOrder = prev[activeColumnId];
        const oldIndex = taskOrder.findIndex(t => t.id === activeId);
        const newIndex = taskOrder.findIndex(t => t.id === overId);
        return {
          ...prev,
          [activeColumnId]: arrayMove(taskOrder, oldIndex, newIndex),
        };
      });
    } else {
      // Moving to a different column
      setTasks(prev => {
        const activeTasks = [...prev[activeColumnId]];
        const overTasks = [...prev[overColumnId]];

        const activeIndex = activeTasks.findIndex(t => t.id === activeId);
        const [movedTask] = activeTasks.splice(activeIndex, 1);

        const overIndex = over.data.current?.type === 'Task'
          ? overTasks.findIndex(t => t.id === overId)
          : overTasks.length;
        
        overTasks.splice(overIndex, 0, movedTask);

        return {
          ...prev,
          [activeColumnId]: activeTasks,
          [overColumnId]: overTasks,
        };
      });
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-2">
        <SortableContext items={columns.map(c => c.id)}>
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasks[col.id] || []}
            />
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask && <KanbanCard task={activeTask} isOverlay />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
