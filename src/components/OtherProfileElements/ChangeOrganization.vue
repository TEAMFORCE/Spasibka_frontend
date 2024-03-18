<template>
  <div class="change_organization_wrapper">
    <div class="change_organization general-white-bg">
      <h1 class="change_organization_header">
        {{ status }}
      </h1>
      <vSelect
        v-if="reloginStep === 1"
        :placeholder="$t('profile.select_organization')"
        :options="organizations"
        :clearable="false"
        label="name"
        v-model="selectedOrganization"
      />
      <input
        class="code_input"
        v-if="reloginStep === 2"
        :placeholder="$t('profile.enter_the_code')"
        v-model="confirmationCode"
      />
      <div class="relogin_or_cancel_buttons">
        <button
          class="relogin_or_cancel_button general-brand-bg general-white-color"
          @click="mainAction"
        >
          {{ reloginStep === 1 ? 
            $t("profile.select_chosen_organization") :
            $t("profile.approve_the_code") }}
        </button>
        <button
          class="relogin_or_cancel_button brand-secondary-bg general-brand-color"
          @click="$emit('closeOrganizationChange')"
        >
          {{ $t("profile.cancel_organization_change") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import axios from "axios";
import vSelect from "vue-select";

export default {
  name: "ChangeOrganization",
  emits: ["closeOrganizationChange", "changedOrg"],
  props: ["organizations", "proceededOrganizationInfo"],
  components: {
    vSelect,
  },
  data() {
    return {
      reloginStep: 1,
      confirmationCode: "",
      selectedOrganization: null,
      alreadyChangingOrg: false,
      status: this.$t("profile.change_organization"),
      authMethod: null,
    };
  },
  mounted() {
    this.getAuthMethod();
  },
  watch: {
    proceededOrganizationInfo: {
      handler(newVal) {
        if (newVal && this.organizations && !this.alreadyChangingOrg) {
          if (this.proceededOrganizationInfo) {
            for (let i = 0; i < this.organizations.length; ++i) {
              if (!this.alreadyChangingOrg && this.organizations[i].id === this.proceededOrganizationInfo.organization_id) {
                this.alreadyChangingOrg = true;
                this.selectedOrganization = this.organizations[i];
                this.changeOrganization();
                break;
              }
            }
          }
        }
      },
      immediate: true
    },
    organizations: {
      async handler(newVal) {
        if (newVal && this.proceededOrganizationInfo && !this.alreadyChangingOrg) {
          if (this.proceededOrganizationInfo) {
            for (let i = 0; i < this.organizations.length; ++i) {
              if (!this.alreadyChangingOrg && this.organizations[i].id === this.proceededOrganizationInfo.organization_id) {
                this.alreadyChangingOrg = true;
                this.selectedOrganization = this.organizations[i];
                if (this.authMethod) {
                  this.changeOrganization();
                } else {
                  await this.getAuthMethod();
                  this.changeOrganization();
                }
                break;
              }
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    mainAction(){
      if (this.reloginStep === 1) this.changeOrganization();
      else this.enterTheCode();
    },
    async getAuthMethod() {
      try {
        const response = await axios.get(API_URIS.authMethod);
        this.authMethod = response.data.auth_method;
      } catch(err) {
        throw err;
      }
    },
    async changeOrganization() {
      try {
        let requestObject = {
          organization_id: this.selectedOrganization.id,
        }
        if (this.authMethod === "VK" && "VKAccessToken" in localStorage) {
          requestObject.access_token = localStorage.getItem("VKAccessToken");
        }
        const response = await axios.post(API_URIS.userChangeOrganization, requestObject);
        if (this.authMethod === "VK" && requestObject.access_token) {
          await this.$router.push("/main");
          window.location.reload();
        } else {
          this.reloginStep = 2;
          this.status = response.data.status;
        }
      } catch (err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    },
    async enterTheCode(){
      try {
        await axios.post(API_URIS.userChangeOrganizationVerify, {
          code: this.confirmationCode
        });
        this.$emit("changedOrg");
        notify(this.$t("profile.you_proceeded_to_org") + " " + this.selectedOrganization.name, "success");
      } catch(err) {
        notify(err?.response?.data?.reason || err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.change_organization_wrapper {
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
.change_organization {
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

.change_organization_header {
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.code_input {
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 13px 16px;

  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.relogin_or_cancel_buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.relogin_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
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
