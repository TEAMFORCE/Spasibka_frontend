<template>
  <div class="likes_and_comments_buttons_wrapper">
    <button class="likes_and_comments_button">
      <CommentIcon :currentColor="getCommentColor()" />
      <span class="button_value">{{ itemData.comments_amount }}</span>
    </button>

    <button
      :class="{ active: itemData.user_liked }"
      class="likes_and_comments_button"
      @click.stop="likeItem"
    >
      <LikeIcon :currentColor="getLikeColor()" />
      <span :class="{ active: itemData.user_liked }" class="button_value">{{
        itemData.likes_amount
      }}</span>
    </button>
  </div>
</template>

<script>
import LikeIcon from "@/components/Icons/like.vue";
import CommentIcon from "@/components/Icons/comment.vue";

export default {
  name: "ChallengeLikeAndCommentButtons",
  components: {
    LikeIcon,
    CommentIcon,
  },
  props: {
    itemData: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getCommentColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalContrast;
    },
    getLikeColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");

      if (this.itemData.user_liked) {
        return generalColorWhite;
      } else if (!this.itemData.user_liked) {
        return generalContrast;
      } else {
        return generalContrast;
      }
    },
    likeItem() {
      this.$emit("itemLiked");
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/FeedImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
  },
};
</script>

<style scoped>
.likes_and_comments_buttons_wrapper {
  position: relative;
  z-index: 101;
  display: flex;
  gap: 8px;
}
.likes_and_comments_button {
  height: 32px;
  border-radius: 8px;
  background-color: var(--minorInfoSecondaryColor);
  padding: 0px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.likes_and_comments_button.active {
  background-color: var(--generalBrand);
}
.button_image {
  height: 16px;
  width: 16px;
}
.button_value {
  font-size: 10px;
  font-weight: 500;
  font-family: "Roboto";
  color: var(--generalContrast);
}
.button_value.active {
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
</style>