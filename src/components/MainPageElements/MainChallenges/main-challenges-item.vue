<template>
  <div class="main_page_challenges_item_wrapper" @click="goToChallenge">
    <img
      v-if="hasCover"
      class="challenge_bg"
      :src="challengePhoto"
      alt="challenge_bg"
    />
    <div
      class="wrap_over_img"
      :class="{ blackBg: hasCover }"
      :style="{ background: getCoverColor() }"
    >
      <div class="challenges_item_status_wrapper">
        <div v-if="challengeData.active" class="challenges_item_status">
          {{ $t("mainPage.challenges.statusActive") }}
        </div>
        <div v-if="!challengeData.active" class="challenges_item_status">
          {{ $t("mainPage.challenges.statusClosed") }}
        </div>
        <div class="challenges_item_date" :class="{ whiteText: hasCover }">
          <span>
            {{ $t("mainPage.challenges.date") }}
            {{ challengeData.updated_at.slice(0, 10) }}
          </span>
        </div>
      </div>
      <h3 class="challenge_item_name" :class="{ whiteName: hasCover }">
        {{ challengeData.name }}
      </h3>
      <div class="challenge_item_info">
        <div class="info_block">
          <p class="info_number" :class="{ whiteInfoNumber: hasCover }">
            {{ challengeData.winners_count }}
          </p>
          <p class="info_name" :class="{ whiteInfoName: hasCover }">
            {{ $t("mainPage.challenges.winners") }}
          </p>
        </div>
        <div class="info_block">
          <p class="info_number" :class="{ whiteInfoNumber: hasCover }">
            {{ challengeData.fund }}
          </p>
          <p class="info_name" :class="{ whiteInfoName: hasCover }">
            {{ $t("mainPage.challenges.prizeStock") }}
          </p>
        </div>
      </div>
      <div class="challenge_item_info">
        <div class="info_block">
          <p class="info_number" :class="{ whiteInfoNumber: hasCover }">
            {{ challengeData.participants_total }}
          </p>
          <p class="info_name" :class="{ whiteInfoName: hasCover }">
            {{ $t("mainPage.challenges.participants") }}
          </p>
        </div>
        <div class="info_block">
          <p class="info_number" :class="{ whiteInfoNumber: hasCover }">
            {{ challengeData.awardees }}
          </p>
          <p class="info_name" :class="{ whiteInfoName: hasCover }">
            {{ $t("mainPage.challenges.prizePlaces") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { photoAddress } from "@/general-scripts/photo-address";

export default {
  name: "MainPageChallengesItem",
  props: {
    challengeData: {
      required: true,
    },
  },
  computed: {
    hasCover() {
      if (this.challengeData.photos) {
        return true;
      } else {
        return false;
      }
    },
    challengePhoto() {
      if (this.challengeData.photos && this.challengeData.photos.length > 0) {
        return this.photoAddress(`${this.challengeData.photos[0]}?thumbnail=1`);
      } else {
        return null;
      }
    },
  },
  methods: {
    reduceNumber(num) {
      while (num >= 10) {
        num = this.digSumm(num);
      }
      return (num % 5) + 1;
    },

    digSumm(num) {
      let summ = 0;
      while (num !== 0) {
        summ += num % 10;
        num = Math.floor(num / 10);
      }
      return summ;
    },
    getCoverColor() {
      if (!this.hasCover) {
        let numberOfCover = this.reduceNumber(this.challengeData?.id);
        if (numberOfCover == 1 || numberOfCover == 3 || numberOfCover == 4) {
          return "#FFF0D9";
        } else if (numberOfCover == 2) {
          return "linear-gradient(135deg, rgba(151,69,255,0.5) 5%, rgba(245,174,76,0.5018382352941176) 95%)";
        } else if (numberOfCover == 5) {
          return "linear-gradient(135deg, rgba(146,196,242,1) 5%, rgba(201,231,255,1) 95%)";
        }
      }
    },
    getImgUrl() {
      var images = require.context(
        "@/assets/svgIcons/challengeIcons/",
        false,
        /\.svg$/
      );
      return images(
        "./" +
          `${"challenge"}${this.reduceNumber(this.challengeData.id)}` +
          ".svg"
      );
    },
    photoAddress: photoAddress,
    goToChallenge() {
      this.$router.push(`/challenge/${this.challengeData.id}`);
    },
  },
};
</script>

<style scoped>
.main_page_challenges_item_wrapper {
  width: 306px;
  height: 212px;
  border-radius: 20px;
  background-color: var(--secondaryColorBrand);
  position: relative;
  overflow: hidden;
}
.blackBg {
  background-color: rgba(0, 0, 0, 0.6) !important;
}
.challenge_bg {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  border-radius: 20px;
  box-sizing: border-box;
}
.wrap_over_img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 258px !important;
  height: 164px !important;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.challenges_item_status_wrapper {
  width: 100%;
  display: flex;
  gap: 4px;
}
.challenges_item_status {
  height: 20px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--generalColorWhite);
  margin: 0;
  padding: 2px 8px 2px 8px;
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 12px;
  border-radius: 8px;
  color: var(--generalContrast);
  z-index: 2;
}
.challenges_item_date {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 2px 8px 2px 8px;
  border-radius: 8px;
  border: 1px solid var(--generalContrast);
  color: var(--generalContrast);
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 12px;
}
.whiteText {
  color: var(--generalColorWhite);
  border: 1px solid var(--generalColorWhite);
}
.challenge_item_name {
  text-align: left;
  font-family: "Golos";
  font-weight: 500;
  font-size: 16px;
  color: var(--generalContrast);
  margin: 12px 0 0 0 !important;
}
.whiteName {
  color: var(--generalColorWhite);
}
.challenge_item_info {
  display: flex;
  gap: 16px;
  margin: 4px 0 0 0;
}
.challenge_item_info:last-child {
  margin: 16px 0 0 0;
}
.info_block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.info_number {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: -0.28px;
  color: var(--generalContrast);
  margin: 0;
}
.whiteInfoNumber {
  color: var(--generalColorWhite);
}
.info_name {
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.28px;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
}
.whiteInfoName {
  color: var(--generalColorWhite);
}
@media (max-width: 1600px) {
  .main_page_challenges_item_wrapper {
    width: 267px;
    height: 212px;
    border-radius: 20px;
    background-color: var(--secondaryColorBrand);
    position: relative;
    overflow: hidden;
  }
  .wrap_over_img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 219px !important;
    height: 164px !important;
    padding: 24px;
    display: flex;
    flex-direction: column;
  }
}
@media (max-width: 1140px) {
  .main_page_challenges_item_wrapper {
    width: 338px;
    height: 212px;
  }
  .wrap_over_img {
    width: 290px !important;
    height: 164px !important;
  }
}

@media (max-width: 1140px) {
  .main_page_challenges_item_wrapper {
    width: 338px;
    height: 212px;
  }
  .wrap_over_img {
    width: 290px !important;
    height: 164px !important;
  }
}
@media (max-width: 768px) {
  .main_page_challenges_item_wrapper {
    width: 338px;
    height: 212px;
  }
  .wrap_over_img {
    width: 290px !important;
    height: 164px !important;
  }
}
@media (max-width: 380px) {
  .main_page_challenges_item_wrapper {
    width: 308px;
    height: 212px;
  }
  .wrap_over_img {
    width: 260px !important;
    height: 164px !important;
  }
}
</style>