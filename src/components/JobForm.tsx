import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateJobPayload, JobPriority } from '@/types/job';
import { Plus, Loader2 } from 'lucide-react';

interface JobFormProps {
  onSubmit: (payload: CreateJobPayload) => Promise<void>;
  isLoading?: boolean;
}

export function JobForm({ onSubmit, isLoading }: JobFormProps) {
  const [taskName, setTaskName] = useState('');
  const [payload, setPayload] = useState('{}');
  const [priority, setPriority] = useState<JobPriority>('medium');
  const [errors, setErrors] = useState<{ taskName?: string; payload?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { taskName?: string; payload?: string } = {};

    if (!taskName.trim()) {
      newErrors.taskName = 'Task name is required';
    }

    try {
      JSON.parse(payload);
    } catch {
      newErrors.payload = 'Payload must be valid JSON';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit({
        taskName: taskName.trim(),
        payload: JSON.parse(payload),
        priority,
      });
      
      // Reset form on success
      setTaskName('');
      setPayload('{}');
      setPriority('medium');
      setErrors({});
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="taskName" className="text-sm font-medium">
          Task Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="taskName"
          placeholder="Enter task name..."
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            if (errors.taskName) setErrors(prev => ({ ...prev, taskName: undefined }));
          }}
          className={errors.taskName ? 'border-destructive focus-visible:ring-destructive' : ''}
          disabled={isLoading}
        />
        {errors.taskName && (
          <p className="text-sm text-destructive animate-fade-in">{errors.taskName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="payload" className="text-sm font-medium">
          Payload (JSON)
        </Label>
        <Textarea
          id="payload"
          placeholder='{"key": "value"}'
          value={payload}
          onChange={(e) => {
            setPayload(e.target.value);
            if (errors.payload) setErrors(prev => ({ ...prev, payload: undefined }));
          }}
          className={`font-mono text-sm min-h-[120px] resize-y ${
            errors.payload ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
          disabled={isLoading}
        />
        {errors.payload && (
          <p className="text-sm text-destructive animate-fade-in">{errors.payload}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm font-medium">
          Priority
        </Label>
        <Select value={priority} onValueChange={(val) => setPriority(val as JobPriority)} disabled={isLoading}>
          <SelectTrigger id="priority" className="w-full">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                Low
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-running" />
                Medium
              </span>
            </SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                High
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </>
        )}
      </Button>
    </form>
  );
}
