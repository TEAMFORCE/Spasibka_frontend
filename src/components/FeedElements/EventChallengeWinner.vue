<template>
  <div class="event_challenge_winner">
    <Avatar
      class="align_top"
      :type="'feed'"
      :userID="feedItem.winnerID"
      :userName="feedItem.winnerFirstName"
      :userSurname="feedItem.winnerSurname"
      :userPhoto="feedItem.icon"
      :recipient="feedItem.recipient"
    />
    <img
      class="challenge_winner_icon"
      :src="getImgUrl('ChallengeWinnerIcon')"
    />
    <h1 class="transaction_date general-secondary-color">
      {{ getDisplayDate(feedItem.winnerReportUpdatedAt) }}
    </h1>
  </div>
</template>

<script>
import { formatTimestamp } from "@/general-scripts/timestamps";

import { SERVER_IP } from "@/constants/api";
import Avatar from "@/widgets/Avatar.vue";

export default {
  name: "EventChallengeWinner",
  props: {
    feedItem: {
      reqiured: true,
    },
    selfUserID: {
      required: true,
    },
  },
  components: {
    Avatar,
  },
  data() {
    return {};
  },
  computed: {
    winnerDisplayName() {
      let displayName = "";
      if (this.feedItem.winnerFirstName) {
        displayName += this.feedItem.winnerFirstName;
        if (this.feedItem.winnerSurname) {
          displayName += " " + this.feedItem.winnerSurname;
        }
        return displayName;
      } else {
        return "@" + this.feedItem.winnerTgName;
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
  },
};
</script>

<style scoped>
.align_top {
  align-self: flex-start;
}
.event_challenge_winner {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: center;
}
@media (max-width: 550px) {
  .event_challenge_winner {
    flex-direction: column;
  }
}
.challenge_winner_photo_wrapper {
  padding: 0px;
  position: relative;
  height: 44px;
  width: 44px;
  align-self: flex-start;
}
.challenge_winner_photo {
  border-radius: 50%;
  height: 44px;
  width: 44px;
  object-fit: cover;
}
.challenge_winner_icon {
  position: absolute;
  left: -5.87px;
  top: 29.33px;
  height: 20.53px;
  width: 20.53px;
}

.transaction_date {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
}
</style>
