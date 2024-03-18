<template>
  <div class="event_transaction">
    <div class="user_info">
      <Avatar
        :type="'feed'"
        :userID="feedItem.eventObjectID"
        :userName="feedItem.transactionRecipientFirstName"
        :userSurname="feedItem.transactionRecipientSurname"
        :userPhoto="feedItem.icon"
        :recipient="feedItem.recipient"
        :birthday="true"
      />
      <div class="user_name_and_transaction_date">
        <h1 class="user_name" v-html="feedItemHeader"></h1>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_IP } from "@/constants/api";
import Avatar from "@/widgets/Avatar.vue";

export default {
  name: "EventBirthday",
  props: {
    feedItem: {
      required: true,
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
    feedItemHeader() {
      if (this.feedItem.mainlink){
        const inputStr = this.feedItem.mainlink;
        var regex = /https?:\/\/[^\/]+(\/[^ ]*)/g;
        const replaced = inputStr.replace(regex, function(match) {
            var url = new URL(match);
            return url.pathname + url.search + url.hash;
        });
        return decodeURIComponent(replaced);
      } else {
        return this.feedItem.mainlink;
      }
    }
  },
  methods: {
    openOtherProfile(userID) {
      this.$router.push("/other_profile/" + userID);
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
    getDisplayDate(data) {
      let createdAt = new Date(Date.parse(data));

      let currentDate = new Date(Date.now());
      let createdAtTimeZoneOffset = createdAt.getTimezoneOffset();
      let currentTimeZoneOffset = currentDate.getTimezoneOffset();
      let timeZoneOffsetDifference =
        currentTimeZoneOffset - createdAtTimeZoneOffset;

      createdAt.setTime(
        createdAt.getTime() - timeZoneOffsetDifference * 60 * 1000
      );

      let dateString = "";

      if (
        createdAt.getFullYear() == currentDate.getFullYear() &&
        createdAt.getMonth() == currentDate.getMonth() &&
        createdAt.getDate() == currentDate.getDate()
      ) {
        dateString = this.$t("general.date.today");
      } else {
        createdAt.setDate(createdAt.getDate() + 1);

        if (
          createdAt.getFullYear() == currentDate.getFullYear() &&
          createdAt.getMonth() == currentDate.getMonth() &&
          createdAt.getDate() == currentDate.getDate()
        ) {
          dateString = this.$t("general.date.yesterday");
        } else {
          createdAt.setDate(createdAt.getDate() - 1);
          let day = createdAt.getDate();
          let month = createdAt.getMonth();
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
          dateString = day + " " + months[month];
        }
      }

      let hours =
        createdAt.getHours() > 9
          ? createdAt.getHours()
          : "0" + createdAt.getHours();
      let minutes =
        createdAt.getMinutes() > 9
          ? createdAt.getMinutes()
          : "0" + createdAt.getMinutes();
      return (
        dateString +
        " " +
        this.$t("general.date.at") +
        " " +
        hours +
        ":" +
        minutes
      );
    },
  },
};
</script>

<style scoped>
.event_transaction {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
@media (max-width: 550px) {
  .user_info {
    flex-direction: column;
  }
}
.user_info_and_like_comment_buttons {
  display: flex;
  justify-content: space-between;
}
.user_info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.user_avatar_wrapper {
  width: 60px;
  height: 60px;
}
.user_avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.user_avatar:hover {
  cursor: pointer;
}
.user_name_and_transaction_date {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.user_name {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
::v-deep(a) {
  color: var(--generalContrast);
  text-decoration: none;
}
.user_name:hover {
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
