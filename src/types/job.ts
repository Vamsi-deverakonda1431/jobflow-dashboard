export type JobStatus = 'pending' | 'running' | 'completed';
export type JobPriority = 'low' | 'medium' | 'high';

export interface Job {
  id: string;
  taskName: string;
  payload: Record<string, unknown>;
  status: JobStatus;
  priority: JobPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobPayload {
  taskName: string;
  payload: Record<string, unknown>;
  priority: JobPriority;
}

export interface JobFilters {
  status: JobStatus | 'all';
  priority: JobPriority | 'all';
}
