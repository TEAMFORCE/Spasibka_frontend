<template>
  <div
    ref="adminSurveys"
    class="admin_surveys general-white-bg"
    v-scroll-end="handleScrollEnd"
  >
    <CreateVotingScreen
      :votingStartTime="votingStartTime"
      :votingEndTime="votingEndTime"
      @disableVotingCreation="disableVotingCreation"
      @votingCreated="votingCreated"
      @configureVotingTime="configureVotingTime"
      v-show="createVotingEnabled"
    />
    <ConfigureVotingTimeScreen
      v-show="configureVotingTimeEnabled"
      @cancelVotingTimeChanges="cancelVotingTimeChanges"
      @confirmVotingTimeChanges="confirmVotingTimeChanges"
    />
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <div
      class="survey_actions_list"
      v-click-outside="() => closeRowOptions()"
      id="survey_actions_list"
    >
      <button
        v-if="currentRow?.status === 1"
        @click="enableSurveyEnd(currentRow)"
        class="survey_action top_button general-white-bg general-contrast-color"
      >
        <EndSurveyIcon class="action_icon" />
        {{ $t("surveys.end") }}
      </button>
      <hr v-if="currentRow?.status === 1" class="separator" />
      <button
        @click="shareSurveyLink(currentRow)"
        class="survey_action general-white-bg general-contrast-color"
        :class="{ top_button: currentRow?.status !== 1 }"
      >
        <ShareSurveyIcon class="action_icon" />
        {{ $t("surveys.share") }}
      </button>
      <hr class="separator" />
      <button
        @click="enableSurveyDeletion(currentRow)"
        class="survey_action bottom_button general-white-bg general-contrast-color"
      >
        <DeleteSurveyIcon class="action_icon" />
        {{ $t("surveys.delete") }}
      </button>
    </div>
    <SurveyFilters
      @resetFilters="resetFilters"
      @applyFilters="applyFilters"
      @filterByAuthor="filterByAuthor"
      @filterByEndDate="filterByEndDate"
      @filterByStartDate="filterByStartDate"
      @filterByMaxParticipants="filterByMaxParticipants"
      @filterByMinParticipants="filterByMinParticipants"
      @filterByStatus="filterByStatus"
      @closeFilters="closeFilter"
      v-show="filterOpened"
    />
    <DeleteSurvey
      v-if="surveyDeletionEnabled"
      @deleteSurvey="deleteSurvey"
      @cancelSurveyDeletion="cancelSurveyDeletion"
    />
    <EndSurvey
      v-if="surveyEndEnabled"
      @endSurvey="endSurvey"
      @cancelSurveyEnd="cancelSurveyEnd"
    />
    <div class="page_headers">
      <h1 class="header_name general-contrast-color">
        {{ $t("surveys.my_surveys_and_votings") }}
      </h1>
      <h1 class="header_description general-secondary-color">
        {{ $t("surveys.create_your_survey") }}
      </h1>
    </div>
    <div class="survey_types">
      <button class="survey_type not_in_development general-white-bg" @click="createSurvey">
        <div class="survey_type_icon_wrapper minor-success-secondary-bg">
          <SurveyIcon class="survey_type_icon" />
        </div>
        <h1 class="survey_type_name general-contrast-color">
          {{ $t("surveys.survey") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.create_survey_for_results_analysis") }}
        </h1>
      </button>
      <!-- @click="createTest" -->
      <button class="survey_type general-white-bg">
        <div class="survey_type_icon_wrapper minor-error-secondary-bg">
          <TestIcon class="survey_type_icon" />
        </div>
        <h1 class="survey_type_name general-contrast-color">
          {{ $t("surveys.test") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.check_knowledge_and_assess_answers") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.in_development") }}
        </h1>
      </button>
      
      <!-- @click="enableVotingCreation" -->
      <button
        class="survey_type general-white-bg"
      >
        <div class="survey_type_icon_wrapper minor-info-secondary-bg">
          <VoteIcon class="survey_type_icon" />
        </div>
        <h1 class="survey_type_name general-contrast-color">
          {{ $t("surveys.voting") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.ask_short_question_for_fast_decision") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.in_development") }}
        </h1>
      </button>

      <button class="survey_type general-white-bg">
        <div class="survey_type_icon_wrapper general-brand-bg">
          <CatalogIcon class="survey_type_icon" />
        </div>
        <h1 class="survey_type_name general-contrast-color">
          {{ $t("surveys.catalog") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.launch_ready_survey_in_org") }}
        </h1>
        <h1 class="survey_type_description general-secondary-color">
          {{ $t("surveys.in_development") }}
        </h1>
      </button>
    </div>
    <div class="page_headers">
      <h1 class="header_name general-contrast-color">
        {{ $t("surveys.surveys_in_org") }}
      </h1>
      <h1 class="header_description general-secondary-color">
        {{ $t("surveys.here_you_can_see_surveys") }}
      </h1>
    </div>
    <div class="search_field_and_filter">
      <div class="input_field_wrapper">
        <input
          v-model="searchString"
          class="search_field general-contrast-color"
          :placeholder="$t('surveys.search_surveys')"
        />
        <div class="input_field_icons">
          <ClearInputIcon
            v-if="searchString"
            @click="clearInput"
            class="clear_input_icon"
          />
          <div class="search_icon_wrapper">
            <SearchIcon class="search_icon" />
          </div>
        </div>
      </div>
      <button class="toggle_filter brand-secondary-bg" @click="toggleFilter">
        <FilterIcon class="filter_icon" />
      </button>
    </div>
    <vue-good-table
      v-if="surveys?.length"
      :columns="tableColumns"
      :rows="surveys"
    >
      <template #table-row="props">
        <div
          @click="goToSurvey(props.row)"
          v-if="props.column.field === 'title'"
          class="name_cell general-contrast-color"
        >
          <img
            v-if="props.row.photo"
            :src="props.row.photo"
            class="name_cell_photo"
          />
          <div v-else class="name_cell_no_photo brand-secondary-bg">
            <NoPhotoSurveyIcon class="no_photo_survey_icon" />
          </div>
          {{ props.row.title }}
        </div>
        <div
          v-else-if="props.column.field === 'options'"
          class="options_wrapper"
          :id="`options_wrapper_${props.row.id}`"
        >
          <button
            @click="toggleRowOptions(props.row)"
            class="options_button brand-secondary-bg"
          >
            <SurveyOptionsIcon class="survey_options_icon" />
          </button>
        </div>
      </template>
    </vue-good-table>
    <div v-else class="no_surveys_indicator">
      <h1 class="no_surveys_yet general-grey-color">
        {{ $t("surveys.nothing_found_by_this_query") }}
      </h1>
      <h1 class="create_your_own_survey_text general-grey-color">
        {{ $t("surveys.try_to_apply_different_filters") }}
      </h1>
    </div>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";

import SurveyIcon from "@/components/Icons/SurveyIcons/SurveyIcon.vue";
import TestIcon from "@/components/Icons/SurveyIcons/TestIcon.vue";
import VoteIcon from "@/components/Icons/SurveyIcons/VoteIcon.vue";
import CatalogIcon from "@/components/Icons/SurveyIcons/CatalogIcon.vue";
import NoPhotoSurveyIcon from "@/components/Icons/SurveyIcons/NoPhotoSurveyIcon.vue";
import SurveyOptionsIcon from "@/components/Icons/SurveyIcons/SurveyOptionsIcon.vue";
import vSelect from "vue-select";
import SurveyCard from "@/components/AdminSurveysElements/SurveyCard.vue";
import { notify } from "@/general-scripts/toast-notification";
import { photoAddress } from "@/general-scripts/photo-address";
import EndSurveyIcon from "@/components/Icons/SurveyIcons/EndSurveyIcon.vue";
import ShareSurveyIcon from "@/components/Icons/SurveyIcons/ShareSurveyIcon.vue";
import DeleteSurveyIcon from "@/components/Icons/SurveyIcons/DeleteSurveyIcon.vue";
import SearchIcon from "@/components/Icons/SurveyIcons/SearchIcon.vue";
import FilterIcon from "@/components/Icons/SurveyIcons/FilterIcon.vue";
import ClearInputIcon from "@/components/Icons/SurveyIcons/ClearInputIcon.vue";
import SurveyFilters from "@/components/AdminSurveysElements/SurveyFilters.vue";
import axios from "axios";

import Loading from "vue3-loading-overlay";
import { API_URIS } from "@/constants/api.js";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import DeleteSurvey from "@/components/AdminSurveysElements/DeleteSurvey.vue";
import EndSurvey from "@/components/AdminSurveysElements/EndSurvey.vue";
import { formatTimestamp } from "@/general-scripts/timestamps";
import CreateVotingScreen from "@/components/VotingsElements/CreateVotingScreen.vue";
import ConfigureVotingTimeScreen from "@/components/VotingsElements/ConfigureVotingTimeScreen.vue";
import { QUESTIONNAIRE_TYPE } from "@/infrastructure/constants/questionnaire-type";

export default {
  name: "AdminSurveys",
  components: {
    SurveyIcon,
    TestIcon,
    VoteIcon,
    CatalogIcon,
    ClearInputIcon,
    NoPhotoSurveyIcon,
    SurveyOptionsIcon,
    vSelect,
    SurveyCard,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
    EndSurveyIcon,
    ShareSurveyIcon,
    DeleteSurveyIcon,
    SearchIcon,
    FilterIcon,
    SurveyFilters,
    DeleteSurvey,
    EndSurvey,
    CreateVotingScreen,
    ConfigureVotingTimeScreen,
    Loading,
  },
  directives: { // ДИРЕКТИВА ДЛЯ ХЭНДЛИНГА СКРОЛЛА ДО КОНЦА ВНИЗ
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler; 
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  data() {
    return {
      votingStartTime: null, // ДАТА НАЧАЛА ГОЛОСОВАНИЯ
      votingEndTime: null, // ДАТА ЗАВЕРШЕНИЯ ГОЛОСОВАНИЯ
      createVotingEnabled: false, // ОТКРЫТО ЛИ ОКНО СОЗДАНИЯ ГОЛОСОВАНИЯ
      configureVotingTimeEnabled: false, // ОТКРЫТО ЛИ ОКНО НАСТРОЕК ВРЕМЕНИ ГОЛОСОВАНИЯ
      searchSurveyTimeout: null, // ТАЙМАУТ ДЛЯ ТЕКСТОВОГО ВВОДА: ПОИСКА ПО ОПРОСАМ
      startDate: null, // ФИЛЬТР ПО МИН. ДАТЕ НАЧАЛА ОПРОСА
      endDate: null, // ФИЛЬТР ПО МАКС. ДАТЕ ОКОНЧАНИЯ ОПРОСА
      minParticipants: null, // ФИЛЬТР ПО МИН. КОЛИЧЕСТВУ УЧАСТНИКОВ ОПРОСА
      maxParticipants: null, // ФИЛЬТР ПО МАКС. КОЛИЧЕСТВУ УЧАСТНИКОВ ОПРОСА
      selectedIDs: new Map(), // ФИЛЬТР ПО АВТОРАМ ОПРОСОВ
      statusFilters: [], // ФИЛЬТР ПО СТАТУСАМ ОПРОСОВ
      isLoading: false, // ПОДГРУЖАЮТСЯ ЛИ СЕЙЧАС ОПРОСЫ ИЛИ НЕТ
      stopFetching: false, // МОЖНО ЛИ ПОДГРУЖАТЬ ОПРОСЫ ИЛИ НЕТ
      page: 1, // СТРАНИЦА ПАГИНАЦИИ 
      pageSize: 30, // МАКС. КОЛИЧСЕСТВО ОПРОСОВ НА СТРАНИЦЕ
      surveyDeletionEnabled: false, // ОТКРЫТО ЛИ ОКНО УДАЛЕНИЯ ОПРОСА
      surveyEndEnabled: false, // ОТКРЫТО ЛИ ОКНО ЗАВЕРШЕНИЯ ОПРОСА
      searchString: "", // СТРОКА ПОИСКА ПО ОПРОСАМ
      filterOpened: false, // ОТКРЫТ ЛИ БОКОВОЙ ФИЛЬТР
      popupIsBeingOpened: false, // ОТКРЫВАЕТСЯ ЛИ СЕЙЧАС ОКНО ОПЦИЙ ОПРОСА
      surveys: [], // ТЕКУЩИЙ ОТОБРАЖАЕМЫЙ СПИСОК ОПРОСОВ
      currentRow: null, // ВЫБРАННЫЙ РЯД В ТАБЛИЦЕ ОПРОСОВ
    };
  },
  mounted() {
    this.getSurveys(); // ПОЛУЧЕНИЕ СПИСКА ОПРОСОВ
    this.$refs.adminSurveys.addEventListener("scroll", this.closePopup); // ЗАКРЫВАЕМ ОКНО ОПЦИЙ ОПРОСА ДЛЯ ПРЕДОТВРАЩЕНИЯ ОШИБОК
  },
  beforeUnmount() {
    this.$refs.adminSurveys.removeEventListener("scroll", this.closePopup); // ЗАКРЫВАЕМ ОКНО ОПЦИЙ ОПРОСА ДЛЯ ПРЕДОТВРАЩЕНИЯ ОШИБОК
  },
  watch: {
    isLoading: { // ЕСЛИ В СОСТОЯНИИ ЗАГРУЗКИ
      handler(newVal) {
        if (newVal) {
          this.positionLoader(); // ОТОБРАЖАЕМ ЛОАДЕР
        }
      },
    },
    searchString: { // ТЕКСТОВЫЙ ПОИСК ПО ОПРОСАМ
      handler() {
        this.stopFetching = false; // МОЖНО СНОВА ПОЛУЧАТЬ СПИСОК ОПРОСОВ ТАК КАК НОВЫЙ ФИЛЬТР
        this.isLoading = true; // ВХОДИМ В СОСТОЯНИЕ ЗАГРУЗКИ
        this.surveys = []; // ОЧИЩАЕМ СПИСОК ОПРОСОВ
        this.page = 1; // СБРОС ПАГИНАЦИИ

        // ТАЙМАУТ ДЛЯ ТОГО ЧТОБЫ НЕ СПАМИТЬ ЗАПРОСАМИ ПОСЛЕ КАЖДОГО ВВОДА
        if (this.searchSurveyTimeout) { 
          clearTimeout(this.searchSurveyTimeout);
        }
        this.searchSurveyTimeout = setTimeout(() => this.getSurveys(), 500);
      },
    },
  },
  computed: {
    ...mapStores(useProfileStore), // ПОДВЯЗКА STORE ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
    tableColumns() { // ДАННЫЕ О СТОЛБЦАХ ТАБЛИЦЫ
      let columns = [
        {
          label: "#",
          field: "id",
          width: "50px",
          thClass: "padding_left",
          tdClass: "padding_left",
          sortable: false,
        },
        {
          label: this.$t("surveys.name"),
          field: "title",
          width: "300px",
          sortable: false,
        },
        {
          label: this.$t("surveys.type"),
          field: this.surveyType,
          width: "200px",
          sortable: false,
        },
        {
          label: this.$t("surveys.status"),
          field: this.statusDeclension,
          width: "200px",
          sortable: false,
        },
        {
          label: this.$t("surveys.participants_count"),
          field: "participants",
          width: "200px",
          sortable: false,
        },
        {
          label: this.$t("surveys.creator"),
          field: this.creator,
          width: "200px",
          sortable: false,
        },
        {
          label: this.$t("surveys.launch_date"),
          field: this.launchDate,
          width: "200px",
          sortable: false,
        },
        {
          label: "",
          field: "options",
          width: "10px",
          sortable: false,
          tdClass: "survey_options",
        },
      ];
      return columns;
    },
  },
  methods: {
    positionLoader() { // ПОЗИЦИОНИРОВАНИЕ ЗАГРУЗЧИКА ВО ВРЕМЯ HTTP-ЗАПРОСОВ
      const el = this.$refs.adminSurveys;
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    votingCreated() { // ПОСЛЕ ТОГО КАК СОЗДАЛИ ГОЛОСОВАНИЯ
      this.createVotingEnabled = false; // ЗАКРЫВАЕМ ОКНО
      window.location.reload(); // ПЕРЕЗАГРУЗКА СТРАНИЦЫ
    },
    cancelVotingTimeChanges() { // ОТМЕНА НАСТРОЕК ВРЕМЕНИ ГОЛОСОВАНИЯ
      this.createVotingEnabled = true; // ПЕРЕХОДИМ К ОКНУ СОЗДАНИЯ ГОЛОСОВАНИЯ
      this.configureVotingTimeEnabled = false;
    },
    confirmVotingTimeChanges(votingStartTime, votingEndTime) { // ПРИМЕНИТЬ ИЗМЕНЕНИЯ НАСТРОЕК ВРЕМЕНИ ГОЛОСОВАНИЯ
      this.votingStartTime = votingStartTime; // ВРЕМЯ НАЧАЛА
      this.votingEndTime = votingEndTime; // ВРЕМЯ ОКОНЧАНИЯ
      this.createVotingEnabled = true; // ПЕРЕХОДИМ В ЭКРАН СОЗДАНИЯ ГОЛОСОВАНИЯ
      this.configureVotingTimeEnabled = false; // ЗАКРЫВАЕМ ЭКРАН НАСТРОЕК ВРЕМЕНИ
    },
    configureVotingTime() { // ПОКАЗАТЬ ОКНО НАСТРОЙКИ ВРЕМЕНИ В ГОЛОСОВАНИИ
      this.createVotingEnabled = false; // ТАКЖЕ ЗАКРЫВАЕМ ОКНО СОЗДАНИЯ ГОЛОСОВАНИЯ
      this.configureVotingTimeEnabled = true;
    },
    enableVotingCreation() { // ПОКАЗАТЬ ОКНО СОЗДАНИЯ ГОЛОСОВАНИЯ
      this.createVotingEnabled = true;
    },
    disableVotingCreation() { // СКРЫТЬ ОКНО СОЗДАНИЯ ГОЛОСОВАНИЯ
      this.createVotingEnabled = false;
    },
    photoAddress: photoAddress, // МЕТОД ДЛЯ ПОКАЗА ФОТО С БЭКА
    clearInput() { // ОЧИСТКА ФИЛЬТРА ПОИСКА ПО ОПРОСУ
      this.searchString = "";
    },
    goToSurvey(data) { // ПЕРЕХОД К ОПРОСУ/ТЕСТУ ПО НАЖАТИЮ НА НЕГО
      if (data.type === QUESTIONNAIRE_TYPE.SURVEY) {
        this.$router.push(`/survey_management/${data.id}`);
      } else if (data.type === QUESTIONNAIRE_TYPE.TEST) {
        this.$router.push(`/test_management/${data.id}`);
      }
    },
    handleScrollEnd() { // ХЭНДЛИНГ СКРОЛЛА ДО КОНЦА ВНИЗ
      if (!this.isLoading && !this.stopFetching) { // ЕСЛИ МОЖНО ПОЛУЧАТЬ ОПРОСЫ И ОНИ НЕ В ПРОЦЕССЕ ЗАГРУЗКИ
        this.page++; // УВЕЛИЧИВАЕМ СТРАНИЦУ ПАГИНАЦИИ
        this.getSurveys(); // ПОЛУЧАЕМ СЛЕДУЮЩУЮ ПАРТИЮ ОПРОСОВ
      } 
    },
    resetFilters() {  // СБРОС ВСЕХ ФИЛЬТРОВ
      this.stopFetching = false; // МОЖНО СНОВА ПОЛУЧАТЬ СПИСОК ОПРОСОВ 
      this.surveys = []; // ОЧИЩАЕМ ТЕКУЩИЙ СПИСОК ОПРОСОВ
      this.page = 1; // СБРАСЫВАЕМ ПАГИНАЦИЮ 
      this.selectedIDs = new Map(); // ОЧИЩАЕМ СПИСОК ВЫБРАННЫХ АВТОРОВ
      this.endDate = null; // ОЧИЩАЕМ ФИЛЬТР ПО ДАТЕ ОКОНЧАНИЯ
      this.startDate = null; // ОЧИЩАЕМ ФИЛЬТР ПО ДАТЕ НАЧАЛА
      this.minParticipants = null; // ОЧИЩАЕМ ФИЛЬТР ПО МАКС. УЧАСТНИКАМ
      this.maxParticipants = null; // ОЧИЩАЕМ ФИЛЬТР ПО МИН. УЧАСТИНИКАМ
      this.statusFilters = []; // ОЧИЩАЕМ ФИЛЬТРЫ ПО СТАТУСАМ
      this.getSurveys();  // ПОЛУЧАЕМ НОВУЮ ПАРТИЮ ОПРОСОВ БЕЗ ФИЛЬТРОВ
    },
    applyFilters() {  // ПРИМЕНИТЬ ВЫБРАННЫЕ ФИЛЬТРЫ
      this.stopFetching = false; // МОЖНО СНОВА ПОЛУЧАТЬ СПИСОК ОПРОСОВ
      this.surveys = []; // ОЧИЩАЕМ ТЕКУЩИЙ СПИСОК ОПРОСОВ
      this.page = 1; // СБРАСЫВАЕМ ПАГИНАЦИЮ 
      this.getSurveys(); // ПОЛУЧАЕМ НОВУЮ ПАРТИЮ ОПРОСОВ ПО НОВЫМ ФИЛЬТРАМ
    },
    filterByAuthor(selectedIDs) { // ИЗМЕНЕНИЕ ФИЛЬТРА ПО СПИСКУ АВТОРОВ КТО СОЗДАЛ ОПРОСЫ
      this.selectedIDs = selectedIDs;
    },
    filterByStartDate(date) { // ИЗМЕНЕНИЕ ФИЛЬТРА ПО МИН. ДАТЕ ЗАВЕРШЕНИЯ ОПРОСА
      this.startDate = date;
    },
    filterByEndDate(date) { // ИЗМЕНЕНИЕ ФИЛЬТРА ПО МАКС. ДАТЕ ЗАВЕРШЕНИЯ ОПРОСА 
      this.endDate = date;
    },
    filterByMaxParticipants(count) { // ИЗМЕНЕНИЕ ФИЛЬТРА ПО МАКС. КОЛИЧЕСТВУ УЧАСТНИКОВ
      this.maxParticipants = count;
    },
    filterByMinParticipants(count) { // ИЗМЕНЕНИЕ ФИЛЬТРА ПО МИН. КОЛИЧЕСТВУ УЧАСТНИКОВ
      this.minParticipants = count;
    },
    filterByStatus(statuses) { // ИЗМЕНЕНИЕ ФИЛЬТРА ПО СТАТУСАМ
      this.statusFilters = statuses;
    },
    statusDeclension(rowObj) { // СКЛОНЕНИЯ СЛОВ СТАТУСА ПО РОДАМ
      if (rowObj.status === 1) {
        if (rowObj.type !== 3) {
          return this.$t("surveys.active_declension_masculine");
        } else {
          return this.$t("surveys.active_declension_neutral");
        }
      } else if (rowObj.status === 2) {
        if (rowObj.type !== 3) {
          return this.$t("surveys.ended_declension_masculine");
        } else {
          return this.$t("surveys.ended_declension_neutral");
        }
      } else if (rowObj.status === 3) {
        if (!rowObj.started_at) {
          return this.$t("surveys.draft");
        } else if (rowObj.type !== 3) {
          return this.$t("surveys.planned_declension_masculine");
        } else {
          return this.$t("surveys.planned_declension_neutral");
        }
      } else {
        return this.$t("surveys.not_specified");
      }
    },
    creator(rowObj) { // ПОЛУЧЕНИЕ ОТОБРАЖАЕМОГО ИМЕНИ СОЗДАТЕЛЯ ОПРОСА
      return rowObj.creator.profile?.get_full_name_or_nickname_surnames_first;
    },
    surveyType(rowObj) { // НАЗВАНИЕ ОПРОСА В ЗАВИСИМОСТИ ОТ ЕГО ТИПА
      if (rowObj.type === 1) {
        return this.$t("surveys.survey");
      } else if (rowObj.type === 2) {
        return this.$t("surveys.test");
      } else if (rowObj.type === 3) {
        return this.$t("surveys.voting");
      } else {
        return this.$t("surveys.not_specified");
      }
    },
    launchDate(rowObj) { // ФОРМАТИРОВАНИЕ ДАТЫ ЗАПУСКА ОПРОСА
      if (!rowObj.started_at) return this.$t("surveys.not_specified"); 
      const date = formatTimestamp(rowObj.started_at);
      return (
        (date.day < 10 ? "0" : "") +
        date.day +
        "." +
        (date.month + 1 < 10 ? "0" : "") +
        (date.month + 1) +
        "." +
        date.year
      );
    },
    shareSurveyLink(survey) { // ПОДЕЛИТЬСЯ ССЫЛКОЙ НА ОПРОС
      try {
        // СОБИРАЕМ ССЫЛКУ
        const invite_link = "/survey_preview/" + survey.id; 
        const match = invite_link.match(/(?:[^\/]*\/)?(.*)/);
        const pathWithQuery = match ? match[1] : invite_link;
        const newLink = window.location.origin + "/" + pathWithQuery;

        // СОЗДАЕМ ТЕКСТОВОЕ ПОЛЕ, ЗАПИСЫВАЕМ ТУДА ССЫЛКУ И КОПИРУЕМ ЕЁ
        const textArea = document.createElement("textarea");
        textArea.value = newLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");

        // УБИРАЕМ ТЕКСТОВОЕ ПОЛЕ
        document.body.removeChild(textArea);

        // ПОДСКАЗКА УСПЕШНОГО КОПИРОВАНИЯ
        notify(this.$t("surveys.link_copied"), "success");
      } catch (err) { // ПОДСКАЗКА С ОШИБКОЙ
        notify(this.$t("surveys.link_copy_failed"));
        throw err;
      }
    },
    async createSurvey() { // МЕТОД СОЗДАНИЯ ОПРОСА
      try {
        const response = await axios.post(API_URIS.questionnaries, { 
          type: QUESTIONNAIRE_TYPE.SURVEY, // ПЕРЕДАЕМ ТИП=ОПРОС
          title: `${this.$t("surveys.survey")} ${this.surveys.length + 1}`, // НАЗВАНИЕ АВТОМАТИЧЕСКОЕ (СКОЛЬКО СЕЙЧАС ОПРОСОВ НА СТРАНИЦЕ, ТАКОЙ И НОМЕР + 1)
        });
        this.$router.push("/survey_management/" + response.data.id); // СРАЗУ ПЕРЕХОДИМ К СОЗДАННОМУ ОПРОСУ
      } catch (err) {
        notify( // ПОДСКАЗКА ПРИ ОШИБКЕ
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async createTest() { // СОЗДАНИЕ ТЕСТА (АНАЛОГИЧНО СОЗДАНИЮ ОПРОСА, ТОЛЬКО ТИП ДРУГОЙ)
      try {
        const response = await axios.post(API_URIS.questionnaries, {
          type: QUESTIONNAIRE_TYPE.TEST, // ТИП=ТЕСТ
          title: `${this.$t("surveys.test")} ${this.surveys.length + 1}`,
        });
        this.$router.push("/test_management/" + response.data.id);
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    enableSurveyDeletion(survey) { // ПОКАЗ ОКНА УДАЛЕНИЯ ОПРОСА
      this.surveyDeletionEnabled = true; // ПОКАЗ ОКНА
      this.currentRow = survey; // ЗАПИСЫВАЕМ ВЫБРАННЫЙ РЯД
    },
    cancelSurveyDeletion() { // ОТМЕНА УДАЛЕНИЯ ОПРОСА
      this.currentRow = null; // ОБНУЛЕНИЕ ВЫБРАННОГО РЯДА
      this.surveyDeletionEnabled = false; // СКРЫТИЕ ОКНА УДАЛЕНИЯ
    },
    async deleteSurvey() { // МЕТОД ДЛЯ УДАЛЕНИЯ ВЫБРАННОГО ОПРОСА
      try {
        await axios.delete(API_URIS.questionnaries + this.currentRow.id + "/"); // HTTP-ЗАПРОС НА УДАЛЕНИЕ
        notify(this.$t("surveys.survey_deleted"), "success"); // ВЫВОД ПОДСКАЗКИ С УСПЕШНЫМ УДАЛЕНИЕМ
        window.location.reload(); // ПЕРЕЗАГРУЗКА СТРАНИЦЫ
      } catch (err) {
        notify( // ПОДСКАЗКА С ВЫВОДОМ ОШИБКИ
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    enableSurveyEnd(survey) { // МЕТОД ДЛЯ ПОКАЗА ВСПЛЫВАЮЩЕГО ОКНА ЗАВЕРШЕНИЯ ОПРОСА
      this.surveyEndEnabled = true; // ПОКАЗЫВАЕМ ОКНО
      this.currentRow = survey; // ЗАПИСЫВАЕМ ВЫБРАННЫЙ РЯД
    },
    cancelSurveyEnd() { // МЕТОД ДЛЯ ОТМЕНЫ ЗАВЕРШЕНИЯ ОПРОСА
      this.currentRow = null; // ОБНУЛЯЕМ ВЫБРАННЫЙ РЯД ТАБЛИЦЫ
      this.surveyEndEnabled = false; // ЗАКРЫВАЕМ ОКНО ЗАВЕРШЕНИЯ ОПРОСА
    },
    async endSurvey() { // МЕТОД ДЛЯ ЗАВЕРШЕНИЯ ВЫБРАННОГО ОПРОСА
      try {
        let endDate = new Date().toISOString(); // ПОЛУЧАЕМ ТЕКУЩУЮ ДАТУ
        const response = await axios.patch( // HTTP-ЗАПРОС ДЛЯ ИЗМЕНЕНИЯ ВЫБРАННОГО ОПРОСА
          API_URIS.questionnaries + this.currentRow.id + "/",
          {
            is_active: false, // ОН СТАНОВИТСЯ НЕАКТИВНЫМ
            finished_at: endDate, // ДАТУ ЗАВЕРШЕНИЯ СТАВИМ КАК СЕЙЧАС
          }
        );
        this.surveyEndEnabled = false; // ЗАКРЫВАЕМ ВСПЛЫВАЮЩЕЕ ОКНО ЗАВЕРШЕНИЯ ОПРОСА
        window.location.reload(); // ПЕРЕЗАГРУЖАЕМ СТРАНИЦУ
      } catch (err) {
        throw err;
      }
    },
    toggleFilter() { // МЕТОД ДЛЯ ОТКРЫТИЯ БОКОВЫХ ФИЛЬТРОВ
      this.filterOpened ^= true;
    },
    closeFilter() {// МЕТОД ДЛЯ ЗАКРЫТИЯ БОКОВЫХ ФИЛЬТРОВ
      this.filterOpened = false;
    },

    // В ЗАВИСИМОСТИ ОТ СОСТОЯНИЯ ОКНА СПИСКА ОПЦИЙ ВЫБРАННОГО РЯДА В ТАБЛИЦЕ
    // МЕТОД СКРЫВАЕТ ИЛИ ПОКАЗЫВАЕТ ЭТО ОКНО
    toggleRowOptions(row) { 
      const popup = document.querySelector("#survey_actions_list"); // ВЫБИРАЕМ HTML-ЭЛЕМЕНТ ОКНА
      if (popup.style.display === "flex") { // ЕСЛИ ОН ВИДИМЫЙ, ЗНАЧИТ СКРЫВАЕМ ЕГО
        popup.style.display = "none";
        if (this.currentRow.id !== row.id) { // ОДНАКО МЫ НАЖАЛИ НА ОТЛИЧНЫЙ РЯД ОТ ВЫБРАННОГО
          this.positionPopup(row);           // ЗНАЧИТ ОПЦИИ ПРЕДЫДУЩЕГО РЯДА ЗАКРОЮТСЯ А МЫ ОТКРОЕМ ОПЦИИ НОВОГО РЯДА
        }
      } else {
        this.positionPopup(row); // ИНАЧЕ ОТКРОЕМ ОПЦИИ ВЫБРАННОГО РЯДА
      }
    },
    closeRowOptions() { // МЕТОД ДЛЯ СКРЫТИЯ СПИСКА ОПЦИЙ ВЫБРАННОГО РЯДА ТАБЛИЦЫ (ПОСЛЕ КЛИКА ЗА ПРЕДЕЛЫ ОКНА ОПЦИЙ)
      if (this.popupIsBeingOpened) return; // ЕСЛИ ОКНО В ПРОЦЕССЕ ОТКРЫТИЯ, ТО НИЧЕГО НЕ ДЕЛАЕМ
      const popup = document.querySelector("#survey_actions_list"); // ИНАЧЕ НАХОДИМ HTML-ЭЛЕМЕНТ ОКНА СПИСКА ОПЦИЙ
      if (popup.style.display === "flex") popup.style.display = "none"; // СКРЫВАЕМ ЕГО
    },
    closePopup() { // МЕТОД ДЛЯ СКРЫТИЯ ОКНА ОПЦИЙ РЯДА (ТОЛЬКО ПОСЛЕ MOUNT И ДО UNMOUNT)
      const popup = document.querySelector("#survey_actions_list"); // ВЫБИРАЕМ HTML-ЭЛЕМЕНТ СПИСКА ОПЦИЙ
      if (popup) { // ЕСЛИ ОН СУЩЕСТВУЕТ, СКРЫВАЕМ ЕГО
        popup.style.display = "none";
        this.currentRow = null;
      }
    },

    // МЕТОД ДЛЯ ПОЗИЦИОНИРОВАНИЯ ОПЦИЙ ОПРОСА ПРИ НАЖАТИИ НА ТРОЕТОЧИЕ В ТАБЛИЦЕ
    positionPopup(row) { 
      this.popupIsBeingOpened = true; // ПОМЕЧАЕМ ТО ЧТО ОПЦИИ В ПРОЦЕССЕ ОТКРЫТИЯ
      setTimeout(() => { // ЧЕРЕЗ 300МС ЗАКРЫВАЕМ ОБРАТНО 
        this.popupIsBeingOpened = false; 
      }, 300);
      const button = document.querySelector(`#options_wrapper_${row.id}`); // ПОЛУЧАЕМ КОМПОНЕНТ ОПЦИЙ ВЫБРАННОГО РЯДА ТАБЛИЦЫ
      const popup = document.querySelector("#survey_actions_list"); // ПОЛУЧАЕМ СПИСОК ОПЦИЙ (1 СПИСОК ДЛЯ ВСЕХ РЯДОВ, МЕНЯЮЩИЙ ПОЗИЦИИ НА ЭКРАНЕ В ЗАВИСИМОСТИ ОТ РЯДА ТАБЛИЦЫ)
      if ( // ПОЛУЧЕННЫЕ HTML ЭЛЕМЕНТЫ ЕСТЬ НА СТРАНИЦЕ И СПИСОК ОПЦИЙ ЕЩЕ НЕ ПОКАЗАН
        button && 
        popup &&
        (popup.style.display === "none" || !popup.style.display)
      ) {
        popup.style.display = "flex"; // ПОКАЗЫВАЕМ СПИСОК ОПЦИЙ
        this.currentRow = row; // ЗАПИСЫВАЕМ ТЕКУЩИЙ ВЫБРАННЫЙ РЯД В ТАБЛИЦЕ

        // ПОДСЧИТЫВАЕМ ПОЗИЦИЮ ВЫБРАННОГО РЯДА (У КОТОРОГО ОТКРЫВАЕМ ОПЦИИ)
        const rect = button.getBoundingClientRect();
        const topPosition = rect.top + window.scrollY - popup.offsetHeight;
        const leftPosition = rect.right - popup.offsetWidth;

        // ПОЗИЦИОНИРУЕМ СПИСОК ОПЦИЙ ОКОЛО КНОПКИ ПОКАЗА ОПЦИЙ ВЫБРАННОГО РЯДА
        popup.style.top = `${topPosition}px`;
        popup.style.left = `${leftPosition}px`;
        popup.style.position = "fixed";
      }
    },
    async getSurveys() { // МЕТОД ДЛЯ ПОЛУЧЕНИЯ СПИСКА ВСЕХ ОПРОСОВ 
      try {
        this.isLoading = true; // ВХОДИМ В СОСТОЯНИЕ ЗАГРУЗКИ ВО ВРЕМЯ HTTP-ЗАПРОСА ДЛЯ ОТОБРАЖЕНИЯ ЛОАДЕРА
        let params = { // ПЕРЕДАЕМ QUERY-ПАРАМЕТРЫ В GET-ЗАПРОСЕ
          page: this.page,  // НОМЕР СТРАНИЦЫ (ПАГИНАЦИЯ)
          page_size: this.pageSize, // КОЛИЧЕСТВО ОПРОСОВ НА СТРАНИЦЕ
        };
        if (this.statusFilters.length) { // ЕСЛИ КАКИЕ-ЛИБО ФИЛЬТРЫ ПО СТАТУСАМ ПРИМЕНЕНЫ
          let queryString = "";  // ЗАВОДИМ СТРОКУ ЧТОБЫ СОЕДИНИТЬ ИМЕНА СТАТУСОВ ЧЕРЕЗ ЗАПЯТУЮ
          for (let i = 0; i < this.statusFilters.length; ++i) { // ПРОХОДИМСЯ ПО ВЫБРАННЫМ СТАТУСАМ
            queryString += this.statusFilters[i];  // ДОБАВЛЯЕМ ИМЯ СТАТУСА В КОНЕЦ СТРОКИ
            if (i < this.statusFilters.length - 1) queryString += ","; // ЕСЛИ ПОСЛЕ ТЕКУЩЕГО ЕЩЕ ДОБАВИМ СТРОКУ В КОНЕЦ, ТО СТАВИМ ЗАПЯТУЮ ПЕРЕД ЭТИМ
          }
          params["status"] = queryString;  // ЗАПИСЫВАЕМ РАЗДЕЛЕННЫЕ ЗАПЯТОЙ СТРОКИ СТАТУСОВ В QUERY-ПАРАМЕТР
        }
        if (this.maxParticipants !== null) { // ЕСЛИ ВЫБРАН ФИЛЬТР ПО МАКС. КОЛИЧЕСТВУ УЧАСТНИКОВ
          params["participants_max"] = this.maxParticipants; // ДОБАВЛЯЕМ В QUERY-ПАРАМЕТР
        }
        if (this.minParticipants !== null) { // ЕСЛИ ВЫБРАН ФИЛЬТР ПО МИН. КОЛИЧЕСТВУ УЧАСТНИКОВ
          params["participants_min"] = this.minParticipants; // ДОБАВЛЯЕМ В QUERY-ПАРАМЕТР
        }
        if (this.startDate) { // ЕСЛИ ВЫБРАН ФИЛЬТР ПО МИНИМАЛЬНОЙ ДАТЕ НАЧАЛА ОПРОСА
          params["date_from"] = this.startDate; // ДОБАВЛЯЕМ В QUERY-ПАРАМЕТР
        }
        if (this.endDate) { // ЕСЛИ ВЫБРАН ФИЛЬТР ПО МАКСИМАЛЬНОЙ ДАТЕ ОКОНЧАНИЯ ОПРОСА
          params["date_to"] = this.endDate; // ДОБАВЛЯЕМ В QUERY-ПАРАМЕТР
        }

        // СОЗДАЕМ СТРОКУ ДЛЯ РАЗДЕЛЕНИЯ ЗАПЯТОЙ ID АВТОРОВ КОТОРЫХ ОТМЕТИЛИ В ФИЛЬТРЕ
        // КОГДО ПОЛЬЗОВАТЕЛЬ ОТМЕЧАЕТ АВТОРОВ В ФИЛЬТРЕ, ПОКАЗЫВАЮТСЯ ТОЛЬКО ТЕ ОПРОСЫ, КОТОРЫЕ БЫЛИ СОЗДАНЫ ДАННЫМИ АВТОРАМИ
        let authors = ""; 

        for (let [key, value] of this.selectedIDs) { // ПРОХОДИМСЯ ПО MAP: {ID (INT) -> IS_SELECTED (BOOLEAN)}
          if (value) {  // ЕСЛИ АВТОР ОТМЕЧЕН
            if (authors) authors += "," + key; // ЗНАЧИТ ДОБАВЛЯЕМ ЕГО ID В СТРОКУ ПЕРЕД ЭТИМ СТАВЯ ЗАПЯТУЮ, ЕСЛИ В СТРОКЕ УЖЕ ЧТО-ТО ЕСТЬ
            else authors += key; // ЕСЛИ СТРОКА ЕЩЕ ПУСТАЯ, ЗНАЧИТ ЗАПЯТАЯ НЕ НУЖНА
          }
        }
        if (authors) params["authors"] = authors; // ДОБАВЛЯЕМ АВТОРОМ В QUERY-ПАРАМЕТР
        if (this.searchString) { // ЕСЛИ ВВЕДЕНО ЧТО-ТО В СТРОКЕ ПОИСКА
          params["title"] = this.searchString; // ДОБАВЛЯЕМ В QUERY-ПАРАМЕТР ФИЛЬТР ПО ТЕКСТУ
        }

        // GET-ЗАПРОС ДЛЯ ПОЛУЧЕНИЯ СПИСКА ОПРОСОВ ДЛЯ АДМИНА
        // ТАКЖЕ ПЕРЕДАЮТСЯ QUERY-ПАРАМЕТРЫ
        const response = await axios.get(API_URIS.questionnariesAdmin, { 
          params,
        });

        // ЕСЛИ КОЛИЧЕСТВО ПРИШЕДШИХ ОПРОСОВ МЕНЬШЕ ЧЕМ УКАЗАННОЕ КОЛИЧЕСТВО, ЗНАЧИТ СПИСОК ОПРОСОВ КОНЧИЛСЯ
        if (response.data.results.length < this.pageSize) { 
          this.stopFetching = true; // ПОМЕЧАЕМ ЧТО БОЛЬШЕ НЕ НУЖНО ЗАПРАШИВАТЬ ОПРОСЫ ПРИ ПОПЫТКЕ ПРОКРУТКИ СТРАЦИНЫ ВНИЗ
        }
        this.surveys.push(...response.data.results); // ДОБАВЛЯЕМ В КОНЕЦ СПИСКА ПОЛУЧЕННУЮ ПАРТИЮ ОПРОСОВ
        this.isLoading = false; // ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
      } catch (err) {
        this.isLoading = false; // ЕСЛИ ОШИБКА, ТАКЖЕ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.admin_surveys {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
}
.admin_surveys::-webkit-scrollbar {
  width: 8px;
}
.admin_surveys::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 680px) {
  .admin_surveys {
    padding: 32px;
  }
}
.page_headers {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.header_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}
.header_description {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.search_field_and_filter {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.input_field_wrapper {
  width: 100%;
  max-width: 713px;
  position: relative;
}
.search_field {
  width: 100%;
  box-sizing: border-box;
  padding: 15px 16px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
}
.search_field::placeholder {
  color: var(--generalColorSecondary);
}
.input_field_icons {
  position: absolute;
  top: 19px;
  right: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}
.clear_input_icon {
  cursor: pointer;
  height: 18px;
  width: 18px;
}
.search_icon_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 15px;
  padding-bottom: 1px;
}
.search_icon {
  height: 14px;
  width: 14px;
}
.toggle_filter {
  padding: 14px;
  border-radius: 50%;
  height: 52px;
  width: 52px;
}
.filter_icon {
  height: 24px;
  width: 24px;
}
.survey_types {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.survey_type {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  width: 270.5px;
  height: 234px;
  box-shadow: 0px 7px 20px 0px rgba(138, 138, 138, 0.1);
  padding: 0px 20px;
}
.survey_type.not_in_development {
  padding-top: 36px;
  justify-content: flex-start;
}
.survey_type_icon_wrapper {
  margin-bottom: 8px;
  height: 48px;
  width: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.survey_type_icon {
  height: 24px;
  width: 24px;
}
.survey_type_name {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
}
.survey_type_description {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

/* .navigation_and_filter {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.navigation_buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.navigation_button {
  padding: 8px 14px;
  border-radius: 12px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  height: 38px;
}
.navigation_button.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  box-shadow: 0px 8px 24px 2px rgba(74, 77, 69, 0.12);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02);
}
.category_selector {
  width: 261px !important;
} */
/* ::v-deep(.vs__dropdown-toggle) {
  height: 38px !important;
  padding: 8px 12px !important;
}
::v-deep(.vs__search) {
  margin: 0;
  padding: 0;
}
::v-deep(.vs__selected) {
  margin: 0;
  padding: 0;
}
::v-deep(.vs__actions) {
  padding: 0;
} */
/* .surveys_list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
} */

::v-deep(.vgt-left-align > span) {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalContrast);
}
::v-deep(.vgt-table.bordered td) {
  border-left: none;
  border-right: none;
}
::v-deep(.vgt-table.bordered th) {
  border-left: none;
  border-right: none;
  border-top: none;
}
::v-deep(.vgt-table thead th) {
  background: none;
}
::v-deep(.vgt-inner-wrap) {
  border: none;
}
::v-deep(table.vgt-table) {
  border: none;
}
::v-deep(.vgt-inner-wrap) {
  box-shadow: none;
}
::v-deep(table.vgt-table td) {
  vertical-align: middle;
}
::v-deep(.survey_options) {
  position: sticky;
  right: 0px;
}
.name_cell {
  cursor: pointer;
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.name_cell_photo {
  height: 34px;
  min-width: 34px;
  width: 34px;
  object-fit: cover;
  border-radius: 50%;
}
.name_cell_no_photo {
  height: 34px;
  width: 34px;
  min-height: 34px;
  min-width: 34px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.no_photo_survey_icon {
  height: 20px;
  width: 20px;
}
.options_wrapper {
  position: relative;
}
.options_button {
  padding: 4px;
  border-radius: 8px;
}
.survey_options_icon {
  height: 16px;
  width: 16px;
}

.survey_actions_list {
  z-index: 1000;
  box-sizing: border-box;
  position: fixed;
  display: none;
  flex-direction: column;
  box-shadow: 0px 3px 40px 0px rgba(0, 0, 0, 0.14);
  border-radius: 12px;
}

.survey_action {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.survey_action.top_button {
  border-radius: 12px 12px 0 0;
}
.action_icon {
  height: 24px;
  width: 24px;
}
.separator {
  margin: 0;
  border: 1px solid var(--secondOverlay);
}
.survey_action.bottom_button {
  border-radius: 0 0 12px 12px;
}

::v-deep(.padding_left) {
  padding-left: 32px;
}

.no_surveys_indicator {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;
}
.no_surveys_yet {
  font-family: "Golos";
  font-size: 36px;
  font-weight: 500;
  line-height: 43px;
}
.create_your_own_survey {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}
.create_your_own_survey_text {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
}
.create_your_own_survey_text.underlined_bold {
  text-decoration: underline;
  cursor: pointer;
}
</style>