<template>
  <div class="text_answer">
    <div v-show="question?.opened" class="text_answer_edition">
      <div class="input_field_wrapper">
        <input
          disabled
          @click.stop
          class="input_field"
          :placeholder="$t('surveys.answer')"
        />
      </div>
      <div class="importance_and_delete_question">
        <button
          class="delete_question transparent-bg"
          @click="$emit('deleteQuestion')"
        >
          <DeleteQuestionIcon class="question_block_icon" />
        </button>
      </div>
    </div>
    <div v-show="!question?.opened" class="text_answer_question">
      <div class="question_header_info">
        <div class="header_and_star">
          <h1 class="header_text general-contrast-color">
            {{ question.question }}
          </h1>
          <h1 v-if="question.required" class="header_star minor-error-color">
            *
          </h1>
        </div>
        <h1 class="description_text general-secondary-color">
          {{ question.description }}
        </h1>
      </div>
      <!-- <div class="input_field_wrapper">
        <div
          v-if="textAnswer"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("surveys.answer") }}
        </div>
        <input
          @click.stop
          v-model="textAnswer"
          class="input_field"
          :placeholder="$t('surveys.answer')"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import DeleteQuestionIcon from "@/components/Icons/SurveyIcons/DeleteQuestionIcon.vue";

export default {
  name: "TextAnswer",
  props: {
    question: {
      required: true,
    },
  },
  components: { DeleteQuestionIcon },
  data() {
    return {
      textAnswer: "",
    };
  },
};
</script>

<style scoped>
.text_answer_edition {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.importance_and_delete_question {
  display: flex;
  gap: 20px;
}
.delete_question {
  height: 24px;
  width: 24px;
}
.text_answer_question {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.question_header_info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.header_and_star {
  display: flex;
  gap: 5px;
}
.header_text {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
}
.header_star {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
}
.description_text {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
  max-width: 587px;
  box-sizing: border-box;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.input_field {
  width: 100%;
  max-width: 587px;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
}
.input_field::placeholder {
  color: var(--generalColorSecondary);
}
</style>
