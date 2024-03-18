<template>
  <div class="create_organization_card_wrapper">
    <h3 class="card_title">
      {{ $t("onboarding.communities.create") }}
    </h3>
    <h4 class="card_description">
      {{ $t("onboarding.communities.fillOrgInfo") }}
    </h4>
    <input
      type="text"
      class="card_input"
      :placeholder="$t('onboarding.communities.name')"
      v-model="organizationName"
    />
    <div class="card_buttons_wrapper">
      <button class="card_button _create" @click="createOrganization">
        {{ $t("onboarding.communities.createButton") }}
      </button>
      <button class="card_button _cancel" @click="cancelCreation">
        {{ $t("onboarding.communities.cancelButton") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateOrganizationCard",
  data() {
    return {
      organizationName: "",
    };
  },
  methods: {
    createOrganization() {
      if (this.organizationName.length > 0) {
        this.$emit("organizationCreate", this.organizationName);
      }
    },
    cancelCreation() {
      this.$emit("cancelCreation");
    },
  },
};
</script>

<style scoped>
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
.card_input {
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
._create {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
._cancel {
  color: var(--generalBrand);
  background-color: var(--secondaryColorBrand);
}
</style>