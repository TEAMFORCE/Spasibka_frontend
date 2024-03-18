<template>
  <div class="telegram_groups_assign_form">
    <h1 class="functionality_header">
      {{ $t("global_admin.telegram_groups_assignment") }}
    </h1>
    <vSelect
      v-model="selectedOrganization"
      :options="globalAdminStore?.organizationsList"
      :placeholder="$t('global_admin.select_organization')"
      label="name"
    />
    <vSelect
      v-model="telegramGroups"
      :placeholder="$t('global_admin.enter_tg_groups_id')"
      no-drop
      taggable
      multiple
    />
    <button
      class="create_button general-brand-bg general-white-color"
      @click="assignGroups"
    >
      {{ $t("global_admin.assign_telegram_groups") }}
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import axios from "axios";

import { mapStores } from "pinia";
import { useStore as useGlobalAdminStore } from "@/store/GlobalAdminStore/index.js";

import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "TelegramGroupsAssignForm",
  components: {
    vSelect
  },  
  data(){
    return {
      selectedOrganization: null,
      telegramGroups: [],
    }
  },
  computed: {
    ...mapStores(useGlobalAdminStore)
  },
  watch: {
    selectedOrganization: {
      handler(){
        this.getTelegramGroups();
      }
    }
  },
  methods: {
    async getTelegramGroups(){
      if (!this.selectedOrganization) {
        this.telegramGroups = [];
        return;
      }
      try {
        const response = await axios.get(API_URIS.organizationTelegramGroups, {
          params: {
            organization_id: this.selectedOrganization.id
          }
        });
        this.telegramGroups = response.data.groups;
      } catch(err) {
        throw err;
      }
    },
    async assignGroups(){
      try {
        if (!this.selectedOrganization){
          throw new Error(this.$t("global_admin.select_organization"));
        }
        await axios.post(API_URIS.organizationTelegramGroups, {
          organization_id: this.selectedOrganization.id,
          groups: this.telegramGroups
        });
        notify(this.$t("global_admin.tg_groups_successfully_assigned"), "success");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    }
  }
}
</script>

<style scoped>
.telegram_groups_assign_form {
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.functionality_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
}
.create_button {
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