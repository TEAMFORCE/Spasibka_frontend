<template>
  <div class="confirmation_popup_wrapper">
    <div class="confirmation_popup general-white-bg">
      <h1
        class="confirmation_header"
      >
        {{ $t("login.confirm_proceed") + " " + orgName + "?"}}
      </h1>
      <div class="action_buttons">
        <button
          class="action_button general-white-color general-brand-bg"
          @click="$emit('confirmProceed')"
        > 
          {{ $t("login.yes") }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="$emit('cancelProceed')"
        >
          {{ $t("login.no") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationPopup",
  props: {
    orgName: {
      required: true
    },
    orgID: {
      required: true
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.confirmation_popup_wrapper {
  position: fixed;
  z-index: 1000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
.confirmation_popup {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;   
  padding: 32px;
  gap: 16px;
}
.confirmation_header {
  text-align: left;
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}

.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>