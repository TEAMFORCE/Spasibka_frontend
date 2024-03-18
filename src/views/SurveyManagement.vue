<template>
  <div class="survey_management_page">
    <div class="survey_management_navigation">
      <div class="navigation_back">
        <button
          class="back_to_surveys tooltip_container brand-secondary-bg"
          :data-tooltip="$t('challenges.back')"
          @click="
            $router.push({
              path: '/admin_surveys',
            })
          "
        >
          <BackArrowIcon />
        </button>
      </div>
      <div class="navigation_links" v-if="surveyInfo">
        <button
          class="copy_link tooltip_container brand-secondary-bg"
          :data-tooltip="$t('surveys.management_navigation.copyLink')"
          @click="copyLink"
        >
          <CopyLinkIcon />
        </button>
        <button
          class="nav_link"
          v-for="link in surveyNavigation"
          :class="{ active: link.name == activeNav }"
          @click="changeNav(link.name)"
        >
          {{ link.title }}
        </button>
      </div>
    </div>
    <div class="survey_management_elements" v-if="surveyInfo">
      <SurveyManagementQuestions
        v-if="activeNav === surveyNavigationItems.questions"
      />
      <SurveyManagementParticipants
        v-if="activeNav === surveyNavigationItems.participants"
      />
      <SurveyManagementResults
        v-if="activeNav === surveyNavigationItems.results"
        :surveyName="surveyInfo.title"
      />
      <SurveyManagementSettings
        v-if="activeNav === surveyNavigationItems.settings"
        :surveyInfo="surveyInfo"
        :key="surveyInfo"
      />
    </div>
  </div>
</template>

<script>
import { notify } from "@/general-scripts/toast-notification";
import { SURVEY_NAVIGATION } from "@/infrastructure/data-sources/survey-navigation";
import { SURVEY_NAVIGATION_ITEMS } from "@/infrastructure/constants/survey-navigation-items";

import { mapStores } from "pinia";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";

import BackArrowIcon from "@/components/Icons/backArrow.vue";
import CopyLinkIcon from "@/components/Icons/OrganizationAdministrationIcons/CopyLinkIcon.vue";

import SurveyManagementQuestions from "@/components/SurveysElements/SurveyManagementQuestions/SurveyManagementQuestions.vue";
import SurveyManagementParticipants from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsComponent.vue";
import SurveyManagementResults from "@/components/SurveysElements/SurveyManagementResults/ResultComponent.vue";
import SurveyManagementSettings from "@/components/SurveysElements/SurveyManagementSettings/SettingsComponent.vue";
import axios from "axios";
import { API_URIS } from "@/constants/api";

export default {
  name: "SurveyManagement",
  components: {
    BackArrowIcon,
    CopyLinkIcon,
    SurveyManagementQuestions,
    SurveyManagementParticipants,
    SurveyManagementResults,
    SurveyManagementSettings,
  },
  data() {
    return {
      activeNav: SURVEY_NAVIGATION_ITEMS.questions,
      surveyInfo: null,
      isActive: false,
      isStarted: false,
    };
  },

  computed: {
    ...mapStores(useSurveyStore),
    surveyNavigation() {
      return SURVEY_NAVIGATION(this, this.isActive, this.isStarted);
    },
    surveyNavigationItems() {
      return SURVEY_NAVIGATION_ITEMS;
    },
  },
  watch: {
    surveyInfo() {
      this.isActive = this.surveyInfo.is_active;
      if (new Date() > new Date(this.surveyInfo.started_at)) {
        this.isStarted = true;
      }
    },
  },
  methods: {
    async copyLink() {
      try {
        const invite_link = "/survey_preview/" + this.$route.params.id;
        const match = invite_link.match(/(?:[^\/]*\/)?(.*)/);
        const pathWithQuery = match ? match[1] : invite_link;
        const newLink = window.location.origin + "/" + pathWithQuery;
        const textArea = document.createElement("textarea");
        textArea.value = newLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        notify(this.$t("surveys.link_copied"), "success");
      } catch (err) {
        notify(this.$t("surveys.link_copy_failed"));
        throw err;
      }
    },
    changeNav(link) {
      this.activeNav = link;
      this.$router.push({
        path: `/survey_management/${this.$route.params.id}`,
        query: { section: link },
      });
    },
    async getSurveyInfo() {
      let response = await axios.get(
        API_URIS.questionnaries + this.$route.params.id + "/"
      );
      this.surveyInfo = response.data;
      this.surveyStore.is_active = response.data?.is_active;
      this.surveyStore.setStartDate(response.data?.started_at);
      this.surveyStore.setEndDate(response.data?.finished_at);
      this.surveyStore.setMinutesHoursDays(response.data.timelimit);
    },
  },
  created() {
    if (this.$route.query?.section) {
      this.activeNav = this.$route.query.section;
    }
  },
  mounted() {
    this.getSurveyInfo();
  },
};
</script>

<style scoped>
.survey_management_page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
  background-color: var(--generalColorWhite);
  padding: 52px;
  margin: 0 4% 0 0;
  border-radius: 24px 24px 0px 0px;
  overflow-y: auto;
  border-left: 1px solid var(--negativeSecondary);
  border-top: 1px solid var(--negativeSecondary);
  border-right: 1px solid var(--negativeSecondary);
}
.survey_management_page::-webkit-scrollbar {
  display: none;
}
.survey_management_navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.back_to_surveys {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  padding: 7px;
  background-color: var(--secondaryColorBrand);
}
.back_arrow_icon {
  height: 16px;
}
.navigation_links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.copy_link {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  padding: 7px;
  background-color: var(--secondaryColorBrand);
  transition: 0.3s;
}
.copy_link:hover {
  transform: translate(0px, -1px);
}
.nav_link {
  outline: none;
  border-radius: 12px;
  height: 38px;
  background-color: var(--secondaryColorBrand);
  padding: 8px 14px;
  box-sizing: border-box;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  color: var(--generalContrast);
  transition: 0.3s;
}
.nav_link:hover {
  opacity: 0.9;
  transform: translate(0px, -1px);
}
.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.survey_management_elements {
  width: 100%;
}
</style>