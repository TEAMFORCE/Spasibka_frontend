<template>
  <div class="all_success_card_wrapper">
    <h3 class="card_title">
      {{ $t("onboarding.communities.allSuccessTitle") }}
    </h3>
    <h4 class="card_description">
      {{ $t("onboarding.communities.allSuccessDescription") }}
    </h4>
    <h4 class="card_description">
      {{ $t("onboarding.communities.iviteKey") }}
    </h4>
    <div class="card_input_wrapper">
      <input
        :value="createdOrganization"
        type="text"
        class="created_input"
        ref="inviteCode"
      />
      <button class="copy_icon_button" @click="copyCode">
        <CopyIcon />
      </button>
    </div>
    <div class="card_buttons_wrapper">
      <button class="card_button _goTo" @click="goTo">
        {{ $t("onboarding.communities.goTo") }}
      </button>
      <button class="card_button _cancel" @click="cancelGoto">
        {{ $t("onboarding.communities.cancelButton") }}
      </button>
    </div>
  </div>
</template>

<script>
import CopyIcon from "@/components/Icons/copy.vue";

export default {
  name: "AllSuccessCard",
  components: {
    CopyIcon,
  },
  props: {
    createdOrganization: {
      requred: true,
    },
  },
  computed: {
    inviteCode() {
      let code = this.$refs.inviteCode;
      return code;
    },
  },
  methods: {
    goTo() {
      this.$emit("goToMain");
    },
    cancelGoto() {
      this.$emit("cancelGoTo");
    },
    copyCode() {
      this.inviteCode.select();
      document.execCommand("copy");
      this.inviteCode.blur();
    },
  },
};
</script>

<style scoped>
.card_title {
  text-align: center;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  margin: 0;
  color: var(--generalContrast);
}
.card_description {
  text-align: center;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  margin: 4px 0 0 0;
  color: var(--generalColorSecondary);
}
.card_buttons_wrapper {
  width: 100%;
  display: flex;
  gap: 12px;
  margin: 24px 0 0 0;
}
.card_button {
  width: 50%;
  padding: 16px 0;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-radius: 6px;
}
._goTo {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
._cancel {
  color: var(--generalBrand);
  background-color: var(--secondaryColorBrand);
}
.card_input_wrapper {
  position: relative;
}
.copy_icon_button {
  width: 24px;
  background-color: transparent;
  outline: none;
  position: absolute;
  right: 11px;
  top: 50%;
}
.created_input {
  width: 98%;
  height: 52px;
  outline: none;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 0 0 0 12px;
  margin: 24px 0 0 0;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>