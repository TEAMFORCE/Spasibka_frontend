<template>
  <div class="main_layout_wrapper">
    <div class="main_layout">
      <Transition name="fade" mode="out-in">
        <div class="data_loading_wrapper" v-if="schemeIsLoading">
          <span class="loader"></span>
        </div>
      </Transition>
      <div class="main_layout" v-if="!schemeIsLoading">
        <Header />
        <div class="middle">
          <Sidebar />
          <router-view class="router_view" v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
          <BottomBarTablet />
          <BottomBarMobile />
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/app/Header.vue";
import Sidebar from "@/components/app/Sidebar.vue";
import BottomBarTablet from "@/components/app/BottomBarTablet.vue";
import BottomBarMobile from "@/components/app/BottomBarMobile.vue";
import Footer from "@/components/app/Footer.vue";

import { organizationSettingsStore } from "@/store/organization-settings";
import axios from "axios";
import { API_URIS } from "@/constants/api";

export default {
  components: {
    Header,
    Sidebar,
    BottomBarTablet,
    BottomBarMobile,
    Footer,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    schemeIsLoading() {
      return this.organizationSettings.schemeIsLoading;
    },
  },
  methods: {
    async getAvailableMarkets() {
      try {
        const response = await axios.get(API_URIS.marketsAvailable);
        const store = organizationSettingsStore();
        if (response?.data?.length) store.setMarketsExist(true);
        else store.setMarketsExist(false);
      } catch (err) {
        throw err;
      }
    },
    async getStoreOrganizationSettings() {
      await this.organizationSettings.getOrganizationSettings();
    },
    async getProfileInfo() {
      await this.profileStore.getProfileInfo();

      if (!this.profileInfo.profile.organization_id) {
        this.$router.push("/onboarding");
      }
    },
  },

  async created() {
    this.getAvailableMarkets();
    await this.getStoreOrganizationSettings();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.router_view {
  max-height: 100% !important;
}
@media (max-width: 1000px) {
  .router_view {
    padding: 24px 0 108px 0;
  }
}
@media (max-width: 550px) {
  .router_view {
    padding-bottom: 94px;
  }
}
.main_layout_wrapper {
  position: relative;
  height: 100%;
  background: radial-gradient(
    75.45% 101.63% at 82.88% 0%,
    rgba(var(--generalBrandRGB), 0.1) 0%,
    rgba(211, 114, 83, 0) 88.24%
  );
  background-color: #f5f5f5;
}
.data_loading_wrapper {
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
.main_layout {
  height: 100%;
  position: relative;
  top: 0px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
}

.middle {
  height: 100%;
  max-height: calc(100% - 98px);
  display: flex;
  position: relative;
}
</style>