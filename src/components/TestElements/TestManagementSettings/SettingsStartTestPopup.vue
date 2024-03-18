
<template>
  <div class="start_test_form general-white-bg">
    <div class="start_test_texts">
      <h1 class="start_test_header general-contrast-color">
        {{ $t("tests.settings.testLaunch") }}
      </h1>
      <h1 class="test_start_description general-secondary-color">
        {{ $t("tests.settings.are_you_sure_to_launch") }}
      </h1>
    </div>
    <div class="action_buttons general-white-bg">
      <button
        @click="$emit('cancelTestStart')"
        class="action_button general-brand-bg general-white-color"
      >
        {{ $t("surveys.cancel") }}
      </button>
      <button
        @click="$emit('startTest')"
        class="action_button brand-secondary-bg general-brand-color"
      >
        {{ $t("surveys.launch") }}
      </button>
    </div>
  </div>
</template>  

<script>
export default {
  name: "SettingsStartTestPopup",
};
</script>

<style scoped>
.start_test_form {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.start_test_texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.start_test_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
}
.test_start_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: center;
}
.action_buttons {
  width: 100%;
  display: flex;
  gap: 12px;
  border-radius: 0px 0px 24px 24px;
}
.action_button {
  width: 50%;
  border-radius: 6px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>