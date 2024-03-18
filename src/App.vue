<template>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1"
  />
  <div id="app">
    <component :is="layout">
      <router-view></router-view>
    </component>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import OnboardingLayout from "@/layouts/OnboardingLayout.vue";
import MainWithoutFooterLayout from "./layouts/MainWithoutFooterLayout.vue";

export default {
  components: {
    AuthLayout,
    MainLayout,
    OnboardingLayout,
    MainWithoutFooterLayout,
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || "auth") + "-layout";
    },
  },
  methods: {
    async getProfileSettings() {
      try {
        let response = await axios.get(API_URIS.profileSettings);
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          localStorage.setItem("lang", response.data.details.language);
        }
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.layout == "auth-layout") {
        return;
      } else {
        this.getProfileSettings();
      }
    }, 500);
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
button {
  padding: 0px;
  cursor: pointer;
  border-style: none;
}
button:focus {
  outline: none;
}
input:focus {
  outline: none;
}
textarea:focus {
  outline: none;
}
html * {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
html {
  height: 100%;
  width: 100%;
}
body {
  margin: 0px;
  height: 100%;
  width: 100%;
}
@font-face {
  font-family: "Golos";
  src: local("Golos"),
    url("@/fonts/Golos-Text/Golos-Text_Regular.woff2") format("woff2"),
    url("@/fonts/Golos-Text/Golos-Text_Regular.woff") format("woff");
}
@font-face {
  font-family: "SF Pro Text";
  src: local("SF Pro Text"),
    url("@/fonts/San Francisco Pro Text/SF-Pro-Display-Regular.otf")
      format("opentype");
}
h1 {
  margin: 0px;
}
input {
  padding: 0px;
}
</style>