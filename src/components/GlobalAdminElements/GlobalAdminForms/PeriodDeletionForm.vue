<template>
  <div class="period_deletion_form">
    <h1 class="functionality_header">
      {{ $t("global_admin.period_deletion") }}
    </h1>
    <vSelect
      v-model="selectedOrganization"
      :options="globalAdminStore?.organizationsList"
      :placeholder="$t('global_admin.select_organization')"
      label="name"
      @option:selected="getPeriods"
    />
    <vSelect
      v-model="selectedPeriod"
      :options="periods"
      :placeholder="$t('global_admin.select_period')"
      label="name"
    />
    <button
      @click="deletePeriod"
      class="create_button general-brand-bg general-white-color"
    >
      {{ $t("global_admin.delete_period") }}
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import axios from "axios";

import { mapStores } from 'pinia';
import { useStore as useGlobalAdminStore } from "@/store/GlobalAdminStore/index.js";

import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "PeriodDeletionForm",
  components: {
    vSelect
  },
  data(){
    return {
      selectedOrganization: null,
      selectedPeriod: null,
      periods: []
    }
  },
  computed: {
    ...mapStores(useGlobalAdminStore),
  },
  watch: {
    'globalAdminStore.periods': {
      handler(newValue){
        if (this.selectedOrganization && this.selectedOrganization.id == this.globalAdminStore.selectedOrganizationIDForPeriods){
          this.periods = this.formatPeriods(newValue);
        }
      }
    }
  },
  methods: {
    formatPeriods(periodsList){
      return periodsList.map((obj) => {
        obj.name = obj.start_date + " --- " + obj.end_date;
        return obj;
      });
    },
    async getPeriods(){
      try {
        const response = await axios.get(API_URIS.globalPeriods, {
          params: {
            organization_id: this.selectedOrganization.id,
            offset: 1,
            limit: 99999
          }
        });
        this.periods = this.formatPeriods(response.data);
      } catch(err) {
        throw err;
      }
    },
    async deletePeriod(){
      try {
        if (!this.selectedPeriod){
          throw new Error(this.$t("global_admin.select_period"));
        }
        await axios.delete(API_URIS.globalPeriods + this.selectedPeriod.id + "/");
        this.selectedPeriod = null;
        this.selectedOrganization = null;
        this.periods = [];
        notify(this.$t("global_admin.period_successfully_deleted"), "success");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"))
        throw err;
      }
    }
  }
}
</script>


<style scoped>
.period_deletion_form {
  display: flex;
  flex-direction: column;
  max-width: 350px;
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