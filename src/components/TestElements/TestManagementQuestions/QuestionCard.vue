<template>
  <div class="question_card general-white-bg">
    <div v-show="question?.opened" class="question_edition_form">
      <div @click="toggleState" class="form_wrapper">
        <div class="form_header">
          <div class="toggle_state transparent-bg">
            <DragHandle>
              <ExpandOrContractIcon class="expand_or_contract_icon" />
            </DragHandle>
          </div>
          <div class="name_attach_and_type">
            <div class="name_and_attach">
              <div @click.stop class="input_field_wrapper" v-show="question">
                <div
                  v-show="question.question"
                  class="input_field_placeholder general-secondary-color general-white-bg"
                >
                  {{ $t("surveys.question") }}
                </div>
                <input
                  @blur="updateQuestionTitle"
                  @input="markChangesAsUnsaved"
                  class="input_field general-contrast-color"
                  v-model="question.question"
                  :placeholder="$t('surveys.question')"
                />
              </div>
              <label :for="`attach_file_${questionId}`" @click.stop>
                <div class="attach_file_button general-white-bg">
                  <AttachCoverIcon
                    class="attach_file_icon"
                    :currentColor="generalBrandColor"
                  />
                </div>
                <input
                  :id="`attach_file_${questionId}`"
                  class="attach_file_input"
                  type="file"
                  @change="attachFile"
                />
              </label>
            </div>
            <vSelect
              @click.stop
              v-show="question"
              v-model="answerType"
              :options="questionType"
              :clearable="false"
              :searchable="false"
              label="title"
              @option:selected="updateQuestionType"
            >
              <template #selected-option="questionType">
                <div class="question_type_selected_option">
                  <component
                    :is="questionType.icon"
                    class="_selected_option_icon"
                  ></component>
                  {{ questionType.title }}
                </div>
              </template>
              <template #option="questionType">
                {{ questionType.answer_type }}
                <div class="question_type_option">
                  <component
                    :is="questionType.icon"
                    class="_selected_option_icon"
                  ></component>
                  {{ questionType.title }}
                </div>
              </template>
            </vSelect>
          </div>
          <div class="description_wrapper">
            <div @click.stop class="input_field_wrapper" v-show="question">
              <div
                v-show="question.description"
                class="input_field_placeholder general-secondary-color general-white-bg"
              >
                {{ $t("surveys.description") }}
              </div>
              <input
                @blur="updateQuestionDescription"
                @input="markChangesAsUnsaved"
                class="input_field general-contrast-color"
                v-model="question.description"
                :placeholder="$t('surveys.description')"
              />
            </div>
          </div>
        </div>
        <div
          class="attached_image_wrapper"
          v-show="attachedFileToDisplay || hasPhoto"
        >
          <button class="delete_button" @click.stop="deleteImage">
            <CloseIcon />
          </button>
          <img
            v-if="attachedFileToDisplay"
            class="attached_image"
            :src="attachedFileToDisplay"
            alt="question image"
          />
          <img
            v-else-if="!attachedFileToDisplay && hasPhoto"
            class="attached_image"
            :src="getImageUrl()"
            alt="question image"
          />
        </div>
        <component
          :is="getComponent()"
          :question="question"
          @deleteQuestion="$emit('deleteQuestion', question)"
          ref="_answers"
        ></component>
      </div>
      <div class="additional_params"></div>
      <button
        class="add_question general-brand-bg general-white-color"
        @click="$emit('addQuestion', question)"
      >
        <PlusIcon class="attach_file_icon" />
        {{ $t("surveys.add_question") }}
      </button>
    </div>
    <div
      class="question_itself"
      v-show="!question?.opened"
      @click="toggleState"
    >
      <div class="toggle_state transparent-bg">
        <DragHandle>
          <ExpandOrContractIcon class="expand_or_contract_icon" />
        </DragHandle>
      </div>
      
      <component :is="getComponent()" :question="question"></component>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { mapStores } from "pinia";
import { useStore as useTestStore } from "@/store/TestStore/index";
import { notify } from "@/general-scripts/toast-notification";
import { photoAddress } from "@/general-scripts/photo-address";
import { QUESTION_TYPE } from "@/infrastructure/data-sources/question-type";
import { QUESTION_TYPES } from "@/infrastructure/constants/question-types";
import { DragHandle } from "vue-slicksort";
import vSelect from "vue-select";

import SingleChoice from "./SingleChoice.vue";
import MultipleChoice from "./MultipleChoice.vue";
import TextAnswer from "./TextAnswer.vue";
import LinearScale from "./LinearScale.vue";
import AttachCoverIcon from "@/components/Icons/SurveyIcons/AttachCoverIcon.vue";
import ExpandOrContractIcon from "@/components/Icons/SurveyIcons/ExpandOrContractIcon.vue";
import LinearScaleIcon from "@/components/Icons/SurveyIcons/LinearScaleIcon.vue";
import MultiChoiceIcon from "@/components/Icons/SurveyIcons/MultiChoiceIcon.vue";
import PlusIcon from "@/components/Icons/SurveyIcons/PlusIcon.vue";
import SingleChoiceIcon from "@/components/Icons/SurveyIcons/SingleChoiceIcon.vue";
import TextAnswerIcon from "@/components/Icons/SurveyIcons/TextAnswerIcon.vue";
import CloseIcon from "@/components/Icons/close_select.vue";

export default {
  name: "QuestionCard",
  props: {
    question: {
      required: true,
    },
    questionId: {
      required: true,
    },
  },
  components: {
    DragHandle,
    vSelect,
    SingleChoice,
    MultipleChoice,
    TextAnswer,
    LinearScale,
    AttachCoverIcon,
    ExpandOrContractIcon,
    LinearScaleIcon,
    MultiChoiceIcon,
    PlusIcon,
    SingleChoiceIcon,
    TextAnswerIcon,
    CloseIcon,
  },
  data() {
    return {
      answerType: "",
      attachedFile: null,
      attachedFileToDisplay: null,

      oldTitle: "",
      oldDescription: "",
      oldType: "",
    };
  },
  computed: {
    ...mapStores(useTestStore),
    generalBrandColor() {
      return getComputedStyle(document.documentElement).getPropertyValue(
        "--generalBrand"
      );
    },
    questionType() {
      return QUESTION_TYPE(this);
    },
    questionTypes() {
      return QUESTION_TYPES;
    },
    hasPhoto() {
      if (this.question.image) {
        return true;
      }
    },
  },

  methods: {
    markChangesAsSaved() {
      this.testStore.changesSaved = true;
    },
    markChangesAsUnsaved() {
      this.testStore.changesSaved = false;
    },

    toggleState() {
      this.question.opened ^= true;
      this.setAnswer();
      if (!this.question.opened) {
        this.updateQuestion();
      }
    },
    setAnswer() {
      this.answerType = this.questionType.find(
        (el) => el.type == this.question.answer_type
      );
    },
    getComponent() {
      let currentComponent = this.questionType.find(
        (el) => el.type == this.question.answer_type
      ).component;
      return currentComponent;
    },
    photoAddress: photoAddress,
    getImageUrl() {
      return `${this.photoAddress(this.question.image)}?thumbnail=1`;
    },
    setOldValues() {
      this.oldTitle = this.question.question;
      this.oldDescription = this.question.description;
      this.oldType = this.question.answer_type;
    },
    async updateQuestionTitle() {
      if (this.question.deleted) return;
      if (this.oldTitle == this.question.question) return;
      try {
        await axios.patch(
          API_URIS.questionnariesBlock + this.question.id + "/",
          {
            question: this.question.question,
          }
        );
        this.oldTitle = this.question.question;
        this.markChangesAsSaved();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async attachFile(event) {
      this.attachedFile = event.target.files[0];
      this.attachedFileToDisplay = URL.createObjectURL(this.attachedFile);
      try {
        const formData = new FormData();
        formData.append("image", this.attachedFile);
        let response = await axios.patch(
          API_URIS.questionnariesBlock + this.question.id + "/",
          formData
        );
        event.target.value = "";
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async deleteImage() {
      try {
        let response = await axios.patch(
          API_URIS.questionnariesBlock + this.question.id + "/",
          {
            image: null,
          }
        );
        this.attachedFileToDisplay = null;
        this.question.image = null;
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateQuestionType(option) {
      if (this.oldType == option.type) return;
      try {
        await axios.patch(
          API_URIS.questionnariesBlock + this.question.id + "/",
          {
            answer_type: option.type,
          }
        );
        this.oldType = option.type;
        this.$emit(
          "questionTypeChanged",
          this.question.id,
          this.answerType.type
        );
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateQuestionDescription() {
      if (this.question.deleted) return;
      if (this.oldDescription == this.question.description) return;
      try {
        await axios.patch(
          API_URIS.questionnariesBlock + this.question.id + "/",
          {
            description: this.question.description,
          }
        );
        this.oldDescription = this.question.description;
        this.markChangesAsSaved();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateQuestion() {
      if (this.question.deleted) return;
      try {
        let response = await axios.patch(
          API_URIS.questionnariesBlock + this.question.id + "/",
          {
            question: this.question.question,
            description: this.question.description,
          }
        );
        if (response.data?.inner_object[0]?.max_score) {
          this.$emit("linearScaleChanged");
        }
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
  },
  mounted() {
    this.setAnswer();
    this.setOldValues();
  },
};
</script>

<style scoped>
.question_card {
  position: relative;
}
.question_edition_form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form_wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  border: 1px solid var(--generalBrand);
  padding: 0px 20px 20px 20px;
  border-radius: 20px;
}
.form_header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toggle_state {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
}
.expand_or_contract_icon {
  cursor: move;
  height: 9px;
  width: 17px;
}
.name_attach_and_type {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.name_and_attach {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
}
.attached_image_wrapper {
  width: 100%;
  height: 100%;
  max-width: 557px;
  max-height: 347px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  position: relative;
}
.delete_button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  transition: 0.3s;
}
.delete_button:hover {
  transform: scale(1.2);
}
.delete_button:active {
  transform: scale(0.9);
}
.attached_image {
  max-width: 557px;
  max-height: 347px;
  width: 100%;
  height: 100%;
  object-fit: contain;
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
.attach_file_input {
  display: none;
}
.attach_file_button {
  cursor: pointer;
  padding: 14px;
  border: 1px solid var(--generalBrand);
  border-radius: 12px;
}
.attach_file_icon {
  height: 24px;
  width: 24px;
}
::v-deep(.v-select) {
  width: 100%;
  max-width: 280px;
  box-sizing: border-box;
}
::v-deep(.vs__dropdown-toggle) {
  height: 100% !important;
}
.question_type_option {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 17px 16px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.question_type_selected_option {
  display: flex;
  gap: 12px;
  align-items: center;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.add_question {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  align-self: center;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}
.question_itself {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 20px;
  border: 1px solid var(--generalColorGrey);
  padding: 0px 20px 20px 20px;
}

._selected_option_icon {
  height: 24px;
  width: 24px;
}
</style>
