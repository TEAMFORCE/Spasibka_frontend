<template>
  <div class="onboarding_education_materials">
    <h3 class="materials_title">
      {{ $t("onboarding.education.title") }}
    </h3>
    <h5 class="materials_description">
      {{ $t("onboarding.education.description") }}
    </h5>
    <div class="materials_carousel_wrapper">
      <carousel
        :breakpoints="breakpoints"
        :itemsToScroll="1"
        :mouseDrag="dragging"
        :touchDrag="dragging"
      >
        <slide :index="1">
          <div class="materials_card">
            <div class="image_wrapper">
              <img
                src="@/assets/onboardingEducationOne.png"
                alt="card_wrapper"
                class="_image"
              />
            </div>
            <div class="black_wrapper"></div>
            <div class="card_text">
              <h4 class="card_title">
                {{ $t("onboarding.education.presentation") }}
              </h4>
              <h6 class="card_description">
                {{ $t("onboarding.education.presentationDescription") }}
              </h6>
            </div>
            <div class="card_button_wrapper">
              <button class="show_card_info">
                {{ $t("onboarding.education.more") }}
              </button>
            </div>
          </div>
        </slide>
        <slide :index="2">
          <div class="materials_card">
            <div class="card_text">
              <h4 class="card_title generalContrast">
                {{ $t("onboarding.education.showAndTell") }}
              </h4>
              <h6 class="card_description generalContrast">
                {{ $t("onboarding.education.showAndTellDescription") }}
              </h6>
            </div>
            <div class="card_icon_wrapper">
              <img
                class="card_icon"
                src="@/assets/svgIcons/onboardingInviteIcon.svg"
                alt=""
              />
            </div>
            <div class="card_button_wrapper">
              <button class="show_card_info generalBrand">
                {{ $t("onboarding.education.look") }}
              </button>
            </div>
          </div>
        </slide>
        <slide :index="3">
          <div class="materials_card">
            <div class="image_wrapper">
              <img
                src="@/assets/onboardingEducationTwo.png"
                alt="card_wrapper"
                class="_image"
              />
            </div>
            <div class="black_wrapper"></div>
            <div class="card_text">
              <h4 class="card_title">
                {{ $t("onboarding.education.userGuide") }}
              </h4>
              <h6 class="card_description">
                {{ $t("onboarding.education.userGuideDescription") }}
              </h6>
            </div>
            <div class="card_button_wrapper">
              <button class="show_card_info generalBrand">
                {{ $t("onboarding.education.read") }}
              </button>
            </div>
          </div>
        </slide>
      </carousel>
    </div>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
export default {
  name: "OnboardingEducationMaterials",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      breakpoints: {
        1920: { itemsToShow: 3, snapAlign: "start" },
        1600: { itemsToShow: 3, snapAlign: "start" },
        1280: { itemsToShow: 3, snapAlign: "start" },
        1024: { itemsToShow: 2, snapAlign: "start" },
        768: { itemsToShow: 1, snapAlign: "start" },
      },
    };
  },
  computed: {
    dragging() {
      let width = window.innerWidth;
      if (width <= 1280) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.onboarding_education_materials {
  width: 100%;
}
.materials_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
  margin: 0 0 0 52px;
  text-align: left;
}
.materials_description {
  margin: 12px 0 0 52px;
  font-family: "Golos";
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: var(--generalColorSecondary);
  text-align: left;
}
.materials_carousel_wrapper {
  display: flex;
  gap: 20px;
  width: 98%;
  height: 100%;
  min-height: 600px;
  margin: 20px 0 0 36px;
}
.materials_card {
  width: 100%;
  height: 545px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 52px 24px 32px 52px;
  position: relative;
  background-color: var(--secondaryColorBrand);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  overflow: hidden;
  margin: 20px 10px;
}
.image_wrapper {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  position: absolute;
  top: 0;
  left: 0;
}
._image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.black_wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.6;
}
.card_text {
  position: relative;
  z-index: 10;
}
.generalContrast {
  color: var(--generalContrast) !important;
}
.card_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalColorWhite);
  margin: 0;
  text-align: left;
}
.card_description {
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: var(--generalColorWhite);
  margin: 10px 0 0 0;
  text-align: left;
  max-width: 80%;
}
.card_icon_wrapper {
  width: 100% !important;
  height: 320px !important;
  position: absolute;
  top: 28%;
  box-sizing: border-box;
}
.card_icon {
  object-fit: contain !important;
  width: 70%;
  height: 100%;
  box-sizing: border-box;
}
.card_button_wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.show_card_info {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalColorWhite);
  padding: 12px 0;
  z-index: 2;
  width: 180px;
  border: 1px solid var(--generalColorWhite);
  border-radius: 12px;
  background-color: transparent;
  transition: 0.3s;
}
.generalBrand {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  border: none;
}
.show_card_info:active {
  transform: scale(0.99);
}
@media (max-width: 1600px) {
  .materials_carousel_wrapper {
    width: 97%;
  }
  .materials_card {
    margin: 40px 5px;
  }
}
@media (max-width: 1280px) {
}
@media (max-width: 1024px) {
  .materials_carousel_wrapper {
    margin: 20px 0 0 6px;
  }
  .materials_title {
    margin: 52px 0 0 24px;
  }
  .materials_description {
    margin: 12px 0 0 24px;
  }
  .materials_card {
    margin: 40px 5px;
    padding: 32px 24px 24px 32px;
  }
}
@media (max-width: 600px) {
  .materials_carousel_wrapper {
    margin: 20px 0 0 6px;
    width: 50%;
  }
  .materials_card {
    width: 100%;
    margin: 10px 10px;
    padding: 32px 24px 24px 32px;
    margin: 40px 5px;
  }
  .materials_title {
    margin: 24px 0 0 24px;
    font-size: 20px;
  }
  .materials_description {
    margin: 2px 0 0 24px;
    font-size: 14px;
    line-height: 28px;
    padding: 0 8px 0 0;
  }
  .card_icon_wrapper {
    width: 76%;
    max-height: 260px;
    position: absolute;
    top: 20%;
  }
}
</style>