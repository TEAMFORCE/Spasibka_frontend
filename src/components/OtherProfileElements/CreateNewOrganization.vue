<template>
  <div class="create_new_organization_wrapper">
    <div class="create_new_organization general-white-bg">
      <h1 
        class="create_organization_header general-contrast-color" 
        v-if="currentStep === 1"
      >
        {{ $t("profile.create_organization") }}
      </h1>
      <h1 
        class="create_organization_header general-contrast-color" 
        v-if="currentStep === 2"
      >
        {{ $t("profile.proceed_to_organization_name") }}
        <span class="general-brand-color">
          {{ organizationName }}
        </span>?
      </h1>
      <input
        v-if="currentStep === 1"
        class="organization_name general-contrast-color"
        v-model="organizationName"
        :placeholder="$t('profile.enter_organization_name')"
      />
      <div class="action_buttons">
        <button
          class="action_button general-brand-bg general-white-color"
          @click="mainAction"
        >
          {{ currentStep === 1 ? 
            $t("profile.create_org_and_continue") :
            $t("profile.proceed_to_organization")
          }}  
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="$emit('closeOrganizationCreation')"
        >
          {{ $t("profile.close_organization_creation") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from '@/constants/api';
import { notify } from '@/general-scripts/toast-notification';
import axios from 'axios';

export default {
  name: "CreateNewOrganization",
  emits: ["proceedToCreatedOrg", "closeOrganizationCreation"],
  data() {
    return {
      organizationName: "",
      currentStep: 1,
      organizationInfo: null,
    }
  },
  methods: {
    async mainAction(){
      if (this.currentStep === 1){
        this.createOrganization();
      } else {
        this.$emit("proceedToCreatedOrg", this.organizationInfo);
      }
    },
    async createOrganization(){
      try {
        const response = await axios.post(API_URIS.community, {
          name: this.organizationName
        })
        this.organizationInfo = response.data;
        this.currentStep = 2;
        notify(this.$t("profile.organization_successfully_created"), "success");
      } catch(err) {
        notify(err?.response?.data?.text || err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    }
  }
}
</script>

<style scoped>
.create_new_organization_wrapper {
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
.create_new_organization {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}
.create_organization_header {
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.organization_name {
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 13px 16px;

  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  border-radius: 6px;
  padding: 16px 24px;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>