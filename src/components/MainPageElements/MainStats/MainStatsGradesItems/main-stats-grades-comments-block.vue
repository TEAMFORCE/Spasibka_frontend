<template>
  <div class="stats_grades_comments_wrapper">
    <div class="comment_list_wrapper" v-if="comments">
      <div class="comment_list_item" v-for="(item, index) in comments">
        <hr v-if="index > 0" class="comments_separator" />
        <div class="avatar">
          <img
            v-if="item.user.avatar"
            :src="getAvatar(item.user.avatar)"
            alt="user_avatar"
            class="has_avatar"
          />
          <div v-else class="no_avatar">
            <span>{{ getFirstLetter(item.user.name) }}</span>
            <span>{{ getFirstLetter(item.user.surname) }}</span>
          </div>
        </div>
        <div class="user">
          <span class="user_name" @click="openOtherProfile(item.user.id)">
            {{ item.user.name }}
            {{ item.user.surname }}
          </span>
          <span class="user_comment">
            {{ item.text }}
          </span>
          <span class="user_comment_date">
            {{ getDisplayDate(item.created, false) }}
          </span>
        </div>
      </div>

      <div v-if="countOfComments">
        <button
          v-if="countOfComments > 3 && !showAll"
          class="comment_show_all"
          @click="showAllComments"
        >
          {{ $t("comments.show_next_comments") }}
        </button>
      </div>
    </div>

    <div class="comments_input_wrapper">
      <input
        :placeholder="$t('comments.send_message')"
        class="comment_input"
        v-model="commentInput"
      />
      <div class="send_button">
        <button class="send_comment" @click.stop="sendComment">
          <img class="send_icon" src="@/assets/FeedImages/CommentSend.png" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_IP } from "@/constants/api";

export default {
  name: "StatsGradesCommentsBlock",
  props: {
    comments: {
      required: true,
    },
    countOfComments: {
      required: true,
    },
  },
  data() {
    return {
      commentInput: "",
      showAll: false,
    };
  },
  methods: {
    sendComment() {
      this.$emit("sendComment", this.commentInput);
      this.commentInput = "";
    },
    showAllComments() {
      this.showAll = true;
      this.$emit("showAllComments");
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    getFirstLetter(word) {
      return word.substr(0, 1);
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

      if (createdAt.getDate() == currentDate.getDate()) {
        dateString = this.$t("general.date.today");
      } else {
        createdAt.setDate(createdAt.getDate() + 1);

        if (createdAt.getDate() == currentDate.getDate()) {
          dateString = this.$t("general.date.yesterday");
        } else {
          createdAt.setDate(createdAt.getDate() - 1);
          let day = createdAt.getDate();
          let month = createdAt.getMonth();
          let months = [
            this.$t("general.date.months.at_january"),
            this.$t("general.date.months.at_february"),
            this.$t("general.date.months.at_march"),
            this.$t("general.date.months.at_april"),
            this.$t("general.date.months.at_may"),
            this.$t("general.date.months.at_june"),
            this.$t("general.date.months.at_july"),
            this.$t("general.date.months.at_august"),
            this.$t("general.date.months.at_september"),
            this.$t("general.date.months.at_october"),
            this.$t("general.date.months.at_november"),
            this.$t("general.date.months.at_december"),
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
    openOtherProfile(userId) {
      this.$router.push("/other_profile/" + userId);
    },
  },
};
</script>

<style scoped>
.stats_grades_comments_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.comment_list_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.comment_list_item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  position: relative;
  width: 100%;
}
.avatar {
  width: 44px;
  height: 44px;
}
.has_avatar {
  width: 44px;
  height: 44px;
  border-radius: 100%;
}
.no_avatar {
  width: 44px;
  height: 44px;
  border-radius: 100%;
  background: linear-gradient(132.4deg, #f15929 -2.06%, #ffd699 111.97%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
}
.user {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}
.user_name {
  font-family: "Roboto";
  font-weight: 500;
  font-size: 16px;
  color: var(--generalContrast);
}
.user_comment {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.user_comment_date {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  color: var(--generalColorSecondary);
}
.comment_show_all {
  background-color: transparent;
  text-align: left;
  font-family: "Roboto";
  font-weight: 600;
  font-size: 14px;
  color: var(--generalBrand);
  padding: 0;
}
.comments_input_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
  padding: 12px;
  border: 1px solid var(--negativeSecondary);
  border-radius: 16px;
}
.comment_input {
  outline: none;
  border-style: none;
  font-family: "Ubuntu";
  font-weight: 400;
  font-size: 14px;
  flex-grow: 1;
  font-size: 16px;
}
.send_button {
  gap: 16px;
  display: flex;
  height: 32px;
  width: 32px;
  padding: 0px;
}
.send_comment {
  background-color: transparent;
}
.send_icon {
  height: 32px;
  width: 32px;
}
.comments_separator {
  position: absolute;
  width: 100%;
  border: none;
  border-top: 1px solid rgba(206, 206, 206, 0.5);
  top: -20px;
}
</style>