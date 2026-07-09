'use client';

import { useState } from 'react';
import { atlasTaskStatuses, type AtlasTask, type AtlasTaskStatus } from '@/lib/atlas';

export default function AtlasTaskChecklist({ initialTasks, token }: { initialTasks: AtlasTask[]; token: string }) {
  const [tasks, setTasks] = useState(initialTasks);

  async function updateStatus(task: AtlasTask, status: AtlasTaskStatus) {
    setTasks((items) => items.map((item) => item.id === task.id ? { ...item, status } : item));
    const response = await fetch(`/api/atlas/tasks?token=${encodeURIComponent(token)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task.id, patch: { status } }),
    });

    if (!response.ok) {
      setTasks((items) => items.map((item) => item.id === task.id ? task : item));
    }
  }

  return (
    <section className="panel">
      <h2>Due diligence checklist</h2>
      <div className="atlas-task-list">
        {tasks.map((task) => (
          <div className="atlas-task-row" key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <p>{task.area} • Owner: {task.owner} • Due: {task.dueDate}</p>
            </div>
            <select value={task.status} onChange={(event) => updateStatus(task, event.target.value as AtlasTaskStatus)}>
              {atlasTaskStatuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

