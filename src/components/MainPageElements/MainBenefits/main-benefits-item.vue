<template>
  <div class="main_page_benefits_item_wrapper">
    <img
      v-if="benefitData.bg"
      :src="getImgUrl(benefitData.bg)"
      alt="benefitBg"
      class="benefit_bg"
    />
    <div class="wrap_over_img">
      <div class="benefit_header">
        <div class="benefit_logo_wrapper">
          <img
            :src="getImgUrl(benefitData.logo)"
            alt="benefit_logo"
            class="benefit_logo_img"
          />
        </div>
        <h3 class="benefit_name">{{ benefitData.name }}</h3>
      </div>
      <div class="benefit_percentage">
        <h3 class="percentage_value">{{ benefitData.percentage }}%</h3>
        <h3 class="percentage_title">
          {{ $t("mainPage.benefits.firstPurchase") }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainPageBenefitsItem",
  props: {
    benefitData: {
      required: true,
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
  },
};
</script>

<style scoped>
.main_page_benefits_item_wrapper {
  width: 252px !important;
  height: 216px !important;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}
.benefit_bg {
  width: 100% !important;
  height: 100% !important;
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  border-radius: 20px;
}
.wrap_over_img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 236px;
  height: 180px;
  padding: 18px 0 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.6) !important;
}
.benefit_header {
  display: flex;
  flex-direction: column;
  width: 90%;
}
.benefit_logo_wrapper {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  overflow: hidden;
}
.benefit_logo_img {
  width: 100%;
  border-radius: 100%;
}
.benefit_name {
  font-family: "Golos";
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: var(--generalColorWhite);
  margin: 12px 0 0 0;
  max-width: 84%;
  text-align: left;
}
.benefit_percentage {
  display: flex;
  gap: 12px;
  max-width: 78%;
  /* margin-top: 40px; */
}
.percentage_value {
  font-family: "Golos";
  font-weight: 500;
  font-size: 32px;
  color: var(--generalColorWhite);
  margin: 0;
}
.percentage_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 14px;
  color: var(--generalColorWhite);
  margin: 0;
  text-align: left;
}
@media (max-width: 1600px) {
  .main_page_benefits_item_wrapper {
    width: 240px !important;
    height: 216px !important;
  }
  .wrap_over_img {
    width: 224px;
    height: 180px;
  }
}
@media (max-width: 1024px) {
  .main_page_benefits_item_wrapper {
    width: 220px !important;
    height: 216px !important;
  }
  .wrap_over_img {
    width: 204px;
    height: 180px;
  }
}

@media (max-width: 767px) {
  .main_page_benefits_item_wrapper {
    width: 338px !important;
    height: 212px !important;
  }
  .wrap_over_img {
    width: 322px !important;
    height: 174px !important;
  }
}
@media (max-width: 380px) {
  .main_page_benefits_item_wrapper {
    width: 308px !important;
    height: 212px !important;
  }
  .wrap_over_img {
    width: 292px !important;
    height: 174px !important;
  }
}
</style>