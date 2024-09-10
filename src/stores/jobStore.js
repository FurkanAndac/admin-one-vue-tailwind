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
  const fetchJobs = async (userId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/jobs`, {
        params: {
        _id: userId // Send user ID as a query parameter
      }

      });
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
  const fetchJobByAlgorithm = async (user) => {
    try {
      // Include the user ID in the headers
      const response = await axios.get(`${backendUrl}/api/jobs/pick`, {
        params: {
          user: user // Send user ID as a query parameter
        }
      });

      if (response.status === 200) {
        const job = response.data;
        if (job.message) {
          console.warn(job.message); // Log or display a message to the user
          selectedJob.value = null; // Set selectedJob to null if no job is available
        } else {
          selectedJob.value = job; // Update selectedJob with the fetched job
          console.log('Fetched job using algorithm:', selectedJob.value);
        }
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
