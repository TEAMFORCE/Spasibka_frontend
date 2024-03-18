<template>
  <div class="challenge_details">
    <ChallengeSendReport
      v-if="challengeSendReportEnabled"
      :challengeDetails="challengeDetails"
      @goToWinners="goToWinners"
      @sendReportCancel="sendReportCancel"
      @updateMyResult="$emit('updateMyResult')"
    />
    <div class="challenge_top_info">
      <div
        class="challenge_top_info_item general-white-bg"
        v-for="item in topInfoItems"
      >
        <div class="challenge_top_info_item_left">
          <!-- <img class="challenge_top_info_item_icon" :src="item.icon" /> -->
          <component class="challenge_top_info_item_icon" :is="item.icon" />
          <h1 class="challenge_top_info_item_header general-contrast-color">
            {{ item.header() }}
          </h1>
        </div>
        <h1 class="challenge_top_info_item_value general-secondary-color">
          {{ item.value() }}
        </h1>
      </div>
    </div>
    <div class="challenge_bottom_info">
      <h1
        class="challenge_description general-contrast-color"
        v-html="descriptionWithLineBreaks"
      ></h1>
      <div class="challenge_state_items_wrapper">
        <div
          class="challenge_state_item minor-info-secondary-bg"
          v-if="challengeDetails?.status && challengeStatus.trim() !== ''"
        >
          <h1 class="challenge_state_text minor-info-color">
            {{ challengeStatus }}
          </h1>
        </div>
        <div
          class="challenge_state_item minor-info-secondary-bg"
          v-if="challengeDetails?.algorithm_type"
        >
          <h1 class="challenge_state_text minor-info-color">
            {{ getWinnersDefinition() }}
          </h1>
        </div>
      </div>
      <div class="send_and_like">
        <button
          v-if="
            challengeDetails?.is_available /*&&
            !isCreator &&
            challengeDetails?.challenge_condition === 'A' &&
            ((challengeDetails?.multiple_reports &&
              challengeDetails?.status == 'Отчёт отправлен') ||
              challengeDetails?.status == 'Можно отправить отчёт')*/
          "
          class="submit_result general-brand-bg"
          @click="sendReport"
        >
          <h1 class="submit_result_text general-white-color">
            {{ $t("challenges.details.send_result") }}
          </h1>
        </button>
        <div 
          class="like_button_wrapper"
          @mouseover="likeButtonHovered"
          @mouseleave="likeButtonUnhovered"
        >
          <button
            class="like_button minor-info-secondary-bg"
            :class="{ active: challengeDetails?.user_liked }"
            @click="pressChallengeLike"
          >
            <LikeIcon
              :currentColor="getIconColor(challengeDetails?.user_liked)"
            />
            <h1
              class="likes_count general-contrast-color"
              :class="{ active: challengeDetails?.user_liked }"
            >
              {{ challengeDetails?.likes_amount }}
            </h1>
          </button>
          <div 
            v-if="likedUsersVisible"
            class="liked_users_list general-white-bg"
          >
            <div 
              @click="$router.push('/other_profile/' + likedUser.user.id)"
              v-for="(likedUser, index) in likedUsersList.slice(0, 5)"
              class="liked_user_card border_bottom"
            >
              <img 
                @mouseover="displayName(likedUser)"
                @mouseleave="hideName(likedUser)"
                class="liked_user_avatar_image" 
                v-if="likedUser.user.avatar" 
                :src="photoAddress(likedUser.user.avatar)" 
              />
              <NoAvatar 
                @mouseover="displayName(likedUser)"
                @mouseleave="hideName(likedUser)"
                class="liked_user_avatar_image" v-else
              />
              <!-- {{ likedUser }} -->
              <div 
                v-if="likedUser.isNameVisible"
                class="liked_user_name general-white-bg"
                :class="{ left_side: challengeDetails?.is_available }"
              >
                {{ likedUser.user.surname ? (likedUser.user.surname + (likedUser.user.name ? " " + likedUser.user.name : "")) : (likedUser.user.name ? likedUser.user.name : "") }}
              </div>
            </div>
            <div @click="goToChallengeGrades" class="liked_user_card">
              <h1 class="show_all_text general-contrast-color">
                {{ $t("challenges.details.all") }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS, SERVER_IP } from "@/constants/api";
import axios from "axios";
import ChallengeSendReport from "./ChallengeSendReport.vue";

import { organizationSettingsStore } from "@/store/organization-settings";
import { CHALLENGE_ALGORITHM_TYPES } from "@/infrastructure/data-sources/challenge-algorithm-types";

import LikeIcon from "@/components/Icons/like.vue";
import DetailTFLogoIcon from "../Icons/ChallengesIcons/DetailTFLogoIcon.vue";
import DetailClockIcon from "../Icons/ChallengesIcons/DetailClockIcon.vue";
import DetailGiftIcon from "../Icons/ChallengesIcons/DetailGiftIcon.vue";
import { getImageURL } from "@/general-scripts/get-image-url";
import NoAvatar from "../Icons/noAvatar.vue";

export default {
  name: "ChallengeDetails",
  components: {
    ChallengeSendReport,
    LikeIcon,
    DetailTFLogoIcon,
    DetailClockIcon,
    DetailGiftIcon,
    NoAvatar
},
  props: {
    challengeDetails: {
      required: true,
    },
    isCreator: {},
  },
  data() {
    return {
      likedUsersList: [],
      likedUsersVisible: false,
      likedUsersShowTimeout: null,
      likedUsersHideTimeout: null,

      challengeSendReportEnabled: false,

      organizationSettings: organizationSettingsStore(),

      topInfoItems: [
        // {
        //   // icon: this.getImgUrl("PrizeFundIcon"),
        //   icon: "DetailTFLogoIcon",
        //   header: () => {
        //     return this.$t("challenges.details.prize_fund");
        //   },
        //   value: () => {
        //     if (!this.challengeDetails)
        //       return (
        //         "0 " + this.organizationSettings.settings.bonusname.RU.form4
        //       );
        //     if (
        //       this.challengeDetails?.fund % 100 != 11 &&
        //       this.challengeDetails?.fund % 10 == 1
        //     ) {
        //       return (
        //         this.challengeDetails?.fund +
        //         " " +
        //         this.organizationSettings.settings.bonusname.RU.form1
        //       );
        //     } else if (
        //       (this.challengeDetails?.fund % 100 < 12 ||
        //         this.challengeDetails?.fund % 100 > 14) &&
        //       this.challengeDetails?.fund % 10 > 1 &&
        //       this.challengeDetails?.fund % 10 < 5
        //     ) {
        //       return (
        //         this.challengeDetails?.fund +
        //         " " +
        //         this.organizationSettings.settings.bonusname.RU.form5
        //       );
        //     } else {
        //       return (
        //         this.challengeDetails?.fund +
        //         " " +
        //         this.organizationSettings.settings.bonusname.RU.form4
        //       );
        //     }
        //   },
        // },
        {
          // icon: this.getImgUrl("ChallengeEndDateIcon"),
          icon: "DetailClockIcon",
          header: () => {
            if (this.challengeDetails?.challenge_condition === "W") {
              return this.$t("challenges.details.start_date");
            }
            return this.$t("challenges.details.end_date");
          },
          value: () => {
            if (this.challengeDetails?.challenge_condition === "W") {
              return this.prettyPrintTimestamp(this.challengeDetails?.start_at);
            }
            if (!this.challengeDetails?.end_at)
              return this.$t("challenges.details.unidentified");
            return this.prettyPrintTimestamp(this.challengeDetails?.end_at);
          },
        },
        // {
        //   // icon: this.getImgUrl("ChallengeAwardeesCountIcon"),
        //   icon: "DetailGiftIcon",
        //   header: () => {
        //     return this.$t("challenges.details.prize_places");
        //   },
        //   value: () => {
        //     if (!this.challengeDetails) return "0 / 0";
        //     let prizePlaces = 0;
        //     for (let i = 0; i < this.challengeDetails.parameters?.length; ++i) {
        //       let curParameter = this.challengeDetails.parameters[i];
        //       if (curParameter.id == 2) prizePlaces = curParameter.value;
        //     }
        //     return (
        //       this.challengeDetails.awardees -
        //       this.challengeDetails.remaining_top_places +
        //       " / " +
        //       prizePlaces
        //     );
        //   },
        // },
      ],
    };
  },
  mounted() {
    if (this.$route.query.openReport) {
      this.challengeSendReportEnabled = true;
    }
  },
  watch: {
    challengeDetails: {
      handler(newVal) {
        if (newVal) {
          this.getLikedUsers();
        }
      },
      immediate: true
    }
  },
  computed: {
    challengeAlgorithmTypes() {
      return CHALLENGE_ALGORITHM_TYPES(this);
    },
    challengeStatus() {
      if (
        !this.isCreator &&
        this.challengeDetails?.challenge_condition === "A" &&
        ((this.challengeDetails?.multiple_reports &&
          this.challengeDetails?.status == "Отчёт отправлен") ||
          this.challengeDetails?.status == "Можно отправить отчёт") &&
        !this.challengeDetails?.is_available
      ) {
        return this.$t("challenges.details.challenge_not_available");
      }
      let str = this.challengeDetails?.status;
      if (
        (str && this.isCreator) ||
        this.challengeDetails?.challenge_condition === "W"
      ) {
        str = str.replace(/, Можно отправить отчёт/g, "");
        str = str.replace(/Можно отправить отчёт, /g, "");
        str = str.replace(/Можно отправить отчёт/g, "");
        return str;
      } else {
        return str;
      }
    },
    descriptionWithLineBreaks() {
      let description = this.challengeDetails?.description || "";
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n/g, "<br>");
    },
  },
  methods: {
    async getLikedUsers() {
      try {
        const response = await axios.post(API_URIS.getLikes, {
          challenge_id: this.challengeDetails.id,
          include_name: true,
          is_reverse_order: true
        });
        this.likedUsersList = response.data.likes[0].items;
        for (let i = 0; i < this.likedUsersList.length; ++i) {
          this.likedUsersList[i].isNameVisible = false;
        }
      } catch(err) {
        throw err;
      }
    },
    goToChallengeGrades() {
      this.$emit("goToChallengeGrades");
    },
    displayName(likedUser) {
      likedUser.isNameVisible = true;
    },
    hideName(likedUser) {
      likedUser.isNameVisible = false;
    },
    likeButtonHovered() {
      this.likedUsersVisible = true;
    },
    likeButtonUnhovered() {
      this.likedUsersVisible = false;
    },
    goToWinners() {
      this.challengeSendReportEnabled = false;
      this.$emit("goToWinners");
    },
    sendReportCancel() {
      this.challengeSendReportEnabled = false;
      this.$router.push("/challenge/" + this.$route.params.id);
    },
    getIconColor(isLiked) {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");

      if (isLiked) {
        return generalColorWhite;
      } else if (!isLiked) {
        return generalContrast;
      } else {
        return generalContrast;
      }
    },
    photoAddress(photo) {
      if (photo == null) {
        let images = require.context("@/assets/", false, /\.png$/);
        return images("./Logo.png");
      } else {
        if (photo.slice(0, 7) == "http://") {
          return photo;
        }
        return SERVER_IP + photo;
      }
    },
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/ChallengeDetailsImages/",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    prettyPrintTimestamp(timestamp) {
      let hiredAt = new Date(Date.parse(timestamp));
      let months = [
        this.$t("general.date.months.at_january_capital"),
        this.$t("general.date.months.at_february_capital"),
        this.$t("general.date.months.at_march_capital"),
        this.$t("general.date.months.at_april_capital"),
        this.$t("general.date.months.at_may_capital"),
        this.$t("general.date.months.at_june_capital"),
        this.$t("general.date.months.at_july_capital"),
        this.$t("general.date.months.at_august_capital"),
        this.$t("general.date.months.at_september_capital"),
        this.$t("general.date.months.at_october_capital"),
        this.$t("general.date.months.at_november_capital"),
        this.$t("general.date.months.at_december_capital"),
      ];
      return (
        hiredAt.getDate() +
        " " +
        months[hiredAt.getMonth()] +
        " " +
        hiredAt.getFullYear() +
        this.$t("general.date.year_contracted")
      );
    },
    sendReport() {
      this.challengeSendReportEnabled = true;
    },
    getWinnersDefinition() {
      return this.challengeAlgorithmTypes.find(
        (el) => el.type == this.challengeDetails.algorithm_type
      ).title;
    },
    async pressChallengeLike() {
      try {
        await axios.post(API_URIS.pressReaction, {
          challenge_id: this.challengeDetails.id,
          like_kind: 1,
        });
        this.$emit("updateLikesAmount");
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenge_details {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.challenge_top_info {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.challenge_top_info_item {
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  flex-grow: 1;
}

.challenge_top_info_item_left {
  display: flex;
  gap: 12px;
}

.challenge_top_info_item_icon {
  height: 24px;
  width: 24px;
}

.challenge_top_info_item_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

.challenge_top_info_item_value {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}

.challenge_bottom_info {
  border-radius: 12px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.challenge_description {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.28px;
  text-align: left;
  word-break: break-all;
}

.challenge_states {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.challenge_state_items_wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.challenge_state_item {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 50px;
}

.challenge_state_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}

.send_and_like {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  justify-content: space-between;
}

.submit_result {
  width: fit-content;
  border-radius: 12px;
  padding: 17px 39px;
}

.submit_result_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.like_button_wrapper {
  position: relative;
}
.like_button {
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  gap: 4px;
  align-items: center;
}

.like_button.active {
  background-color: var(--generalBrand);
}

.like_icon {
  height: 24px;
  width: 24px;
}

.likes_count {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
}

.likes_count.active {
  color: var(--generalColorWhite);
}

.liked_users_list {
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border: 1px solid var(--generalColorSecondary);
  border-radius: 12px;
  position: absolute;
  left: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.liked_user_card {
  cursor: pointer;
  position: relative;
  padding: 8px;
  display: flex;
  justify-content: center;
}
.liked_user_card.border_bottom {
  border-bottom: 1px solid var(--generalColorSecondary);
}
.show_all_text {
  align-items: center;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
}
.liked_user_avatar_image {
  height: 44px;
  min-width: 44px;
  width: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.liked_user_name {
  position: absolute;
  left: 100%;
  border: 1px solid var(--generalColorSecondary);
  padding: 4px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
}
.liked_user_name.left_side {
  left: auto;
  right: 100%;
}
</style>
