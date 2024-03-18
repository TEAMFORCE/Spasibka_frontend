<template>
  <div class="survey_preview">
    <button
      @click="$router.push('/surveys')"
      class="go_back minor-info-secondary-bg"
    >
      <BackArrowIcon />
    </button>
    <div class="start_survey_card">
      <div class="survey_top_info">
        <div class="survey_name_and_description">
          <div class="survey_name_and_type">
            <h1 class="survey_name general-contrast-color">
              {{ surveyInfo?.title }}
            </h1>
            <h1 class="survey_type general-secondary-color">
              {{ surveyType }}
            </h1>
          </div>
          <h1
            v-html="surveyDescriptionHTML"
            class="survey_description general-secondary-color"
          ></h1>
        </div>
        <div class="survey_picture_and_info">
          <img
            v-if="surveyInfo?.image"
            class="survey_image"
            :src="photoAddress(surveyInfo?.image)"
          />
          <img
            v-else
            class="survey_image"
            :src="getImageURL('SurveysImages', 'DefaultSurveyImage.png')"
          />
          <div class="survey_info">
            <div class="survey_info_card general-white-color">
              <div class="icon_and_info_type">
                <AnswersCountIcon />
                <h1 class="info_title general-contrast-color">
                  {{ $t("surveys.questions_count") }}
                </h1>
              </div>
              <h1 class="info_value general-contrast-color">
                {{ questionsCount + " " + declension }}
              </h1>
            </div>
            <div class="survey_info_card general-white-color">
              <div class="icon_and_info_type">
                <EndDateIcon />
                <h1 class="info_title general-contrast-color">
                  {{ $t("surveys.ending_date") }}
                </h1>
              </div>
              <h1 class="info_value general-contrast-color">
                {{
                  surveyInfo?.finished_at
                    ? surveyEndDate
                    : this.$t("surveys.not_specified")
                }}
              </h1>
            </div>
            <div class="survey_info_card general-white-color">
              <div class="icon_and_info_type">
                <StatusIcon />
                <h1 class="info_title general-contrast-color">
                  {{ $t("surveys.status") }}
                </h1>
              </div>
              <h1 class="info_value general-contrast-color">
                {{ sessionStatus }}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div class="survey_bottom_info">
        <div 
          class="survey_time_info"
          :class="{ invisible: !surveyInfo?.timelimit }"
        >
          <h1 class="time_limit_description minor-error-color">
            {{ $t("surveys.time_limit_exists") }}
          </h1>
          <div class="time_and_icon">
            <TimeLimitIcon class="time_limit_icon" />
            <h1 class="time_for_survey minor-error-color">
              {{ surveyInfo?.timelimit + " " + $t("surveys.mins") }}
            </h1>
          </div>
        </div>
        <button
          class="start_survey general-brand-bg"
          :class="{
            inactive:
              surveyPreview?.session?.finished_at || !surveyInfo?.is_active,
          }"
          :disabled="
            surveyPreview?.session?.finished_at || !surveyInfo?.is_active
          "
          @click="proceedToSurvey"
        >
          <h1
            v-if="surveyPreview?.session?.finished_at"
            class="survey_text general-contrast-color"
          >
            {{ $t("surveys.survey_passed") }}
          </h1>
          <h1
            v-else-if="!surveyInfo?.is_active"
            class="survey_text general-contrast-color"
          >
            {{ $t("surveys.survey_ended") }}
          </h1>
          <h1 v-else-if="emptySession" class="survey_text general-white-color">
            {{ $t("surveys.start_survey") }}
          </h1>
          <h1 v-else class="survey_text general-white-color">
            {{ $t("surveys.continue_survey") }}
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";
import BackArrowIcon from "@/components/Icons/backArrow.vue";
import { photoAddress } from "@/general-scripts/photo-address";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { getImageURL } from "@/general-scripts/get-image-url";
import AnswersCountIcon from "@/components/Icons/SurveyIcons/AnswersCountIcon.vue";
import StatusIcon from "@/components/Icons/SurveyIcons/StatusIcon.vue";
import EndDateIcon from "@/components/Icons/SurveyIcons/EndDateIcon.vue";
import TimeLimitIcon from "@/components/Icons/SurveyIcons/TimeLimitIcon.vue";
import { formatTimestamp } from "@/general-scripts/timestamps";

export default {
  name: "SurveyPreview",
  components: {
    BackArrowIcon,
    AnswersCountIcon,
    StatusIcon,
    EndDateIcon,
    TimeLimitIcon,
  },
  data() {
    return {
      surveyInfo: null,   // ИНФОРМАЦИЯ ОБ ОПРОСЕ
      surveyPreview: null,  // ИНФОРМАЦИЯ О СЕССИИ ПРОХОЖДЕНИЯ ОПРОСА
    };
  },
  mounted() {
    this.getSurvey(); // ПРИ MOUNT КОМПОНЕНТА ПОЛУЧАЕМ ДАННЫЕ ОБ ОПРОСЕ
    this.getSurveyPreview(); // А ТАКЖЕ ДАННЫЕ О СЕССИИ ПРОХОЖДЕНИЯ ЭТОГО ОПРОСА
  },
  computed: {
    ...mapStores(useProfileStore), // ПОДВЯЗКА ДАННЫХ ИЗ STORE ДЛЯ ПРОФИЛЯ
    surveyDescriptionHTML() { // ЭТО COMPUTED ЗНАЧЕНИЕ ДЛЯ ТОГО ЧТОБЫ В ОПИСАНИИ ОПРОСА БЫЛИ ПЕРЕНОСЫ СТРОКИ И ССЫЛКИ БЫЛИ КЛИКАБЕЛЬНЫМИ
      let description = this.surveyInfo?.description || "";
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n|\r|\n/g, "<br>");
    },
    sessionStatus() {   // ЗНАЧЕНИЕ ДЛЯ ОТОБРАЖЕНИЯ СТАТУСА СЕССИИ (ПРОХОЖДЕНИЯ ОПРОСА)
      if (this.surveyPreview?.session?.finished_at) { // ЕСЛИ ИМЕЕТСЯ ДАТА ЗАВЕРШЕНИЯ СЕССИИ, ЗНАЧИТ УЖЕ ПРОШЛИ ОПРОС
        return this.$t("surveys.was_passed");
      } else if (this.emptySession) {  // ЕСЛИ СЕССИЯ ПУСТАЯ ЗНАЧИТ ЕЩЕ НА НАЧАЛИ ПРОХОДИТЬ ОПРОС
        return this.$t("surveys.was_not_passed");
      } else {     // ИНАЧЕ СЕССИЯ НАЧАТА И В ПРОЦЕССЕ
        return this.$t("surveys.in_progress");
      }
    },
    surveyEndDate() {   // COMPUTED ЗНАЧЕНИЕ ДЛЯ ОТОБРАЖЕНИЯ ДАТЫ ОКОНЧАНИЯ ОПРОСА
      let date = formatTimestamp(this.surveyInfo.finished_at); // ИСПОЛЬЗУЕМ МЕТОД ДЛЯ ИЗВЛЕЧЕНИЯ ИНФОРМАЦИИ ИЗ СТРОКИ С ДАТОЙ
      return (date.day < 10 ? "0" : "") + date.day + "." + (date.month + 1 < 10 ? "0" : "") + (date.month + 1) + "." + date.year; // ФОРМАТИРУЕМ ВЫВОД ДАТЫ
    },
    surveyType() { // COMPUTED ЗНАЧЕНИЕ ДЛЯ ОТОБРАЖЕНИЯ ТИПА ОПРОСА (ОПРОС, ТЕСТ, И Т.Д.)
      if (this.surveyInfo?.type === 1) { // TYPE: 1 => ОПРОС
        return this.$t("surveys.survey");
      }
    },
    declension() {     // ОПРЕДЕЛЕНИЕ СКЛОНЕНИЯ ДЛЯ ОТОБРАЖЕНИЯ КОЛИЧЕСТВА ВОПРОСОВ
      let count = this.questionsCount; // КОЛИЧЕСТВО ВОПРОСОВ В ОПРОСЕ
      if (count % 100 >= 11 && count % 100 <= 14) { // ПРИМЕР: 11 ВОПРОСОВ
        return this.$t("surveys.questions_declension_11");
      }
      const lastDigit = count % 10; 
      if (lastDigit === 1) {    // ПРИМЕР: 21 ВОПРОС
        return this.$t("surveys.questions_declension_1");
      } else if (lastDigit >= 2 && lastDigit <= 4) { // ПРИМЕР: 3 ВОПРОСА 
        return this.$t("surveys.questions_declension_2");
      } else {   // ПРИМЕР: 7 ВОПРОСОВ, 1257 ВОПРОСОВ
        return this.$t("surveys.questions_declension_11");
      }
    },
    questionsCount() {   // ПОЛУЧЕНИЯ КОЛИЧЕСТВА ВОПРОСОВ В ОПРОСЕ ДЛЯ ОТОБРАЖЕНИЯ ИНФОРМАЦИИ
      let ans = 0;       // ЗАВОДИМ СЧЕТЧИК ДЛЯ ПОДСЧЕТА КОЛИЧЕСТВА ВОПРОСОВ
      for (let i = 0; i < this.surveyInfo?.questionnairegroup_set.length; ++i) { // ПРОХОДИМСЯ ПО ВСЕМ СЕКЦИЯМ ОПРОСА
        ans +=  
          this.surveyInfo?.questionnairegroup_set[i].questionnaireblock_set    // СКЛАДЫВАЕМ КОЛИЧЕСТВА ВОПРОСОВ В КАЖДОЙ СЕКЦИИ
            .length;
      }
      return ans;
    },
    emptySession() { // ПРОВЕРКА МЫ УЖЕ НАЧАЛИ ПРОХОДИТЬ ОПРОС ИЛИ ЕЩЕ НЕТ
      return this.surveyPreview && this.surveyPreview.session // ЕСЛИ ИНФОРМАЦИЯ О СЕССИИ ИМЕЕТСЯ
        ? Object.keys(this.surveyPreview.session).length === 0  // И ЕСЛИ В ИНФОРМАЦИИ О СЕССИИ ИМЕЮТСЯ ДАННЫЕ ЗНАЧИТ СЕССИЯ УЖЕ НАЧАТА 
        : true;                                             // А ЕСЛИ ИНФОРМАЦИИ О СЕССИИ НЕТ ЗНАЧИТ В ЛЮБОМ СЛУЧАЕ НЕ НАЧАТА
    },
  },
  methods: {
    getImageURL: getImageURL,      // МЕТОД ДЛЯ ОТОБРАЖЕНИЯ ФОТОГРАФИЙ ЛЕЖАЩИХ НА ФРОНТЕ
    photoAddress: photoAddress,   // МЕТОД ДЛЯ ОТОБРАЖЕНИЯ ФОТОГРАФИЙ ЛЕЖАЩИХ НА БЭКЕ
    async getSurveyPreview() {   // ПОЛУЧАЕМ ДАННЫЕ О ПРЕВЬЮ ОПРОСА ДЛЯ ТОГО ЧТОБЫ УЗНАТЬ О ТЕКУЩЕЙ СЕССИИ ПРОХОЖДЕНИЯ ОПРОСА
      try {
        const response = await axios.get(
          API_URIS.questionnariesPreview.replace("id", this.$route.params.id)
        );
        this.surveyPreview = response.data;
      } catch (err) {
        throw err;
      }
    },
    async getSurvey() {  // МЕТОД ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ О ТЕКУЩЕМ ОПРОСЕ КОТОРЫЙ ХОТИМ НАЧАТЬ ПРОХОДИТЬ
      try {
        const response = await axios.get(
          API_URIS.questionnaries + this.$route.params.id + "/"
        );
        this.surveyInfo = response.data;
      } catch (err) {
        throw err;
      }
    },
    async proceedToSurvey() {   // МЕТОД ДЛЯ НАЧАТИЯ ПРОХОЖДЕНИЯ ОПРОСА
      const isEmpty = this.emptySession;  // ПРОВЕРЯЕМ ПОЛЬЗОВАТЕЛЬ УЖЕ НАЧИНАЛ ПРОХОЖДЕНИЕ ОПРОСА ИЛИ ЕЩЕ НЕТ
      if (isEmpty) {   // ЕСЛИ ЕЩЕ НЕ НАЧИНАЛ
        try {
          const response = await axios.post(API_URIS.questionnariesSession, { // POST-ЗАПРОС ДЛЯ СОЗДАНИЯ НОВОЙ СЕССИИ (НАЧАТЬ ПРОХОЖДЕНИЕ ОПРОСА)
            questionnaire: this.$route.params.id,  // ПЕРЕДАЕМ ID ОПРОСА КОТОРЫЙ СОБИРАЕМСЯ НАЧАТЬ ПРОХОДИТЬ
            user: this.profileStore.profileInfo.id,  // ПЕРЕДАЕМ ID СВОЕГО ПРОФИЛЯ
          });
          this.$router.push("/survey/" + this.$route.params.id); // ПЕРЕХОДИМ НА СТРАНИЦУ ПРОХОЖДЕНИЯ ОПРОСА
        } catch (err) {
          throw err;
        }
      } else { // ЕСЛИ УЖЕ НАЧИНАЛИ ОПРОС ЗАРАНЕЕ, ЗНАЧИТ СЕССИЯ УЖЕ ЕСТЬ
        this.$router.push("/survey/" + this.$route.params.id); // ПЕРЕХОДИМ СРАЗУ НА СТРАНИЦУ ПРОХОЖДЕНИЯ ОПРОСА
      }
    },
  },
};
</script>

<style scoped>
.survey_preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  background-color: var(--generalColorWhite);
  padding: 52px;
  border-radius: 24px 0px 0px 0px;
  overflow-x: auto;
}
.go_back {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  padding: 7px;
}
.back_arrow_icon {
  height: 16px;
}
.start_survey_card {
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
}
.survey_top_info {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
}
@media (max-width: 1200px) {
  .survey_preview {
    padding: 32px;
  }
  .survey_top_info {
    flex-wrap: wrap;
  }
  .survey_info {
    flex-wrap: wrap;
  }
  .survey_name_and_description {
    width: 100% !important;
  }
  .survey_picture_and_info {
    width: 100% !important;
  }
  .survey_bottom_info {
    flex-wrap: wrap;
  }
  .survey_time_info {
    width: 100% !important;
    max-width: 522px;
    flex-direction: column;
    align-items: flex-start !important;
  }  
  .start_survey {
    width: 100% !important;
  }
}
.survey_name_and_description {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 50%;
}
.survey_name_and_type {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.survey_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
}
.survey_type {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: left;
}
.survey_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.survey_picture_and_info {
  max-width: 522px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 50%;
}
.survey_image {
  width: 100%;
  max-width: 522px;
  max-height: 337px;
  object-fit: cover;
  border-radius: 12px;
}
.survey_info {
  display: flex;
  gap: 8px;
  width: 100%;
}
.survey_info_card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 12px;
  box-shadow: 0px 7px 20px 0px rgba(138, 138, 138, 0.1);
  border-radius: 12px;
}
.icon_and_info_type {
  display: flex;
  gap: 6px;
}
.info_title {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
}
.info_value {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  text-align: left;
}
.survey_bottom_info {
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: space-between;
}
.survey_time_info {
  /* opacity: 0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 50%;
}
.survey_time_info.invisible {
  opacity: 0;
}
.time_limit_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.time_limit_icon {
  height: 24px;
  width: 24px;
}
.time_and_icon {
  display: flex;
  gap: 8px;
  align-items: center;
}
.time_for_survey {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.start_survey {
  max-width: 522px;
  box-sizing: border-box;
  padding: 17px;
  border-radius: 12px;
  width: 50%;
}
.start_survey.inactive {
  background-color: var(--generalColorGrey);
  color: var(--generalColorWhite);
}
.survey_text {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}
</style>