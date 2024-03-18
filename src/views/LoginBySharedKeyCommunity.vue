<template>
  <div class="login_by_shared_key_page">
    <span class="loader"></span>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

export default {
  name: "LoginBySharedKeyCommunityPage",
  methods: {
    async checkQuery() {
      if (this.$route?.query?.invite) {
        try {
          localStorage.removeItem("VKAccessToken");
          await axios.get(API_URIS.logOutURL);
          this.$router.push({
            path: "/login",
            query: { invite: this.$route.query.invite },
          });
        } catch (error) {
          throw error;
        }
      } else {
        this.$router.push("/main");
      }
    },
  },
  async mounted() {
    await this.checkQuery();
  },
};
</script>

<style scoped>
.login_by_shared_key_page {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(
    75.45% 101.63% at 12.88% 0%,
    rgb(236, 212, 203) 0%,
    rgb(255, 252, 251) 88.24%
  );
  z-index: 100;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--generalColorWhite);
  border-bottom-color: var(--generalBrand);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>