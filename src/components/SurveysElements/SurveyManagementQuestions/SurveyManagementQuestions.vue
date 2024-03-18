<template>
  <div class="survey_management_questions" v-if="surveyInfo">
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <SectionDeletionForm
      v-if="sectionDeletionEnabled"
      @cancelSectionDeletion="cancelSectionDeletion"
      @deleteSection="deleteSection"
    />
    <div class="survey_header">
      <div class="survey_heder_main">
        <div
          @click="enableHeaderEdition"
          class="survey_name_and_description"
          v-click-outside="updateSurveyInfo"
        >
          <h1
            v-show="!headerEditionEnabled"
            class="survey_name general-contrast-color"
          >
            {{ surveyInfo.title || $t("surveys.survey_name") }}
          </h1>
          <h1
            v-show="!headerEditionEnabled"
            v-html="surveyDescriptionHTML"
            class="survey_description general-secondary-color"
          ></h1>
          <div class="input_field_wrapper" v-show="headerEditionEnabled">
            <div
              v-show="surveyInfo"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.survey_name") }}
            </div>
            <input
              @input="markChangesAsUnsaved"
              class="input_field general-contrast-color"
              v-model="surveyInfo.title"
              :placeholder="$t('surveys.survey_name')"
            />
          </div>
          <div class="input_field_wrapper" v-show="headerEditionEnabled">
            <div
              v-show="surveyInfo"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("surveys.description") }}
            </div>
            <textarea
              ref="surveyTextarea"
              @input="adjustSurveyDescriptionHeight(true)"
              class="input_field textarea general-contrast-color"
              v-model="surveyInfo.description"
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
          class="survey_name_and_description"
          v-click-outside="updateSectionInfo"
        >
          <h1
            v-show="!currentSection?.headerEditionEnabled"
            class="survey_name general-contrast-color"
          >
            {{ currentSection?.title || $t("surveys.section_name") }}
          </h1>
          <h1
            v-show="!currentSection?.headerEditionEnabled"
            v-html="sectionDescriptionHTML"
            class="survey_description general-secondary-color"
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
        :class="{ cursor_move: surveyStore.questionDragStarted }"
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

import Loading from "vue3-loading-overlay";
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
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";
import { QUESTION_TYPES } from "@/infrastructure/constants/question-types";

export default {
  name: "SurveyManagementQuestions",
  components: {
    Loading,
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
      isLoading: false, // НАХОДИМСЯ ЛИ МЫ В СОСТОЯНИИ ЗАГРУЗКИ ДАННЫХ
      headerEditionEnabled: false, // НАХОДИМСЯ ЛИ МЫ В РЕЖИМЕ РЕДАКТИРОВАНИЯ ЗАГОЛОВКА ОПРОСА
      sectionDeletionEnabled: false,// НАХОДИМСЯ ЛИ МЫ В РЕЖИМЕ РЕДАКТИРОВАНИЯ ЗАГОЛОВКА СЕКЦИИ ОПРОСА
      selectedImage: null,
      currentSection: null, // ТЕКУЩАЯ СЕКЦИЯ В КОТОРОЙ МЫ НАХОДИМСЯ
      surveyInfo: null, // ИНФОРМАЦИЯ ОБ ОПРОСЕ
      sections: [], // СПИСОК СЕКЦИЙ ОПРОСА
      attachedFileToDisplay: null,
      uploaderTitle: this.$t("surveys.cover"),
    };
  },
  mounted() { // ПРИ МАУНТЕ ПОДГРУЖАЕМ ДАННЫЕ ОПРОСА (СЕКЦИИ, ВОПРОСЫ, И Т.Д.)
    this.getSurveyInfo();
  },
  watch: {
    isLoading: { // ЕСЛИ НАХОДИМСЯ В СОСТОЯНИИ ЗАГРУЗКИ ТО ОТОБРАЖАЕМ ЛОАДЕР
      handler(newVal) {
        if (newVal) this.positionLoader();
      }
    }
  },
  computed: {
    ...mapStores(useSurveyStore), // ПОДВЯЗКА СТОРА ПРОФИЛЯ
    sectionDescriptionHTML() { // ВЫВОД ОПИСАНИЯ СЕКЦИИ С КЛИКАБЕЛЬНЫМИ ССЫЛКАМИ И ПЕРЕНОСАМИ СТРОК
      let description =
        this.currentSection?.description || this.$t("surveys.description");
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n|\r|\n/g, "<br>");
    },
    surveyDescriptionHTML() { // ВЫВОД ОПИСАНИЯ ОПРОСА С КЛИКАБЕЛЬНЫМИ ССЫЛКАМИ И ПЕРЕНОСАМИ СТРОК
      let description =
        this.surveyInfo?.description || this.$t("surveys.description");
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n|\r|\n/g, "<br>");
    },
    lastQuestionOpened() { // ОТКРЫТА ЛИ КАРТОЧКА ПОСЛЕДНЕГО ВОПРОСА СЕКЦИИ
      let questionsList = this.currentSection?.questionnaireblock_set;
      let lastIndex = questionsList?.length - 1;
      if (questionsList?.length > 0 && questionsList[lastIndex].opened)
        return true;
      return false;
    },
    hasPhoto() {
      if (this.surveyInfo.image) {
        return true;
      }
    },
  },
  methods: {
    positionLoader() { // ПОЗИЦИОНИРОВАНИЕ ЛОАДЕРА ВО ВРЕМЯ ЗАГРУЗКИ ДАННЫХ
      const el = document.getElementsByClassName("survey_management_questions")[0];
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.display = "flex";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    photoAddress: photoAddress,
    getImageUrl() {
      return `${this.photoAddress(this.surveyInfo.image)}?thumbnail=1`;
    },
    linearScaleChanged(value, id) {
      setTimeout(() => {
        this.getSurveyInfo();
      }, 100);
    },
    markChangesAsSaved() { // ПОМЕЧАЕМ ВСЕ ИЗМЕНЕНИЯ КАК СОХРАНЕНЫ
      this.surveyStore.changesSaved = true;
    },
    markChangesAsUnsaved() { // ЧТО-ТО ИЗМЕНИЛОСЬ НО ПОКА НЕ СИНХРОНИЗИРОВАЛОСЬ С БЭКОМ
      this.surveyStore.changesSaved = false;
    },

    // МЕТОД ДЛЯ УВЕЛИЧЕНИЯ ВЫСОТЫ ТЕКСТОВОГО ПОЛЯ ДЛЯ РЕДАКТИРОВАНИЯ ОПИСАНИЯ ТЕКУЩЕЙ СЕКЦИИ
    // ЕСЛИ АРГУМЕНТ=FALSE, ЗНАЧИТ ЭТО ИНИЦИАЛИЗАЦИЯ. ИНАЧЕ, ЭТО ВВОД В ТЕКСТОВОЕ ПОЛЕ, ЧТО МОЖЕТ УВЕЛИЧИТЬ ВЫСОТУ
    adjustSectionDescriptionHeight(markAsUnsaved = false) {
      if (markAsUnsaved) this.markChangesAsUnsaved(); 
      const textarea = this.$refs.sectionTextarea;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },

    // МЕТОД ДЛЯ УВЕЛИЧЕНИЯ ВЫСОТЫ ТЕКСТОВОГО ПОЛЯ ДЛЯ РЕДАКТИРОВАНИЯ ОПИСАНИЯ ОПРОСА
    // ЕСЛИ АРГУМЕНТ=FALSE, ЗНАЧИТ ЭТО ИНИЦИАЛИЗАЦИЯ. ИНАЧЕ, ЭТО ВВОД В ТЕКСТОВОЕ ПОЛЕ, ЧТО МОЖЕТ УВЕЛИЧИТЬ ВЫСОТУ
    adjustSurveyDescriptionHeight(markAsUnsaved = false) {
      if (markAsUnsaved) this.markChangesAsUnsaved();
      const textarea = this.$refs.surveyTextarea;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },

    // МЕТОД СРАБАТЫВАЕМЫЙ ПРИ ОКОНЧАНИИ ПЕРЕМЕЩЕНИЯ КАРТОЧКИ ОПРОСА
    async onDragEnd(el) {
      try {
        // НАХОДИМ ВОПРОС КОТОРЫЙ ПЕРЕТАЩИЛИ
        let draggedElement =
          this.currentSection.questionnaireblock_set[el.oldIndex];

        // PATCH-ЗАПРОС НА ИЗМЕНЕНИЕ ПОРЯДКОВОГО НОМЕРА ВОПРОСА, ПЕРЕДАЕМ ЕГО ID
        await axios.patch(
          API_URIS.questionnariesBlock + draggedElement.id + "/",
          {
            ordering: el.newIndex + 1, // НОВАЯ ПОЗИЦИЯ
            answer_type: draggedElement.answer_type, // ТИП ВОПРОСА
            questionnaire_group: draggedElement.questionnaire_group, // СЕКЦИЯ, К КОТОРОЙ ОН ПРИНАДЛЕЖИТ
          }
        );
        this.getSurveyInfo(false); // ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ
      } catch (err) {
        throw err;
      }
    },
    
    // МЕТОД ДЛЯ ВХОДА В РЕЖИМ РЕДАКТИРОВАНИЯ ЗАГОЛОВКА ОПРОСА
    enableHeaderEdition() { 
      this.headerEditionEnabled = true;
      setTimeout(() => { // УВЕЛИЧИВАЕМ ВЫСОТУ ТЕКСТОВОГО ПОЛЯ ОПИСАНИЯ ДЛЯ УДОБСТВА
        this.adjustSurveyDescriptionHeight();
      }, 300);
    },

    // МЕТОД ДЛЯ ВХОДА В РЕЖИМ РЕДАКТИРОВАНИЯ ЗАГОЛОВКА ТЕКУЩЕЙ СЕКЦИИ
    enableHeaderEditionForCurrentSection() { 
      this.currentSection.headerEditionEnabled = true;
      setTimeout(() => { // УВЕЛИЧИВАЕМ ВЫСОТУ ТЕКСТОВОГО ПОЛЯ ОПИСАНИЯ ДЛЯ УДОБСТВА
        this.adjustSectionDescriptionHeight();
      }, 300);
    },

    // МЕТОД ДЛЯ ДОБАВЛЕНИЯ КАРТИНКИ К ОПРОСУ
    async onFileSelected(event) {
      this.attachedFileToDisplay = URL.createObjectURL(event.target.files[0]);
      this.uploaderTitle = event.target.files[0].name;
      try {
        let formData = new FormData();
        formData.append("image", event.target.files[0]);
        await axios.patch(
          API_URIS.questionnaries + this.surveyInfo.id + "/",
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

    // МЕТОД ДЛЯ УДАЛЕНИЯ КАРТИНКИ ОПРОСА
    async deleteImage() {
      try {
        await axios.patch(API_URIS.questionnaries + this.surveyInfo.id + "/", {
          image: null,
        });
        this.attachedFileToDisplay = null;
        this.surveyInfo.image = null;
        this.selectedImage = null;
        this.uploaderTitle = this.$t("surveys.cover");
        this.$refs.coverLoader.files;
      } catch (err) {
        notify(this.$t("notification.error"));
        throw err;
      }
    },
    enableSectionDeletion() { // МЕТОД ДЛЯ ОТКРЫТИЯ ОКНА УДАЛЕНИЯ СЕКЦИИ
      this.sectionDeletionEnabled = true; 
    },
    cancelSectionDeletion() { // МЕТОД ДЛЯ ЗАКРЫТИЯ ОКНА УДАЛЕНИЯ СЕКЦИИ
      this.sectionDeletionEnabled = false;
    },

    // МЕТОД ДЛЯ УДАЛЕНИИ СЕКЦИИ ИЗ ОПРОСА
    async deleteSection() {
      try {
        this.isLoading = true; // ВХОДИМ В РЕЖИМ ЗАГРУЗКИ

        // DELETE-ЗАПРОС ДЛЯ УДАЛЕНИЯ СЕКЦИИ ПО ЕЁ ID
        await axios.delete( 
          API_URIS.questionnariesGroups + this.currentSection.id + "/"
        );
        this.sectionDeletionEnabled = false; // ЗАКРЫВАЕМ ОКНО УДАЛЕНИЯ СЕКЦИИ
        await this.getSurveyInfo(); // ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ
        this.isLoading = false; // ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
      } catch (err) {
        this.isLoading = false; // ПРИ ОШИБКЕ ТАКЖЕ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
        notify(this.$t("notification.error")); // ВЫВОДИМ ОШИБКУ НА ЭКРАН
        throw err;
      }
    },

    // МЕТОД ДЛЯ СОХРАНЕНИЯ ДАННЫХ ЗАГОЛОВКА СЕКЦИИ ПРИ КЛИКЕ ЗА ЕГО ПРЕДЕЛЫ 
    async updateSectionInfo() { 
      if (!this.currentSection.headerEditionEnabled) return; // ЕСЛИ МЫ НЕ В РЕЖИМЕ РЕДАКТИРОВАНИЯ, ЗНАЧИТ НИЧЕГО НЕ ДЕЛАЕМ
      try {
        // PATCH-ЗАПРОС ДЛЯ ОБНОВЛЕНИЯ ИНФОРМАЦИИ О СЕКЦИИ
        const response = await axios.patch(
          API_URIS.questionnariesGroups + this.currentSection.id + "/",
          {
            title: this.currentSection.title, // НАЗВАНИЕ
            description: this.currentSection.description, // ОПИСАНИЕ
          }
        );
        this.markChangesAsSaved();  // ПОМЕЧАЕМ ВСЕ ИЗМЕНЕНИЯ СОХРАНЕННЫМИ
        this.currentSection.headerEditionEnabled = false; // ВЫХОДИМ ИЗ РЕЖИМА РЕДАКТИРОВАНИЯ ЗАГОЛОВКА
      } catch (err) {
        notify(this.$t("notification.error")); // ПРИ ОШИБКЕ ВЫВОДИМ СООБЩЕНИЕ
        throw err;
      }
    },

    // МЕТОД ДЛЯ СОХРАНЕНИЯ ДАННЫХ ЗАГОЛОВКА ОПРОСА ПРИ КЛИКЕ ЗА ЕГО ПРЕДЕЛЫ
    async updateSurveyInfo() { 
      if (!this.headerEditionEnabled) return; // ЕСЛИ МЫ НЕ В РЕЖИМЕ РЕДАКТИРОВАНИЯ, ЗНАЧИТ НИЧЕГО НЕ ДЕЛАЕМ
      try {

        // PATCH-ЗАПРОС ДЛЯ ОБНОВЛЕНИЯ ИНФОРМАЦИИ ОБ ОПРОСЕ
        const response = await axios.patch(
          API_URIS.questionnaries + this.surveyInfo.id + "/",
          {
            title: this.surveyInfo.title, // НАЗВАНИЕ
            description: this.surveyInfo.description, // ОПИСАНИЕ
          }
        );
        this.markChangesAsSaved(); // ПОМЕЧАЕМ ВСЕ ИЗМЕНЕНИЯ СОХРАНЕННЫМИ
        this.headerEditionEnabled = false; // ВЫХОДИМ ИЗ РЕЖИМА РЕДАКТИРОВАНИЯ ЗАГОЛОВКА
      } catch (err) {
        notify(this.$t("notification.error")); // ПРИ ОШИБКЕ ВЫВОДИМ СООБЩЕНИЕ
        throw err;
      }
    },

    // МЕТОД ДЛЯ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ОБ ОПРОСЕ
    // АРГУМЕНТ ДЛЯ ТОГО, ЧТОБЫ ЗНАТЬ ПЕРЕХОДИТЬ ЛИ СРАЗУ К ПОСЛЕДНЕЙ СЕКЦИИ ПОСЛЕ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ИЛИ НЕТ
    async getSurveyInfo(goToLastSection = true) { 
      try {

        // GET-ЗАПРОС ДЛЯ ПОЛУЧЕНИЯ ИНФОРМАЦИИ ОБ ОПРОСЕ ПО ID ОПРОСА
        const response = await axios.get(
          API_URIS.questionnaries + this.$route.params.id + "/"
        );
        this.surveyInfo = response.data; // ЗАПИСЫВАЕМ ИНФОРМАЦИЮ
        this.sections = response.data.questionnairegroup_set; // ЗАПИСЫВАЕМ СПИСОК СЕКЦИЙ ОПРОСА
        if (this.sections.length > 0) { // ЕСЛИ ХОТЬ ОДНА СЕКЦИЯ ЕСТЬ
          if (goToLastSection) {  // ЕСЛИ НУЖНО ПЕРЕЙТИ В ПОСЛЕДНЮЮ СЕКЦИЮ, ПЕРЕХОДИМ
            this.currentSection = this.sections[this.sections.length - 1]; 
          } else { // ИНАЧЕ ПЕРЕХОДИМ В СЕКЦИЮ КОТОРАЯ БЫЛА ВЫБРАНА ДО ЭТОГО
            for (let i = 0; i < this.sections.length; ++i) { 
              if (this.sections[i].id === this.currentSection.id) {
                this.currentSection = this.sections[i];
                break;
              }
            }
          }
        } else { // ЕСЛИ НЕТ СЕКЦИЙ СОВСЕМ, ТО СОЗДАЕМ ОДНУ, ТАК КАК БЕЗ СЕКЦИЙ И ВОПРОСОВ НЕ БУДЕТ
          this.addSection();
        }
      } catch (err) { // ПРИ ОШИБКЕ, ВЫВОДИМ СООБЩЕНИЕ НА ЭКРАН
        notify(this.$t("notification.error")); 
        throw err;
      }
    },

    closeQuestion(question) { // МЕТОД ДЛЯ ЗАКРЫТИЯ КАРТОЧКИ ВОПРОСА
      if (question?.opened) {  // ЕСЛИ ВОПРОС ОТКРЫТ
        question.opened = false; // ТО ЗАКРЫВАЕМ ЕГО
        this.updateQuestion(question); // А ТАКЖЕ ОБНОВЛЯЕМ ВСЕ НЕСОХРАНЕННЫЕ ИЗМЕНЕНИЯ
      }
    },

    // МЕТОД ВЫЗЫВАЕМЫЙ ПРИ ИЗМЕНЕНИИ ТИПА ВОПРОСА
    // В АРГУМЕНТАХ ПЕРЕДАЮТСЯ ID ВОПРОСА И ЕГО НОВЫЙ ТИП
    async questionTypeChanged(questionId, questionType) {
      let curSectionID = this.currentSection.id; // ПОЛУЧАЕМ ID ТЕКУЩЕЙ СЕКЦИИ

      // НАХОДИМ В ТЕКУЩЕЙ СЕКЦИИ ПЕРЕДАННЫЙ ВОПРОС И ИЗМЕНЯЕМ ЕГО ТИП
      this.currentSection.questionnaireblock_set.find(
        (el) => el.id == questionId 
      ).answer_type = questionType;
      // if (questionType == QUESTION_TYPES.SCALE) {
      //   this.currentSection.questionnaireblock_set.find(
      //     (el) => el.id == questionId
      //   ).inner_object[0].max_score = 5;
      // }

      await this.getSurveyInfo(); // ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ

      // НАХОДИМ СЕКЦИЮ В КОТОРОЙ МЫ НАХОДИЛИСЬ ДО ОБНОВЛЕНИЯ ИНФОРМАЦИИ, И ОТКРЫВАЕМ ЕЁ ЗАНОВО
      for (let i = 0; i < this.sections.length; ++i) {
        if (this.sections[i].id === curSectionID) {
          this.currentSection = this.sections[i];
          break;
        }
      }

      // ТАКЖЕ НАХОДИМ ВОПРОС, КОТОРЫЙ БЫЛ ОТКРЫТ ДО ОБНОВЛЕНИЯ ИНФОРМАЦИИ, И ОТКРЫВАЕМ ЕГО СНОВА
      for (let i = 0; i < this.currentSection.questionnaireblock_set.length; ++i) {
        let currentQuestion = this.currentSection.questionnaireblock_set[i];
        if (currentQuestion.id === questionId) {
          currentQuestion.opened = true;
          break;
        }
      }
    },

    // МЕТОД ДЛЯ ВНЕСЕНИЯ ИЗМЕНЕНИЙ В ВОПРОС
    async updateQuestion(question) { 
      // ЕСЛИ ВОПРОС УДАЛЕН НО ИНФОРМАЦИЯ ЕЩЕ НЕ ОБНОВИЛАСЬ, ЗНАЧИТ ОН СКОРО УДАЛИТСЯ, И РЕДАКТИРОВАТЬ НЕЛЬЗЯ
      if (question.deleted) return; 
      try {
        // PATCH-ЗАПРОС НА РЕДАКТИРОВАНИЕ ВОПРОСА
        await axios.patch(API_URIS.questionnariesBlock + question.id + "/", {
          question: question.question, // ПЕРЕДАЕМ НАЗВАНИЕ ВОПРОСА
          description: question.description, // ПЕРЕДАЕМ ОПИСАНИЕ ВОПРОСА
        });
      } catch (err) {
        notify(this.$t("notification.error")); // СООБЩЕНИЕ ОБ ОШИБКЕ
        throw err;
      }
    },

    // МЕТОД ДЛЯ УДАЛЕНИЯ ВОПРОСА ИЗ СЕКЦИИ
    async deleteQuestion(question) {
      try {
        this.isLoading = true; // ВХОДИМ В СОСТОЯНИЕ ЗАГРУЗКИ 
        question.deleted = true; // ПОМЕЧАЕМ ВОПРОС КАК УДАЛЕННЫЙ

        // POST-ЗАПРОС ДЛЯ УДАЛЕНИЯ ВОПРОСА, ПЕРЕДАЕМ ID ВОПРОСА
        await axios.delete(API_URIS.questionnariesBlock + question.id + "/"); 
        await this.getSurveyInfo(false); // ПОСЛЕ УДАЛЕНИЯ ВОПРОСА ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ
        this.isLoading = false; // ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
      } catch (err) {
        this.isLoading = false; // ПРИ ОШИБКЕ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
        question.deteled = false; // ЕСЛИ ОШИБКА, ТО ЗНАЧИТ ВОПРОС НЕ УДАЛИЛСЯ, УБИРАЕМ МЕТКУ
        notify(this.$t("notification.error")); // СООБЩЕНИЕ ОБ ОШИБКЕ
        throw err;
      }
    },

    // МЕТОД ДЛЯ ДОБАВЛЕНИЯ ВОПРОСА В СЕКЦИЮ
    // ЕСЛИ АРГУМЕНТ НЕ ПЕРЕДАЕТСЯ, ЗНАЧИТ СОЗДАЕМ ВОПРОС В КОНЕЦ СЕКЦИИ
    // ИНАЧЕ АРГУМЕНТ ЭТО ССЫЛКА НА ВОПРОС В СЕКЦИИ, ПОСЛЕ КОТОРОГО СОЗДАЕМ ВОПРОС
    async addQuestion(question = null) { 
      if (question && question?.opened) question.opened = false; // ЕСЛИ ВОПРОС РАСКРЫТ, ТО ЗАКРЫВАЕМ ЕГО
      try {
        this.isLoading = true; // ВХОДИМ В СОСТОЯНИЕ ЗАГРУЗКИ
        let payload = { 
          questionnaire_group: this.currentSection.id, // ПЕРЕДАЕМ ID СЕКЦИИ

          // НАЗВАНИЯ НОВОГО ВОПРОСА ЗАВИСИТ ОТ ПОРЯДКОВОГО НОМЕРА ТЕКУЩЕГО ВОПРОСА
          question: `${this.$t("surveys.question")} ${ 
            question.ordering <
            this.currentSection.questionnaireblock_set.length
              ? question.ordering + 1
              : this.currentSection.questionnaireblock_set.length + 1
          }`,
          answer_type: 1, // ТИП ВОПРОСА ПО УМОЛЧАНИЮ ОДИНОЧНЫЙ
        };

        // ПЕРЕДАЕМ ПОРЯДКОВЫЙ НОМЕР ВОПРОСА КАК СЛЕДУЮЩИЙ ОТ ТЕКУЩЕГО ВОПРОСА
        if ( 
          question.ordering < this.currentSection.questionnaireblock_set.length
        ) {
          payload["ordering"] = question.ordering + 1;
        }

        // ЕСЛИ НОВЫЙ ВОПРОС ПОСЛЕДНИЙ (ТЕКУЩИЙ ВОПРОС НЕ ПЕРЕДАН В АРГУМЕНТАХ), ЗНАЧИТ ПОРЯДКОВЫЙ НОМЕР ТОЖЕ ПОСЛЕДНИЙ
        if (!question?.ordering) payload["ordering"] = this.currentSection.questionnaireblock_set.length + 1;
        
        // POST-ЗАПРОС ДЛЯ СОЗДАНИЯ ВОПРОСА
        const response = await axios.post(
          API_URIS.questionnariesBlock, 
          payload
        );
        await this.getSurveyInfo(false); // ПОСЛЕ СОЗДАНИЯ ВОПРОСА ПОЛУЧАЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ
        this.isLoading = false; // ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
      } catch {
        this.isLoading = false; // ПРИ ОШИБКЕ ТАКЖЕ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
        notify(this.$t("notification.error"));
        throw err;
      }
    },

    // МЕТОД ДЛЯ ДОБАВЛЕНИЯ ПЕРВОГО ВОПРОСА В ПУСТОЙ СЕКЦИИ
    async addStartingQuestion() {
      try {

        // POST-ЗАПРОС ДЛЯ СОЗДАНИЯ ВОПРОСА
        const response = await axios.post(API_URIS.questionnariesBlock, {
          questionnaire_group: this.currentSection.id, // ПЕРЕДАЕМ ID ТЕКУЩЕЙ СЕКЦИИ
          question: `${this.$t("surveys.question")} ${ // ПЕРЕДАЕМ ИМЯ ВОПРОСА ИСХОДЯ ИЗ КОЛИЧЕСТВА УЖЕ ИМЕЮЩИХСЯ ВОПРОСОВ
            this.currentSection.questionnaireblock_set.length + 1
          }`,
          answer_type: 1, // ТИП ВОПРОСА ПО УМОЛЧАНИЮ ОДИНОЧНЫЙ ВЫБОР
        });
        await this.getSurveyInfo(); // ПОСЛЕ СОЗДАНИЯ ВОПРОСА ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ ДЛЯ СИНХРОНИЗАЦИИ С БЭКОМ
      } catch (err) {
        notify(this.$t("notification.error")); // СООБЩЕНИЕ ОБ ОШИБКЕ
        throw err;
      }
    },

    // МЕТОД ДЛЯ ДОБАВЛЕНИЯ СЕКЦИИ В ОПРОС
    async addSection() { 
      try {
        this.isLoading = true; // ВХОДИМ В СОСТОЯНИЕ ЗАГРУЗКИ ДЛЯ ОТОБРАЖЕНИЯ ЛОАДЕРА

        // POST-ЗАПРОС ДЛЯ СОЗДАНИЯ СЕКЦИИ
        const response = await axios.post(API_URIS.questionnariesGroups, {
          title: `${this.$t("surveys.section")} ${this.sections.length + 1}`, // ИМЯ СЕКЦИИ ИСХОДЯ ИЗ КОЛИЧЕСТВА УЖЕ ИМЕЮЩИХСЯ СЕКЦИЙ
          ordering: this.sections.length + 1, // ПОРЯДКОВЫЙ НОМЕР СЕКЦИИ БУДЕТ ПОСЛЕДНИМ
          questionnaire: parseInt(this.$route.params.id), // ID ТЕКУЩИЙ ОПРОСА, КОТОРОМУ ПРИНАДЛЕЖИТ СЕКЦИЯ
        });
        await this.getSurveyInfo(); // ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОПРОСЕ, ТАК КАК НОВАЯ СЕКЦИЯ ДОБАВЛЕНА
        await this.addStartingQuestion(); // СОЗДАЕМ ПЕРВЫЙ ВОПРОС В НОВОЙ СЕКЦИИ ТАК КАК ЗАЧЕМ СЕКЦИЯ БЕЗ ВОПРОСА
        this.currentSection.questionnaireblock_set[0].opened = true; // ОТКРЫВАЕМ СОЗДАННЫЙ ВОПРОС ДЛЯ РЕДАКТИРОВАНИЯ
        this.currentSection.questionnaireblock_set[0].answer_type = 1; // ЕГО ТИП ПО УМОЛЧАНИЮ ЭТО ОДИНОЧНЫЙ ВЫБОР
        this.isLoading = false; // ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ 
      } catch (err) {
        this.isLoading = false; // ПРИ ОШИБКЕ ТАКЖЕ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
        notify(this.$t("notification.error"));
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.survey_management_questions {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.survey_header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--generalColorGrey);
}
.survey_heder_main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.survey_name_and_description {
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
.survey_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}
.survey_description {
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
  /* background-color: transparent; */
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background-color: rgba(255, 255, 255, 0.5);
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
  object-fit: cover;
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