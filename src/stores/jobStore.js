import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // Ensure axios is installed and imported

export const useJobStore = defineStore('job', () => {
  // State
  const jobs = ref([]);
  const selectedJob = ref(null);
  const error = ref('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Adjust based on environment

  /**
   * Fetch all jobs from the backend
   */
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/jobs`);
      if (response.status === 200) {
        jobs.value = response.data;
        console.log('Fetched jobs from backend:', jobs.value);
      } else {
        console.error('Failed to fetch jobs:', response.status);
        error.value = 'Failed to fetch jobs';
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      error.value = err.message;
    }
  };

  /**
   * Fetch a job according to a specific algorithm
   */
  const fetchJobByAlgorithm = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/jobs/pick`);
      if (response.status === 200) {
        selectedJob.value = response.data;
        console.log('Fetched job using algorithm:', selectedJob.value);
      } else {
        console.error('Failed to fetch job by algorithm:', response.status);
        error.value = 'Failed to fetch job by algorithm';
      }
    } catch (err) {
      console.error('Error fetching job by algorithm:', err);
      error.value = err.message;
    }
  };

  return {
    jobs,
    selectedJob,
    error,
    fetchJobs,
    fetchJobByAlgorithm,
  };
});
