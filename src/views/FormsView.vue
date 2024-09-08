<script setup>
import { reactive, ref } from 'vue'
import { mdiBallotOutline, mdiAccount, mdiGithub } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'

const form = reactive({
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

const submit = () => {
  // Handle form submission
}

const formStatusWithHeader = ref(true)
const formStatusCurrent = ref(0)
const formStatusOptions = ['info', 'success', 'danger', 'warning']

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0
}
</script>


<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Feedback Form" main>
        <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <CardBox form @submit.prevent="submit">
        <FormField label="Initial Impressions">
          <FormControl v-model="form.initialImpression" type="textarea" placeholder="What was your initial impression of the website?" />
        </FormField>

        <FormField label="Ease of Access">
          <FormControl v-model="form.easeOfAccess" type="textarea" placeholder="Was it easy to access and load the website on your first attempt?" />
        </FormField>

        <FormField label="Finding Information">
          <FormControl v-model="form.findingInformation" type="textarea" placeholder="How easy was it to find the information you were looking for?" />
        </FormField>

        <FormField label="Visual Appeal">
          <FormControl v-model="form.visualAppeal" type="textarea" placeholder="How would you describe the visual appeal of the website?" />
        </FormField>

        <FormField label="Understanding Content">
          <FormControl v-model="form.understandingContent" type="textarea" placeholder="Was the content presented in a clear and understandable way?" />
        </FormField>

        <FormField label="Relevance">
          <FormControl v-model="form.relevance" type="textarea" placeholder="Did the content seem relevant and useful to you?" />
        </FormField>

        <FormField label="Feature Use">
          <FormControl v-model="form.featureUse" type="textarea" placeholder="Did you find the features of the website to be functional and helpful?" />
        </FormField>

        <FormField label="Performance">
          <FormControl v-model="form.performance" type="textarea" placeholder="How would you rate the performance of the website?" />
        </FormField>

        <FormField label="Ease of Use">
          <FormControl v-model="form.easeOfUse" type="textarea" placeholder="How easy was it to use the website overall?" />
        </FormField>

        <FormField label="First-Time Experience">
          <FormControl v-model="form.firstTimeExperience" type="textarea" placeholder="Did you feel that the website was user-friendly and welcoming?" />
        </FormField>

        <FormField label="Design Appeal">
          <FormControl v-model="form.designAppeal" type="textarea" placeholder="How did you feel about the design of the website?" />
        </FormField>

        <FormField label="Engagement">
          <FormControl v-model="form.engagement" type="textarea" placeholder="Did the website engage you visually or interactively?" />
        </FormField>

        <FormField label="Finding Help">
          <FormControl v-model="form.findingHelp" type="textarea" placeholder="Was it easy to find help or support resources on the website?" />
        </FormField>

        <FormField label="Onboarding">
          <FormControl v-model="form.onboarding" type="textarea" placeholder="Did the website provide any onboarding or introductory content?" />
        </FormField>

        <FormField label="Satisfaction">
          <FormControl v-model="form.satisfaction" type="textarea" placeholder="Overall, how satisfied are you with your first-time experience on the website?" />
        </FormField>

        <FormField label="Improvement">
          <FormControl v-model="form.improvement" type="textarea" placeholder="What improvements or changes would you suggest?" />
        </FormField>

        <FormField label="Specific Features">
          <FormControl v-model="form.specificFeatures" type="textarea" placeholder="Did you interact with any specific features for the first time?" />
        </FormField>

        <FormField label="Visual and Media Elements">
          <FormControl v-model="form.visualMediaElements" type="textarea" placeholder="How did the visual and media elements contribute to your experience?" />
        </FormField>

        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>

      <SectionTitle>Form with status example</SectionTitle>

      <CardBox
        class="md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl md:mx-auto"
        is-form
        is-hoverable
        @submit.prevent="formStatusSubmit"
      >
        <NotificationBarInCard
          :color="formStatusOptions[formStatusCurrent]"
          :is-placed-with-header="formStatusWithHeader"
        >
          <span
            ><b class="capitalize">{{ formStatusOptions[formStatusCurrent] }}</b> state</span
          >
        </NotificationBarInCard>
        <FormField label="Fields">
          <FormControl
            v-model="form.name"
            :icon-left="mdiAccount"
            help="Your full name"
            placeholder="Name"
          />
        </FormField>

        <template #footer>
          <BaseButton label="Trigger" type="submit" color="info" />
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
