<template>
  <div class="challenge_chain_item" @click="goToChallenge">
    <img
      v-if="challengePhoto"
      class="challenge_chain_item_cover"
      :src="challengePhoto"
      alt="challenge chain cover"
    />
    <div
      v-else
      class="challenge_chain_item_no_cover"
      :style="{ background: getCoverGradient() }"
    >
      <img
        class="challenge_chain_item_no_cover_image"
        :src="getDefaultCoverUrl()"
        alt="challenge chain cover"
      />
    </div>
    <div class="challenge_chain_item_info">
      <!-- :style="{ backdropFilter: getCoverFilter() }" -->
      <div class="cahallenge_chain_status">
        {{ challengeStatus }}
      </div>
      <h4 class="challenge_chain_name">
        {{ challengeChainInfo?.name }}
      </h4>
      <h5 class="challenge_chain_author">
        {{ $t("general.from") + " " + challengeChainInfo?.author }}
      </h5>
      <h6 class="challenge_chain_updated">
        {{ challengeLastUpdated }}
      </h6>
      <div class="challenge_chain_progress_bar">
        <div class="_progress_bar_wrapper">
          <div class="_progress_bar"></div>
          <div
            class="_filled_progress_bar"
            :style="{ width: progressWidth + 2 + '%' }"
          ></div>
          <div
            class="_progress_bar_icon"
            :style="{ left: progressWidth + '%' }"
          >
            <ProgressBarRocketIcon class="progress_icon_svg" />
          </div>
        </div>
        <h3 class="_progress_bar_counter">
          {{
            challengeChainInfo?.tasks_finished +
            "/" +
            challengeChainInfo?.tasks_total
          }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import { photoAddress } from "@/general-scripts/photo-address";
import { formatTimestamp } from "@/general-scripts/timestamps";
import { organizationSettingsStore } from "@/store/organization-settings";
import ProgressBarRocketIcon from "../Icons/ChallengesIcons/ProgressBarRocketIcon.vue";
import ChallengeChainIcon from "@/components/Icons/ChallengesIcons/ChallengeChainIcon.vue";

export default {
  name: "ChallengeChainCard",
  props: {
    challengeChainInfo: {
      required: true,
    },
  },
  components: { ProgressBarRocketIcon, ChallengeChainIcon },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    progressWidth() {
      if (this.challengeChainInfo?.tasks_total === 0) return 0;
      return (
        (this.challengeChainInfo?.tasks_finished /
          this.challengeChainInfo?.tasks_total) *
        100
      );
    },
    challengePhoto() {
      if (this.challengeChainInfo?.photo) {
        return this.photoAddress(this.challengeChainInfo.photo);
      } else if (
        this.challengeChainInfo?.photos &&
        this.challengeChainInfo?.photos?.length > 0
      ) {
        return this.photoAddress(this.challengeChainInfo.photos[0]);
      } else {
        return null;
      }
    },
    challengeStatus() {
      if (this.challengeChainInfo?.current_state === "D")
        return this.$t("challenges.challenge_chains.status_waiting");
      else if (this.challengeChainInfo?.current_state === "A")
        return this.$t("challenges.challenge_chains.status_active");
      else if (this.challengeChainInfo?.current_state === "C")
        return this.$t("challenges.challenge_chains.status_ended");
      else return "";
    },
    challengeLastUpdated() {
      let formattedTime;
      const isWaiting = this.challengeChainInfo?.challenge_condition === "W";
      if (isWaiting) {
        formattedTime = formatTimestamp(this.challengeChainInfo?.start_at);
      } else {
        formattedTime = formatTimestamp(this.challengeChainInfo?.updated_at);
      }
      let day = formattedTime.day;
      if (day < 10) day = "0" + day;
      let month = formattedTime.month + 1;
      if (month < 10) month = "0" + month;
      let year = formattedTime.year;
      const statusString = isWaiting
        ? this.$t("challenges.start_at")
        : this.$t("challenges.updated_at");
      return statusString + ": " + day + "." + month + "." + year;
    },
  },
  methods: {
    photoAddress: photoAddress,
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
    getDefaultCoverUrl() {
      var images = require.context(
        "@/assets/svgIcons/challengeIcons/",
        false,
        /\.svg$/
      );
      return images(
        "./" +
          `${"challengeSmall"}${this.reduceNumber(
            this.challengeChainInfo?.id
          )}` +
          ".svg"
      );
    },
    getCoverGradient() {
      let numberOfCover = this.reduceNumber(this.challengeChainInfo?.id);
      if (numberOfCover == 1 || numberOfCover == 3 || numberOfCover == 4) {
        return "rgba(255, 240, 217, 1)";
      } else if (numberOfCover == 2) {
        return "linear-gradient(280deg, rgba(151,69,255,0.5) 5%, rgba(245,174,76,0.5) 95%)";
      } else if (numberOfCover == 5) {
        return "linear-gradient(240deg, rgba(146,196,242,2) 5%, rgba(201,231,255,2) 95%)";
      }
    },
    getCoverFilter() {
      let numberOfCover = this.reduceNumber(this.challengeChainInfo?.id);
      if (numberOfCover == 1 || numberOfCover == 3 || numberOfCover == 4) {
        return "blur(24px) brightness(1)";
      } else if (numberOfCover == 2) {
        return "blur(24px) brightness(1)";
      } else if (numberOfCover == 5) {
        return "blur(24px) brightness(1)";
      }
    },
    goToChallenge() {
      this.$router.push("/challenge_chain/" + this.challengeChainInfo?.id);
    },
  },
};
</script>

<style scoped>
.challenge_chain_item {
  width: 358px;
  height: 394px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
}
.challenge_chain_item_cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.challenge_chain_item_no_cover {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.challenge_chain_item_no_cover_image {
  width: 100%;
  height: 60%;
}
.challenge_chain_item_info {
  width: 100%;
  height: 40%;
  background-color: transparent;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 0 0 20px 20px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
}
.cahallenge_chain_status {
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  font-family: "SF Pro Text";
  color: var(--minorInfoSecondaryColor);
  border-radius: 8px;
  background-color: var(--minorInfo);
  padding: 2px 8px;
  position: absolute;
  right: 15px;
  top: -10px;
  z-index: 10;
}
.challenge_chain_name {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
  color: var(--generalContrast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: 0;
  z-index: 10;
}
.challenge_chain_author {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
  color: var(--generalContrast);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: 0;
  z-index: 10;
}
.challenge_chain_updated {
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  text-align: left;
  color: var(--generalColorSecondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin: 0;
  z-index: 10;
}
.challenge_chain_progress_bar {
  margin: 9px 0 0 0;
  width: 100%;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
}
._progress_bar_wrapper {
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
._progress_bar {
  width: 100%;
  height: 15.7px;
  border-radius: 17px;
  background-color: var(--secondaryColorBrand);
}
._filled_progress_bar {
  position: absolute;
  height: 15.7px;
  border-radius: 17px 0 0 17px;
  background-color: var(--generalBrand);
}
._progress_bar_icon {
  width: 34px;
  height: 34px;
  border-radius: 100%;
  background-color: var(--secondaryColorBrand);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;
  transform: translate(-5%, 0);
}
.progress_icon_svg {
  height: 18px;
  width: 18px;
  margin: 0;
}
._progress_bar_counter {
  font-family: "SF Pro Text";
  font-size: 16px;
  line-height: 22px;
  font-weight: 700;
  color: var(--generalContrast);
  margin: 0;
}
</style>
