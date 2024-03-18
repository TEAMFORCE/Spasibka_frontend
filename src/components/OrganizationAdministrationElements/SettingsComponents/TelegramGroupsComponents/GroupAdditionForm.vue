<template>
  <div class="group_addition_form_wrapper">
    <div class="group_addition_form general-white-bg">
      <h1 class="group_addition_header">
        {{ $t("organization.settings.telegram_group_addition") }}
      </h1>
      <div class="input_field_wrapper">
        <div 
          v-if="groupName"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t('organization.settings.tg_name_placeholder') }}
        </div>
        <input
          type="text"
          class="form_input general-contrast-color"
          :placeholder="$t('organization.settings.tg_name_placeholder')"
          v-model="groupName"
        />
      </div>
      <div class="input_field_wrapper">
        <div 
          v-if="chatID"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t('organization.settings.chat_id_placeholder') }}
        </div>
        <input
          class="form_input general-contrast-color"
          v-model="chatID"
          :placeholder="$t('organization.settings.chat_id_placeholder')"
        />
      </div>
      <div class="action_buttons">
        <button
          class="action_button general-white-color general-brand-bg"
          @click="addGroup"
        >
          {{ $t("organization.settings.add_tg_group") }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="cancelGroupAddition"
        >
          {{ $t("organization.settings.cancel_tg_group_addition") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupAdditionForm",
  data() {
    return {
      groupName: "",
      chatID: "",
    };
  },
  methods: {
    addGroup() {
      this.$emit("addGroup", this.groupName, this.chatID);
    },
    cancelGroupAddition() {
      this.$emit("cancelGroupAddition");
    },
  },
};
</script>

<style scoped>
.group_addition_form_wrapper {
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
.group_addition_form {
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

.group_addition_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: left;
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
.form_input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>