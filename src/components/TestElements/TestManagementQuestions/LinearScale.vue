<template>
  <div class="linear_scale">
    <div v-show="question?.opened" class="linear_scale_edition">
      <div class="scale_corner">
        <h1 class="scale_corner_index general-contrast-color">1</h1>
        <div @click.stop class="input_field_wrapper">
          <div
            v-show="question.inner_object[0].min_title"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("surveys.description_optional") }}
          </div>
          <input
            @click.stop
            @blur="updateMinTitle"
            @input="markChangesAsUnsaved"
            v-model="this.question.inner_object[0].min_title"
            class="input_field"
            :placeholder="$t('surveys.description_optional')"
          />
        </div>
      </div>
      <div class="scale_corner">
        <h1 class="scale_corner_index general-contrast-color">
          {{ scaleLength }}
        </h1>
        <div @click.stop class="input_field_wrapper">
          <div
            v-show="question.inner_object[0].max_title"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("surveys.description_optional") }}
          </div>
          <input
            @click.stop
            @blur="updateMaxTitle"
            @input="markChangesAsUnsaved"
            v-model="this.question.inner_object[0].max_title"
            class="input_field"
            :placeholder="$t('surveys.description_optional')"
          />
        </div>
      </div>
      <div class="length_tuner">
        <h1 class="length_text general-secondary-color">
          {{ $t("surveys.count") }}
        </h1>
        <button
          class="length_tuner_button minor-info-secondary-bg"
          @click.stop="decreaseLength"
        >
          <DecreaseScaleLengthIcon class="tune_scale_icon" />
        </button>
        <h1 class="scale_length_text general-contrast-color">
          {{ scaleLength }}
        </h1>
        <button
          class="length_tuner_button minor-info-secondary-bg"
          @click.stop="increaseLength"
        >
          <IncreaseScaleLengthIcon class="tune_scale_icon" />
        </button>
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
    <div v-show="!question?.opened" class="linear_scale_question">
      <div class="question_header_info">
        <div class="header_and_star">
          <h1 class="header_text general-contrast-color">
            {{ question.question }}
          </h1>
          <h1 v-show="question.required" class="header_star minor-error-color">
            *
          </h1>
        </div>
      </div>
      <h1 class="description_text general-secondary-color">
        {{ question.description }}
      </h1>
      <div class="scale_selectors_wrapper">
        <h1 class="corner_descriptions general-contrast-color">
          {{ question.inner_object[0].min_title }}
        </h1>
        <div class="scale_selectors">
          <div class="scale_selector" v-for="index in scaleLength" :key="index">
            <h1 class="scale_value general-contrast-color">{{ index }}</h1>
            <div
              @click.stop="selectOption(index)"
              class="answer_option_button minor-info-secondary-bg"
              :class="{ selected: currentSelected === index }"
            >
              <div
                v-show="currentSelected === index"
                class="option_selected_circle general-brand-bg"
              ></div>
            </div>
          </div>
        </div>
        <h1 class="corner_descriptions general-contrast-color">
          {{ question.inner_object[0].max_title }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

import DecreaseScaleLengthIcon from "@/components/Icons/SurveyIcons/DecreaseScaleLengthIcon.vue";
import DeleteQuestionIcon from "@/components/Icons/SurveyIcons/DeleteQuestionIcon.vue";
import IncreaseScaleLengthIcon from "@/components/Icons/SurveyIcons/IncreaseScaleLengthIcon.vue";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";
import { mapStores } from "pinia";

export default {
  name: "LinearScale",
  props: {
    question: {
      required: true,
    },
  },
  components: {
    DeleteQuestionIcon,
    DecreaseScaleLengthIcon,
    IncreaseScaleLengthIcon,
  },
  data() {
    return {
      startCornerDescription: "",
      endCornerDescription: "",
      scaleLength: 5,
      scaleLengthArray: [],
      currentSelected: -1,

      oldDescriptions: {
        minTitle: "",
        maxTitle: "",
      },
    };
  },
  computed: {
    ...mapStores(useSurveyStore),
  },
  methods: {
    async increaseLength() {
      this.scaleLength++;
      this.setScaleLength();
    },
    async decreaseLength() {
      if (this.scaleLength > 2) {
        this.scaleLength--;
        this.setScaleLength();
      }
    },
    markChangesAsSaved() {
      this.surveyStore.changesSaved = true;
    },
    markChangesAsUnsaved() {
      this.surveyStore.changesSaved = false;
    },
    setOldDescriptions() {
      this.oldDescriptions.minTitle = this.question.inner_object[0].min_title;
      this.oldDescriptions.maxTitle = this.question.inner_object[0].max_title;
    },
    async updateMinTitle() {
      if (
        this.oldDescriptions.minTitle ===
        this.question.inner_object[0].min_title
      )
        return;
      try {
        await axios.patch(
          API_URIS.questionnariesScale + this.question.inner_object[0].id + "/",
          {
            min_title: this.question.inner_object[0].min_title,
          }
        );
        this.oldDescriptions.minTitle = this.question.inner_object[0].min_title;
        this.markChangesAsSaved();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateMaxTitle() {
      if (
        this.oldDescriptions.maxTitle ===
        this.question.inner_object[0].max_title
      )
        return;
      try {
        await axios.patch(
          API_URIS.questionnariesScale + this.question.inner_object[0].id + "/",
          {
            max_title: this.question.inner_object[0].max_title,
          }
        );
        this.oldDescriptions.maxTitle = this.question.inner_object[0].max_title;
        this.markChangesAsSaved();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async setScaleLength() {
      try {
        let response = await axios.patch(
          API_URIS.questionnariesScale + this.question.inner_object[0].id + "/",
          {
            max_score: this.scaleLength,
          }
        );
        setTimeout(() => {
          this.setCurrentScaleLength(response.data.max_score);
        }, 100);
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    selectOption(index) {
      this.currentSelected = index;
    },
    setCurrentScaleLength(value) {
      if (value) {
        this.scaleLength = value;
      } else {
        this.scaleLength = this.question.inner_object[0].max_score;
      }
    },
  },
  mounted() {
    this.setCurrentScaleLength();
    this.setOldDescriptions();
  },
};
</script>

<style scoped>
.linear_scale_edition {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 32px;
}
.importance_and_delete_question {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}
.delete_question {
  height: 24px;
  width: 24px;
}
.linear_scale_question {
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
.scale_corner {
  display: flex;
  gap: 14px;
  align-items: center;
}
.scale_corner_index {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
  max-width: 567px;
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
.length_tuner {
  display: flex;
  gap: 10px;
  align-items: center;
}
.length_text {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.length_tuner_button {
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.tune_scale_icon {
  height: 16px;
  width: 16px;
}
.scale_length_text {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
}
.scale_selectors_wrapper {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: flex-end;
}
.corner_descriptions {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.scale_selectors {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}
.scale_selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.scale_value {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
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
</style>
