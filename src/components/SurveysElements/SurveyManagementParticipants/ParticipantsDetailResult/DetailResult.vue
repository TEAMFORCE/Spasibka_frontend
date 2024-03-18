<template>
  <div class="detail_result">
    <div class="detail_result_sections_navigation" v-if="answers.length > 1">
      <div
        class="_sections_navigation_item"
        v-for="(item, index) in answers"
        :class="{ _active: activeSection == index }"
        @click="changeActiveSection(index)"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="detail_result_sections_info" v-if="answers">
      <h3 class="detail_result_sections_info_title">
        {{ answers[activeSection].title }}
      </h3>
      <h4 class="detail_result_sections_info_description">
        {{ answers[activeSection].description }}
      </h4>
    </div>
    <div
      v-if="answers"
      class="question_wrapper"
      v-for="answer in answers[activeSection].questionnaireblock_set"
    >
      <DetailResultRadio
        v-if="answer.answer_type === answerType.SINGLE_CHOICE"
        :question="answer"
      />
      <DetailsResultCheckbox
        v-if="answer.answer_type === answerType.MULTIPLE_CHOICE"
        :question="answer"
      />
      <DetailResultText
        v-if="answer.answer_type === answerType.TEXT_INPUT"
        :question="answer"
      />
      <DetailResultLine
        v-if="answer.answer_type === answerType.SCALE"
        :question="answer"
      />
    </div>
  </div>
</template>

<script>
import { ANSWER_TYPE } from "@/infrastructure/constants/survey-answer-type";

import DetailResultRadio from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsDetailResult/DetailResultRadio.vue";
import DetailsResultCheckbox from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsDetailResult/DetailsResultCheckbox.vue";
import DetailResultLine from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsDetailResult/DetailResultLine.vue";
import DetailResultText from "@/components/SurveysElements/SurveyManagementParticipants/ParticipantsDetailResult/DetailResultText.vue";

export default {
  name: "DetailResult",
  props: {
    answers: {
      requred: true,
    },
  },
  components: {
    DetailResultRadio,
    DetailsResultCheckbox,
    DetailResultLine,
    DetailResultText,
  },
  data() {
    return {
      activeSection: 0,
    };
  },
  computed: {
    answerType() {
      return ANSWER_TYPE;
    },
  },

  methods: {
    changeActiveSection(index) {
      this.activeSection = index;
    },
  },
};
</script>

<style scoped>
.detail_result {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}
.detail_result_sections_navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}
._sections_navigation_item {
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
._sections_navigation_item:hover {
  transform: translate(0px, -1px);
}
._active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.detail_result_sections_info {
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
.detail_result_sections_info_title {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: 0px;
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
}
.detail_result_sections_info_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0px;
  text-align: left;
  color: var(--generalColorSecondary);
  margin: 0;
}
.question_wrapper {
  width: 100%;
}
</style>