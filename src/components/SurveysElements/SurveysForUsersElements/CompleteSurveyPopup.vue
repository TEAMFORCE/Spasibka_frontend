<template>
  <div class="section_deletion_form_wrapper">
    <div class="section_deletion_form general-white-bg">
      <div
        class="survey_end_time_left_and_close"
      >
        <div 
          class="time_left" 
          :class="{ invisible: !surveyPreview?.timelimit }"
        >
          <TimeLeftIcon
            class="time_left_icon"
          />
          <h1 class="time_left_text general-secondary-color" v-if="timeLeft">{{ timeLeft?.hours }}:{{ timeLeft?.minutes }}:{{ timeLeft?.seconds }}</h1>
          <h1 class="time_left_text general-secondary-color" v-else>{{ $t("surveys.survey_pass_time_has_expired") }}</h1>
        </div>
        <button @click="$emit('cancelSurveyCompletion')" class="close_popup transparent-bg">
          <CloseFiltersIcon
            class="close_popup_button"
          />
        </button>
      </div>
      <div class="survey_end_and_action_buttons">
        <div class="section_deletion_texts">
          <h1 class="section_deletion_header general-contrast-color">{{ $t("surveys.are_you_sure_to_complete") }}</h1>
          <h1 class="section_deletion_description general-contrast-color">{{ $t("surveys.no_answer_change_after") }}</h1>
        </div>
        <div class="action_buttons general-white-bg">
          <button
            @click="$emit('completeSurvey')"
            class="action_button general-brand-bg general-white-color"
          >
            {{
              $t("surveys.complete")
            }}
          </button>
          <button
            @click="$emit('cancelSurveyCompletion')"
            class="action_button brand-secondary-bg general-brand-color"
          >
            {{ $t("surveys.back") }}
          </button>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import CloseFiltersIcon from '@/components/Icons/SurveyIcons/CloseFiltersIcon.vue';
import TimeLeftIcon from '@/components/Icons/SurveyIcons/TimeLeftIcon.vue';

export default {
    name: "CompleteSurveyPopup",
    props: {
      timeLeft: {
        default: null
      },
      surveyPreview: {
        required: true,
      }
    },
    data() {
        return {};
    },
    components: { CloseFiltersIcon, TimeLeftIcon }
}
</script>

<style scoped>
.section_deletion_form_wrapper {
  position: fixed;
  z-index: 5000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  display: flex;
}

.section_deletion_form {
  width: 100%;
  max-width: 544px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  margin: auto;
}
.survey_end_time_left_and_close {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.time_left {
  display: flex;
  gap: 8px;
  align-items: center;
}
.time_left.invisible {
  opacity: 0;
}
.time_left_icon {
  height: 24px;
  width: 24px;
}
.time_left_text {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.close_popup {
  height: 32px;
  width: 32px;
}
.close_popup_button {
  height: 32px;
  width: 32px;  
}
.survey_end_and_action_buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.section_deletion_texts {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.section_deletion_header {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
}
.section_deletion_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;

}

.action_buttons {
  /* box-shadow: 0px -9px 24px 0px rgba(138, 138, 138, 0.1); */
  width: 100%;
  display: flex;
  gap: 12px;
  border-radius: 0px 0px 24px 24px;
}
.action_button {
  width: 50%;
  border-radius: 6px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>