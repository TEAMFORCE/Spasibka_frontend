<template>
  <div class="survey_management_results">
    <div class="results_header">
      <!-- <div class="result_header_main">
        <h3 class="results_header_title">
          {{ $t("surveys.results.title") }}
        </h3>
        <label class="switch">
          <input type="checkbox" v-model="comparisonResults" />
          <span class="slider round"></span>
        </label>
      </div> -->
      <div
        class="download_excell_wrapper"
        v-if="userRole == 'Администратор' && !comparisonResults"
      >
        <button
          v-if="downloadPending"
          class="download_excell brand-secondary-bg general-brand-color"
          disabled
        >
          {{ $t("analyticsPage.reports.processing") }}
        </button>
        <button
          v-else
          class="download_excell general-brand-bg"
          @click="downloadExcel"
        >
          <DownloadIcon :currentColor="getIconColor()" />
          {{ $t("analyticsPage.reports.inputs.uplToExcel") }}
        </button>
      </div>
    </div>
    <div class="result_sections" v-if="questions.length > 1">
      <div
        class="result_sections_item"
        v-for="(item, index) in questions"
        :class="{ _active: activeSection == index }"
        @click="changeActiveSection(index)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="result_sections_info" v-if="questions.length > 1">
      <h3 class="result_sections_info_title">
        {{ questions[activeSection].title }}
      </h3>
      <h4 class="result_sections_info_description">
        {{ questions[activeSection].description }}
      </h4>
    </div>
    <div
      class="result_question_wrapper"
      v-if="questions.length"
      v-for="question in questions[activeSection].questionnaireblock_set"
    >
      <ResultRoundGraph
        v-if="question.answer_type === answerType.SINGLE_CHOICE"
        :question="question"
        :key="activeSection"
      />
      <ResultLineGraph
        v-if="question.answer_type === answerType.MULTIPLE_CHOICE"
        :question="question"
        :key="activeSection"
      />
      <ResultListGraph
        v-if="question.answer_type === answerType.TEXT_INPUT"
        :question="question"
        :key="activeSection"
      />
      <ResultLineGraph
        v-if="question.answer_type === answerType.SCALE"
        :question="question"
        :type="answerType.SCALE"
        :key="activeSection"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { ANSWER_TYPE } from "@/infrastructure/constants/survey-answer-type";

import DownloadIcon from "@/components/Icons/download.vue";
import ResultLineGraph from "@/components/SurveysElements/SurveyManagementResults/ResultLineGraph.vue";
import ResultRoundGraph from "@/components/SurveysElements/SurveyManagementResults/ResultRoundGraph.vue";
import ResultListGraph from "@/components/SurveysElements/SurveyManagementResults/ResultListGraph.vue";

export default {
  name: "SurveyManagementResults",
  components: {
    DownloadIcon,
    ResultLineGraph,
    ResultRoundGraph,
    ResultListGraph,
  },
  props: {
    surveyName: {
      requred: true,
    },
  },
  data() {
    return {
      comparisonResults: false,
      downloadPending: false,

      activeSection: 0,
      questions: [],
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    userRole() {
      let role = "";
      for (let i = 0; i < this.profileInfo?.privileged.length; ++i) {
        let curRole = this.profileInfo.privileged[i];
        role = curRole.role_name;
        if (role == "Администратор") {
          break;
        }
      }
      if (role == "") {
        role = "Пользователь";
      }
      return role;
    },
    answerType() {
      return ANSWER_TYPE;
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    changeActiveSection(index) {
      this.activeSection = index;
    },
    async getSurveyResult() {
      let response = await axios.get(
        API_URIS.questionnariesResult.replace("id", this.$route.params.id)
      );
      this.questions = response.data.questionnairegroup_set;
    },
    async downloadExcel() {
      try {
        this.downloadPending = true;
        let response = await axios.get(
          `${API_URIS.questionnariesResult.replace(
            "id",
            this.$route.params.id
          )}?xlsx=1`,
          { responseType: "arraybuffer" }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        let currentDate = new Date();
        currentDate = new Intl.DateTimeFormat("ru").format(currentDate);
        link.download = `${this.surveyName} ${currentDate}.xlsx`;
        link.click();

        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
  },
  mounted() {
    this.getSurveyResult();
  },
};
</script>

<style scoped>
.survey_management_results {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}
.results_header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
}
.result_header_main {
  display: flex;
  align-items: center;
  gap: 118px;
}
.results_header_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 400;
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
}
.download_excell {
  width: 192px !important;
  height: 52px !important;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  transition: 0.3s;
}
.download_icon {
  width: 14px;
  height: 18px;
}
.download_excell:hover {
  opacity: 0.9;
  transform: translate(0px, -1px);
}

.result_sections {
  display: flex;
  align-items: center;
  gap: 8px;
}
.result_sections_item {
  background-color: var(--secondaryColorBrand);
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: center;
  color: var(--generalContrast);
  padding: 8px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
}
.result_sections_item:hover {
  transform: translate(0px, -1px);
}
._active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}

.result_sections_info {
  width: 100%;
  padding: 20px 16px;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}
.result_sections_info_title {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: 0px;
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
}
.result_sections_info_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: left;
  color: var(--generalColorSecondary);
  margin: 0;
}
.result_question_wrapper {
  width: 100%;
}
</style>