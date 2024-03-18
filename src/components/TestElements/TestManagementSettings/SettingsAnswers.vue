<template>
  <div class="settings_answers">
    <h2 class="settings_answers_title">
      {{ $t("tests.settings.questionsSettings.title") }}
    </h2>
    <div class="settings_answers_item">
      <div class="item_info">
        <h3 class="_item_title">
          {{ $t("tests.settings.questionsSettings.showAnswersToUsers") }}
        </h3>
        <h4 class="_item_description">
          {{
            $t("tests.settings.questionsSettings.showAnswersToUsersDescription")
          }}
        </h4>
      </div>
      <div class="item_switch">
        <label class="switch">
          <input type="checkbox" />
          <!-- v-model="endAllUsers" -->
          <!-- @click="setEndAllUsers" -->
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="_divider"></div>
    <div class="settings_answers_item">
      <div class="item_info">
        <h3 class="_item_title">
          {{ $t("tests.settings.questionsSettings.showTrueAnswers") }}
        </h3>
        <h4 class="_item_description">
          {{
            $t("tests.settings.questionsSettings.showTrueAnswersDescription")
          }}
        </h4>
      </div>
      <div class="item_switch">
        <label class="switch">
          <input type="checkbox" />
          <!-- v-model="endAllUsers" -->
          <!-- @click="setEndAllUsers" -->
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="_divider"></div>
    <div class="settings_answers_item">
      <div class="item_info">
        <h3 class="_item_title">
          {{ $t("tests.settings.questionsSettings.showFalseAnswers") }}
        </h3>
        <h4 class="_item_description">
          {{
            $t("tests.settings.questionsSettings.showFalseAnswersDescription")
          }}
        </h4>
      </div>
      <div class="item_switch">
        <label class="switch">
          <input type="checkbox" />
          <!-- v-model="endAllUsers" -->
          <!-- @click="setEndAllUsers" -->
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div class="_divider"></div>
    <div class="settings_answers_item">
      <div class="item_info">
        <h3 class="_item_title">
          {{ $t("tests.settings.questionsSettings.showNumberOfPoints") }}
        </h3>
        <h4 class="_item_description">
          {{
            $t("tests.settings.questionsSettings.showNumberOfPointsDescription")
          }}
        </h4>
      </div>
      <div class="item_switch">
        <label class="switch">
          <input type="checkbox" />
          <!-- v-model="endAllUsers" -->
          <!-- @click="setEndAllUsers" -->
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsAnswers",
};
</script>

<style scoped>
.settings_answers {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
}
.settings_answers_title {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  margin: 0;
  color: var(--generalContrast);
}
.settings_answers_item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

._item_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
._item_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  margin: 6px 0 0 0;
  color: var(--generalColorSecondary);
}
._divider {
  width: 100%;
  height: 1px;
  background-color: var(--negativeSecondary);
}
</style>