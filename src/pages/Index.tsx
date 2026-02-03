import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { JobForm } from '@/components/JobForm';
import { JobTable } from '@/components/JobTable';
import { JobDetailModal } from '@/components/JobDetailModal';
import { useJobs } from '@/hooks/useJobs';
import { Job, CreateJobPayload } from '@/types/job';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, ListTodo } from 'lucide-react';

const Index = () => {
  const { jobs, filters, isLoading, createJob, runJob, updateFilters, refreshJobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [runningJobIds, setRunningJobIds] = useState<Set<string>>(new Set());

  const handleCreateJob = useCallback(async (payload: CreateJobPayload) => {
    setIsCreating(true);
    try {
      const newJob = await createJob(payload);
      toast.success('Job created successfully', {
        description: `"${newJob.taskName}" has been added to the queue.`,
      });
    } catch (error) {
      toast.error('Failed to create job', {
        description: 'Please try again later.',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [createJob]);

  const handleRunJob = useCallback(async (jobId: string) => {
    setRunningJobIds(prev => new Set(prev).add(jobId));
    try {
      const job = await runJob(jobId);
      toast.success('Job completed', {
        description: `"${job.taskName}" has been executed successfully.`,
      });
    } catch (error) {
      toast.error('Failed to run job', {
        description: 'Please try again later.',
      });
    } finally {
      setRunningJobIds(prev => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  }, [runJob]);

  const handleSelectJob = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedJob(null), 200);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refreshJobs();
    toast.success('Jobs refreshed', {
      description: 'Job list has been updated.',
    });
  }, [refreshJobs]);

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Create Job Form */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5 text-primary" />
                Create New Job
              </CardTitle>
              <CardDescription>
                Schedule a new task to run in the queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobForm onSubmit={handleCreateJob} isLoading={isCreating} />
            </CardContent>
          </Card>
        </div>

        {/* Jobs Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Job Queue</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <JobTable
                jobs={jobs}
                filters={filters}
                onRunJob={handleRunJob}
                onSelectJob={handleSelectJob}
                onFilterChange={updateFilters}
                runningJobIds={runningJobIds}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </DashboardLayout>
  );
};

export default Index;
