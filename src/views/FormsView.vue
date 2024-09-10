<script setup>
import { ref } from 'vue'
import { mdiBallotOutline, mdiWeb } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import { useUserStore } from '@/stores/userStore.js'
import AddApplication from '@/components/AddApplication.vue'
import { useJobStore } from '@/stores/jobStore'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import axios from 'axios'

const form = ref({
  initialImpression: '',
  easeOfAccess: '',
  findingInformation: '',
  visualAppeal: '',
  understandingContent: '',
  relevance: '',
  featureUse: '',
  performance: '',
  easeOfUse: '',
  firstTimeExperience: '',
  designAppeal: '',
  engagement: '',
  findingHelp: '',
  onboarding: '',
  satisfaction: '',
  improvement: '',
  specificFeatures: '',
  visualMediaElements: ''
})
const router = useRouter()
const mainStore = useMainStore()

const completeJob = async (jobId, userId) => {
  try {
    console.log('Completing job with ID:', jobId); // Log jobId
    console.log('Completing job with userID:', userId); // Log userId

    const date = new Date().toISOString(); // Get current date in ISO format

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/jobs/markAsCompleted`, {
      jobId,
      userId,
      date // Send the current date to the backend
    });

  } catch (error) {
    console.error('Error completing job:', error);
  }
};

const submitFeedback = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/questionnaire/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: jobStore.selectedJob._id,
        ...form.value,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Feedback submitted successfully:', result);
      completeJob(jobStore.selectedJob?._id, userStore.user?._id);
      mainStore.inExcercise = ref(false)
      router.push('/dashboard')
      // Handle success (e.g., show a confirmation message)
    } else {
      console.error('Error submitting feedback:', response.statusText);
      // Handle error (e.g., show an error message)
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    // Handle network error (e.g., show an error message)
  }
}

const userStore = useUserStore();
const jobStore = useJobStore();

const showIframe = ref(false);

const toggleIframe = () => {
  showIframe.value = !showIframe.value;
}
</script>


<template>
  <LayoutAuthenticated >
    <SectionMain>
      <div v-if="userStore.user?.status === 'UXReviewer' || userStore.user?.status === 'Company'">
        <SectionTitleLineWithButton
    :icon="mdiBallotOutline"
    :title="userStore.user?.status === 'UXReviewer' ? 'Questionnaire Form' : 'Application Form'"
    main
  >
    <!-- Toggle Button -->
    <BaseButton
      @click="toggleIframe"
      :icon="mdiWeb"
      label="Show iFrame"
      color="primary"
      rounded-full
      small
    />

    <!-- Conditional iFrame Display -->
    <div v-if="showIframe" class="mt-4">
      <iframe
        :src="jobStore.selectedJob?.websiteUrl"
        width="100%"
        height="600px"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </SectionTitleLineWithButton>

        <CardBox form @submit.prevent="submit">
          <AddApplication v-if="userStore.user?.status === 'Company'"/>

          <!-- Optional fields for UXReviewer -->
          <template v-if="userStore.user?.status === 'UXReviewer' && jobStore.selectedJob?._id !== null">
            <form @submit.prevent="submitFeedback">
              <FormField label="Ease of Access" required>
                <FormControl v-model="form.easeOfAccess" type="textarea" placeholder="Was it easy to access and load the website on your first attempt?" required />
              </FormField>

              <FormField label="Finding Information" required>
                <FormControl v-model="form.findingInformation" type="textarea" placeholder="How easy was it to find the information you were looking for?" required />
              </FormField>

              <FormField label="Visual Appeal" required>
                <FormControl v-model="form.visualAppeal" type="textarea" placeholder="How would you describe the visual appeal of the website?" required />
              </FormField>

              <FormField label="Understanding Content" required>
                <FormControl v-model="form.understandingContent" type="textarea" placeholder="Was the content presented in a clear and understandable way?" required />
              </FormField>

              <FormField label="Relevance" required>
                <FormControl v-model="form.relevance" type="textarea" placeholder="Did the content seem relevant and useful to you?" required />
              </FormField>

              <FormField label="Feature Use" required>
                <FormControl v-model="form.featureUse" type="textarea" placeholder="Did you find the features of the website to be functional and helpful?" required />
              </FormField>

              <FormField label="Performance" required>
                <FormControl v-model="form.performance" type="textarea" placeholder="How would you rate the performance of the website?" required />
              </FormField>

              <FormField label="Ease of Use" required>
                <FormControl v-model="form.easeOfUse" type="textarea" placeholder="How easy was it to use the website overall?" required />
              </FormField>

              <FormField label="First-Time Experience" required>
                <FormControl v-model="form.firstTimeExperience" type="textarea" placeholder="Did you feel that the website was user-friendly and welcoming?" required />
              </FormField>

              <FormField label="Design Appeal" required>
                <FormControl v-model="form.designAppeal" type="textarea" placeholder="How did you feel about the design of the website?" required />
              </FormField>

              <FormField label="Engagement" required>
                <FormControl v-model="form.engagement" type="textarea" placeholder="Did the website engage you visually or interactively?" required />
              </FormField>

              <FormField label="Finding Help" required>
                <FormControl v-model="form.findingHelp" type="textarea" placeholder="Was it easy to find help or support resources on the website?" required />
              </FormField>

              <FormField label="Onboarding" required>
                <FormControl v-model="form.onboarding" type="textarea" placeholder="Did the website provide any onboarding or introductory content?" required />
              </FormField>

              <FormField label="Satisfaction" required>
                <FormControl v-model="form.satisfaction" type="textarea" placeholder="Overall, how satisfied are you with your first-time experience on the website?" required />
              </FormField>

              <FormField label="Improvement" required>
                <FormControl v-model="form.improvement" type="textarea" placeholder="What improvements or changes would you suggest?" required />
              </FormField>

              <FormField label="Specific Features" required>
                <FormControl v-model="form.specificFeatures" type="textarea" placeholder="Did you interact with any specific features for the first time?" required />
              </FormField>

              <FormField label="Visual and Media Elements" required>
                <FormControl v-model="form.visualMediaElements" type="textarea" placeholder="How did the visual and media elements contribute to your experience?" required />
              </FormField>

              <BaseButton type="submit" color="primary" label="Submit Feedback" />
            </form>
          </template>


          <!-- <BaseDivider />

          <template v-if="userStore.user?.status === 'UXReviewer'" #footer >
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Next!" />
            </BaseButtons>
          </template> -->
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
