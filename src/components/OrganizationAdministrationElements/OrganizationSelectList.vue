<template>
  <div class="organization_select_list">
    <button
      @click="organizationListOpened ^= 1"
      class="selected_organization transparent-bg"
    >
      <h1
        v-if="selectedOrganization?.name"
        class="organization_name general-contrast-color"
      >
        {{ selectedOrganization.name }}
      </h1>
      <h1 v-else class="organization_name general-grey-color">
        {{ $t("employee.employee_actions.move") }}
      </h1>
      <img
        class="organization_list_opener_icon"
        :src="getImgUrl('OrganizationListOpenerIcon')"
      />
    </button>
    <div v-if="organizationListOpened" class="organization_options">
      <button
        class="organization_option transparent-bg"
        v-for="item in organizations"
        @click="selectOrganization(item)"
      >
        <h1 class="organization_name general-contrast-color">
          {{ item.name }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrganizationSelectList",
  props: {
    organizations: {
      required: true,
    },
  },
  data() {
    return {
      organizationListOpened: false,
      selectedOrganization: null,
    };
  },
  methods: {
    selectOrganization(item) {
      this.selectedOrganization = item;
      this.organizationListOpened = false;
      this.$emit("selectOrganization", this.selectedOrganization);
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/ReloginImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
  },
};
</script>

<style scoped>
.organization_select_list {
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.selected_organization {
  padding: 13px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.organization_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.organization_list_opener_icon {
  height: 14px;
  width: 14px;
}
.organization_options {
  display: flex;
  flex-direction: column;
}
.organization_option {
  border-top: 1px solid var(--generalColorGrey);
  padding: 13px 16px;
}
</style>