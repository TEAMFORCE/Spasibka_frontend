<template>
  <div class="main_page_challenges_wrapper">
    <div class="main_page_challenges_header">
      <h3 class="main_page_challenges_title">
        {{ $t("mainPage.topChallenges") }}
      </h3>
      <h4 class="main_page_all_challenges" @click="goToChallenges">
        {{ $t("mainPage.allChallenges") }}
      </h4>
    </div>
    <div class="main_page_challenges_items" v-if="testData.length > 0">
      <MainPageChallengesItem v-for="item in testData" :challengeData="item" />
    </div>
    <div class="mobile_all_challenges_button">
      <h4 class="main_page_all_challenges_mobile" @click="goToChallenges">
        {{ $t("mainPage.allChallenges") }}
      </h4>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import MainPageChallengesItem from "@/components/MainPageElements/MainChallenges/main-challenges-item.vue";

export default {
  name: "MainPageChallenges",
  components: {
    MainPageChallengesItem,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      testData: [],
    };
  },

  watch: {
    // windowWidth() {
    //   this.getItems();
    // },
  },
  methods: {
    goToChallenges() {
      this.$router.push("/challenges");
    },
    updateWidth() {
      this.windowWidth = window.innerWidth;
    },
    async getItems() {
      try {
        let params = {
          offset: 1,
          limit: 10,
        };
        let response = await axios.get(API_URIS.challenges, { params });
        this.testData = response.data;
        if (this.windowWidth <= 3840 && this.testData.length > 10) {
          this.testData.splice((this.testData.length = 10));
        }
        if (this.windowWidth <= 3000 && this.testData.length > 8) {
          this.testData.splice((this.testData.length = 8));
        }
        if (this.windowWidth <= 2480 && this.testData.length > 6) {
          this.testData.splice((this.testData.length = 6));
        }
        if (this.windowWidth <= 2048 && this.testData.length > 5) {
          this.testData.splice((this.testData.length = 5));
        }
        if (this.windowWidth <= 1800 && this.testData.length > 4) {
          this.testData.splice((this.testData.length = 4));
        }
        if (this.windowWidth <= 1366 && this.testData.length > 3) {
          this.testData.splice((this.testData.length = 3));
        }
        if (this.windowWidth <= 1140 && this.testData.length > 2) {
          this.testData.splice((this.testData.length = 2));
        }
      } catch (error) {
        throw error;
      }
    },
  },
  created() {
    window.addEventListener("resize", this.updateWidth);
  },
  mounted() {
    this.getItems();
  },
};
</script>

<style scoped>
.main_page_challenges_wrapper {
  background-color: var(--generalColorWhite);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  padding: 52px 52px 52px 52px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin: 0 0 52px 0;
}
.main_page_challenges_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}
.main_page_challenges_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
  margin: 0;
}
.main_page_all_challenges {
  font-family: "Golos";
  font-weight: 400 !important;
  font-size: 20px;
  color: var(--generalBrand);
  margin: 0;
  transition: 0.3s;
}
.main_page_all_challenges:hover {
  color: #e43500;
  cursor: pointer;
}
.mobile_all_challenges_button {
  display: none;
}
.main_page_all_challenges_mobile {
  font-family: "Golos";
  font-weight: 400 !important;
  font-size: 20px;
  color: var(--generalBrand);
  margin: 0;
  text-align: center;
  display: none;
}
.main_page_challenges_items {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  gap: 20px;
  width: 100%;
}
@media (max-width: 1280px) {
  .main_page_challenges_wrapper {
    padding: 24px;
  }
}
@media (max-width: 767px) {
  .main_page_all_challenges {
    display: none;
  }
  .main_page_challenges_items {
    flex-direction: column;
    justify-content: start;
    gap: 20px;
  }
  .main_page_all_challenges_mobile {
    display: block;
  }

  .mobile_all_challenges_button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>