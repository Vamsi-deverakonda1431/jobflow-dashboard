import { useState } from 'react';
import { Job, JobStatus, JobPriority, JobFilters } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Play, Loader2, Clock, CheckCircle2, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface JobTableProps {
  jobs: Job[];
  filters: JobFilters;
  onRunJob: (jobId: string) => Promise<void>;
  onSelectJob: (job: Job) => void;
  onFilterChange: (filters: Partial<JobFilters>) => void;
  runningJobIds: Set<string>;
}

const statusConfig: Record<JobStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="h-3 w-3" />,
    className: 'status-pending',
  },
  running: {
    label: 'Running',
    icon: <RefreshCw className="h-3 w-3 animate-spin" />,
    className: 'status-running animate-pulse-soft',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: 'status-completed',
  },
};

const priorityConfig: Record<JobPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
};

export function JobTable({
  jobs,
  filters,
  onRunJob,
  onSelectJob,
  onFilterChange,
  runningJobIds,
}: JobTableProps) {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        </div>
        
        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange({ status: val as JobStatus | 'all' })}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(val) => onFilterChange({ priority: val as JobPriority | 'all' })}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground ml-auto">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold">Task Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold hidden sm:table-cell">Created At</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-8 w-8" />
                    <p>No jobs found</p>
                    <p className="text-sm">Create a new job to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => {
                const status = statusConfig[job.status];
                const priority = priorityConfig[job.priority];
                const isRunning = runningJobIds.has(job.id) || job.status === 'running';
                const canRun = job.status !== 'running' && job.status !== 'completed';

                return (
                  <TableRow key={job.id} className="table-row-hover">
                    <TableCell>
                      <button
                        onClick={() => onSelectJob(job)}
                        className="font-medium text-primary hover:underline underline-offset-4 transition-colors text-left"
                      >
                        {job.taskName}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${status.className} gap-1.5`}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={priority.className}>
                        {priority.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {format(job.createdAt, 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={canRun ? 'default' : 'secondary'}
                        onClick={() => onRunJob(job.id)}
                        disabled={!canRun || isRunning}
                        className="min-w-[80px]"
                      >
                        {isRunning ? (
                          <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Running
                          </>
                        ) : job.status === 'completed' ? (
                          'Done'
                        ) : (
                          <>
                            <Play className="mr-1.5 h-3.5 w-3.5" />
                            Run
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
