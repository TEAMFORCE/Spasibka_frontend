<template>
  <div class="main_page_benefits_wrapper">
    <div class="main_page_benefits_header">
      <h3 class="main_page_benefits_title">
        {{ $t("mainPage.benefits.header") }}
      </h3>
      <h4 class="main_page_all_benefits" @click="goToBenefits">
        {{ $t("mainPage.benefits.allBenefits") }}
      </h4>
    </div>
    <div class="main_page_benefits_items">
      <MainPageBenefitsItem v-for="item in testData" :benefitData="item" />
    </div>
    <div class="mobile_all_benefits_button">
      <h4 class="main_page_all_benefits_mobile" @click="goToBenefits">
        {{ $t("mainPage.benefits.allBenefits") }}
      </h4>
    </div>
  </div>
</template>

<script>
import MainPageBenefitsItem from "@/components/MainPageElements/MainBenefits/main-benefits-item.vue";

export default {
  name: "MainPageBenefits",
  components: {
    MainPageBenefitsItem,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      testData: [],
      mockData: [
        {
          bg: "testbk",
          logo: "testBenefitThree",
          name: "Burger King",
          percentage: "12",
        },
        {
          bg: "testvv",
          logo: "testBenefitOne",
          name: "ВкусМил от ВкусВилл",
          percentage: "10",
        },
        {
          bg: "testpsv",
          logo: "testBenefitTwo",
          name: "PizzaSushiWok",
          percentage: "7",
        },
        {
          bg: "testbk",
          logo: "testBenefitThree",
          name: "Burger King",
          percentage: "17",
        },
        {
          bg: "testvv",
          logo: "testBenefitOne",
          name: "ВкусМил от ВкусВилл",
          percentage: "2",
        },
        {
          bg: "testpsv",
          logo: "testBenefitTwo",
          name: "PizzaSushiWok",
          percentage: "19",
        },
      ],
    };
  },
  watch: {
    windowWidth() {
      this.getItems();
    },
  },
  methods: {
    updateWidth() {
      this.windowWidth = window.innerWidth;
    },
    getItems() {
      this.testData = this.mockData;
      if (this.windowWidth <= 1800 && this.testData.length > 5) {
        this.testData.splice(this.testData.length - 1, 1);
      }
      if (this.windowWidth <= 1600 && this.testData.length > 4) {
        this.testData.splice(this.testData.length - 1, 1);
      }
      if (this.windowWidth <= 1230 && this.testData.length > 3) {
        this.testData.splice(this.testData.length - 1, 1);
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
.main_page_benefits_wrapper {
  background-color: var(--generalColorWhite);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  padding: 52px 52px 52px 52px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin: 0 0 100px 0;
}
.main_page_benefits_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}
.main_page_benefits_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
  margin: 0;
}
.main_page_all_benefits {
  font-family: "Golos";
  font-weight: 400 !important;
  font-size: 20px;
  color: var(--generalBrand);
  margin: 0;
  transition: 0.3s;
}
.mobile_all_benefits_button {
  display: none;
}
.main_page_all_benefits:hover {
  color: #e43500;
  cursor: pointer;
}
.main_page_benefits_items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
@media (max-width: 1280px) {
  .main_page_benefits_wrapper {
    padding: 24px 24px 24px 24px;
  }
}
@media (max-width: 767px) {
  .main_page_all_benefits {
    display: none;
  }
  .mobile_all_benefits_button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .main_page_all_benefits_mobile {
    font-family: "Golos";
    font-weight: 400 !important;
    font-size: 20px;
    color: var(--generalBrand);
    margin: 0;
  }
  .main_page_benefits_items {
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
  }
}
</style>