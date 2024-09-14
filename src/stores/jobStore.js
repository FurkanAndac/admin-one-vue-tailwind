import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // Ensure axios is installed and imported

export const useJobStore = defineStore('job', () => {
  // State
  const jobs = ref([]);
  const selectedJob = ref(null);
  const error = ref('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Adjust based on environment
  const errorMessage = ref(null);  // Reactive state for error message
  const payableCheck = ref(false)
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

  const checkPayableJob = async (selectedJob) => {
    const response = await axios.post(`${backendUrl}/api/jobs/check`, {
      checkJob: selectedJob

    })
    if (response.status === 200) {
      payableCheck.value = response;
    }
  }

  /**
   * Fetch a job according to a specific algorithm
   */
  const fetchJobByAlgorithm = async (user) => {
    try {      console.log("test")

      // Include the user ID in the headers
      const response = await axios.get(`${backendUrl}/api/jobs/pick`, {
        params: {
          user: user // Send user ID as a query parameter
        }
      });
      console.log("test")
      if (response.status === 200) {
        const job = response.data;
        if (job.message) {
          console.warn(job.message); // Log or display a message to the user
          selectedJob.value = null; // Set selectedJob to null if no job is available
        } else {
          selectedJob.value = job; // Update selectedJob with the fetched job
          console.log('Fetched job using algorithm:', selectedJob.value);
        }
        errorMessage.value = null; // Clear error message on successful fetch
      } else {
        // Handle unexpected response status codes
        console.error('Unexpected response status:', response.status);
        error.value = 'Unexpected response status.';
        errorMessage.value = 'An unexpected error occurred.';
        setTimeout(() => {
          errorMessage.value = null;
        }, 8000);
      }
    } catch (err) {
      if (err.response) {
        // Handle errors returned from the server
        if (err.response.status === 409) {
          console.warn('Conflict: Company has too little credits or some other issue.');
          error.value = 'Conflict: Company has too little credits.';
          errorMessage.value = 'Company has insufficient credits.';
        } else {
          console.error('Error fetching job by algorithm:', err.response.status);
          error.value = 'Failed to fetch job by algorithm';
          errorMessage.value = 'Failed to fetch job by algorithm.';
        }
      } else {
        // Handle errors not related to response (e.g., network errors)
        console.error('Error fetching job by algorithm:', err.message);
        error.value = err.message;
        errorMessage.value = 'An error occurred while fetching job by algorithm.';
      }
      setTimeout(() => {
        errorMessage.value = null;
      }, 8000);
    }
  };


  return {
    jobs,
    selectedJob,
    error,
    errorMessage,
    fetchJobs,
    fetchJobByAlgorithm,
    checkPayableJob,
  };
});
