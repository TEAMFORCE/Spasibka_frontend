<template>
  <div class="test_management_settings">
    <div class="settings_tab_header">
      <button v-if="!isActive" class="start_test" @click="openStartTestPopup">
        {{ $t("tests.settings.startButton") }}
      </button>
      <button v-else class="start_test" @click="openEndTestPopup">
        {{ $t("tests.settings.endButton") }}
      </button>
    </div>
    <BaseSmallPopup maxWidth="361px" ref="startConfirmation">
      <SettingsStartTestPopup
        @cancelTestStart="closeStartTestPopup"
        @startTest="closeStartTestPopup"
      />
    </BaseSmallPopup>
    <BaseSmallPopup maxWidth="361px" ref="endConfirmation">
      <SettingsEndTestPopup
        @cancelTestEnd="closeEndTestPopup"
        @endTest="closeEndTestPopup"
      />
    </BaseSmallPopup>
    <SettingsAnswers />
    <SettingsResult />
    <SettingsGeneral />
    <SettingsNotifications />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

import BaseSmallPopup from "@/components/app/SmallPopup.vue";
import SettingsStartTestPopup from "@/components/TestElements/TestManagementSettings/SettingsStartTestPopup.vue";
import SettingsEndTestPopup from "@/components/TestElements/TestManagementSettings/SettingsEndTestPopup.vue";
import SettingsAnswers from "@/components/TestElements/TestManagementSettings/SettingsAnswers.vue";
import SettingsResult from "@/components/TestElements/TestManagementSettings/SettingsResult.vue";
import SettingsGeneral from "@/components/TestElements/TestManagementSettings/SettingsGeneral.vue";
import SettingsNotifications from "@/components/TestElements/TestManagementSettings/SettingsNotification.vue";

export default {
  name: "TestManagementSettings",
  components: {
    SettingsGeneral,
    BaseSmallPopup,
    SettingsStartTestPopup,
    SettingsEndTestPopup,
    SettingsAnswers,
    SettingsResult,
    SettingsGeneral,
    SettingsNotifications,
  },
  data() {
    return {
      isActive: true,
    };
  },
  methods: {
    openStartTestPopup() {
      this.$refs.startConfirmation.open();
    },
    closeStartTestPopup() {
      this.$refs.startConfirmation.close();
    },
    openEndTestPopup() {
      this.$refs.endConfirmation.open();
    },
    closeEndTestPopup() {
      this.$refs.endConfirmation.close();
    },
  },
};
</script>

<style scoped>
.test_management_settings {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}
.settings_tab_header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.start_test {
  width: 237px;
  height: 56px;
  padding: 17px 17px;
  border-radius: 12px;
  font-family: "Golos";
  font-size: 16px;
  text-align: center;
  font-weight: 500;
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
</style>