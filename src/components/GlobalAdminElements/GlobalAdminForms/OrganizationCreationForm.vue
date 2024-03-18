<template>
  <div class="organization_creation_form">
    <h1 class="functionality_header">{{ $t("global_admin.org_creation") }}</h1>
    <input
      class="input_field general-contrast-color"
      v-model="organizationNameInput"
      @input="updateRootOrganizationName"
      :placeholder="$t('global_admin.enter_org_name')"
    />
    <button
      @click="createRootOrganization"
      class="create_button create_org_button general-brand-bg general-white-color"
    >
      {{ $t("global_admin.create_root_org") }}
    </button>
  </div>
</template>

<script>
import axios from "axios";

import { useStore as useGlobalAdminStore } from "@/store/GlobalAdminStore/index.js";
import { mapStores } from "pinia";

import { notify } from "@/general-scripts/toast-notification.js";
import { API_URIS } from "@/constants/api";

export default {
  name: "OrganizationCreationForm",
  data() {
    return {
      organizationNameInput: "",
    };
  },
  mounted() {
    this.matchStoreValues();
  },
  computed: {
    ...mapStores(useGlobalAdminStore),
  },
  methods: {
    matchStoreValues() {
      this.organizationNameInput = this.globalAdminStore?.organizationNameInput;
    },
    updateRootOrganizationName() {
      this.globalAdminStore.organizationNameInput = this.organizationNameInput;
    },

    async createRootOrganization() {
      try {
        await axios.post(API_URIS.createRootOrganization, {
          name: this.organizationNameInput,
        });
        this.globalAdminStore.getOrganizations();
        notify(this.$t("global_admin.org_successfully_created"), "success");
      } catch (err) {
        notify(err?.response?.data || this.$t("notification.error"));
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.organization_creation_form {
  max-width: 350px;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
.global_admin_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
}
.functionality_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
}
.input_field {
  width: auto;
  border-radius: 12px;
  padding: 13px 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
}
.create_button {
  width: 100%;
  border-radius: 6px;
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
}
</style>
