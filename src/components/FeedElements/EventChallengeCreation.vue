<template>
  <div class="event_challenge_creation">
    <img
      class="challenge_creation_icon"
      :src="getImgUrl('EventChallengeCreationIcon')"
      @click="$router.push('/challenge/' + feedItem.challengeID)"
    />
    <h1 class="transaction_date general-secondary-color">
      {{ getDisplayDate(feedItem.challengeCreatedAt) }}
    </h1>
  </div>
</template>

<script>
import { formatTimestamp } from '@/general-scripts/timestamps';

export default {
  props: {
    feedItem: {
      required: true,
    },
    selfUserID: {
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    creatorDisplayName() {
      let displayName = "";
      if (this.feedItem.challengeCreatorFirstName) {
        displayName += this.feedItem.challengeCreatorFirstName;
        if (this.feedItem.challengeCreatorSurname) {
          displayName += " " + this.feedItem.challengeCreatorSurname;
        }
        return displayName;
      } else {
        return "@" + this.feedItem.challengeCreatorTgName;
      }
    },
  },
  methods: {
    getDisplayDate(date) {
      let formattedTimestamp = formatTimestamp(date);
      let dateString = "";
      if (formattedTimestamp.when === "today") {
        dateString = this.$t("general.date.today");
      } else if (formattedTimestamp.when === "yesterday") {
        dateString = this.$t("general.date.yesterday");
      } else {
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
        dateString = formattedTimestamp.day + " " + months[formattedTimestamp.month];
      }
      let hours = formattedTimestamp.hours > 9 ? formattedTimestamp.hours : "0" + formattedTimestamp.hours;
      let minutes = formattedTimestamp.minutes > 9 ? formattedTimestamp.minutes : "0" + formattedTimestamp.minutes;
      return dateString + " " + this.$t("general.date.at") + " " + hours + ":" + minutes;
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/FeedImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    challengeExpireTime(time) {
      let updatedAt = new Date(Date.parse(time));
      let day =
        updatedAt.getDate() > 9
          ? updatedAt.getDate()
          : "0" + updatedAt.getDate();
      let month =
        updatedAt.getMonth() > 8
          ? updatedAt.getMonth() + 1
          : "0" + (updatedAt.getMonth() + 1);
      return day + "." + month + "." + updatedAt.getFullYear();
    },
  },
};
</script>

<style scoped>
.event_challenge_creation {
  display: flex;
  align-items: center;
  gap: 16px;
}
@media (max-width: 550px) {
  .event_challenge_creation {
    flex-direction: column;
  }
}
.challenge_creation_icon {
  width: 44px;
  height: 44px;
  object-fit: cover;
  align-self: flex-start;
}
.challenge_creation_icon:hover {
  cursor: pointer;
}
.transaction_date {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
}
</style>
