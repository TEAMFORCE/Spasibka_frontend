<template>
  <div class="survey_management_settings">
    <div class="settings_tab_header">
      <button
        v-if="!surveyStore?.is_active"
        @click="openStartSurveyPopup"
        class="start_survey"
      >
        {{ $t("surveys.management_settings.start_survey") }}
      </button>
      <button v-else @click="openEndSurveyPopup" class="start_survey">
        {{ $t("surveys.management_settings.end_survey") }}
      </button>
    </div>
    <BaseSmallPopup
      :maxWidth="'361px'"
      ref="startConfirmation"
    >
      <SettingsStartSurveyPopup
        @cancelSurveyStart="closeStartSurveyPopup"
        @startSurvey="startSurvey"
      />
    </BaseSmallPopup>
    <BaseSmallPopup
      :maxWidth="'361px'"
      ref="endConfirmation"
    >
      <SettingsEndSurveyPopup
        @cancelSurveyEnd="closeEndSurveyPopup"
        @endSurvey="endSurvey"
      />
    </BaseSmallPopup>

    <SettingsGeneral v-if="surveyInfo" :surveyInfo="surveyInfo" />
    <SettingsNotifications v-if="surveyInfo" :surveyInfo="surveyInfo" />

    <div class="survey_delete">
      <button class="survey_delete_button" @click="openDeleteConfirmation">
        {{ $t("surveys.management_settings.deleteSurvey") }}
      </button>
    </div>
    <BaseSmallPopup ref="deleteConfirmation">
      <div class="delete_confirmation">
        <div class="delete_confirmation_info">
          <h3 class="delete_confirmation_title">
            {{ $t("surveys.survey_deletion") }}
          </h3>
          <h5 class="delete_confirmation_description">
            {{ $t("surveys.are_you_sure_to_delete") }}
          </h5>
        </div>
        <div class="delete_confirmation_buttons">
          <button
            class="delete_confirmation_button _cancel"
            @click="cancelDeletion"
          >
            {{ $t("surveys.cancel") }}
          </button>
          <button
            class="delete_confirmation_button _delete"
            @click="deleteSurvey"
          >
            {{ $t("surveys.delete") }}
          </button>
        </div>
      </div>
    </BaseSmallPopup>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";

import SettingsGeneral from "@/components/SurveysElements/SurveyManagementSettings/SettingsGeneral.vue";
import SettingsNotifications from "@/components/SurveysElements/SurveyManagementSettings/SettingsNotifications.vue";
import BaseSmallPopup from "@/components/app/SmallPopup.vue";
import SettingsStartSurveyPopup from "./SettingsStartSurveyPopup.vue";
import SettingsEndSurveyPopup from "./SettingsEndSurveyPopup.vue";

export default {
  name: "SurveyManagementSettings",
  components: {
    SettingsGeneral,
    SettingsNotifications,
    BaseSmallPopup,
    SettingsStartSurveyPopup,
    SettingsEndSurveyPopup
  },
  props: {
    surveyInfo: {
      requred: true,
    },
  },
  computed: {
    ...mapStores(useProfileStore),
    ...mapStores(useSurveyStore),
  },
  methods: {
    openStartSurveyPopup(){
      try {
        if (!this.surveyStore.finished_at) throw new Error(this.$t("surveys.survey_end_date_should_be_defined"));
        this.$refs.startConfirmation.open();
      }
      catch(err) {
        notify(err.message || this.$t("notification.error"))
      }
    },
    closeStartSurveyPopup() {
      this.$refs.startConfirmation.close();
    },
    openEndSurveyPopup(){
      this.$refs.endConfirmation.open();
    },
    closeEndSurveyPopup() {
      this.$refs.endConfirmation.close();
    },
    async startSurvey() {
      try {
        let params = {
          is_active: true,
        };
        if (!this.surveyInfo.started_at) {
          params.started_at = new Date().toISOString();
        }
        const response = await axios.patch(
          API_URIS.questionnaries + this.$route.params.id + "/",
          params
        );
        // this.surveyStore.started_at = startDate;
        // this.surveyStore.is_active = true;
        notify(this.$t("surveys.survey_launched"), "success");
        window.location.reload();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async endSurvey() {
      try {
        let endDate = new Date().toISOString();
        const response = await axios.patch(
          API_URIS.questionnaries + this.$route.params.id + "/",
          {
            is_active: false,
            finished_at: endDate,
          }
        );
        // this.surveyStore.finished_at = endDate;
        // this.surveyStore.is_active = false;
        notify(this.$t("surveys.survey_ended"), "success");
        window.location.reload();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    openDeleteConfirmation() {
      this.$refs.deleteConfirmation.open();
    },
    cancelDeletion() {
      this.$refs.deleteConfirmation.close();
    },
    async deleteSurvey() {
      try {
        await axios.delete(
          API_URIS.questionnaries + this.$route.params.id + "/"
        );
        notify(this.$t("surveys.survey_deleted"), "success");
        this.$router.push("/admin_surveys");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.survey_management_settings {
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
.start_survey {
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
.survey_delete {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.survey_delete_button {
  background-color: transparent;
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  color: var(--minorError);
  transition: 0.3s;
}
.survey_delete_button:active {
  transform: scale(0.98);
}
.delete_confirmation {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  width: 100%;
}
.delete_confirmation_info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}
.delete_confirmation_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: center;
  color: var(--generalContrast);
  margin: 0;
}
.delete_confirmation_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -0.2800000011920929px;
  text-align: center;
  color: var(--generalColorSecondary);
  margin: 0;
}
.delete_confirmation_buttons {
  width: 100%;
  display: flex;
  gap: 12px;
}
.delete_confirmation_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
}
._cancel {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
._delete {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
</style>