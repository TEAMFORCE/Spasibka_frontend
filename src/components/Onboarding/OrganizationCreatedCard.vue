<template>
  <div class="organization_created_card_wrapper">
    <h3 class="card_title">
      {{ $t("onboarding.communities.communitieCreated") }}
    </h3>
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
    <button class="created_close_button" @click="closeOrganizationCreatedCard">
      {{ $t("onboarding.communities.close") }}
    </button>
  </div>
</template>

<script>
import CopyIcon from "@/components/Icons/copy.vue";

export default {
  name: "OrganizationCreatedCard",
  components: {
    CopyIcon,
  },
  props: {
    createdOrganization: {
      requred: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    inviteCode() {
      let code = this.$refs.inviteCode;
      return code;
    },
  },
  methods: {
    copyCode() {
      this.inviteCode.select();
      document.execCommand("copy");
      this.inviteCode.blur();
    },
    closeOrganizationCreatedCard() {
      this.$emit("closeOrganizationCreatedCard");
    },
  },
};
</script>

<style scoped>
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
.card_title {
  text-align: left;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  margin: 0;
  color: var(--generalContrast);
}
.card_description {
  text-align: left;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  margin: 4px 0 0 0;
  color: var(--generalColorSecondary);
}
.created_close_button {
  width: 100%;
  padding: 16px 0;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-radius: 6px;
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
  margin: 24px 0 0 0;
}
</style>