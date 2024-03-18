<template>
  <div class="likes_and_comments">
    <button
      @click="$emit('toggleComments')"
      :class="{ active: commentPressed }"
      class="comment_or_like_button"
    >
      <CommentIcon :currentColor="getCommentColor()" />
      <h1 :class="{ active: commentPressed }" class="like_or_comment_count">
        {{ feedItem.commentsCount }}
      </h1>
    </button>

    <button
      @click.stop="rate(1)"
      :class="{ active: feedItem.userLiked }"
      class="comment_or_like_button"
    >
      <LikeIcon :currentColor="getIconColor()" />
      <h1 :class="{ active: feedItem.userLiked }" class="like_or_comment_count">
        {{ feedItem.likesCount }}
      </h1>
    </button>
  </div>
</template>

<script>
import {
  useStore as useFeedStore,
  FeedItem as FeedItemClass,
} from "@/store/feed";
import { mapStores } from "pinia";

import CommentIcon from "@/components/Icons/comment.vue";
import LikeIcon from "@/components/Icons/like.vue";

export default {
  name: "LikeAndCommentButtons",
  components: {
    CommentIcon,
    LikeIcon,
  },
  props: {
    feedItem: {
      required: true,
      type: FeedItemClass,
    },
    commentPressed: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    ...mapStores(useFeedStore),
    commentIcon() {
      if (this.commentPressed) return this.getImgUrl("CommentPressed");
      else return this.getImgUrl("CommentUnpressed");
    },
    likeIcon() {
      if (this.feedItem.userLiked) return this.getImgUrl("LikePressed");
      else return this.getImgUrl("LikeUnpressed");
    },
    dislikeIcon() {
      if (this.feedItem.userDisliked) return this.getImgUrl("DislikePressed");
      else return this.getImgUrl("DislikeUnpressed");
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/FeedImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    async rate(reaction) {
      await this.feedStore.rateFeedItem(this.feedItem.eventObjectID, reaction);
      this.$emit("fetchRatedUsersIfEnabled");
    },
    getIconColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");

      if (this.feedItem.userLiked) {
        return generalColorWhite;
      } else if (!this.feedItem.userLiked) {
        return generalContrast;
      } else {
        return generalContrast;
      }
    },
    getCommentColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");

      if (this.commentPressed) {
        return generalColorWhite;
      } else if (!this.commentPressed) {
        return generalContrast;
      } else {
        return generalContrast;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");

.likes_and_comments {
  display: flex;
  gap: 8px;
}

.comment_or_like_button {
  height: 32px;
  border-radius: 8px;
  background-color: var(--minorInfoSecondaryColor);
  padding: 0px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.comment_or_like_button.active {
  background-color: var(--generalBrand);
}

/* .like_or_comment_icon {
  margin-top: 8px;
  height: 16px;
  width: 16px;
} */

.like_or_comment_count {
  color: var(--generalContrast);
  font-family: "Roboto";
  font-weight: 500;
  font-size: 10px;
}
.like_or_comment_count.active {
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
