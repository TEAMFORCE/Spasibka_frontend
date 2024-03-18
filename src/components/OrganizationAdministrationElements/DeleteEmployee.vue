<template>
  <div class="delete_employee_screen_wrapper">
    <div class="delete_employee_wrapper">
      <div class="delete_employee general-white-bg">
        <h1 class="delete_employee_text general-contrast-color">
          {{ $t("employee.employee_actions.block") }}
        </h1>
        <div class="delete_or_cancel_buttons">
          <button
            class="delete_or_cancel_button general-brand-bg"
            @click="$emit('deleteEmployee')"
          >
            <h1 class="delete_or_cancel_button_text general-white-color">
              {{ $t("employee.employee_actions.yes") }}
            </h1>
          </button>
          <button
            class="delete_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelEmployeeDelete')"
          >
            <h1 class="delete_or_cancel_button_text general-brand-color">
              {{ $t("employee.employee_actions.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeleteEmployee",
  props: {},
  data() {
    return {};
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.delete_employee_screen_wrapper {
  position: fixed;
  z-index: 3;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}
.delete_employee_wrapper {
  max-width: 477px;
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.delete_employee {
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.delete_employee_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.delete_or_cancel_buttons {
  display: flex;
  gap: 12px;
}
.delete_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.delete_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
}
</style> 