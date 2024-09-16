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
  try {
    // API request to fetch a job
    const response = await axios.get(`${backendUrl}/api/jobs/pick`, {
      params: { user } // Pass user as query parameter
    });

    if (response.status === 200) {
      const job = response.data;

      // Check if any of the specific messages are returned
      if (job.message && (job.message === 'No more jobs available' ||
                          job.message === 'No more jobs available for this user' ||
                          job.message === 'No jobs available' ||
                          job.message === 'No more payable jobs available')) {
        console.warn(job.message); // Log the message (optional)
        selectedJob.value = null; // Set selectedJob to null
        errorMessage.value = job.message; // Display the message to the user
        clearErrorMessageAfterDelay(); // Clear the message after a delay
      } else {
        // If a valid job is returned
        selectedJob.value = job; // Update selectedJob with the fetched job
        console.log('Fetched job using algorithm:', selectedJob.value);
        errorMessage.value = null; // Clear any previous error message
      }
    } else {
      // Handle unexpected status codes
      handleErrorResponse(response.status);
    }
  } catch (err) {
    // Differentiate between server and network errors
    if (err.response) {
      handleServerError(err.response.status);
    } else {
      handleNetworkError(err.message);
    }
  }
};

// Helper function to handle unexpected status codes
const handleErrorResponse = (status) => {
  console.error('Unexpected response status:', status);
  error.value = `Unexpected response status: ${status}`;
  errorMessage.value = 'An unexpected error occurred.';
  clearErrorMessageAfterDelay();
};

// Helper function to handle server-side errors
const handleServerError = (status) => {
  if (status === 409) {
    console.warn('Conflict: Company has too little credits.');
    error.value = 'Conflict: Company has insufficient credits.';
    errorMessage.value = 'Company has insufficient credits.';
  } else {
    console.error(`Server error: ${status}`);
    error.value = `Server error: ${status}`;
    errorMessage.value = 'Failed to fetch job by algorithm.';
  }
  clearErrorMessageAfterDelay();
};

// Helper function to handle network or other non-response errors
const handleNetworkError = (message) => {
  console.error('Network or other error:', message);
  error.value = message;
  errorMessage.value = 'A network error occurred while fetching the job.';
  clearErrorMessageAfterDelay();
};

// Helper function to clear error message after a delay
const clearErrorMessageAfterDelay = () => {
  setTimeout(() => {
    errorMessage.value = null;
  }, 8000); // Clear error after 8 seconds
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
