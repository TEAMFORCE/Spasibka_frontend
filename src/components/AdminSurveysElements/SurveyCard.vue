<template>
  <div
    class="survey_card general-white-bg"
    @click="openSurvey"
  >
    <div class="survey_cover">
      <div class="survey_type general-white-bg">
        {{ typeMapper }}
      </div>
      <img
        v-if="survey.image"
        class="survey_image"
        :src="getSurveyImage(survey.image)"
        alt="survey_cover"
      />
      <img
        v-else
        class="survey_image"
        :src="getImageURL('SurveysImages', 'DefaultSurveyImage.png')"
        alt="survey_cover"
      />
    </div>
    <div class="survey_header">
      <h1 class="survey_name general-contrast-color">
        {{ survey.title }}
      </h1>
      <div class="survey_footer">
        <div class="survey_info general-secondary-color">
          {{ answersCountDeclension }}
          <div class="gray_dot general-secondary-bg"></div>
          {{ statusDeclension }}
          <div
            v-if="survey.finished_at"
            class="gray_dot general-secondary-bg"
          ></div>
          {{ survey.finished_at ? `${$t("general.to")} ${surveyEndDate}` : "" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OptionsIcon from "@/components/Icons/SurveyIcons/OptionsIcon.vue";
import { photoAddress } from "@/general-scripts/photo-address";
import EndSurveyIcon from "../Icons/SurveyIcons/EndSurveyIcon.vue";
import ShareSurveyIcon from "../Icons/SurveyIcons/ShareSurveyIcon.vue";
import DeleteSurveyIcon from "../Icons/SurveyIcons/DeleteSurveyIcon.vue";
import { getImageURL } from "@/general-scripts/get-image-url";
import { formatTimestamp } from "@/general-scripts/timestamps";

export default {
  name: "SurveyCard",
  props: {
    survey: {
      required: true,
    },
  },
  components: {
    OptionsIcon,
    EndSurveyIcon,
    ShareSurveyIcon,
    DeleteSurveyIcon,
  },
  data() {
    return {
      surveyActionsEnabled: false,
    };
  },
  computed: {
    surveyEndDate() {
      let date = formatTimestamp(this.survey.finished_at);
      return (date.day < 10 ? "0" : "") + date.day + "." + (date.month + 1 < 10 ? "0" : "") + (date.month + 1);
    },
    typeMapper() {
      // Survey: "S"
      // Test: "T"
      // Voting: "V"
      // Catalog: "C"
      return this.$t("surveys.survey");
      if (this.survey.type === 1) return this.$t("surveys.survey");
      if (this.survey.type === 2) return this.$t("surveys.test");
      if (this.survey.type === 3) return this.$t("surveys.voting");
      // if (this.survey.type === $) return this.$t("surveys.catalog");
    },
    answersCountDeclension() {
      let textString = this.survey.questions + " ";
      if (this.survey.questions === 1) {
        textString += this.$t("surveys.questions_declension_1");
      } else {
        let module100 = this.survey.questions % 100;
        let module10 = this.survey.questions % 10;
        if (module100 < 5 || module100 > 20) {
          if (module10 === 1) {
            textString += this.$t("surveys.questions_declension_1");
          } else if (module10 > 1 && module10 < 5) {
            textString += this.$t("surveys.questions_declension_2");
          } else {
            textString += this.$t("surveys.questions_declension_11");
          }
        } else {
          textString += this.$t("surveys.questions_declension_11");
        }
      }
      return textString;
    },
    statusDeclension() {
      if (this.survey.status === 1) {
        if (this.survey.type !== 3) {
          return this.$t("surveys.active_declension_masculine");
        } else {
          return this.$t("surveys.active_declension_neutral");
        }
      } else if (this.survey.status === 2) {
        if (this.survey.type !== 3) {
          return this.$t("surveys.ended_declension_masculine");
        } else {
          return this.$t("surveys.ended_declension_neutral");
        }
      } else if (this.survey.status === 3) {
        if (this.survey.type !== 3) {
          return this.$t("surveys.not_started_declension_masculine");
        } else {
          return this.$t("surveys.not_started_declension_neutral");
        }
      } else {
        return this.$t("surveys.not_specified");
      }
    },
  },
  methods: {
    getImageURL: getImageURL,
    photoAddress: photoAddress,
    getSurveyImage(url) {
      return photoAddress(url);
    },
    openSurvey() {
      this.$router.push('/survey_preview/' + this.survey.id);
    },
    toggleSurveyActions() {
      this.surveyActionsEnabled ^= true;
    },
    disableSurveyActions() {
      this.surveyActionsEnabled = false;
    },
  },
};
</script>

<style scoped>
.survey_card {
  display: flex;
  flex-direction: column;
  width: 264.5px;
  height: 282px;
  border-radius: 16px;
  box-shadow: 0px 7px 20px 0px rgba(138, 138, 138, 0.1);
  cursor: pointer;
}
.survey_cover {
  position: relative;
  height: 174px;
  border-radius: 16px 16px 0 0;
}
.survey_type {
  position: absolute;
  right: 9.5px;
  top: 10px;
  font-family: "Golos";
  font-size: 12px;
  font-weight: 600;
  line-height: 14px;
  padding: 4px 10px;
  border-radius: 8px;
}
.survey_image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
}
.survey_header {
  height: 108px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
}
.survey_name {
  height: 48px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.survey_footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.survey_info {
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Golos";
  font-size: 13px;
  font-weight: 400;
  line-height: 22px;
}
.gray_dot {
  border-radius: 50%;
  height: 4px;
  width: 4px;
}
.survey_actions_wrapper {
  position: relative;
}
.survey_actions {
  height: 24px;
  width: 24px;
}
.survey_actions_list {
  position: absolute;
  z-index: 1000;
  top: 0%;
  transform: translate(0px, -100%);
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 40px 0px rgba(0, 0, 0, 0.14);
  border-radius: 12px;
}

.survey_action {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.survey_action.top_button {
  border-radius: 12px 12px 0 0;
}
.action_icon {
  height: 24px;
  width: 24px;
}
.separator {
  margin: 0;
  border: 1px solid var(--secondOverlay);
}
.survey_action.bottom_button {
  border-radius: 0 0 12px 12px;
}
</style>