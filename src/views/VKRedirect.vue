<template>
  <div class="vk_redirect">
    <div 
      v-if="enableChooseOrganization"
      class="choose_organization general-contrast-color"
    >
      {{ $t("login.select_org") }}
      <vSelect
        v-model="selectedOrganization"
        :placeholder="$t('login.select_org')"
        :options="organizationsList"
        label="organization_name"
      />
    </div>
  </div>  
</template>

<script>
import { API_URIS } from '@/constants/api';
import { notify } from '@/general-scripts/toast-notification';
import axios from 'axios';
import vSelect from "vue-select";

export default {
  name: "VKRedirect",
  components: {
    vSelect
  },  
  data() {
    return {
      enableChooseOrganization: false,
      organizationsList: [],
      selectedOrganization: null,
      accessToken: null,
    }
  },  
  mounted() {
    const payloadString = decodeURIComponent(this.$route.query.payload);
    console.log(payloadString);
    const payloadJSON = this.convertToJSON(payloadString); // Convert the string to JSON
    console.log(payloadJSON);
    this.exchangeToken(payloadJSON.token, payloadJSON.uuid);
  },
  watch: {
    selectedOrganization: {
      handler() {
        if (this.selectedOrganization) {
          this.chooseOrganization();
        }
      }
    },
    deep: true
  },
  methods: {
    async exchangeToken(silent_token, uuid) {
      try {
        let requestObject = {
          silent_token: silent_token,
          uuid: uuid
        }
        console.log(this.$route.query.state);
        if (this.$route.query.state && this.$route.query.state !== 'profile') {
          requestObject.shared_key = this.$route.query.state;
        }
        const response = await axios.post(API_URIS.VKGetToken, requestObject);
        this.accessToken = response.data.access_token;
        localStorage.setItem("VKAccessToken", this.accessToken);
        this.accessTokenLogin(response.data.access_token);
        //this.$router.push("/main");
      } catch(err) {
        throw err;
      }
      // payload contains the silent token and user information
      // Call your backend API to exchange the silent token for an access token
    },
    async accessTokenLogin(access_token) {
      try {
        let requestObject = {
          access_token: access_token
        }
        if (this.$route.query.state && this.$route.query.state !== 'profile') {
          requestObject.shared_key = this.$route.query.state;
        }
        const response = await axios.post(API_URIS.VKAuth, requestObject);
        if (this.$route.query.state === "profile") {
          this.$router.push("/profile");
        }
        else {
          if (response.data.details === "need to choose organization") {
            this.enableChooseOrganization = true;
            this.organizationsList = response.data.organizations_data;
          } else {
            this.$router.push("/main");
          }
        }
      } catch(err) {
        throw err;
      }
    },
    async chooseOrganization() {
      try {
        await axios.post(API_URIS.VKChooseOrg, {
          user_id: this.selectedOrganization.user_id,
          organization_id: this.selectedOrganization.organization_id,
          access_token: this.accessToken
        });
        this.$router.push("/main");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    },
    convertToJSON(input) {
      if (typeof input === "string") {
        try {
          return JSON.parse(input);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          return null;
        }
      } else if (typeof input === "object") {
        const result = {};
        for (const key in input) {
          result[key] = this.convertToJSON(input[key]);
        }
        return result;
      }
      return input;
    },
  },
};
</script>

<style scoped>
.vk_redirect {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.choose_organization {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}
::v-deep(.vs__dropdown-menu) {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>
