<template>
  <div class="challenge_report_check_screen_wrapper">
    <div class="challenge_report_check_wrapper general-white-bg">
      <div class="challenge_report_check">
        <h1 class="challenge_report_check_header general-contrast-color">
          {{ $t("challenges.check_report.reject_report") }}
        </h1>
        <textarea
          v-model="reportCheckReason"
          class="challenge_report_check_input"
          @input="checkError = false"
          :placeholder="$t('challenges.check_report.reject_reason_placeholder')"
        >
        </textarea>
        <h1 v-if="checkError" class="error_message general-brand-color">
          {{ errorMessage }}
        </h1>

        <div class="report_check_buttons">
          <button
            class="report_check_button general-brand-bg"
            @click="sendReportCheck"
          >
            <h1 class="report_check_button_text general-white-color">
              {{ $t("challenges.check_report.reject") }}
            </h1>
          </button>
          <button
            class="report_check_button brand-secondary-bg"
            @click="$emit('sendReportCheckCancel')"
          >
            <h1 class="report_check_button_text general-brand-color">
              {{ $t("challenges.check_report.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";

export default {
  name: "ChallengesendCheckReport",
  props: {
    reportID: {
      required: true,
    },
  },
  data() {
    return {
      checkError: false,
      errorMessage: "",

      reportCheckReason: "",
      reportAttachment: null,
    };
  },
  methods: {
    async sendReportCheck() {
      try {
        await axios.put(API_URIS.checkChallengeReport + this.reportID + "/", {
          state: "D",
          text: this.reportCheckReason,
        });
        this.$emit("sendReportCheckCancel");
        this.$emit("refreshCandidates");
      } catch (err) {
        this.checkError = true;
        this.errorMessage = this.$t(
          "challenges.check_report.reject_reason_error"
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenge_report_check_screen_wrapper {
  position: fixed;
  z-index: 102;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}

.challenge_report_check_wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.challenge_report_check {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.challenge_report_check_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
textarea {
  outline: none;
}
.challenge_report_check_input {
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
}
.challenge_report_check_input::placeholder {
  color: var(--generalColorSecondary);
}

.error_message {
  margin-top: -20px;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
}
.report_check_buttons {
  display: flex;
  gap: 12px;
}
.report_check_button {
  width: 232.5px;
  border-radius: 6px;
  padding: 16px 0px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.report_check_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}
</style>