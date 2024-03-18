<template>
  <div class="_question_wrapper" v-if="question">
    <div class="_question_name">
      {{ `${$t("surveys.question")} ${question.ordering}` }}
    </div>
    <div class="_questions_block">
      <div class="_question_info">
        <h3 class="_question_title">
          {{ question.question }}
        </h3>
        <h4 class="_question_description">
          {{ question.description }}
        </h4>
      </div>
      <div class="_question_line">
        <h4 class="_question_line_title">
          {{ question.inner_object[0].min_title }}
        </h4>
        <div class="_total_scores">
          <div
            class="_score_wrapper"
            v-for="(score, index) in question.inner_object[0].max_score"
            :key="index"
          >
            <h4 class="_score_value">
              {{ score }}
            </h4>
            <div
              class="_score_point minor-info-secondary-bg"
              :class="{ selected: isSelected(score) }"
            >
              <div
                v-if="isSelected(score)"
                class="_score_point_circle general-brand-bg"
              ></div>
            </div>
          </div>
        </div>
        <h4 class="_question_line_title">
          {{ question.inner_object[0].max_title }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailResultLine",
  props: {
    question: {
      required: true,
    },
  },
  methods: {
    isSelected(score) {
      if (score === this.question.inner_object[0].my_answer?.score) {
        return true;
      }
    },
  },
};
</script>

<style  scoped>
._question_wrapper {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
._question_name {
  min-width: 140px;
  box-sizing: border-box;
  padding: 10px 33px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--generalBrand);
}
._questions_block {
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 16px;
  gap: 32px;
  flex-grow: 1;
}
._question_title {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
._question_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
._question_line {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
}
._question_line_title {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalContrast);
  margin: 0;
}
._total_scores {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}
._score_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
._score_value {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
  color: var(--generalContrast);
}
._score_point {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
}
._score_point.selected {
  border: 1px solid var(--generalBrand);
  background-color: var(--generalColorWhite);
}
._score_point_circle {
  border-radius: 50%;
  width: 12px;
  height: 12px;
}
</style>