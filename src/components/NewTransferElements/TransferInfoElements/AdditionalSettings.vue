<template>
  <div class="additional_settings">
    <!-- {{ organizationSettingsStore.settings?.settings?.t_anonym?.default_settings_value  }} -->
    <div 
      v-if="organizationSettingsStore.settings?.settings?.t_anonym?.default_settings_value === '1'"
      class="send_to_employee_checkbox general-contrast-color"
    >
      <input type="checkbox" class="checkbox" v-model="anonSend"/>
      {{ $t("new_transfer.send_anonymously") }}
    </div>
    <div class="send_to_employee_checkbox general-contrast-color">
      <input type="checkbox" class="checkbox" v-model="showEveryone"/>
      {{ $t("new_transfer.show_to_everyone") }}
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";
import { organizationSettingsStore } from '@/store/organization-settings';

export default {
  name: "AdditionalSettings",
  data(){
    return {
      anonSend: false,
      showEveryone: true,
      organizationSettingsStore: organizationSettingsStore()
    }
  },
  computed: {
    ...mapStores(useNewTransferStore),
  },
  watch: {
    anonSend: {
      handler(){
        this.newTransferStore.anonSend = this.anonSend;
      },
      immediate: true
    },
    showEveryone: {
      handler(){
        this.newTransferStore.showEveryone = this.showEveryone;
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.additional_settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.send_to_employee_checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}

.checkbox {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: var(--generalColorWhite);
  border-radius: 6px;
  border: 1px solid var(--generalBrandLight);
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
</style>