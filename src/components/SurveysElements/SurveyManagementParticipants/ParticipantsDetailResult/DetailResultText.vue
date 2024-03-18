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
      <div class="_question_line" v-if="question.inner_object[0]?.my_answer">
        <h3 class="_question_answer_title">
          {{ $t("surveys.answer") }}
        </h3>
        <!-- <input
          type="text"
          class="_question_answer"
          disabled
          v-model="question.inner_object[0].my_answer"
        /> -->
        <textarea
          type="text"
          class="_question_answer"
          disabled
          v-model="question.inner_object[0].my_answer.text"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailResultText",
  props: {
    question: {
      required: true,
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
  align-items: center;
  gap: 16px;
}
._question_answer_title {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  color: var(--generalContrast);
  margin: 0;
}
._question_answer {
  width: 40%;
  min-width: 300px;
  min-height: 52px;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalContrast);
  border: 1px solid var(--generalColorGrey);
  background-color: transparent;
  resize: none;
}
</style>