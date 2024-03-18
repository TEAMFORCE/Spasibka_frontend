<template>
  <div class="scale_creation_form_wrapper">
    <div class="scale_creation_form general-white-bg">
      <div class="scale_creation_header">
        <h1 class="scale_creation_header_text general-contrast-color"> {{ $t("organization.settings.are_you_sure_to_delete_scale") }} </h1>
      </div>
      <div class="action_buttons">
        <button
          @click="deleteScale"
          class="action_button general-brand-bg general-white-color"
        >
          {{ this.$t("general.yes") }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="goBack"
        >
          {{ this.$t("organization.settings.back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { notify } from '@/general-scripts/toast-notification';
import { mapStores } from 'pinia';
import { useStore as useProfileStore } from "@/store/profile";
import axios from 'axios';
import { API_URIS } from '@/constants/api';

export default {
  name: "ScaleDeletionForm",
  emits: ["closeScaleDeletion"],
  props: {
    scaleID: {
      required: true
    }
  },
  computed: {
    ...mapStores(useProfileStore),
  },    
  methods: {
    goBack() {
      this.$emit("closeScaleDeletion");
    },    
    async deleteScale() {
      try {
        await axios.delete(API_URIS.scales.replace("organization_id", this.profileStore.profileInfo.profile.organization_id) + this.scaleID);
        this.$emit("closeScaleDeletion");
        notify(this.$t("organization.settings.scale_got_deleted"), "success");
      } catch(err) {
        notify(err?.response?.data?.errors || err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    }
  }
}
</script>

<style scoped>
.scale_creation_form_wrapper {
  position: fixed;
  z-index: 1001;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex; 
  flex-direction: column;
  justify-content: center;
}
.scale_creation_form {
  z-index: 1000;
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 52px 32px 32px 32px;
  gap: 24px;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
}
.scale_creation_header {
  display: flex;
  justify-content: space-between;
}
.scale_creation_header_text {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>