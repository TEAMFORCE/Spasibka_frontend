<template>
  <div class="settings_notifications">
    <h2 class="settings_notifications_title">
      {{ $t("surveys.management_settings.notifications.title") }}
    </h2>
    <div class="settings_notifications_item" v-if="settingsAdded">
      <h3 class="_item_title">
        {{
          $t("surveys.management_settings.notifications.endSurveyNotification")
        }}
      </h3>
      <div class="item_switch">
        <label class="switch">
          <input
            type="checkbox"
            v-model="endAllUsers"
            @click="setEndAllUsers"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="_divider"></div>
    <div class="settings_notifications_item" v-if="settingsAdded">
      <h3 class="_item_title">
        {{
          $t("surveys.management_settings.notifications.endComingNotification")
        }}
      </h3>
      <div class="item_switch">
        <label class="switch">
          <input
            type="checkbox"
            v-model="endComingAdmin"
            @click="setEndComingAdmin"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="_divider"></div>
    <div class="settings_notifications_item" v-if="settingsAdded">
      <h3 class="_item_title">
        {{
          $t(
            "surveys.management_settings.notifications.newParticipantsNotification"
          )
        }}
      </h3>
      <div class="item_switch">
        <label class="switch">
          <input
            type="checkbox"
            v-model="endComingUser"
            @click="setEndComingUser"
          />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="_divider"></div>
    <div class="settings_notifications_item" v-if="settingsAdded">
      <h3 class="_item_title">
        {{
          $t(
            "surveys.management_settings.notifications.surveyCreatedNotification"
          )
        }}
      </h3>
      <div class="item_switch">
        <label class="switch">
          <input type="checkbox" v-model="created" @click="setCreated" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { notify } from "@/general-scripts/toast-notification";

import { SURVEY_NOTIFICATION_TYPE } from "@/infrastructure/constants/survey-notification-type";

export default {
  name: "SettingsNotifications",
  props: {
    surveyInfo: {
      required: true,
    },
  },
  data() {
    return {
      endAllUsers: true,
      endComingAdmin: true,
      endComingUser: true,
      created: true,

      alerts: [],
      settingsAdded: false,
    };
  },
  methods: {
    setEndAllUsers() {
      if (!this.alerts.includes(SURVEY_NOTIFICATION_TYPE.CLOSED_NOW)) {
        this.alerts.push(SURVEY_NOTIFICATION_TYPE.CLOSED_NOW);
      } else {
        this.alerts = this.alerts.filter(
          (el) => el !== SURVEY_NOTIFICATION_TYPE.CLOSED_NOW
        );
      }
      this.setSurveyNotification();
    },
    setEndComingAdmin() {
      if (!this.alerts.includes(SURVEY_NOTIFICATION_TYPE.CLOSING_TO_ADMIN)) {
        this.alerts.push(SURVEY_NOTIFICATION_TYPE.CLOSING_TO_ADMIN);
      } else {
        this.alerts = this.alerts.filter(
          (el) => el !== SURVEY_NOTIFICATION_TYPE.CLOSING_TO_ADMIN
        );
      }
      this.setSurveyNotification();
    },
    setEndComingUser() {
      if (
        !this.alerts.includes(SURVEY_NOTIFICATION_TYPE.CLOSING_TO_PARTICIPANT)
      ) {
        this.alerts.push(SURVEY_NOTIFICATION_TYPE.CLOSING_TO_PARTICIPANT);
      } else {
        this.alerts = this.alerts.filter(
          (el) => el !== SURVEY_NOTIFICATION_TYPE.CLOSING_TO_PARTICIPANT
        );
      }
      this.setSurveyNotification();
    },
    setCreated() {
      if (!this.alerts.includes(SURVEY_NOTIFICATION_TYPE.CREATED)) {
        this.alerts.push(SURVEY_NOTIFICATION_TYPE.CREATED);
      } else {
        this.alerts = this.alerts.filter(
          (el) => el !== SURVEY_NOTIFICATION_TYPE.CREATED
        );
      }
      this.setSurveyNotification();
    },
    async setSurveyNotification() {
      try {
        await axios.patch(
          API_URIS.questionnaries + this.$route.params.id + "/",
          {
            alerts: this.alerts,
          }
        );
        notify(
          this.$t(
            "surveys.management_settings.notifications.surveyNotificationSettingsChanged"
          ),
          "success"
        );
      } catch (err) {
        err?.response?.data || err?.message || this.$t("notification.error");
        throw err;
      }
    },
    setReceivedSettings() {
      this.alerts = this.surveyInfo.alerts;
      this.endAllUsers = this.surveyInfo.alerts.some(
        (el) => el == SURVEY_NOTIFICATION_TYPE.CLOSED_NOW
      )
        ? true
        : false;
      this.endComingAdmin = this.surveyInfo.alerts.some(
        (el) => el == SURVEY_NOTIFICATION_TYPE.CLOSING_TO_ADMIN
      )
        ? true
        : false;
      this.endComingUser = this.surveyInfo.alerts.some(
        (el) => el == SURVEY_NOTIFICATION_TYPE.CLOSING_TO_PARTICIPANT
      )
        ? true
        : false;
      this.created = this.surveyInfo.alerts.some(
        (el) => el == SURVEY_NOTIFICATION_TYPE.CREATED
      )
        ? true
        : false;
      this.settingsAdded = true;
    },
  },
  mounted() {
    this.setReceivedSettings();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.settings_notifications {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
}
.settings_notifications_title {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  margin: 0;
  color: var(--generalContrast);
}
.settings_notifications_item {
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
._item_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 400;
  margin: 0;
  color: var(--generalContrast);
}

._divider {
  width: 100%;
  height: 1px;
  background-color: var(--negativeSecondary);
}
</style>