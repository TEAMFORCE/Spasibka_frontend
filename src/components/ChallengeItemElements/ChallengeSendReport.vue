<template>
  <div class="challenge_send_report_screen_wrapper">
    <div class="challenge_send_report_wrapper general-white-bg">
      <div v-if="!reportWasSent" class="challenge_send_report">
        <h1 class="challenge_send_report_header general-contrast-color">
          {{ $t("challenges.send_report.result") }}
        </h1>
        <textarea
          v-model="reportDescription"
          class="challenge_send_report_input"
          :placeholder="$t('challenges.send_report.comment_placeholder')"
        >
        </textarea>
        <label class="report_file_select_wrapper">
          <div class="report_file_select transparent-bg">
            <SelectChallengeCoverIcon />
            <h1 class="report_file_select_text">
              {{ $t("challenges.send_report.attach_photo") }}
            </h1>
          </div>
          <h1
            v-if="reportAttachment"
            class="report_selected_file_name general-contrast-color"
          >
            {{ reportAttachment.name }}
          </h1>
          <h1
            v-if="sendError"
            class="report_selected_file_name general-brand-color"
          >
            {{ errorMessage }}
          </h1>
          <input type="file" @change="handleFileSelect" />
        </label>

        <div class="send_report_buttons">
          <button
            class="send_report_button general-brand-bg"
            @click="sendReport"
          >
            <h1 class="send_report_button_text general-white-color">
              {{ $t("challenges.send_report.send_report") }}
            </h1>
          </button>
          <button
            class="send_report_button brand-secondary-bg"
            @click="$emit('sendReportCancel')"
          >
            <h1 class="send_report_button_text general-brand-color">
              {{ $t("challenges.send_report.cancel") }}
            </h1>
          </button>
        </div>
      </div>
      <div class="challenge_send_report" v-else>
        <h1 class="challenge_send_report_header general-contrast-color">
          {{ $t("challenges.send_report.thanks_for_participation") }}
        </h1>
        <div class="send_report_buttons">
          <button
            class="send_report_button general-brand-bg"
            @click="$emit('goToWinners')"
          >
            <h1 class="send_report_button_text general-white-color">
              {{ $t("challenges.challenge_item_navigation.winners") }}
            </h1>
          </button>
          <button
            class="send_report_button brand-secondary-bg"
            @click="$emit('sendReportCancel')"
          >
            <h1 class="send_report_button_text general-brand-color">
              {{ $t("challenges.back") }}
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
import { notify } from "@/general-scripts/toast-notification";

import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";

export default {
  name: "ChallengeSendReport",
  components: {
    SelectChallengeCoverIcon,
  },
  props: {
    challengeDetails: {
      required: true,
    },
  },
  data() {
    return {
      reportDescription: "",
      reportAttachment: null,
      reportWasSent: false,

      sendError: false,
      errorMessage: "",
    };
  },
  methods: {
    handleFileSelect(e) {
      this.reportAttachment = e.target.files[0];
      this.sendError = false;
    },
    challengeCreationError() {
      this.$moshaToast(
        {
          title: this.errorMessage || this.$t("notification.error"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "danger",
        }
      );
      this.step = 1;
    },
    async sendReport() {
      try {
        this.errorMessage = "";
        this.sendError = false;
        let formData = new FormData();
        formData.append("challenge", this.challengeDetails?.id);
        formData.append("text", this.reportDescription);
        if (this.reportAttachment) {
          formData.append("photo", this.reportAttachment);
        }
        await axios.post(API_URIS.createChallengeReport, formData, {
          "Content-Type": "multipart/form-data",
        });
        notify(this.$t("challenges.report_sent"), "success");
        // this.$emit("sendReportCancel");
        this.reportWasSent = true;
        this.$emit("updateMyResult");
      } catch (err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        // this.sendError = true;
        // if (err.response.data.photo) {
        //   this.errorMessage = err.response.data.photo[0];
        // } else if (err.response.data.length > 0) {
        //   this.errorMessage = err.response.data[0];
        // } else {
        //   this.errorMessage = this.$t("challenges.send_report.error_message");
        // }
        // if (!this.errorMessage && err.response.status == 413)
        //   this.errorMessage = "Объем файла слишком велик";
        // if (!this.errorMessage) this.errorMessage = err.response.data;
        // this.challengeCreationError();
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenge_send_report_screen_wrapper {
  position: fixed;
  z-index: 3;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}

.challenge_send_report_wrapper {
  width: 100%;
  max-width: 477px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.challenge_send_report {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.challenge_send_report_header {
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
.challenge_send_report_input {
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
}
.challenge_send_report_input::placeholder {
  color: var(--generalColorSecondary);
}

.report_file_select_wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.report_file_select {
  border: 1px solid var(--generalBrand);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.report_file_select_icon {
  width: 24px;
  height: 24px;
}
.report_file_select_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.report_file_select_wrapper > input[type="file"] {
  display: none;
}
.report_selected_file_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  word-break: break-word;
}

.send_report_buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.send_report_button {
  flex-grow: 1;
  border-radius: 6px;
  padding: 16px 0px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.send_report_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}
</style>