<template>
  <div                                        
    ref="scrollContainer"
    v-scroll-end="handleScrollEnd"
    class="surveys_page general-white-bg"
  >

    <!-- ОКНО ГОЛОСОВАНИЯ -->
    <VotingScreen 
      v-if="votingVisible"
      @closeVoting="closeVoting"
      @openParticipants="openParticipants"
    />

    <!-- ОКНО УЧАСТНИКОВ ГОЛОСОВАНИЯ -->
    <ParticipantsScreen
      v-if="participantsVisible"
      @closeParticipants="closeParticipants"
    />

    <!-- КРУТЯЩИЙСЯ ЗАГРУЗЧИК ОТОБРАЖАЕМЫЙ ВО ВРЕМЯ HTTP-ЗАПРОСОВ -->
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />

    <!-- ТЕСТОВАЯ КНОПКА ДЛЯ ОТКРЫТИЯ ОКНА ГОЛОСОВАНИЯ -->
    <!-- <button
      @click="openVoting"
    >
      Voting
    </button> -->

    <div class="page_header">
      <h1 class="page_name general-contrast-color">
        {{ $t("surveys.surveys_and_votings") }}
      </h1>
      <button
        v-if="isAdmin"
        @click="$router.push('/admin_surveys')"
        class="go_to_admin_page general-brand-color brand-secondary-bg"
      >
        {{ $t("surveys.surveys_management") }}
      </button>
    </div>
    <div class="page_navigation">
      <div class="navigation_buttons">
        <button
          v-for="tab in navTabs"
          class="nav_tab_button minor-info-secondary-bg general-contrast-color"
          :class="{ active: tab === curTab }"
          @click="openTab(tab)"
        >
          {{ tab.name }}
        </button>
      </div>
      <vSelect
        class="category_selector"
        v-model="selectedCategory"
        :options="categories"
        :placeholder="$t('surveys.categories')"
        label="name"
      />
    </div>

    <!-- КАРТОЧКИ ОПРОСОВ (СПИСОК) -->
    <div v-if="surveys?.length" class="surveys_list">
      <SurveyCard v-for="survey in surveys" :survey="survey" />
    </div>
    
    <div v-else class="no_surveys_indicator">
      <h1 v-if="selectedCategory" class="no_surveys_yet general-grey-color">
        {{ $t("surveys.nothing_found_by_this_query") }}
      </h1>
      <h1 v-else class="no_surveys_yet general-grey-color">
        {{ $t("surveys.no_surveys_in_org_yet") }}
      </h1>
      <h1
        v-if="selectedCategory"
        class="create_your_own_survey_text general-grey-color"
      >
        {{ $t("surveys.try_to_apply_different_filters") }}
      </h1>
      <div v-else-if="isAdmin" class="create_your_own_survey">
        <h1 class="create_your_own_survey_text general-grey-color">
          {{ $t("surveys.you_can_create") }}
        </h1>
        <h1
          @click="$router.push('/admin_surveys')"
          class="create_your_own_survey_text underlined_bold general-grey-color"
        >
          {{ $t("surveys.your_own_survey") }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import SurveyCard from "@/components/AdminSurveysElements/SurveyCard.vue";
import { API_URIS } from "@/constants/api";
import axios from "axios";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import vSelect from "vue-select";
import VotingScreen from "@/components/VotingsElements/VotingScreen.vue";
import ParticipantsScreen from "@/components/VotingsElements/ParticipantsScreen.vue";
import Loading from "vue3-loading-overlay";

export default {
  name: "SurveysPage",
  components: {
    SurveyCard,
    vSelect,
    VotingScreen,
    ParticipantsScreen,
    Loading,
  },
  directives: {  // ДИРЕКТИВА ДЛЯ ОТСЛЕЖИВАНИЯ ДОСТИГ ЛИ СКРОЛЛ САМОГО НИЗА СТРАНИЦЫ
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
      votingVisible: false,        // ЕСЛИ TRUE, ТО ВИДНО ОКНО ГОЛОСОВАНИЯ
      participantsVisible: false,  // ЕСЛИ TRUE, ТО ВИДНО ОКНО УЧАСТНИКОВ ГОЛОСОВАНИЯ
      isLoading: false,   // ЕСЛИ TRUE, ТО МЫ НАХОДИМСЯ В СОСТОЯНИИ ЗАГРУЗКИ (ИДЕТ HTTP-ЗАПРОС)
      stopFetching: false,   // ЕСЛИ TRUE, ТО МЫ БОЛЬШЕ НЕ ПОСЫЛАЕМ GET-ЗАПРОС НА ПОЛУЧЕНИЕ СПИСКА ОПРОСОВ (ЗНАЧИТ СПИСОК КОНЧИЛСЯ)
      page: 1,   // ТЕКУЩАЯ СТРАНИЦА ДЛЯ СПИСКА ОПРОСОВ (ПАГИНАЦИЯ)
      pageSize: 20,   // КОЛИЧЕСТВО ОПРОСОВ КОТОРОЕ ЗАПРАШИВАЕТ ФРОНТ ОТ БЭКА ЗА ОДИН РАЗ
      selectedCategory: null, // ТЕКУЩИЙ ВЫБРАННЫЙ ФИЛЬТР ПО КАТЕГОРИЯМ
      categories: [ // СПИСОК ВКЛАДОК, КОТОРЫЕ ЯВЛЯЮТСЯ ФИЛЬТРАМИ ОПРОСОВ ПО КАТЕГОРИЯМ
        {
          name: this.$t("surveys.survey"), // ТИП = ОПРОС
          type: 1,
        },
        {
          name: this.$t("surveys.test"),   // ТИП = ТЕСТ
          type: 2,
        },
        {
          name: this.$t("surveys.voting"),   // ТИП = ГОЛОСОВАНИЕ
          type: 3,
        },
      ],
      curTab: null,  // ТЕКУЩИЙ ВЫБРАННЫЙ ФИЛЬТР ПО СТАТУСАМ
      navTabs: [   // СПИСОК ВКЛАДОК, КОТОРЫЕ ЯВЛЯЮТСЯ ФИЛЬТРАМИ ОПРОСОВ ПО СТАТУСУ
        {
          name: this.$t("surveys.active"), // АКТИВНЫЕ
          status: 1,
        },
        {
          name: this.$t("surveys.upcoming"), // ПРЕДСТОЯЩИЕ
          status: 3,
        },
        {
          name: this.$t("surveys.ended"), // ЗАВЕРШЕННЫЕ
          status: 2,
        },
        {
          name: this.$t("surveys.all"), // ВСЕ
          status: 0,
        },
      ],
      surveys: [],
    };
  },
  mounted() {   
    this.curTab = this.navTabs[0];  // ПРИ MOUNT КОМПОНЕНТА ИЗНАЧАЛЬНО ФИЛЬТР ПО СТАТУСАМ ДОЛЖЕН ПОКАЗЫВАТЬ "АКТИВНЫЕ" ОПРОСЫ
    this.getSurveysList();  // ВЫЗЫВАЕМ ФУНКЦИЮ ПОЛУЧЕНИЯ СПИСКА ОПРОСОВ
  },
  watch: {
    isLoading: {     // WATCHER ДЛЯ ОТСЛЕЖИВАНИЯ НАХОДИТСЯ ЛИ СТРАНИЦА В СОСТОЯНИИ ЗАГРУЗКИ (ИДЕТ ЛИ HTTP-ЗАПРОС НА ДАННЫЙ МОМЕНТ)
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    selectedCategory: { // WATCHER ДЛЯ ОТСЛЕЖИВАНИЯ ИЗМЕНЕНИЯ ФИЛЬТРА ПО КАТЕГОРИЯМ
      handler() {
        this.selectCategory();
      },
    },
  },
  computed: {
    ...mapStores(useProfileStore), // ПОДХВАТ ИНФОРМАЦИИ ИЗ STORE ДЛЯ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
    isAdmin() {   // COMPUTED ЗНАЧЕНИЕ ДЛЯ ПОНИМАНИЯ ЯВЛЯЕТСЯ ЛИ ПОЛЬЗОВАТЕЛЬ АДМИНОМ
      if (this.profileStore?.profileInfo?.privileged.length > 0) { // ПРОВЕРКА ЕСЛИ СПИСОК РОЛЕЙ ПОЛЬЗОВАТЕЛЯ НЕ ПУСТОЙ
        if (  // ПРОВЕРКА ЕСЛИ ПРОФИЛЬ ЕСТЬ РОЛЬ АДМИНА В СПИСКЕ РОЛЕЙ ПОЛЬЗОВАТЕЛЯ
          this.profileStore?.profileInfo.privileged.some(   
            (el) => el.role === "A"
          )
        ) {
          return true; 
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    positionLoader() {      // МЕТОД ВЫЗЫВАЕМЫЙ ДЛЯ ПОЗИЦИОНИРОВАНИЯ ЗАГРУЗЧИКА НА ЭКРАНЕ НА ВРЕМЯ ВЫПОЛНЕНИЯ HTTP-ЗАПРОСА

      // ДАЛЬНЕЙШИЙ КОД РАЗМЕЩАЕТ ЗАГРУЗЧИК ПО ЦЕНТРУ ЭТОГО КОМПОНЕНТА
      const el = this.$refs.scrollContainer;   
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    openParticipants() {                  // МЕТОД ВЫЗЫВАЕМЫЙ ДЛЯ ОТКРЫТИЯ ОКНА СО СПИСКОМ УЧАСТНИКОВ ГОЛОСОВАНИЯ
      this.votingVisible = false;          // CКРЫВАЕМ ОКНО ГОЛОСОВАНИЯ
      this.participantsVisible = true;     // ДЕЛАЕМ ОКНО УЧАСТНИКОВ ГОЛОСВАНИЯ ВИДИМЫМ
    },
    closeParticipants() {               // МЕТОД ВЫЗЫВАЕМЫЙ ДЛЯ ЗАКРЫТИЯ ОКНА СО СПИСКОМ УЧАСТНИКОВ ГОЛОСОВАНИЯ
      this.participantsVisible = false; // УБИРАЕМ ВИДИМОСТЬ ОКНА ГОЛОСОВАНИЯ
    },
    openVoting() {                 // МЕТОД ВЫЗЫВАЕМЫЙ ДЛЯ ОТКРЫТИЯ ОКНА С ГОЛОСОВАНИЕМ
      this.votingVisible = true;     // ДЕЛАЕМ ОКНО ГОЛОСОВАНИЯ ВИДИМЫМ
    },
    closeVoting() {               // МЕТОД ВЫЗЫВАЕМЫЙ ДЛЯ ЗАКРЫТИЯ ОКНА С ГОЛОСОВАНИЕМ
      this.votingVisible = false;  // УБИРАЕМ ВИДИМОСТЬ ОКНА ГОЛОСОВАНИЯ
    },
    selectCategory() {            // МЕТОД ВЫПОЛНЯЕМЫЙ ПРИ ИЗМЕНЕНИЯ ФИЛЬТРА ПО КАТЕГОРИЯМ
      this.stopFetching = false;   // ТАК КАК ФИЛЬТР ИЗМЕНЕН, ТО СПИСОК ОПРОСОВ НОВЫЙ, И МОЖНО СНОВА ПОДГРУЖАТЬ ДАННЫЕ (СМ. МЕТОД getSurveysList())
      this.page = 1;              // СБРОС НОМЕРА СТРАНИЦЫ ПАГИНАЦИИ
      this.surveys = [];         // ОЧИСТКА ТЕКУЩЕГО СПИСКА ОПРОСОВ ТАК КАК СПИСОК БУДЕТ СОСТАВЛЕН ИЗ ДРУГИХ ОПРОСОВ
      this.getSurveysList();      // ВЫЗОВ МЕТОДА ПОЛУЧЕНИЯ НОВОГО СПИСКА ОПРОСОВ
    },
    handleScrollEnd() {        // МЕТОД ВЫПОЛНЯЕМЫЙ ПРИ СКРОЛЛЕ ДО КОНЦА ВНИЗ СТРАНИЦЫ
      if (!this.isLoading && !this.stopFetching) { // ЕСЛИ МЫ УЖЕ НЕ В СОСТОЯНИИ ЗАГРУЗКИ И СПИСОК ОПРОСОВ ЕЩЕ НЕ КОНЧИЛСЯ ТО ВЫПОЛНЯЕМ ДАЛЕЕ:
        this.page++;                               // НОМЕР СТРАНИЦЫ УВЕЛИЧИВАЕМ (НОВАЯ ПАРТИЯ ОПРОСОВ)
        this.getSurveysList();                     // ВЫЗЫВАЕМ ФУНКЦИЮ ПОЛУЧЕНИЯ СПИСКА ОПРОСОВ
      }
    },
    openTab(tab) {          // МЕТОД ВЫПОЛНЯЕМЫЙ ПРИ СМЕНЕ ВКЛАДКИ (ФИЛЬТР ПО СТАТУСАМ) НА ДРУГУЮ
      this.curTab = tab;        // ЗАПИСЫВАЕМ ТЕКУЩУЮ ВКЛАДКУ
      this.stopFetching = false;  // ТАК КАК ФИЛЬТР ИЗМЕНЕН, ТО СПИСОК ОПРОСОВ НОВЫЙ, И МОЖНО СНОВА ПОДГРУЖАТЬ ДАННЫЕ (СМ. МЕТОД getSurveysList())
      this.page = 1;       // СБРОС НОМЕРА СТРАНИЦЫ ПАГИНАЦИИ
      this.surveys = [];      // ОЧИСТКА ТЕКУЩЕГО СПИСКА ОПРОСОВ ТАК КАК СПИСОК БУДЕТ СОСТАВЛЕН ИЗ ДРУГИХ ОПРОСОВ
      this.getSurveysList();     // ВЫЗОВ МЕТОДА ПОЛУЧЕНИЯ НОВОГО СПИСКА ОПРОСОВ
    },
    async getSurveysList() {  // МЕТОД ДЛЯ ПОЛУЧЕНИЯ СПИСКА ОПРОСОВ (+ ГОЛОСОВАНИЙ, ТЕСТОВ)
      try {
        this.isLoading = true;      // ВХОДИМ В СОСТОЯНИЕ ЗАГРУЗКИ
        let params = {                // ПАРАМЕТРЫ ДЛЯ GET-ЗАПРОСА
          page: this.page,               // ПАРАМЕТР ПАГИНАЦИИ (НОМЕР СТРАНИЦЫ)
          page_size: this.pageSize,         // ПАРАМЕТР ПАГИНАЦИИ (КОЛИЧЕСТВО ОПРОСОВ НА СТРАНИЦЕ)
        };
        if (this.curTab.status !== 0) {          // ЕСЛИ ТЕКУЩАЯ ВКЛАДКА НЕ "ВСЕ" ТО ПЕРЕДАЕМ ФИЛЬТР ПО СТАТУСУ
          params["status"] = this.curTab.status;
        }
        if (this.selectedCategory) {               // ЕСЛИ ВЫБРАН ФИЛЬТР ПО КАТЕГОРИЯМ, ПЕРЕДАЕМ ФИЛЬТР ПО КАТЕГОРИЯМ
          params["type"] = this.selectedCategory.type;
        }
        const response = await axios.get(API_URIS.questionnaries, { // GET-ЗАПРОС С ВЫШЕУКАЗАННЫМИ ПАРАМЕТРАМИ
          params,
        });
        if (response.data.results.length < this.pageSize) {  // ЕСЛИ ДЛИНА ПРИШЕДШЕГО МАССИВА МЕНЬШЕ ПЕРЕДАННОГО ПАРАМЕТРА КОЛИЧЕСТВА ОПРОСОВ НА СТРАНИЦЕ,
          this.stopFetching = true;                          // ТО ЗНАЧИТ СПИСОК ОПРОСОВ УЖЕ КОНЧИЛСЯ И МЫ МОЖЕМ БОЛЬШЕ НЕ СЛАТЬ ЗАПРОСЫ (ПОЛУЧИМ ПУСТОЙ МАССИВ)
        }
        this.surveys.push(...response.data.results);         // ДОБАВЛЯЕМ НОВЫЕ ПОЛУЧЕННЫЕ ОПРОСЫ В КОНЕЦ СПИСКА

        if (this.curTab.status == 1) {                       // ОБХОД ВОЗМОЖНОЙ ОШИБКИ, ЕСЛИ С БЭКА ПРИДУТ "ЗАВЕРШЕННЫЕ" ОПРОСЫ КОГДА ФИЛЬТР СТОИТ "АКТИВНЫЕ"
          this.surveys = this.surveys.filter((el) => el.status !== 2);
        }
        this.isLoading = false;   // ПОСЛЕ ПОЛУЧЕНИЯ ДАННЫХ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
      } catch (err) {
        this.isLoading = false;    // ПРИ ОШИБКЕ ВЫХОДИМ ИЗ СОСТОЯНИЯ ЗАГРУЗКИ
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.surveys_page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
  background-color: var(--generalColorWhite);
  padding: 52px;
  border-radius: 24px 0px 0px 0px;
  overflow-x: auto;
}
.surveys_page::-webkit-scrollbar {
  width: 8px;
}
.surveys_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.page_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.page_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}
.go_to_admin_page {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.07);
  border-radius: 30px;
  padding: 15px 20px;
}
.page_navigation {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}
.navigation_buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.nav_tab_button {
  padding: 8px 14px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 12px;
}
.nav_tab_button.active {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
  box-shadow: 0px 8px 24px 2px rgba(var(--generalBrandRGB), 0.12);
  box-shadow: 0px 0px 7px 2px rgba(var(--generalBrandRGB), 0.02);
}

.category_selector {
  width: 261px !important;
}
::v-deep(.vs__dropdown-toggle) {
  height: 38px !important;
  padding: 8px 12px !important;
  border-radius: 8px !important;
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
}
.surveys_list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
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

