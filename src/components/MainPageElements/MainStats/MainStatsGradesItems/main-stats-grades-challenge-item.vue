<template>
  <div class="grades_challenges_item_wrapper">
    <div class="grades_challenges_item_top">
      <div class="item_icon_wrapper">
        <img
          class="item_icon"
          src="@/assets/ChallengesPressed.png"
          alt="challenge_icon"
        />
      </div>
      <div class="item_info">
        <p class="item_text">
          {{ $t("feed.challenge_created") }}
          <span class="item_colored_text">
            «{{ challengeData.challenge.name }}»
          </span>
          {{ $t("feed.by_user") }}
          <span
            class="item_colored_text"
            @click="goToProfile(challengeData.challenge.creator_id)"
          >
            @{{ challengeData.challenge.creator_tg_name }}
          </span>
        </p>
      </div>
      <div class="item_buttons">
        <button class="item_button" @click.stop="getComments">
          <CommentIcon :currentColor="getIconColor()" />
          <span class="button_value">{{ itemData.comments_amount }}</span>
        </button>
        <button
          class="item_button"
          :class="{ item_button_pressed: itemData.challenge.user_liked }"
          @click="likeChallenge"
        >
          <LikeIcon
            :currentColor="getIconColor(itemData.challenge.user_liked)"
          />
          <span v-if="!itemData.challenge.user_liked" class="button_value">{{
            challengeData.likes_amount
          }}</span>
          <span
            v-if="itemData.challenge.user_liked"
            class="button_value_white"
            >{{ challengeData.likes_amount }}</span
          >
        </button>
      </div>
    </div>
    <div class="grades_challenges_item_bottom" v-if="showCommentsBlock">
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
  name: "GradesChallengeItem",
  components: {
    StatsGradesCommentsBlock,
    CommentIcon,
    LikeIcon,
  },
  props: {
    challengeData: {
      required: true,
    },
  },
  data() {
    return {
      itemData: this.challengeData,
      comments: null,
      showCommentsBlock: false,
      countOfComments: null,
    };
  },
  methods: {
    async likeChallenge() {
      await axios
        .post(API_URIS.pressReaction, {
          like_kind: LIKE_TYPES.like,
          challenge_id: this.challengeData.event_object_id,
        })
        .then(() => {
          if (this.itemData.challenge.user_liked) {
            this.itemData.challenge.user_liked = false;
            this.getCommentsAndLikes();
          } else {
            this.itemData.challenge.user_liked = true;
            this.getCommentsAndLikes();
          }
        });
    },
    async getCommentsAndLikes() {
      let res = await axios.post(API_URIS.getLikesCommentsStatistics, {
        challenge_id: this.challengeData.event_object_id,
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
          challenge_id: this.challengeData.event_object_id,
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
          challenge_id: this.challengeData.event_object_id,
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
          challenge_id: this.challengeData.event_object_id,
        })
        .then(() => {
          this.getComments();
        })
        .catch((err) => {
          throw err;
        });
    },
    goToProfile(userId) {
      this.$router.push(`/other_profile/${userId}`);
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
.grades_challenges_item_wrapper {
  padding: 24px;
  width: 93%;
  border-radius: 20px;
  border: 1px solid var(--negativeSecondary);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  gap: 16px;
}
.grades_challenges_item_top {
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  position: relative;
}
.grades_challenges_item_bottom {
  width: 100%;
}
.item_icon_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 100%;
  background-color: var(--minorInfoSecondaryColor);
}
.item_icon {
  width: 18px;
}
.item_info {
  margin: 0 0 0 16px;
}
.item_text {
  font-family: "SF Pro Text";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalContrast);
  margin: 0;
}
.item_colored_text {
  color: var(--generalBrand);
}
.item_buttons {
  position: absolute;
  right: 24px;
  display: flex;
  gap: 8px;
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
  .grades_challenges_item_wrapper {
    width: auto;
  }
}
@media (max-width: 1280px) {
  .grades_challenges_item_wrapper {
    width: auto;
  }
}
@media (max-width: 768px) {
  .grades_challenges_item_wrapper {
    width: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 72px;
  }
  .item_info {
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