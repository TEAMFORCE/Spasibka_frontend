<template>
  <div class="challenge_details">
    <div class="challenge_bottom_info">
      <h1
        class="challenge_description general-contrast-color"
        v-html="descriptionWithLineBreaks"
      ></h1>
    </div>
  </div>
</template>

<script>
import { API_URIS, SERVER_IP } from "@/constants/api";
import axios from "axios";

import { organizationSettingsStore } from "@/store/organization-settings";

import LikeIcon from "@/components/Icons/like.vue";

export default {
  name: "ChallengeChainDetails",
  components: {
    LikeIcon,
  },
  props: {
    challengeDetails: {
      required: true,
    },
    isCreator: {},
  },
  data() {
    return {
      challengeSendReportEnabled: false,

      organizationSettings: organizationSettingsStore(),

      topInfoItems: [
        {
          icon: this.getImgUrl("PrizeFundIcon"),
          header: () => {
            return this.$t("challenges.details.prize_fund");
          },
          value: () => {
            if (!this.challengeDetails)
              return (
                "0 " + this.organizationSettings.settings.bonusname.RU.form4
              );
            if (
              this.challengeDetails?.fund % 100 != 11 &&
              this.challengeDetails?.fund % 10 == 1
            ) {
              return (
                this.challengeDetails?.fund +
                " " +
                this.organizationSettings.settings.bonusname.RU.form1
              );
            } else if (
              (this.challengeDetails?.fund % 100 < 12 ||
                this.challengeDetails?.fund % 100 > 14) &&
              this.challengeDetails?.fund % 10 > 1 &&
              this.challengeDetails?.fund % 10 < 5
            ) {
              return (
                this.challengeDetails?.fund +
                " " +
                this.organizationSettings.settings.bonusname.RU.form5
              );
            } else {
              return (
                this.challengeDetails?.fund +
                " " +
                this.organizationSettings.settings.bonusname.RU.form4
              );
            }
          },
        },
        {
          icon: this.getImgUrl("ChallengeEndDateIcon"),
          header: () => {
            return this.$t("challenges.details.end_date");
          },
          value: () => {
            if (!this.challengeDetails?.end_at)
              return this.$t("challenges.details.unidentified");
            return this.prettyPrintTimestamp(this.challengeDetails?.end_at);
          },
        },
        {
          icon: this.getImgUrl("ChallengeAwardeesCountIcon"),
          header: () => {
            return this.$t("challenges.details.prize_places");
          },
          value: () => {
            if (!this.challengeDetails) return "0 / 0";
            let prizePlaces = 0;
            for (let i = 0; i < this.challengeDetails.parameters?.length; ++i) {
              let curParameter = this.challengeDetails.parameters[i];
              if (curParameter.id == 2) prizePlaces = curParameter.value;
            }
            return (
              this.challengeDetails.awardees -
              this.challengeDetails.remaining_top_places +
              " / " +
              prizePlaces
            );
          },
        },
      ],
    };
  },
  mounted() {
    if (this.$route.query.openReport) {
      this.challengeSendReportEnabled = true;
    }
  },
  computed: {
    challengeStatus() {
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
}

.challenge_states {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
</style>
