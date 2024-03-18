<template>
  <div class="survey_wrapper general-white-bg">
    <div v-if="surveyCompleted" class="survey_completed">
      <div class="survey_passed_header">
        <h1 class="survey_passed_message">
          {{ $t("surveys.congrats_survey_passed") + ":" }}
        </h1>
        <h1 class="survey_name">{{ survey?.title }}</h1>
      </div>
      <AfterSurveyCompletedIcon />
      <button
        class="back_to_surveys general-brand-bg general-white-color"
        @click="$router.push('/surveys')"
      >
        {{ $t("surveys.back_to_surveys") }}
      </button>
    </div>
    <div v-else class="survey general-white-bg">
      <CompleteSurveyPopup
        :timeLeft="timeLeft"
        :surveyPreview="surveyPreview"
        v-if="surveyCompletionEnabled"
        @completeSurvey="completeSurvey"
        @cancelSurveyCompletion="cancelSurveyCompletion"
      />
      <div class="survey_questions">
        <div class="survey_questions_without_next_prev_buttons">
          <div class="survey_header">
            <div class="back_and_header_text">
              <button
                @click="$router.push('/surveys')"
                class="back_icon_wrapper minor-info-secondary-bg"
              >
                <BackArrowIcon :currentColor="generalContrastColor" />
              </button>
              <h1 class="header_text general-contrast-color">
                {{ survey?.title || "TITLE" }}
              </h1>
            </div>
            <div v-if="surveyPreview?.timelimit" class="time_left general-contrast-collor">
              <div class="time_not_expired" v-if="timeLeft">
                <CountdownIcon class="time_left_icon"/>
                <h1 class="time_left" >{{ timeLeft.hours }}:{{ timeLeft.minutes }}:{{ timeLeft.seconds }}</h1>
              </div>
              <h1 class="time_left" v-else>{{ $t("surveys.survey_pass_time_has_expired") }}</h1>
            </div>
          </div>
          <div v-if="moreThanOneSection" class="section_info">
            <h1 class="section_header general-contrast-color">
              {{ currentSection?.title }}
            </h1>
            <h1
              v-html="sectionDescription"
              class="section_description general-secondary-color"
            ></h1>
          </div>
          <div
            v-for="(question, index) in currentSection?.questionnaireblock_set"
            class="question_card"
            :id="`question_${question.id}`"
          >
            <div class="question_number general-brand-color">
              {{ $t("surveys.question") + " " + (index + 1) + (question.required ? " *" : "") }}
            </div>
            <div class="question_interaction_card">
              <div class="question_interaction_header">
                <div class="question_title_and_star">
                  <h1 class="question_title general-contrast-color">
                    {{ question.question }}
                  </h1>
                  <h3 class="question_description">
                    {{ question.description }}
                  </h3>
                  <img
                    v-if="question.image"
                    class="question_image"
                    :src="getQuestionImage(question.image)"
                    alt="question_image"
                  />
                  <h1 v-if="question.required" class="question_title general-brand-color">*</h1>
                </div>
                <h1 v-if="question.required" class="question_importance general-secondary-color">{{ $t("surveys.important_question") }}</h1>
              </div>
              <div class="single_choice_question">
                <div class="answer_options" v-if="question.answer_type === 1">
                  <button
                    @click="selectOption(option, question)"
                    class="answer_option transparent-bg"
                    v-for="(option, index) in question.inner_object"
                  >
                    <div
                      class="answer_option_button minor-info-secondary-bg"
                      :class="{ selected: option.my_answer }"
                    >
                      <div
                        v-if="option.my_answer"
                        class="option_selected_circle general-brand-bg"
                      ></div>
                    </div>
                    <h1 class="answer_option_text general-contrast-color">
                      {{ option.answer }}
                    </h1>
                  </button>
                </div>
                <div
                  v-else-if="question.answer_type === 2"
                  class="answer_options"
                >
                  <button
                    @click="selectOrDeselectOption(option)"
                    class="answer_option transparent-bg"
                    v-for="(option, index) in question.inner_object"
                  >
                    <input
                      type="checkbox"
                      class="checkbox"
                      v-model="option.my_answer_boolean"
                    />
                    <h1 class="answer_option_text general-contrast-color">
                      {{ option.answer }}
                    </h1>
                  </button>
                </div>
                <div
                  v-else-if="question.answer_type === 3"
                  class="text_answer_wrapper"
                >
                  <div class="input_field_wrapper">
                    <div
                      v-if="question.inner_object[0].my_answer"
                      class="input_field_placeholder general-secondary-color general-white-bg"
                    >
                      {{ $t("surveys.answer") }}
                    </div>
                    <input
                      @blur="writeTextOption(question)"
                      class="input_field general-contrast-color"
                      v-model="question.inner_object[0].my_text_answer"
                      :placeholder="$t('surveys.answer')"
                    />
                  </div>
                </div>
                <div
                  v-else-if="question.answer_type === 4"
                  class="scale_selectors_wrapper"
                >
                  <h1 class="corner_descriptions general-contrast-color">
                    {{ question.inner_object[0].min_title }}
                  </h1>
                  <div class="scale_selectors">
                    <div
                      class="scale_selector"
                      v-for="index in question.inner_object[0].max_score"
                      :key="index"
                    >
                      <h1 class="scale_value general-contrast-color">
                        {{ index }}
                      </h1>
                      <div
                        @click.stop="selectScaleOption(question, index)"
                        class="answer_option_button minor-info-secondary-bg"
                        :class="{
                          selected:
                            question.inner_object[0].my_answer?.score === index,
                        }"
                      >
                        <div
                          v-show="question.inner_object[0].my_answer?.score === index"
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
          </div>
        </div>
        <div class="next_and_prev">
          <button
            v-if="!firstSection"
            class="next_or_prev_button transparent-bg general-contrast-color"
            @click="proceedToPrevSection"
          >
            {{ $t("surveys.previous_page") }}
          </button>
          <button
            class="next_or_prev_button general-brand-bg general-white-color"
            @click="nextOrEnd"
          >
            {{
              lastSection
                ? $t("surveys.complete_survey")
                : $t("surveys.continue")
            }}
          </button>
        </div>
      </div>
      <div class="question_selectors">
        <div class="navigation_header general-contrast-color">
          {{ $t("surveys.navigation") }}
        </div>
        <div class="sections_and_complete">
          <div class="sections_selection">
            <div
              @click="currentSection = section"
              v-for="(section, indexS) in survey?.questionnairegroup_set"
              class="section"
            >
              <h1
                v-if="moreThanOneSection"
                class="section_title"
                :class="{ active: currentSection.id === section.id }"
              >
                {{ section.title }}
              </h1>
              <div class="questions_list">
                <div
                  v-for="(question, indexQ) in section.questionnaireblock_set"
                  class="question"
                  :class="{ answered: answered(question) }"
                  @click.stop="goToQuestion(section, question)"
                >
                  {{ indexQ + 1 }}
                    <h1 v-if="question.required" class="question_importance_star general-brand-color">*</h1>
                </div>
              </div>
            </div>
          </div>
          <div class="complete_survey">
            <button
              @click="enableSurveyCompletion"
              class="complete_survey_text transparent-bg general-contrast-color"
            >
              {{ $t("surveys.complete_survey") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackArrowIcon from "@/components/Icons/backArrow.vue";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import { photoAddress } from "@/general-scripts/photo-address";
import axios from "axios";
import CompleteSurveyPopup from "@/components/SurveysElements/SurveysForUsersElements/CompleteSurveyPopup.vue";
import AfterSurveyCompletedIcon from "@/components/Icons/SurveyIcons/AfterSurveyCompletedIcon.vue";
import CountdownIcon from "@/components/Icons/SurveyIcons/CountdownIcon.vue";

export default {
  name: "Survey",
  components: {
    BackArrowIcon,
    CompleteSurveyPopup,
    AfterSurveyCompletedIcon,
    CountdownIcon
},
  data() {
    return {
      timeLeft: null, // ОБЪЕКТ ДЛЯ ХРАНЕНИЯ ОСТАВШЕГОСЯ ВРЕМЕНИ ПРОХОЖДЕНИЯ ОПРОСА
      intervalId: null, // ИНТЕРВАЛ ДЛЯ ОБНОВЛЕНИЯ ОСТАВШЕГОСЯ ВРЕМЕНИ ПРОХОЖДЕНИЯ ОПРОСА

      surveyCompleted: false, // БУЛЕВОЕ ЗНАЧЕНИЕ ЗАВЕРШЕН ЛИ ОПРОС ДЛЯ ПОКАЗА ЭКРАНА С БЛАГОДАРНОСТЬЮ ЗА ЗАВЕРШЕНИЕ ОПРОСА
      surveyPreview: null, // ОБЪЕКТ СЕССИИ ПОЛЬЗОВАТЕЛЯ
      currentSession: null, // ОБЪЕКТ ТЕКУЩЕЙ СЕССИИ ПОЛЬЗОВАТЕЛЯ (ЯВЛАЕТСЯ ПОЛЕМ surveyPreview)
      surveyCompletionEnabled: false, //  БУЛЕВОЕ ЗНАЧЕНИЕ КОТОРОЕ ОПРЕДЕЛЯЕТ ПОКАЗЫВАЕТСЯ ЛИ ВСПЛЫВАЮЩЕЕ ОКНО ЗАВЕРШЕНИЯ ОПРОСА
      survey: null, // ОБЪЕКТ ДЛЯ ХРАНЕНИЯ ВСЕГО ОПРОСА С СЕКЦИЯМИ, ВОПРОСАМИ, И ВАРИАНТАМИ ОТВЕТОВ
      currentSection: null, // ОБЪЕКТ ТЕКУЩЕЙ СЕКЦИИ НА КОТОРОЙ НАХОДИТСЯ ПОЛЬЗОВАТЕЛЬ
    };
  },
  mounted() {
    this.getSurveyPreview(); // ПРИ MOUNT КОМПОНЕНТА ПОЛУЧАЕМ ДАННЫЕ О СЕССИИ ПОЛЬЗОВАТЕЛЯ
  },
  beforeDestroy() {
    clearInterval(this.intervalId); // ОЧИСТКА ИНТЕРВАЛА ПЕРЕД УНИЧТОЖЕНИЕМ КОМПОНЕНТА
  },
  computed: {

    // COMPUTED ЗНАЧЕНИЕ ДЛЯ ПРАВИЛЬНОГО ОТОБРАЖЕНИЯ ОПИСАНИЯ СЕКЦИИ С КЛИКАБЕЛЬНЫМИ ССЫЛКАМИ И ПЕРЕНОСАМИ СТРОК
    sectionDescription() { 
      let description = this.currentSection?.description || "";
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n|\r|\n/g, "<br>");
    },
    firstSection() { // ОПРЕДЕЛЯЕМ ТЕКУЩАЯ СЕКЦИЯ ЭТО ПЕРВАЯ СЕКЦИЯ ИЛИ НЕТ
      let sections = this.survey?.questionnairegroup_set; // ПОЛУЧАЕМ СПИСОК СЕКЦИЙ ОПРОСА
      if (!sections) return false; // ЕСЛИ ИХ НЕТ ЗНАЧИТ СЕКЦИЯ НЕ СЧИТАЕТСЯ ПОСЛЕДНЕЙ
      let firstSection = sections[0]; // БЕРЕМ ПЕРВУЮ СЕКЦИЮ ОПРОСА
      return this.currentSection?.id === firstSection?.id; // СРАВНИВАЕМ ID ДЛЯ ПРОВЕРКИ ИДЕНТИЧНОСТИ
    },
    lastSection() { // ОПРЕДЕЛЯЕМ ТЕКУЩАЯ СЕКЦИЯ ЭТО ПОСЛЕДНЯЯ СЕКЦИЯ ИЛИ НЕТ
      let sections = this.survey?.questionnairegroup_set; // ПОЛУЧАЕМ СПИСОК СЕКЦИЙ ОПРОСА
      if (!sections) return false; // ЕСЛИ ИХ НЕТ ЗНАЧИТ СЕКЦИЯ НЕ СЧИТАЕТСЯ ПОСЛЕДНЕЙ
      let lastSection = sections[sections.length - 1]; // БЕРЕМ ПРЕДПОСЛЕДНЮЮ СЕКЦИЮ ОПРОСА
      return this.currentSection?.id === lastSection?.id; // СРАВНИВАЕМ ID ДЛЯ ПРОВЕРКИ ИДЕНТИЧНОСТИ
    },
    moreThanOneSection() {  // ОПРЕДЕЛЯЕМ ОДНА СЕКЦИЯ В ОПРОСЕ ИЛИ БОЛЬШЕ
      return this.survey?.questionnairegroup_set?.length > 1;
    },
    generalContrastColor() { // ЗНАЧЕНИЕ БРЕНДОВОГО ЧЕРНОГО ЦВЕТА
      return getComputedStyle(document.documentElement).getPropertyValue(
        "--generalContrast"
      );
    },
  },
  methods: {
    updateTimeLeft() { // МЕТОД ДЛЯ ОБНОВЛЕНИЯ ТАЙМЕРА ПРОХОЖДЕНИЯ ОПРОСА
      const startTime = new Date(this.currentSession.started_at);   // ЗАПИСЫВАЕМ ВРЕМЯ НАЧАЛА СЕССИИ
      
      // ПРИБАВЛЯЕМ К ВРЕМЕНИ НАЧАЛА СЕССИИ МАКС. ВРЕМЯ НА ПРОХОЖДЕНИЕ (В МИЛЛИСЕКУНДАХ)
      // ДЛЯ ТОГО ЧТОБЫ ПОЛУЧИТЬ ВРЕМЯ ОКОНЧАНИЯ ПРОХОЖДЕНИЯ ОПРОСА
      const endTime = new Date(startTime.getTime() + this.surveyPreview.timelimit * 60000); 
      const currentTime = new Date();  // ЗАПИСЫВАЕМ ТЕКУЩЕЕ ВРЕМЯ
      let timeDiff = endTime - currentTime; // СЧИТАЕМ ВРЕМЯ ДО ОКОНЧАНИЯ СЕССИИ

      if (timeDiff > 0) { // ЕСЛИ ВРЕМЯ ДО ОКОНЧАНИЯ СЕССИИ ВСЕ ЕЩЕ ЕСТЬ
        // ТО ФОРМАТИРУЕМ ОСТАВШЕЕСЯ ВРЕМЯ ДЛЯ ВЫВОДА НА ЭКРАН
        this.timeLeft = {
          hours: Math.floor((timeDiff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
          minutes: Math.floor((timeDiff / (1000 * 60)) % 60).toString().padStart(2, '0'),
          seconds: Math.floor((timeDiff / 1000) % 60).toString().padStart(2, '0'),
        };
      } else {
        // ЕСЛИ ВРЕМЯ СЕССИИ УЖЕ ЗАКОНЧИЛОСЬ
        this.timeLeft = null; // В ОСТАШЕМСЯ ВРЕМЕНИ НЕ БУДЕТ НИКАКОГО ЗНАЧЕНИЯ
        clearInterval(this.intervalId); // ОЧИЩАЕМ ИНТЕРВАЛ ТАК КАК БОЛЬШЕ НЕ НУЖЕН
      }
    },

    photoAddress: photoAddress, // МЕТОД ДЛЯ ОТОБРАЖЕНИЯ КАРТИНКИ ЛЕЖАЩИЕ НА БЭКЕ
    getQuestionImage(url) { // МЕТОД ДЛЯ ПОЛУЧЕНИЯ КАРТИНКИ ВОПРОСА 
      return photoAddress(url);
    },

    // МЕТОД ДЛЯ ПЕРЕХОДА ЭКРАНА К ВОПРОСУ, УКАЗАННОМУ В АРГУМЕНТАХ
    // ТАКЖЕ УКАЗАНА ТЕКУЩАЯ СЕКЦИЯ
    goToQuestion(section, question) { 
      this.currentSection = section; 
      this.$nextTick(() => {   // ДОЖИДАЕМСЯ РЕНДЕРИНГА ВОПРОСОВ
        const element = document.getElementById(`question_${question.id}`); // НАХОДИМ В UI НАШ ВОПРОС
        if (element) { // ЕСЛИ ОН ТАМ ЕСТЬ, ЗНАЧИТ СКРОЛЛИМСЯ К НЕМУ
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    proceedToPrevSection() { // МЕТОД ДЛЯ ПЕРЕХОДА К ПРЕДЫДУЩЕЙ СЕКЦИИ
      let sections = this.survey?.questionnairegroup_set;
      if (sections) {
        for (let i = 1; i < sections.length; ++i) { // ПРОХОДИМСЯ ПО ВСЕМ СЕКЦИЯМ 
          if (sections[i].id === this.currentSection?.id) { // НАХОДИМ ТЕКУЩУЮ СРЕДИ НИХ
            this.currentSection = sections[i - 1]; // ПЕРЕХОДИМ НА 1 ИНДЕКС НИЖЕ
            break;
          }
        }
      }
    },

    // В ЗАВИСИМОСТИ ОТ РЕЗУЛЬТАТА ЭТОГО МЕТОДА БУДЕТ ЛИБО ПЕРЕХОД К СЛЕДУЮЩЕЙ СЕКЦИИ ЛИБО ПЕРЕХОД К ЗАВЕРШЕНИЮ ОПРОСА
    nextOrEnd() { 
      if (this.lastSection) { // ЕСЛИ ТЕКУЩАЯ СЕКЦИЯ ПОСЛЕДНЯЯ
        this.enableSurveyCompletion(); // ЗНАЧИТ ОТКРЫВАЕМ ВСПЛЫВАЮЩЕЕ ОКНО ДЛЯ ЗАВЕРШЕНИЯ ОПРОСА
      } else { // ИНАЧЕ ПРОХОДИСЯ ПО ВСЕМ СЕКЦИЯМ И НАХОДИМ НАШУ ТЕКУЩУЮ
        let sections = this.survey?.questionnairegroup_set;
        if (sections) {
          for (let i = 0; i < sections.length - 1; ++i) {
            if (sections[i].id === this.currentSection?.id) { // КОГДА НАШЛИ НАШУ СЕКЦИЮ В СПИСКЕ ВСЕХ СЕКЦИЙ
              this.currentSection = sections[i + 1];  // ТО ПЕРЕХОДИМ К СЕКЦИИ СО СЛЕДУЮЩИМ ИНДЕКСОМ
              break;
            }
          }
        }
      }
    },
    answered(question) { // ПРОВЕРКА ЕСТЬ ЛИ ОТВЕТ ПОЛЬЗОВАТЕЛЯ НА КАКОЙ-НИУБДЬ ВОПРОС (ССЫЛКА НА ВОПРОС В АРГУМЕНТАХ)
      for (let i = 0; i < question.inner_object.length; ++i) { // ПРОХОДИМСЯ ПО ВСЕМ ВАРИАНТАМ ОТВЕТА НА ВОПРОС
        if (
          (question.answer_type === 1 && question.inner_object[i].my_answer) || // ЕСТЬ ЛИ ОТВЕТ ДЛЯ SINGLE CHOICE
          (question.answer_type === 2 &&  // ЕСТЬ ЛИ ОТВЕТ ДЛЯ MULTIPLE CHOICE
            question.inner_object[i].my_answer_boolean) ||
          (question.answer_type === 3 &&   // ЕСТЬ ЛИ ОТВЕТ ДЛЯ ТЕКСТОВОГО ОТВЕТА
            question.inner_object[i].my_text_answer) || 
          (question.answer_type === 4 && question.inner_object[i].my_answer) // ЕСЛИ ЛИ ОТВЕТ ДЛЯ ЛИНЕЙНОЙ ШКАЛЫ
        )
          return true;
      }
      return false;
    },
    enableSurveyCompletion() { // МЕТОД ДЛЯ ПОКАЗА ВСПЛЫВАЮЩЕГО ОКНА ЗАВЕРШЕНИЯ ОПРОСА
      this.surveyCompletionEnabled = true;
    },
    cancelSurveyCompletion() {  // МЕТОД ДЛЯ СКРЫТИЯ ВСПЛЫВАЮЩЕГО ОКНА ЗАВЕРШЕНИЯ ОПРОСА
      this.surveyCompletionEnabled = false;  
    },
    async getSurveyPreview() {   // ПОЛУЧЕННИЕ ДАННЫХ О СЕССИИ ПОЛЬЗОВАТЕЛЯ
      try { 
        const response = await axios.get( 
          API_URIS.questionnariesPreview.replace("id", this.$route.params.id)
        );

        // СОХРАНЯЕМ ДАННЫЕ О СЕССИИ
        this.surveyPreview = response.data;
        this.currentSession = this.surveyPreview.session; 
        
        this.updateTimeLeft(); // УСТАНАВЛИВАЕМ ТАЙМЕР НА ПРОХОЖДЕНИЕ ОПРОСА
        this.intervalId = setInterval(this.updateTimeLeft, 1000); // КАЖДУЮ СЕКУНДУ ОБНОВЛЯЕМ ТАЙМЕР
        
        this.getSurvey(); // ПОЛУЧАЕМ ДАННЫЕ О ВОПРОСАХ СЕССИИ + ОБ ОТВЕТАХ УЖЕ СДЕЛАННЫМИ ПОЛЬЗОВАТЕЛЕМ
      } catch (err) {
        throw err;
      }
    },
    async completeSurvey() { // МЕТОД ДЛЯ ЗАВЕРШЕНИЯ ОПРОСА ПОЛЬЗОВАТЕЛЕМ
      try {
        for (let i = 0; i < this.survey.questionnairegroup_set.length; ++i) { // ПРОХОДИМСЯ ПО ВСЕМ СЕКЦИЯМ ОПРОСА
          let currentSection = this.survey.questionnairegroup_set[i]; // ПОЛУЧАЕМ ТЕКУЩУЮ СЕКЦИЮ
          for (let j = 0; j < currentSection.questionnaireblock_set.length; ++j) { // ПРОХОДИМСЯ ПО КАЖДОМУ ВОПРОСУ ТЕКУЩЕЙ СЕКЦИИ
            let currentQuestion = currentSection.questionnaireblock_set[j]; // ПОЛУЧАЕМ ТЕКУЩИЙ ВОПРОС
            if (currentQuestion.required && !this.answered(currentQuestion)) { // ЕСЛИ ТЕКУЩИЙ ВОПРОС ОБЯЗАТЕЛЬНЫЙ НО НА НЕГО ОТВЕТА НЕТ
              this.cancelSurveyCompletion(); // ЗНАЧИТ НЕ ЗАВЕРШАЕМ ОПРОС 
              this.goToQuestion(currentSection, currentQuestion); // И ПЕРЕХОДИМ К ВОПРОСУ НА КОТОРЫЙ НЕ ОТВЕТИЛИ
              throw new Error(this.$t("surveys.answer_all_mandatory_questions")); // ВЫВОДИМ ПОЛЬЗОВАТЕЛЮ СООБЩЕНИЕ ЧТОБЫ ОТВЕТИЛ НА ВСЕ ВАЖНЫЕ ВОПРОСЫ
            }
          }
        }
        const response = await axios.patch( // ЕСЛИ НА ВСЕ ОБЯЗАТЕЛЬНЫЕ ВОПРОСЫ ОТВЕТЫ ИМЕЮТСЯ
          API_URIS.questionnariesSession + this.currentSession.id + "/", // ТО ПОСЫЛАЕМ ЗАПРОС НА ИЗМЕНЕНИЕ СЕССИИ НА ЗАВЕРШЕННУЮ
          {
            finished_at: new Date().toISOString(), // ПЕРЕДАЕМ ТЕКУЩУЮ ДАТУ
            user: this.currentSession.user,   // ПЕРЕДАЕМ ПОЛЬЗОВАТЕЛЯ КТО ПРОШЕЛ ОПРОС
            questionnaire: this.$route.params.id,  // ПЕРЕДАЕМ ID ОПРОСА КОТОРЫЙ ПРОШЕЛ ПОЛЬЗОВАТЕЛЬ
          }
        );
        this.surveyCompleted = true; // ПОМЕЧАЕМ ОПРОС КАК ПРОЙДЕННЫЙ
      } catch (err) {
        notify(err.message || this.$t("notification.error"));
        throw err;
      }
    },

    // МЕТОД ВЫЗЫВАЕМЫЙ ПРИ ВЫБОРЕ ПОЛЬЗОВАТЕЛЕМ ВАРИАНТА ОТВЕТА (MULTIPLE CHOICE)
    // В АРГУМЕНТАХ ПРИНИМАЕТ ССЫЛКУ НА ОТВЕТ И ВОПРОС
    async selectOrDeselectOption(option) {
      try {
        if (!option.my_answer) {   // ЕСЛИ ПОЛЬЗОВАТЕЛЬ ЕЩЕ НЕ ОТВЕТИЛ НА ЭТОТ ВОПРОС
          const response = await axios.post( // ПОСЫЛАЕМ POST ЗАПРОС НА БЭК С ИНФОРМАЦИЕЙ О ТОМ, КАКОЙ ВАРИАНТ ОТВЕТА НАЖАЛ ПОЛЬЗОВАТЕЛЬ
            API_URIS.questionnariesAnswerUserSelect, 
            {
              session: this.currentSession.id, // ПЕРЕДАЕМ СЕССИЮ ПОЛЬЗОВАТЕЛЯ
              answer_select: option.id,    // ПЕРЕДАЕМ ID ВАРИАНТА ОТВЕТА
            }
          );
          option.my_answer = response.data.id; // ОБНОВЛЯЕМ СОБСТВЕННЫЙ ОТВЕТ ПОСЛЕ ОКОНЧАНИЯ ЗАПРОСА
        } else {
          await axios.delete(
            API_URIS.questionnariesAnswerUserSelect + option.my_answer + "/"
          );
          option.my_answer = false;
        }
      } catch (err) {  // ЕСЛИ ФИКСИРУЕМ ОШИБКУ ВО ВРЕМЯ POST ЗАПРОСА
        let sessionStartDate = new Date(this.currentSession.started_at);  // ПОЛУЧАЕМ ДАТУ НАЧАЛА СЕССИИ
        sessionStartDate.setMinutes(sessionStartDate.getMinutes() + this.surveyPreview.timelimit); // ПРИБАВЛЯЕМ ЛИМИТ ВРЕМЕНИ НА ПРОХОЖДЕНИЕ ОПРОСА
        let currentDate = new Date(); // ПОЛУЧАЕМ ТЕКУЩУЮ ДАТУ
        if (sessionStartDate < currentDate) { // ЕСЛИ ОЖИДАЕМОЕ ВРЕМЯ ОКОНЧАНИЯ СЕССИИ МЕНЬШЕ ТЕКУЩЕГО, ЗНАЧИТ ОНА ДОЛЖНА БЫЛА ЗАКОНЧИТЬСЯ РАНЬШЕ
          notify(this.$t("surveys.survey_pass_time_has_expired")); // А ЗНАЧИТ ВРЕМЯ СЕССИИ УЖЕ ИСТЕКЛО
        } else {
          notify(this.$t("notification.error")); // ИНАЧЕ ОШИБКА В ДРУГОМ, ВЫВОДИМ СООБЩЕНИЕ ОБ ОШИБКЕ ПО УМОЛЧАНИЮ
        }
        throw err;
      }
    },

    // МЕТОД ВЫЗЫВАЕМЫЙ ПРИ ОТВЕТЕ ПОЛЬЗОВАТЕЛЕМ НА ВОПРОС С ЛИНЕЙНОЙ ШКАЛОЙ
    // В АРГУМЕНТЕ ПЕРЕДАЕТСЯ ССЫЛКА НА ВОПРОС И ВЫБРАННЫЙ ИНДЕКС ПО ШКАЛЕ
    async selectScaleOption(question, index) {
      try {
        if (!question.inner_object[0].my_answer) { // ЕСЛИ ПОЛЬЗОВАТЕЛЬ ЕЩЕ НЕ ОТВЕТИЛ НА ЭТОТ ВОПРОС
          const response = await axios.post(
            API_URIS.questionnariesAnswerUserScale,  // POST-ЗАПРОС ДЛЯ ОТВЕТА НА ВОПРОС 
            {
              answer: question.inner_object[0].id,  // ПЕРЕДАЕМ ID ВАРИАНТА ОТВЕТА
              session: this.currentSession.id,      // ПЕРЕДАЕМ ID СЕССИИ
              score: index,                          // ПЕРЕДАЕМ ЗНАЧЕНИЕ ПО ШКАЛЕ
            }
          );
          question.inner_object[0].my_answer = {  // ОБНОВЛЯЕМ ИНФОРМАЦИЮ ОБ ОТВЕТЕ ПОЛЬЗОВАТЕЛЯ НА ДАННЫЙ ВОПРОС
            id: response.data.id,
            score: index
          }
        } else { // ЕСЛИ ПОЛЬЗОВАТЕЛЬ УЖЕ ОТВЕТИЛ НА ВОПРОС РАНЕЕ
          question.inner_object[0].my_answer.score = index; // ЗАПИСЫВАЕМ В ОТВЕТ ЗНАЧЕНИЕ ПО ШКАЛЕ
          const response = await axios.patch( // ИЗМЕНЯЕМ ОТВЕТ КОТОРЫЙ УЖЕ ПОЛЬЗОВАТЕЛЬ УЖЕ СДЕЛАЛ
            API_URIS.questionnariesAnswerUserScale +
              question.inner_object[0].my_answer.id + // ПЕРЕДАЕМ ID ВАРИАНТА ОТВЕТА
              "/",
            {
              score: question.inner_object[0].my_answer.score, // ПЕРЕДАЕМ ЗНАЧЕНИЕ ПО ШКАЛЕ
            }
          );
        }
      } catch (err) { // ПРИ ОШИБКЕ ПРОВЕРЯЕМ ИСТЕКЛО ЛИ ВРЕМЯ ПРОХОЖДЕНИЯ ОПРОСА (ПОДРОБНЕЕ СМ. МЕТОД selectOption)
        let sessionStartDate = new Date(this.currentSession.started_at);
        sessionStartDate.setMinutes(sessionStartDate.getMinutes() + this.surveyPreview.timelimit);
        let currentDate = new Date();
        if (sessionStartDate < currentDate) {
          notify(this.$t("surveys.survey_pass_time_has_expired"));
        } else {
          notify(this.$t("notification.error"));
        }
        throw err;
      }
    },

    // МЕТОД ВЫЗЫВАЕМЫЙ ПРИ ОТВЕТЕ ПОЛЬЗОВАТЕЛЕМ НА ВОПРОС С ТЕКСТОВЫМ ОТВЕТОМ
    // В АРГУМЕНТЕ ПЕРЕДАЕТСЯ ССЫЛКА НА ВОПРОС
    async writeTextOption(question) {
      try {
        if (!question.inner_object[0].my_answer) { // ЕСЛИ ДО ЭТОГО ПОЛЬЗОВАТЕЛЬ ЕЩЕ НЕ ОТВЕЧАЛ НА ЭТОТ ВОПРОС
          const response = await axios.post(   // ОТПРАВЛЯЕМ POST-ЗАПРОС С ТЕКСТОВЫМ ВВОДОМ ПОЛЬЗОВАТЕЛЯ
            API_URIS.questionnariesAnswerUserText,
            {
              answer_text: question.inner_object[0].id, // ПЕРЕДАЕМ ID ТЕКСТОВОГО ОТВЕТА
              session: this.currentSession.id,      // ПЕРЕДАЕМ ID ТЕКУЩЕЙ СЕССИИ
              text: question.inner_object[0].my_text_answer,  // ПЕРЕДАЕМ ТЕКСТОВЫЙ ВВОД ПОЛЬЗОВАТЕЛЯ
            }
          );
          question.inner_object[0].my_answer = {  // ПОСЛЕ ЗАПРОСА ОБНОВЛЯЕМ ДАННЫЕ ОБ ОТВЕТЕ ПОЛЬЗОВАТЕЛЯ НА ДАННЫЙ ВОПРОС
            id: response.data.id,  // ID ОТВЕТА
            text: question.inner_object[0].my_text_answer // САМ ТЕКСТОВЫЙ ОТВЕТ
          }
        } else {   // ЕСЛИ ПОЛЬЗОВАТЕЛЬ ДО ЭТОГО ОТВЕЧАЛ НА ЭТОТ ВОПРОС
          const response = await axios.patch(  // ОТПРАВЛЯЕМ PATCH-ЗАПРОС НА ИЗМЕНЕНИЯ ПРОШЛОГО ОТВЕТА НА НОВЫЙ
            API_URIS.questionnariesAnswerUserText +
              question.inner_object[0].my_answer.id +
              "/",
            {
              text: question.inner_object[0].my_text_answer,  // ПЕРЕДАЕМ НОВЫЙ ТЕКСТОВЫЙ ОТВЕТ
            }
          );
        }
      } catch (err) { // ПРИ ОШИБКЕ ПРОВЕРЯЕМ ИСТЕКЛО ЛИ ВРЕМЯ ПРОХОЖДЕНИЯ ОПРОСА (ПОДРОБНЕЕ СМ. МЕТОД selectOption)
        let sessionStartDate = new Date(this.currentSession.started_at);
        sessionStartDate.setMinutes(sessionStartDate.getMinutes() + this.surveyPreview.timelimit);
        let currentDate = new Date();
        if (sessionStartDate < currentDate) {
          notify(this.$t("surveys.survey_pass_time_has_expired"));
        } else {
          notify(this.$t("notification.error"));
        }
        throw err;
      }
    },

    // МЕТОД ВЫЗЫВАЕМЫЙ ПРИ ВЫБОРЕ ПОЛЬЗОВАТЕЛЕМ ВАРИАНТА ОТВЕТА (SINGLE CHOICE)
    // В АРГУМЕНТАХ ПРИНИМАЕТ ССЫЛКУ НА ОТВЕТ И ВОПРОС
    async selectOption(option, question) {  
      try {
        for (let i = 0; i < question.inner_object.length; ++i) { // ПРОХОДИМСЯ ПО ВАРИАНТАМ ОТВЕТА ДЛЯ ЭТОГО ВОПРОСА
          if (question.inner_object[i].id === option.id) {  // ЕСЛИ ВАРИАНТ ОТВЕТА ВЫБРАННЫНЙ ПОЛЬЗОВАТЕЛЕМ СООТВЕТСТВУЕТ ТЕКУЩЕМУ В ЦИКЛЕ
            question.inner_object[i].my_answer = true;     // ТО ПОМЕЧАЕМ ЭТОТ ВАРИАНТ ОТВЕТА КАК ВЫБРАННЫЙ ПОЛЬЗОВАТЕЛЕМ
          } else {
            question.inner_object[i].my_answer = false;   // ИНАЧЕ ПОМЕЧАЕМ ЭТОТ ВАРИАНТ ОТВЕТА КАК НЕ ВЫБРАННЫЙ
          }
        }
        const response = await axios.post(        // ПОСЫЛАЕМ POST ЗАПРОС НА БЭК С ИНФОРМАЦИЕЙ О ТОМ, КАКОЙ ВАРИАНТ ОТВЕТА НАЖАЛ ПОЛЬЗОВАТЕЛЬ
          API_URIS.questionnariesAnswerUserSelect,
          {
            session: this.currentSession.id, // ПЕРЕДАЕМ СЕССИЮ ПОЛЬЗОВАТЕЛЯ
            answer_select: option.id,      // ПЕРЕДАЕМ ID ВАРИАНТА ОТВЕТА
          }
        );
      } catch (err) {  // ЕСЛИ ФИКСИРУЕМ ОШИБКУ ВО ВРЕМЯ POST ЗАПРОСА
        let sessionStartDate = new Date(this.currentSession.started_at); // ПОЛУЧАЕМ ДАТУ НАЧАЛА СЕССИИ
        sessionStartDate.setMinutes(sessionStartDate.getMinutes() + this.surveyPreview.timelimit); // ПРИБАВЛЯЕМ ЛИМИТ ВРЕМЕНИ НА ПРОХОЖДЕНИЕ ОПРОСА
        let currentDate = new Date(); // ПОЛУЧАЕМ ТЕКУЩУЮ ДАТУ
        if (sessionStartDate < currentDate) { // ЕСЛИ ОЖИДАЕМОЕ ВРЕМЯ ОКОНЧАНИЯ СЕССИИ МЕНЬШЕ ТЕКУЩЕГО, ЗНАЧИТ ОНА ДОЛЖНА БЫЛА ЗАКОНЧИТЬСЯ РАНЬШЕ
          notify(this.$t("surveys.survey_pass_time_has_expired"));  // А ЗНАЧИТ ВРЕМЯ СЕССИИ УЖЕ ИСТЕКЛО
        } else {
          notify(this.$t("notification.error"));   // ИНАЧЕ ОШИБКА В ДРУГОМ, ВЫВОДИМ СООБЩЕНИЕ ОБ ОШИБКЕ ПО УМОЛЧАНИЮ
        }
        throw err;
      }
    },
    async getSurvey() { // МЕТОД ДЛЯ ПОЛУЧЕНИЯ ИНФОМАЦИИ О ТЕКУЩЕЙ СЕССИИ И ОТВЕТАХ ПОЛЬЗОВАТЕЛЯ НА ТЕКУЩИЙ ОПРОС
      try {
        const response = await axios.get(  // GET-ЗАПРОС ДЛЯ ПОЛУЧЕНИЯ СЕСИИ
          API_URIS.questionnariesSessionResult.replace(
            "session_id",
            this.currentSession.id
          )
        );
        this.survey = response.data;
        for (let i = 0; i < this.survey.questionnairegroup_set.length; ++i) { // ПРОХОДИМСЯ ПО КАЖДОЙ СЕКЦИИ ОПРОСА
          let curGroup =
            this.survey.questionnairegroup_set[i].questionnaireblock_set; 
          for (let j = 0; j < curGroup.length; ++j) {  // ПРОХОДИМСЯ ПО КАЖДОМУ ВОПРОСУ СЕССИИ
            let curBlock = curGroup[j].inner_object;
            for (let k = 0; k < curBlock.length; ++k) { // ПРОХОДИМСЯ ПО КАЖДОМУ ВАРИАНТУ ОТВЕТА В ВОПРОСЕ
              let curAnswer = curBlock[k];
              curAnswer.my_answer_boolean = curAnswer.my_answer ? true : false; // ЗАПИСЫВАЕМ ОТМЕТИЛ ЛИ ПОЛЬЗОВАТЕЛЬ ДАННЫЙ ВАРИАНТ ОТВЕТА (НАЖАЛ ЛИ ГАЛОЧКУ)
              curAnswer.my_text_answer = curAnswer.my_answer // ЗАПИСЫВАЕМ ТЕКСТОВЫЙ ОТВЕТ ПОЛЬЗОВАТЕЛЯ НА ТЕКУЩИЙ ВОПРОС
                ? curAnswer.my_answer.text
                : "";
            }
          }
        }
        if (this.survey.questionnairegroup_set.length) {  // ПОСЛЕ ПОЛУЧЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЬ НАЧИНАЕТ ПРОХОДИТЬ ОПРОС НАЧИНАЯ С ПЕРВОЙ СЕКЦИИ
          this.currentSection = this.survey.questionnairegroup_set[0];
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.survey_wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  border-radius: 24px 0px 0px 0px;
  padding: 0;
}

.survey {
  height: 100%;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 32px;
  background-color: var(--generalColorWhite);
  padding: 52px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
}
.survey::-webkit-scrollbar {
  width: 8px;
}
.survey::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 1000px) {
  .survey_questions {
    padding-bottom: 100px;
  }
}
.survey_questions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
  min-height: 100%;
}
.survey_questions_without_next_prev_buttons {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}
.survey_header {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}
.back_and_header_text {
  display: flex;
  gap: 12px;
}
.back_icon_wrapper {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 7px;
  padding: 7px;
}
.back_arrow_icon {
  height: 16px;
}
.header_text {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}
.time_left {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 600;
  line-height: 36px;
}
.time_left_icon {
  height: 24px;
  width: 24px;
}
.time_not_expired {
  display: flex;
  gap: 8px;
  align-items: center;
}

.section_info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 16px;
  border-radius: 16px;
  border: 1px solid var(--generalColorGrey);
}
.section_header {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}
.section_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.question_card {
  display: flex;
  gap: 16px;
}
.question_number {
  display: flex;
  width: 138px;
  height: fit-content;
  gap: 2px;
  padding: 10px;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}
.question_interaction_card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
  padding: 20px;
}
.question_interaction_header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.question_title_and_star {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.question_title {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  margin: 0;
}
.question_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
.question_image {
  width: 100%;
  height: 100%;
  max-width: 450px;
  max-height: 450px;
  object-fit: cover;
  border-radius: 20px;
  overflow: hidden;
}
.question_importance {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.single_choice_question {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
.scale_selectors_wrapper {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: flex-end;
}
.text_answer_wrapper {
  display: flex;
  flex-direction: column;
}
.corner_descriptions {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
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
.input_field {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.scale_selectors {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
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
.next_and_prev {
  position: relative;
  display: flex;
  align-self: flex-end;
  transform: translateX(247px);
}
.next_or_prev_button {
  padding: 16px;
  border-radius: 6px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  width: 232px;
  box-sizing: border-box;
}
.question_selectors {
  position: sticky;
  top: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
}
.navigation_header {
  padding: 10px 16px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.sections_and_complete {
  width: 215px;
  box-sizing: border-box;
  padding: 16px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sections_selection {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section_title {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
}
.section_title.active {
  color: var(--generalBrand);
}
.questions_list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.question {
  position: relative;
  border: 1px solid var(--generalColorGrey);
  border-radius: 6px;
  padding: 6px 0;
  font-family: "Golos";
  font-size: 10px;
  font-weight: 400;
  line-height: 24px;
  width: 28px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.question.answered {
  background-color: var(--generalColorSecondary);
  color: var(--generalColorWhite);
}
.question_importance_star {
  position: absolute;
  top: 0px;
  right: 2px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
}
.complete_survey {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.complete_survey_text {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.reset_answers_text {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.survey_completed {
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: var(--generalColorWhite);
  padding: 52px;
  margin: 0 4% 0 0;
  border-radius: 24px 0px 0px 0px;
  overflow-x: auto;
  align-items: center;
}
.survey_passed_header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.survey_passed_message {
  font-family: "Golos";
  font-size: 36px;
  font-weight: 600;
  line-height: 43px;
}
.survey_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
}
.back_to_surveys {
  width: 232px;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 6px;
  /* width: fit-content; */
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>
