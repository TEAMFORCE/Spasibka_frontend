<template>
  <div class="create_department_screen_wrapper">
    <div class="create_department_wrapper">
      <div class="create_department general-white-bg">
        <h1 class="create_department_text general-contrast-color">
          Создать дочернюю организацию
        </h1>
        <input
          class="department_name general-contrast-color"
          v-model="childOrganizationName"
          :placeholder="'Введите имя дочерней организации'"
        />
        <div class="create_or_cancel_buttons">
          <button
            class="create_or_cancel_button general-brand-bg"
            @click="$emit('createChildOrganization', childOrganizationName)"
          >
            <h1 class="create_or_cancel_button_text general-white-color">
              Создать
            </h1>
          </button>
          <button
            class="create_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelChildOrganizationCreation')"
          >
            <h1 class="create_or_cancel_button_text general-brand-color">
              Отменить
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateChildOrganization",
  props: {},
  data() {
    return {
      childOrganizationName: "",
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.create_department_screen_wrapper {
  position: fixed;
  z-index: 3;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.create_department_wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.create_department {
  width: 477px;
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.create_department_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.department_name {
  border-radius: 12px;
  padding: 13px 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
}
.department_name:focus {
  outline: none;
}
.department_name::placeholder {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--generalColorSecondary);
}
.create_or_cancel_buttons {
  display: flex;
  gap: 12px;
}
.create_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.create_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
@media (max-width: 600px) {
  .create_department_wrapper {
    width: 90%;
  }
  .create_department {
    width: auto;
  }
}
</style> 