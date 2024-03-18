<template>
  <div class="end_survey_wrapper">
    <div class="end_survey general-white-bg">
      <div class="survey_end_texts">
        <h1 class="survey_end_header general-contrast-color">{{ $t("surveys.survey_end") }}</h1>
        <h1 class="survey_end_description general-secondary-color">{{ $t("surveys.are_you_sure_to_end") }}</h1>
      </div>
      <div class="action_buttons general-white-bg">
        <button
          @click="$emit('cancelSurveyEnd')"
          class="action_button general-brand-bg general-white-color"
        >
          {{
            $t("surveys.cancel")
          }}
        </button>
        <button
          @click="$emit('endSurvey')"
          class="action_button brand-secondary-bg general-brand-color"
        >
          {{ $t("surveys.end") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EndSurvey",
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {

  }
}

</script>

<style scoped>
.end_survey_wrapper {
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
.end_survey {
  width: 100%;
  max-width: 425px;
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
.survey_end_texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.survey_end_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
}
.survey_end_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
}
.action_buttons {
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