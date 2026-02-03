import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Clock, CheckCircle2, RefreshCw, Calendar, FileJson } from 'lucide-react';
import { format } from 'date-fns';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: <Clock className="h-4 w-4" />,
    className: 'status-pending',
  },
  running: {
    label: 'Running',
    icon: <RefreshCw className="h-4 w-4 animate-spin" />,
    className: 'status-running animate-pulse-soft',
  },
  completed: {
    label: 'Completed',
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: 'status-completed',
  },
};

const priorityConfig = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
};

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  if (!job) return null;

  const status = statusConfig[job.status];
  const priority = priorityConfig[job.priority];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            <span className="truncate">{job.taskName}</span>
          </DialogTitle>
          <DialogDescription>
            Job ID: {job.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </span>
              <div>
                <Badge variant="secondary" className={`${status.className} gap-1.5`}>
                  {status.icon}
                  {status.label}
                </Badge>
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Priority
              </span>
              <div>
                <Badge variant="secondary" className={priority.className}>
                  {priority.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Created At
              </span>
              <p className="text-sm">{format(job.createdAt, 'PPpp')}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Updated At
              </span>
              <p className="text-sm">{format(job.updatedAt, 'PPpp')}</p>
            </div>
          </div>

          {/* Payload */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <FileJson className="h-3 w-3" />
              Payload
            </span>
            <pre className="code-block max-h-[200px] overflow-auto text-xs">
              {JSON.stringify(job.payload, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
