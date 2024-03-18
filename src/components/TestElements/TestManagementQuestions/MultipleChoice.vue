<template>
  <div class="single_choice">
    <div v-show="question?.opened" class="single_choice_edition">
      <div class="answer_options_list">
        <div
          @click.stop
          v-for="(option, index) in question.inner_object"
          class="answer_option_field"
        >
          <QuestionAnswerOptionsIcon class="answer_options_icon" />
          <div class="input_field_wrapper">
            <div
              v-if="option.answer"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ `${$t("surveys.answer")} ${index + 1}` }}
            </div>
            <!-- <div class="input_field_and_options_wrapper"> -->
            <input
              @blur="updateAnswer(option, index)"
              @input="markChangesAsUnsaved"
              v-model="option.answer"
              :placeholder="`${$t('surveys.answer')} ${index + 1}`"
              class="input_field"
            />
            <div class="answer_option_options">
              <!-- <button class="transparent-bg">
                <ImageAnswerOptionIcon class="question_block_icon"/>
              </button> -->
              <button
                @click="deleteOption(option, index)"
                class="transparent-bg"
              >
                <DeleteAnswerOptionIcon class="question_block_icon" />
              </button>
            </div>
            <!-- </div> -->
          </div>
        </div>
      </div>
      <div class="add_answer_and_delete_question">
        <button
          class="add_answer_option general-brand-bg general-white-color"
          @click.stop="addAnswerOption"
        >
          <PlusIcon class="question_block_icon" />
          {{ $t("surveys.add_answer_option") }}
        </button>
        <div class="importance_and_delete_question">
          <button
            class="delete_question transparent-bg"
            @click="$emit('deleteQuestion')"
          >
            <DeleteQuestionIcon class="question_block_icon" />
          </button>
        </div>
      </div>
    </div>
    <div v-show="!question?.opened" class="single_choice_question">
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
      <div class="answer_options">
        <button
          class="answer_option transparent-bg"
          v-for="(option, index) in question.inner_object"
        >
          <input
            @click.stop
            type="checkbox"
            class="checkbox"
            v-model="option.selected"
          />
          <!-- <div
            @click="selectOption(index)"
            class="answer_option_button minor-info-secondary-bg"
            :class="{ selected: option.selected }"
          >
            <div
              v-if="option.selected"
              class="option_selected_circle general-brand-bg"
            ></div>
          </div> -->
          <h1 class="answer_option_text general-contrast-color">
            {{ option.answer }}
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DeleteAnswerOptionIcon from "@/components/Icons/SurveyIcons/DeleteAnswerOptionIcon.vue";
import DeleteQuestionIcon from "@/components/Icons/SurveyIcons/DeleteQuestionIcon.vue";
import ImageAnswerOptionIcon from "@/components/Icons/SurveyIcons/ImageAnswerOptionIcon.vue";
import PlusIcon from "@/components/Icons/SurveyIcons/PlusIcon.vue";
import QuestionAnswerOptionsIcon from "@/components/Icons/SurveyIcons/QuestionAnswerOptionsIcon.vue";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import axios from "axios";
import { mapStores } from "pinia";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";

export default {
  name: "MultipleChoice",
  props: {
    question: {
      required: true,
    },
  },
  components: {
    QuestionAnswerOptionsIcon,
    PlusIcon,
    ImageAnswerOptionIcon,
    DeleteAnswerOptionIcon,
    DeleteQuestionIcon,
  },
  data() {
    return {
      oldAnswers: [],
    };
  },
  computed: {
    ...mapStores(useSurveyStore),
  },
  methods: {
    markChangesAsSaved() {
      this.surveyStore.changesSaved = true;
    },
    markChangesAsUnsaved() {
      this.surveyStore.changesSaved = false;
    },
    setOldAnswers() {
      for (let i = 0; i < this.question.inner_object.length; i++) {
        this.oldAnswers.push(this.question.inner_object[i].answer);
      }
    },
    async deleteOption(option, index) {
      try {
        await axios.delete(
          API_URIS.questionnariesAnswerSelect + option.id + "/"
        );
        this.question.inner_object.splice(index, 1);
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async addAnswerOption() {
      try {
        const response = await axios.post(API_URIS.questionnariesAnswerSelect, {
          questionnaire_block: this.question.id,
        });
        this.question.inner_object.push(response.data);
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateAnswer(option, index) {
      if (this.oldAnswers[index] === option.answer) return;
      try {
        const response = await axios.patch(
          API_URIS.questionnariesAnswerSelect + option.id + "/",
          {
            answer: option.answer,
            questionnaire_block: option.questionnaire_block,
          }
        );
        this.oldAnswers[index] = option.answer;
        this.markChangesAsSaved();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
  },
  mounted() {
    this.setOldAnswers();
  },
};
</script>

<style scoped>
.single_choice_edition {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: -22px;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
  max-width: 567px;
  box-sizing: border-box;
}
.input_field_wrapper.description {
  max-width: 587px;
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
.input_field_and_options_wrapper {
  display: flex;
  gap: 6px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
}
.input_field_text {
  border-style: none;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.input_field_text::placeholder {
  color: var(--generalColorSecondary);
}
.answer_options_list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.answer_option_field {
  display: flex;
  align-items: center;
}
.answer_options_icon {
  height: 20px;
  width: 20px;
}
.answer_option_options {
  display: flex;
  gap: 6px;
  align-items: center;
  position: absolute;
  right: 16px;
  top: 16px;
}
.add_answer_and_delete_question {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}
.add_answer_option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  width: fit-content;
}
.question_block_icon {
  height: 24px;
  width: 24px;
}
.importance_and_delete_question {
  display: flex;
  gap: 20px;
}
.delete_question {
  height: 24px;
  width: 24px;
}
.single_choice_question {
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
.answer_options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.answer_option {
  display: flex;
  gap: 10px;
  align-items: center;
}
.answer_option_button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
}
.answer_option_button.selected {
  border: 1px solid var(--generalBrand);
  background-color: var(--generalColorWhite);
}
.option_selected_circle {
  border-radius: 50%;
  width: 12px;
  height: 12px;
}
.answer_option_text {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
</style>
