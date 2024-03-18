<template>
  <div
    class="challenge_item general-white-bg"
    @click="goToChallenge"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="challenge_item_without_button">
      <img
        v-if="challengePhoto"
        class="challenge_photo"
        :src="challengePhoto"
      />
      <img v-else :src="getImgUrl()" class="challenge_photo" />
      <h1 class="challenge_name general-contrast-color">
        {{ challenge.name }}
      </h1>
      <h1 class="challenge_creator general-contrast-color">
        {{ creatorName }}
      </h1>
      <div class="updated_date_and_status general-secondary-color">
        {{ challengeLastUpdated }}
        <div
          class="status"
          :class="{
            active: challenge?.challenge_condition === 'A',
            ended: challenge?.challenge_condition === 'F',
            upcoming: challenge?.challenge_condition === 'W',
          }"
        >
          {{ challengeStatus }}
        </div>
      </div>
      <div class="challenge_info">
        <div v-for="info in infoTypes" class="challenge_particular_info">
          <h1 class="info_number general-contrast-color">
            {{ info.number }}
          </h1>
          <h1 class="info_text general-contrast-color">
            {{ info.name }}
          </h1>
        </div>
      </div>
    </div>
    <button
      v-if="!notActive"
      class="send_result general-brand-bg general-white-color"
      :class="{
        disabled:
          /*creatorIsYou || noMultipleReports ||*/ !challenge?.is_available,
      }"
      @click.stop="goToChallengeReport"
      :disabled="
        /*creatorIsYou || noMultipleReports ||*/ !challenge?.is_available
      "
    >
      {{ $t("challenges.send_result") }}
    </button>
  </div>
</template>

<script>
import { photoAddress } from "@/general-scripts/photo-address";
import { formatTimestamp } from "@/general-scripts/timestamps";
import { organizationSettingsStore } from "@/store/organization-settings";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

export default {
  name: "ChallengeChainChallengeCard",
  props: {
    challenge: {
      required: true,
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      isHovered: false,
    };
  },
  directives: {
    tooltip: {
      mounted(el, binding) {
        el.addEventListener("mouseover", function () {
          if (
            this.offsetWidth < this.scrollWidth &&
            !this.getAttribute("data-tooltip")
          ) {
            this.setAttribute("data-tooltip", binding.value);
          }
        });
        el.addEventListener("mouseout", function () {
          this.removeAttribute("data-tooltip");
        });
      },
    },
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    challengePhoto() {
      if (this.challenge?.photo) {
        return this.photoAddress(this.challenge.photo);
      } else if (this.challenge?.photos && this.challenge?.photos?.length > 0) {
        return this.photoAddress(this.challenge.photos[0]);
      } else {
        return null;
      }
    },
    creatorName() {
      if (this.challenge?.from_organization) {
        return (
          this.$t("challenges.by") + " " + this.challenge?.organization_name
        );
      } else {
        let creatorName = this.challenge?.creator_name;
        let creatorSurname = this.challenge?.creator_surname;
        let displayName = "";
        if (creatorName || creatorSurname) {
          displayName +=
            this.$t("challenges.by") +
            " " +
            `${creatorSurname || ""} ${creatorName || ""}`.trim();
        }
        return displayName;
      }
    },
    creatorIsYou() {
      return this.profileInfo?.id == this.challenge?.creator_id;
    },
    noMultipleReports() {
      if (
        !this.challenge?.multiple_reports &&
        this.challenge?.status === "Отчёт отправлен"
      )
        return true;
      return false;
    },
    notActive() {
      return this.challenge?.challenge_condition !== "A";
    },
    challengeStatus() {
      if (this.challenge?.challenge_condition === "W")
        return this.$t("challenges.status_waiting");
      else if (this.challenge?.challenge_condition === "A")
        return this.$t("challenges.status_active");
      else if (this.challenge?.challenge_condition === "F")
        return this.$t("challenges.status_ended");
      else return "";
    },
    challengeLastUpdated() {
      let formattedTime;
      const isWaiting = this.challenge?.challenge_condition === "W";
      if (isWaiting) {
        formattedTime = formatTimestamp(this.challenge?.start_at);
      } else {
        formattedTime = formatTimestamp(this.challenge?.updated_at);
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
    infoTypes() {
      return [
        {
          name: this.$t("challenges.winners_amount"),
          number: this.challenge?.winners_count,
        },
        {
          name:
            this.$t("challenges.prize_fund_amount") +
            " " +
            this.organizationSettings.settings.bonusname.RU.form4,
          number: this.challenge?.fund,
        },
        {
          name: this.$t("challenges.prize_place_amount"),
          number: this.challenge?.awardees,
        },
      ];
    },
  },
  methods: {
    photoAddress: photoAddress,
    changeOldImageOpacity() {
      if (this.$refs.fullImage) {
        this.$refs.fullImage.style.opacity = "1";
      }
    },
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
    getImgUrl() {
      var images = require.context(
        "@/assets/svgIcons/challengeIcons/",
        false,
        /\.svg$/
      );
      return images(
        "./" + `${"challenge"}${this.reduceNumber(this.challenge?.id)}` + ".svg"
      );
    },
    goToChallenge() {
      this.$router.push("/challenge/" + this.challenge?.id);
    },
    goToChallengeReport() {
      this.$router.push({
        path: "/challenge/" + this.challenge?.id,
        query: {
          openReport: true,
        },
      });
    },
  },
};
</script>

<style scoped>
.challenge_item {
  /* max-width: 515px; */
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 19px;
  box-sizing: border-box;
  width: 100%;
  max-width: 357px;
  position: relative;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.challenge_item:hover {
  cursor: pointer;
}

.challenge_item_without_button {
  display: flex;
  flex-direction: column;
}
.challenge_photo {
  max-width: 318px;
  height: 212px;
  object-fit: cover;
  border-radius: 20px;
  margin-bottom: 19px;
}
.challenge_name {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  text-align: left;
}
.challenge_creator {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  text-align: left;
}

.updated_date_and_status {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  text-align: left;
  align-items: center;
}
.status {
  border-radius: 8px;
  padding: 2px 8px;
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.status.active {
  color: var(--minorInfoSecondaryColor);
  background-color: var(--minorInfo);
}
.status.ended {
  color: var(--minorInfoSecondaryColor);
  background-color: var(--generalColorSecondary);
}
.status.upcoming {
  background-color: var(--generalColorGrey);
  color: var(--generalContrast);
}
.challenge_info {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.challenge_particular_info {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  /* width: min-content; */
}
.info_number {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  text-align: left;
}
.info_text {
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  /* width: min-content; */
  /* white-space: nowrap; */
}
.send_result {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
.send_result.disabled {
  background-color: var(--generalColorGrey);
}
</style>
