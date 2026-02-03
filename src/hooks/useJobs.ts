import { useState, useCallback, useMemo } from 'react';
import { Job, CreateJobPayload, JobFilters, JobStatus, JobPriority } from '@/types/job';

// Simulated initial jobs data
const initialJobs: Job[] = [
  {
    id: '1',
    taskName: 'Data Sync Task',
    payload: { source: 'database_a', target: 'database_b', batchSize: 1000 },
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    taskName: 'Email Campaign',
    payload: { template: 'welcome', recipients: ['user1@example.com', 'user2@example.com'] },
    status: 'running',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  },
  {
    id: '3',
    taskName: 'Report Generation',
    payload: { reportType: 'monthly', format: 'pdf', departments: ['sales', 'marketing'] },
    status: 'pending',
    priority: 'low',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: '4',
    taskName: 'Backup Process',
    payload: { databases: ['main', 'analytics'], compression: true },
    status: 'pending',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Simulated API delay
const simulateApiDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({ status: 'all', priority: 'all' });

  // Filtered jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const statusMatch = filters.status === 'all' || job.status === filters.status;
      const priorityMatch = filters.priority === 'all' || job.priority === filters.priority;
      return statusMatch && priorityMatch;
    });
  }, [jobs, filters]);

  // Simulate POST /jobs - Create a new job
  const createJob = useCallback(async (payload: CreateJobPayload): Promise<Job> => {
    setIsLoading(true);
    try {
      await simulateApiDelay();
      
      const newJob: Job = {
        id: generateId(),
        taskName: payload.taskName,
        payload: payload.payload,
        priority: payload.priority,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setJobs(prev => [newJob, ...prev]);
      
      // Simulated API response logging
      console.log('[API] POST /jobs', { request: payload, response: newJob });
      
      return newJob;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simulate POST /run-job/:id - Run a job
  const runJob = useCallback(async (jobId: string): Promise<Job> => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    // Simulate running state
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: 'running' as JobStatus, updatedAt: new Date() } : j
    ));

    await simulateApiDelay(1500);

    // Simulate completion
    const updatedJob: Job = {
      ...job,
      status: 'completed',
      updatedAt: new Date(),
    };

    setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
    
    console.log('[API] POST /run-job/' + jobId, { response: updatedJob });
    
    return updatedJob;
  }, [jobs]);

  // Simulate GET /jobs/:id - Get job details
  const getJob = useCallback((jobId: string): Job | undefined => {
    const job = jobs.find(j => j.id === jobId);
    console.log('[API] GET /jobs/' + jobId, { response: job });
    return job;
  }, [jobs]);

  // Simulate GET /jobs - Fetch all jobs (refresh)
  const refreshJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      await simulateApiDelay(500);
      console.log('[API] GET /jobs', { response: jobs, filters });
      // In real implementation, this would fetch from API
    } finally {
      setIsLoading(false);
    }
  }, [jobs, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    jobs: filteredJobs,
    allJobs: jobs,
    isLoading,
    filters,
    createJob,
    runJob,
    getJob,
    refreshJobs,
    updateFilters,
  };
}
