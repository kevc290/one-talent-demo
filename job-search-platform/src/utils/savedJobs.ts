const SAVED_JOBS_KEY = 'savedJobs';

export interface SavedJob {
  jobId: string;
  savedAt: string;
}

export const getSavedJobs = (): SavedJob[] => {
  try {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveJob = (jobId: string): void => {
  const savedJobs = getSavedJobs();
  const isAlreadySaved = savedJobs.some(job => job.jobId === jobId);
  
  if (!isAlreadySaved) {
    const newSavedJob: SavedJob = {
      jobId,
      savedAt: new Date().toISOString(),
    };
    savedJobs.push(newSavedJob);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }
};

export const unsaveJob = (jobId: string): void => {
  const savedJobs = getSavedJobs();
  const updatedJobs = savedJobs.filter(job => job.jobId !== jobId);
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updatedJobs));
};

export const isJobSaved = (jobId: string): boolean => {
  const savedJobs = getSavedJobs();
  return savedJobs.some(job => job.jobId === jobId);
};

export const getSavedJobsCount = (): number => {
  return getSavedJobs().length;
};