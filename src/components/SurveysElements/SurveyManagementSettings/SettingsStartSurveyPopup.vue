
<template>
  <div class="start_survey_form general-white-bg">
    <div class="start_survey_texts">
      <h1 class="start_survey_header general-contrast-color">{{ $t("surveys.survey_launch") }}</h1>
      <h1 class="survey_start_description general-secondary-color">{{ $t("surveys.are_you_sure_to_launch_survey") }}</h1>
    </div>
    <div class="action_buttons general-white-bg">
      <button
        @click="$emit('cancelSurveyStart')"
        class="action_button general-brand-bg general-white-color"
      >
        {{
          $t("surveys.cancel")
        }}
      </button>
      <button
        @click="$emit('startSurvey')"
        class="action_button brand-secondary-bg general-brand-color"
      >
        {{ $t("surveys.launch") }}
      </button>
    </div>
  </div>
</template>  

<script>
export default {
  name: "SettingsStartSurveyPopup",
}
</script>

<style scoped>
.start_survey_form {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.start_survey_texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.start_survey_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
}
.survey_start_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
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