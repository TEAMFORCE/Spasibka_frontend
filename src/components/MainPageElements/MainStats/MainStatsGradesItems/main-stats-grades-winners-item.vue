<template>
  <div class="grades_winners_item_wrapper">
    <div class="grades_winners_item_top">
      <div class="item_photo_wrapper">
        <img
          class="item_photo"
          :src="photoAddress(itemData.winner.winner_photo)"
          alt="user_photo"
        />
        <div class="challenge_winner_icon">
          <img src="@/assets/ChallengeWhiteIcon.png" alt="challenge_winner" />
        </div>
      </div>
      <p class="item_text">
        <span
          class="colored_text"
          @click="goToProfile(winnerData.winner.winner_id)"
        >
          @{{ winnerData.winner.winner_tg_name }}
        </span>
        {{ $t("feed.somebody_won") }}
        {{ $t("feed.in_challenge") }}
        <span
          class="colored_text"
          @click="goToChallenge(winnerData.winner.challenge_id)"
        >
          «{{ winnerData.winner.challenge_name }}»
        </span>
      </p>
      <div class="item_buttons">
        <button class="item_button" @click.stop="getComments">
          <CommentIcon :currentColor="getIconColor()" />
          <span class="button_value">{{ itemData.comments_amount }}</span>
        </button>
        <button
          class="item_button"
          :class="{ item_button_pressed: itemData.winner.user_liked }"
          @click="likeWinner"
        >
          <LikeIcon :currentColor="getIconColor(itemData.winner.user_liked)" />

          <span v-if="!itemData.winner.user_liked" class="button_value">{{
            itemData.likes_amount
          }}</span>
          <span v-if="itemData.winner.user_liked" class="button_value_white">{{
            itemData.likes_amount
          }}</span>
        </button>
      </div>
    </div>
    <div class="grades_winners_item_bottom" v-if="showCommentsBlock">
      <StatsGradesCommentsBlock
        :comments="comments"
        :countOfComments="countOfComments"
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

import StatsGradesCommentsBlock from "@/components/MainPageElements/MainStats/MainStatsGradesItems/main-stats-grades-comments-block.vue";

import CommentIcon from "@/components/Icons/comment.vue";
import LikeIcon from "@/components/Icons/like.vue";

export default {
  name: "GradesWinnerItem",
  components: {
    StatsGradesCommentsBlock,
    CommentIcon,
    LikeIcon,
  },
  props: {
    winnerData: {
      required: true,
    },
  },
  data() {
    return {
      itemData: this.winnerData,
      comments: null,
      showCommentsBlock: false,
      countOfComments: null,
    };
  },
  methods: {
    async likeWinner() {
      await axios
        .post(API_URIS.pressReaction, {
          like_kind: LIKE_TYPES.like,
          challenge_report_id: this.winnerData.event_object_id,
        })
        .then(() => {
          if (this.itemData.winner.user_liked) {
            this.itemData.winner.user_liked = false;
            this.getCommentsAndLikes();
          } else {
            this.itemData.winner.user_liked = true;
            this.getCommentsAndLikes();
          }
        });
    },
    async getCommentsAndLikes() {
      let res = await axios.post(API_URIS.getLikesCommentsStatistics, {
        challenge_report_id: this.winnerData.event_object_id,
      });
      this.itemData.likes_amount = res.data.likes.find(
        (el) => el.like_kind.id === LIKE_TYPES.like
      ).counter;
      this.itemData.comments_amount = res.data.comments;
      this.countOfComments = res.data.comments;
    },
    async getComments() {
      this.showCommentsBlock = true;
      try {
        let response = await axios.post(API_URIS.getComments, {
          challenge_report_id: this.winnerData.event_object_id,
          include_name: true,
          limit: 3,
          is_reverse_order: true,
        });
        this.comments = response.data.comments;
        this.getCommentsAndLikes();
      } catch (error) {
        throw error;
      }
    },
    async showAllComments() {
      try {
        let response = await axios.post(API_URIS.getComments, {
          challenge_report_id: this.winnerData.event_object_id,
          include_name: true,
          is_reverse_order: true,
        });
        this.comments = response.data.comments;
      } catch (error) {
        error;
      }
    },
    async sendComment(comment) {
      await axios
        .post(API_URIS.createComment, {
          text: comment,
          challenge_report_id: this.winnerData.event_object_id,
        })
        .then(() => {
          this.getComments();
          // this.getCommentsAndLikes();
        })
        .catch((err) => {
          throw err;
        });
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
    goToProfile(userId) {
      this.$router.push(`/other_profile/${userId}`);
    },
    goToChallenge(challengeId) {
      this.$router.push(`/challenge/${challengeId}`);
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
  },
};
</script>

<style scoped>
.grades_winners_item_wrapper {
  padding: 24px;
  width: 95%;
  border-radius: 20px;
  border: 1px solid var(--negativeSecondary);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  gap: 16px;
}
.grades_winners_item_top {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.grades_winners_item_bottom {
  width: 100%;
}
.item_photo_wrapper {
  width: 44px;
  height: 44px;
  border-radius: 100%;
  position: relative;
}
.item_photo {
  min-width: 44px;
  width: 100%;
  height: 100%;
  border-radius: 100%;
}
.challenge_winner_icon {
  width: 21px;
  height: 21px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--generalBrand);
  position: absolute;
  left: -5px;
  bottom: -5px;
}
.item_text {
  font-family: "SF Pro Text";
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin: 0 0 0 16px;
  color: var(--generalContrast);
}
.colored_text {
  color: var(--generalBrand);
  cursor: pointer;
}
.item_buttons {
  position: absolute;
  right: 24px;
  display: flex;
  gap: 8px;
  z-index: 10 !important;
}
.item_button {
  background-color: var(--secondaryColorBrand);
  border-radius: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
}
.item_button_pressed {
  background-color: var(--generalBrand);
}
.button_icon {
  width: 16px;
}
.button_value {
  font-family: "Roboto";
  font-weight: 500;
  font-size: 10px;
  line-height: 18px;
}
.button_value_white {
  color: var(--generalColorWhite);
}
.like_icon {
  width: 16px;
  height: 16px;
}
.comment_icon {
  width: 16px;
  height: 16px;
}
@media (max-width: 1440px) {
  .grades_winners_item_wrapper {
    width: auto;
  }
}
@media (max-width: 1280px) {
  .grades_winners_item_wrapper {
    width: auto;
  }
}
@media (max-width: 768px) {
  .grades_winners_item_wrapper {
    width: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 72px;
  }
  .item_text {
    margin: 0;
    text-align: left;
  }
  .item_buttons {
    right: auto;
    bottom: -48px;
    left: 24px;
  }
}
</style>