<template>
  <div class="test_management_questions" v-if="testInfo">
    <SectionDeletionForm
      v-if="sectionDeletionEnabled"
      @cancelSectionDeletion="cancelSectionDeletion"
      @deleteSection="deleteSection"
    />
    <div class="test_header">
      <div class="test_header_main">
        <div
          @click="enableHeaderEdition"
          class="test_name_and_description"
          v-click-outside="updateSurveyInfo"
        >
          <h1
            v-show="!headerEditionEnabled"
            class="test_name general-contrast-color"
          >
            {{ testInfo.title || $t("tests.questions.test_name") }}
          </h1>
          <h1
            v-show="!headerEditionEnabled"
            v-html="testDescriptionHTML"
            class="test_description general-secondary-color"
          ></h1>
          <div class="input_field_wrapper" v-show="headerEditionEnabled">
            <div
              v-show="testInfo"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("tests.questions.test_name") }}
            </div>
            <input
              @input="markChangesAsUnsaved"
              class="input_field general-contrast-color"
              v-model="testInfo.title"
              :placeholder="$t('tests.questions.test_name')"
            />
          </div>
          <div class="input_field_wrapper" v-show="headerEditionEnabled">
            <div
              v-show="testInfo"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.description") }}
            </div>
            <textarea
              ref="testTextArea"
              @input="adjustSurveyDescriptionHeight(true)"
              class="input_field textarea general-contrast-color"
              v-model="testInfo.description"
              :placeholder="$t('surveys.description')"
            />
          </div>
        </div>
        <label
          class="cover_upload_wrapper general-secondary-color"
          for="cover_upload"
          @click.stop="enableHeaderEdition"
        >
          {{ uploaderTitle }}
          <AttachCoverIcon class="cover_action_icon" />
          <input
            ref="coverLoader"
            id="cover_upload"
            type="file"
            @change="onFileSelected"
          />
        </label>
      </div>
      <div
        class="attached_image_wrapper"
        v-if="headerEditionEnabled && (attachedFileToDisplay || hasPhoto)"
      >
        <button class="delete_button" @click.stop="deleteImage">
          <CloseIcon />
        </button>
        <img
          v-if="attachedFileToDisplay"
          class="attached_image"
          :src="attachedFileToDisplay"
          alt="survey_cover"
        />
        <img
          v-else-if="!attachedFileToDisplay && hasPhoto"
          class="attached_image"
          :src="getImageUrl()"
          alt="survey_cover"
        />
      </div>
    </div>
    <div class="sections" :class="{ flex_end: sections.length < 2 }">
      <div class="sections_tabs" :class="{ invisible: sections.length < 2 }">
        <button
          class="section_tab minor-info-secondary-bg general-contrast-color"
          :class="{ active: currentSection?.id === section.id }"
          @click="currentSection = section"
          v-for="section in sections"
        >
          {{ section.title }}
          <button
            class="transparent-bg"
            v-if="currentSection?.id === section.id"
            @click.stop="enableSectionDeletion(section)"
          >
            <DeleteSectionIcon class="delete_section_icon" />
          </button>
        </button>
      </div>
      <div class="section_info_and_addition">
        <InfoIcon
          class="info_icon tooltip_container"
          :data-tooltip="$t('surveys.displays_on_diff_pages')"
        />
        <button
          class="add_section brand-secondary-bg general-brand-color"
          @click="addSection"
        >
          {{ $t("surveys.add_section") }}
        </button>
      </div>
    </div>
    <div
      v-if="sections.length > 0"
      class="section_header_wrapper"
      :class="{ single_section: sections.length === 1 }"
    >
      <div
        class="section_header_top_border general-brand-bg"
        :class="{ hidden: sections.length === 1 }"
      ></div>
      <div v-show="sections.length > 1" class="section_header">
        <div
          @click="enableHeaderEditionForCurrentSection"
          class="test_name_and_description"
          v-click-outside="updateSectionInfo"
        >
          <h1
            v-show="!currentSection?.headerEditionEnabled"
            class="test_name general-contrast-color"
          >
            {{ currentSection?.title || $t("surveys.section_name") }}
          </h1>
          <h1
            v-show="!currentSection?.headerEditionEnabled"
            v-html="sectionDescriptionHTML"
            class="test_description general-secondary-color"
          ></h1>
          <div
            class="input_field_wrapper"
            v-show="currentSection?.headerEditionEnabled"
          >
            <div
              v-show="currentSection?.title"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.section_name") }}
            </div>
            <input
              @input="markChangesAsUnsaved"
              class="input_field general-contrast-color"
              v-model="currentSection.title"
              :placeholder="$t('surveys.section_name')"
            />
          </div>
          <div
            class="input_field_wrapper"
            v-show="currentSection?.headerEditionEnabled"
          >
            <div
              v-show="currentSection?.description"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.description") }}
            </div>
            <textarea
              ref="sectionTextarea"
              @input="adjustSectionDescriptionHeight(true)"
              class="input_field textarea general-contrast-color"
              v-model="currentSection.description"
              :placeholder="$t('surveys.description')"
            />
          </div>
        </div>
        <!-- <div class="action_after_cur_section">
          <h1 class="action_after_section_text general-secondary-color">
            {{
              `${$t("surveys.action_after_section")} '${currentSection?.title}'`
            }}
          </h1>
          <div class="input_field_wrapper" v-if="currentSection">
            <div
              v-if="currentSection?.selectedNextAction"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.action_after_section") }}
            </div>
            <vSelect
              v-model="currentSection.selectedNextAction"
              :options="currentSection?.nextActionsList"
              :placeholder="$t('surveys.action_after_section')"
            />
          </div>
        </div> -->
      </div>
      <SlickList
        @sort-end="onDragEnd"
        v-if="currentSection.questionnaireblock_set"
        v-model:list="currentSection.questionnaireblock_set"
        class="questions_list"
        :class="{ cursor_move: testStore.questionDragStarted }"
        lock-axis="y"
        :distance="10"
        :accept="true"
        useDragHandle
      >
        <SlickItem
          v-for="(question, idx) in currentSection.questionnaireblock_set"
          :index="idx"
          :key="question.id"
          class="slick_list_item"
        >
          <QuestionCard
            v-click-outside="() => closeQuestion(question)"
            :question="question"
            :questionId="question.id"
            @addQuestion="addQuestion"
            @deleteQuestion="deleteQuestion"
            @questionTypeChanged="questionTypeChanged"
            @linearScaleChanged="linearScaleChanged"
            :key="question"
          />
        </SlickItem>
      </SlickList>
      <button
        v-if="!lastQuestionOpened"
        class="add_question general-brand-bg general-white-color"
        @click="addQuestion"
      >
        <PlusIcon class="attach_file_icon" />
        {{ $t("surveys.add_question") }}
      </button>
    </div>
  </div>
</template>

<script>
import { SlickList, SlickItem } from "vue-slicksort";

import AttachCoverIcon from "@/components/Icons/SurveyIcons/AttachCoverIcon.vue";
import InfoIcon from "@/components/Icons/SurveyIcons/InfoIcon.vue";
import RemoveAttachedCoverIcon from "@/components/Icons/SurveyIcons/RemoveAttachedCoverIcon.vue";
import vSelect from "vue-select";
import QuestionCard from "./QuestionCard.vue";
import { API_URIS } from "@/constants/api";
import axios from "axios";
import { notify } from "@/general-scripts/toast-notification";
import { photoAddress } from "@/general-scripts/photo-address";
import DeleteSectionIcon from "@/components/Icons/SurveyIcons/DeleteSectionIcon.vue";
import SectionDeletionForm from "./SectionDeletionForm.vue";
import PlusIcon from "@/components/Icons/SurveyIcons/PlusIcon.vue";
import CloseIcon from "@/components/Icons/close_select.vue";
import { mapStores } from "pinia";
import { useStore as useTestStore } from "@/store/TestStore/index";

export default {
  name: "TestManagementQuestions",
  components: {
    AttachCoverIcon,
    RemoveAttachedCoverIcon,
    InfoIcon,
    vSelect,
    QuestionCard,
    DeleteSectionIcon,
    SectionDeletionForm,
    SlickList,
    SlickItem,
    PlusIcon,
    CloseIcon,
  },
  data() {
    return {
      mouseDownTime: null,
      headerEditionEnabled: false,
      sectionDeletionEnabled: false,
      selectedImage: null,
      currentSection: null,
      testInfo: null,
      sections: [],
      attachedFileToDisplay: null,
      uploaderTitle: this.$t("surveys.cover"),
    };
  },
  mounted() {
    this.getSurveyInfo();
  },
  computed: {
    ...mapStores(useTestStore),
    sectionDescriptionHTML() {
      let description =
        this.currentSection?.description || this.$t("surveys.description");
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n|\r|\n/g, "<br>");
    },
    testDescriptionHTML() {
      let description =
        this.testInfo?.description || this.$t("surveys.description");
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n|\r|\n/g, "<br>");
    },
    lastQuestionOpened() {
      let questionsList = this.currentSection?.questionnaireblock_set;
      let lastIndex = questionsList?.length - 1;
      if (questionsList?.length > 0 && questionsList[lastIndex].opened)
        return true;
      return false;
    },
    hasPhoto() {
      if (this.testInfo.image) {
        return true;
      }
    },
  },
  methods: {
    photoAddress: photoAddress,
    getImageUrl() {
      return `${this.photoAddress(this.testInfo.image)}?thumbnail=1`;
    },
    linearScaleChanged(value, id) {
      setTimeout(() => {
        this.getSurveyInfo();
      }, 100);
    },
    markChangesAsSaved() {
      this.testStore.changesSaved = true;
    },
    markChangesAsUnsaved() {
      this.testStore.changesSaved = false;
    },
    adjustSectionDescriptionHeight(markAsUnsaved = false) {
      if (markAsUnsaved) this.markChangesAsUnsaved();
      const textarea = this.$refs.sectionTextarea;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },
    adjustSurveyDescriptionHeight(markAsUnsaved = false) {
      if (markAsUnsaved) this.markChangesAsUnsaved();
      const textarea = this.$refs.testTextArea;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },
    async onDragEnd(el) {
      try {
        let draggedElement =
          this.currentSection.questionnaireblock_set[el.oldIndex];
        await axios.patch(
          API_URIS.questionnariesBlock + draggedElement.id + "/",
          {
            ordering: el.newIndex + 1,
            answer_type: draggedElement.answer_type,
            questionnaire_group: draggedElement.questionnaire_group,
          }
        );
        this.getSurveyInfo(false);
      } catch (err) {
        throw err;
      }
    },
    enableHeaderEdition() {
      this.headerEditionEnabled = true;
      setTimeout(() => {
        this.adjustSurveyDescriptionHeight();
      }, 300);
    },
    enableHeaderEditionForCurrentSection() {
      this.currentSection.headerEditionEnabled = true;
      setTimeout(() => {
        this.adjustSectionDescriptionHeight();
      }, 300);
    },
    async onFileSelected(event) {
      this.attachedFileToDisplay = URL.createObjectURL(event.target.files[0]);
      this.uploaderTitle = event.target.files[0].name;
      try {
        let formData = new FormData();
        formData.append("image", event.target.files[0]);
        await axios.patch(
          API_URIS.questionnaries + this.testInfo.id + "/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.selectedImage = event.target.files[0];
        event.target.value = "";
      } catch (err) {
        notify(this.$t("notification.error"));
        this.uploaderTitle = this.$t("surveys.cover");
        throw err;
      }
    },
    async deleteImage() {
      try {
        await axios.patch(API_URIS.questionnaries + this.testInfo.id + "/", {
          image: null,
        });
        this.attachedFileToDisplay = null;
        this.testInfo.image = null;
        this.selectedImage = null;
        this.uploaderTitle = this.$t("surveys.cover");
        this.$refs.coverLoader.files;
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    enableSectionDeletion() {
      this.sectionDeletionEnabled = true;
    },
    cancelSectionDeletion() {
      this.sectionDeletionEnabled = false;
    },
    async deleteSection() {
      try {
        await axios.delete(
          API_URIS.questionnariesGroups + this.currentSection.id + "/"
        );
        this.sectionDeletionEnabled = false;
        this.getSurveyInfo();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateSectionInfo() {
      if (!this.currentSection.headerEditionEnabled) return;
      try {
        const response = await axios.patch(
          API_URIS.questionnariesGroups + this.currentSection.id + "/",
          {
            title: this.currentSection.title,
            description: this.currentSection.description,
          }
        );
        this.markChangesAsSaved();
        this.currentSection.headerEditionEnabled = false;
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async updateSurveyInfo() {
      if (!this.headerEditionEnabled) return;
      try {
        const response = await axios.patch(
          API_URIS.questionnaries + this.testInfo.id + "/",
          {
            title: this.testInfo.title,
            description: this.testInfo.description,
          }
        );
        this.markChangesAsSaved();
        this.headerEditionEnabled = false;
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async getSurveyInfo(goToLastSection = true) {
      try {
        const response = await axios.get(
          API_URIS.questionnaries + this.$route.params.id + "/"
        );
        this.testInfo = response.data;
        this.sections = response.data.questionnairegroup_set;
        if (this.sections.length > 0) {
          if (goToLastSection) {
            this.currentSection = this.sections[this.sections.length - 1];
          } else {
            for (let i = 0; i < this.sections.length; ++i) {
              if (this.sections[i].id === this.currentSection.id) {
                this.currentSection = this.sections[i];
                break;
              }
            }
          }
        } else {
          this.addSection();
        }
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    closeQuestion(question) {
      if (question?.opened) {
        question.opened = false;
        this.updateQuestion(question);
      }
    },
    questionTypeChanged(questionId, questionType) {
      this.currentSection.questionnaireblock_set.find(
        (el) => el.id == questionId
      ).answer_type = questionType;
      // if (questionType == QUESTION_TYPES.SCALE) {
      //   this.currentSection.questionnaireblock_set.find(
      //     (el) => el.id == questionId
      //   ).inner_object[0].max_score = 5;
      // }

      this.getSurveyInfo();
    },
    async updateQuestion(question) {
      if (question.deleted) return;
      try {
        await axios.patch(API_URIS.questionnariesBlock + question.id + "/", {
          question: question.question,
          description: question.description,
        });
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async deleteQuestion(question) {
      try {
        question.deleted = true;
        await axios.delete(API_URIS.questionnariesBlock + question.id + "/");
        this.getSurveyInfo(false);
      } catch (err) {
        question.deteled = false;
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async addQuestion(question = null) {
      if (question && question?.opened) question.opened = false;
      try {
        let payload = {
          questionnaire_group: this.currentSection.id,
          question: `${this.$t("surveys.question")} ${
            question.ordering <
            this.currentSection.questionnaireblock_set.length
              ? question.ordering + 1
              : this.currentSection.questionnaireblock_set.length + 1
          }`,
          answer_type: 1,
        };
        if (
          question.ordering < this.currentSection.questionnaireblock_set.length
        ) {
          payload["ordering"] = question.ordering + 1;
        }
        const response = await axios.post(
          API_URIS.questionnariesBlock,
          payload
        );
        this.getSurveyInfo(false);
      } catch {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async addStartingQuestion() {
      try {
        const response = await axios.post(API_URIS.questionnariesBlock, {
          questionnaire_group: this.currentSection.id,
          question: `${this.$t("surveys.question")} ${
            this.currentSection.questionnaireblock_set.length + 1
          }`,
          answer_type: 1,
        });
        await this.getSurveyInfo();
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    async addSection() {
      try {
        const response = await axios.post(API_URIS.questionnariesGroups, {
          title: `${this.$t("surveys.section")} ${this.sections.length + 1}`,
          questionnaire: parseInt(this.$route.params.id),
        });
        await this.getSurveyInfo();
        await this.addStartingQuestion();
        this.currentSection.questionnaireblock_set[0].opened = true;
        this.currentSection.questionnaireblock_set[0].answer_type = 1;
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.test_management_questions {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.test_header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--generalColorGrey);
}
.test_header_main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.test_name_and_description {
  width: 100%;
  max-width: 567px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
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
.test_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}
.test_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.input_field {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.input_field.textarea {
  max-height: 300px;
  overflow-y: auto;
  resize: vertical;
}
.cover_upload_wrapper {
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  cursor: pointer;
  border: 1px dashed var(--generalColorGrey);
  border-radius: 12px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.cover_action_icon {
  height: 24px;
  width: 24px;
  cursor: pointer;
}
#cover_upload {
  display: none;
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
.attached_image {
  max-width: 557px;
  max-height: 347px;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.uploaded_file_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  min-width: 300px;
  box-sizing: border-box;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--generalBrand);
}
.sections {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.sections.flex_end {
  justify-content: flex-end;
}
.sections_tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sections_tabs.invisible {
  display: none;
}
.section_tab {
  padding: 8px 14px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-radius: 12px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}
.section_tab.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  box-shadow: 0px 8px 24px 2px rgba(var(--generalBrandRGB), 0.12);
  box-shadow: 0px 0px 7px 2px rgba(var(--generalBrandRGB), 0.02);
}
.delete_section_icon {
  height: 16px;
  width: 16px;
}
.section_info_and_addition {
  display: flex;
  align-items: center;
  gap: 12px;
}
.info_icon {
  position: relative;
  height: 20px;
  width: 20px;
}
.tooltip_container:hover::before {
  width: 150px;
  box-sizing: border-box;
  white-space: normal;
}
.add_section {
  padding: 8px 14px;
  border-radius: 12px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
}

.section_header_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px 24px 21px 24px;
  border-left: 1px solid var(--generalColorGrey);
  border-right: 1px solid var(--generalColorGrey);
  border-bottom: 1px solid var(--generalColorGrey);
  border-radius: 0 0 20px 20px;
}
.section_header_wrapper.single_section {
  border: none;
  padding: 0;
  border-radius: 0;
}
.section_header_top_border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 11px;
}
.section_header_top_border.hidden {
  display: none;
}
.section_header {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}
.action_after_cur_section {
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.action_after_section_text {
  white-space: nowrap;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.questions_list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cursor_move {
  cursor: move;
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
.attach_file_icon {
  height: 24px;
  width: 24px;
}
::v-deep(.dragged .question_itself) {
  border: 1px solid var(--generalBrand);
}
::v-deep(.dragged .question_edition_form) {
  border: 1px solid var(--generalBrand);
}
</style>

<style>
body > .slick_list_item > .question_card > .question_itself {
  border: 1px solid var(--generalBrand);
}
body > .slick_list_item > .question_card > .question_edition_form {
  border: 1px solid var(--generalBrand);
}
body
  > .slick_list_item
  > .question_card
  > .question_itself
  > .toggle_state
  > span
  > .expand_or_contract_icon
  > svg
  > circle {
  fill: var(--generalBrand);
}
body
  > .slick_list_item
  > .question_card
  > .question_edition_form
  > .toggle_state
  > span
  > .expand_or_contract_icon
  > svg
  > circle {
  fill: var(--generalBrand);
}
</style>