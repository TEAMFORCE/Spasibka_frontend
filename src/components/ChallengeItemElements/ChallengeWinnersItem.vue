<template>
  <div class="challenge_winner_item">
    <div
      class="challenge_winner transparent-bg"
      @click="openOrCloseAdditionalInfo"
    >
      <div class="challenge_winner_user">
        <Avatar
          :type="'challenges'"
          :userID="challengeWinner?.participant_id"
          :userName="challengeWinner?.participant_name"
          :userSurname="challengeWinner?.participant_surname"
          :userPhoto="challengeWinner?.participant_photo"
        />
        <div class="challenge_winner_info">
          <h1 class="challenge_winner_name general-contrast-color">
            {{
              challengeWinner?.participant_name +
              " " +
              challengeWinner?.participant_surname
            }}
          </h1>
          <h1 class="challenge_winner_report_time general-secondary-color">
            {{ getDisplayDate(challengeWinner?.awarded_at) }}
          </h1>
        </div>
      </div>
      <ChallengeLikeAndCommentButtons
        :itemData="itemData"
        @itemLiked="itemLiked"
      />
    </div>
    <div class="challenge_winner_additional_info">
      <h1
        v-if="challengeWinner?.text"
        class="challenge_winner_report_text"
        v-html="additionalInfoWithLineBreaks"
      ></h1>
      <img
        @click.stop="enableIncreasedPhoto"
        v-if="challengeWinner?.photo"
        class="challenge_winner_report_photo"
        :src="photoAddress(challengeWinner?.photo)"
      />
      <div
        @click.stop="disableIncreasedPhoto"
        v-if="increasedPhotoEnabled"
        class="increased_photo_wrapper"
      >
        <img
          class="increased_photo"
          :src="photoAddress(challengeWinner?.photo)"
        />
      </div>
      <ChallengeComments
        v-if="additionalInfoEnabled" 
        :comments="itemComments"
        :countOfComments="countOfLikesAndComments"
        @sendComment="sendComment"
        @showAllComments="showAllComments"
      />
    </div>
  </div>
</template>

<script>
import { LIKE_TYPES } from "@/constants/likeTypes";
import { API_URIS, SERVER_IP } from "@/constants/api";

import axios from "axios";

import Avatar from "@/widgets/Avatar.vue";
import ChallengeLikeAndCommentButtons from "@/components/ChallengeItemElements/ChallengeLikeAndCommentButtons.vue";
import ChallengeComments from "@/components/ChallengeItemElements/ChallengeComments.vue";

export default {
  name: "ChallengeWinnersItem",

  components: {
    Avatar,
    ChallengeLikeAndCommentButtons,
    ChallengeComments,
  },
  props: {
    challengeWinner: {
      required: true,
    },
  },
  data() {
    return {
      additionalInfoEnabled: false,
      itemComments: null,
      countOfLikesAndComments: null,
      itemData: this.challengeWinner,
      increasedPhotoEnabled: false,
    };
  },
  computed: {
    additionalInfoWithLineBreaks() {
      return this.challengeWinner?.text.replace(/\r\n/g, "<br>");
    },
  },
  methods: {
    enableIncreasedPhoto() {
      this.increasedPhotoEnabled = true;
    },
    disableIncreasedPhoto() {
      this.increasedPhotoEnabled = false;
    },
    async showAllComments() {
      const comments = await axios.post(API_URIS.getComments, {
        challenge_report_id: this.itemData.id,
        include_name: true,
        is_reverse_order: true,
      });
      this.itemComments = comments.data.comments;
    },
    async sendComment(comment) {
      await axios
        .post(API_URIS.createComment, {
          text: comment,
          challenge_report_id: this.itemData.id,
        })
        .then(() => {
          this.getComments();
        });
    },
    async getComments() {
      let comments = await axios.post(API_URIS.getComments, {
        challenge_report_id: this.itemData.id,
        include_name: true,
      });
      this.itemComments = comments.data.comments;
      this.itemData.comments_amount = comments.data.comments.length;
    },
    async itemLiked() {
      await axios
        .post(API_URIS.pressReaction, {
          like_kind: LIKE_TYPES.like,
          challenge_report_id: this.itemData.id,
        })
        .then(() => {
          if (this.itemData.user_liked) {
            this.itemData.user_liked = false;
            this.getCommentsAndLikes();
          } else {
            this.itemData.user_liked = true;
            this.getCommentsAndLikes();
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    async getCommentsAndLikes() {
      let res = await axios.post(API_URIS.getLikesCommentsStatistics, {
        challenge_report_id: this.itemData.id,
      });
      this.itemData.likes_amount = res.data.likes.find(
        (el) => el.like_kind.id === LIKE_TYPES.like
      ).counter;
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
        createdAt.getDate() === currentDate.getDate() &&
        createdAt.getMonth() === currentDate.getMonth() &&
        createdAt.getFullYear() === currentDate.getFullYear()
      ) {
        dateString = this.$t("general.date.today");
      } else {
        createdAt.setDate(createdAt.getDate() + 1);
        if (
          createdAt.getDate() == currentDate.getDate() &&
          createdAt.getMonth() === currentDate.getMonth() &&
          createdAt.getFullYear() === currentDate.getFullYear()
        ) {
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
    async openOrCloseAdditionalInfo() {
      if (this.additionalInfoEnabled) {
        this.additionalInfoEnabled = false;
      } else {
        this.additionalInfoEnabled = true;
        try {
          const comments = await axios.post(API_URIS.getComments, {
            challenge_report_id: this.itemData.id,
            include_name: true,
            limit: 3,
            is_reverse_order: true,
          });
          const commentsAndLikes = await axios.post(
            API_URIS.getLikesCommentsStatistics,
            {
              challenge_report_id: this.itemData.id,
            }
          );
          this.itemComments = comments.data.comments;
          this.countOfLikesAndComments = commentsAndLikes.data;
        } catch (err) {
          throw err;
        }
      }
    },
  },
};
</script>

<style scoped>
.challenge_winner_item {
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  max-width: 343px;
  width: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.challenge_winner {
  padding: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}
.challenge_winner_user {
  display: flex;
  align-items: center;
}
.challenge_winner_photo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.challenge_winner_info {
  margin: 0 0 0 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.challenge_winner_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
}
.challenge_winner_report_time {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
}
.challenge_winner_additional_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.challenge_winner_report_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: left;
  color: var(--generalContrast);
}
.challenge_winner_report_photo {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 20px;
}
.increased_photo_wrapper {
  position: fixed;
  z-index: 102;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.increased_photo {
  position: fixed;
  max-height: 50%;
  max-width: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
</style>