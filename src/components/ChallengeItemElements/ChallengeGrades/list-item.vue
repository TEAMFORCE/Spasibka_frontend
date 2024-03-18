<template>
  <div class="grades_list_item_wrapper">
    <div class="list_item_avatar_wrapper">
      <img
        @click="$router.push('/other_profile/' + itemData.user.id)"
        v-if="itemData.user.avatar"
        :src="itemAvatar"
        alt="user_avatar"
        class="list_item_avatar"
      />
      <div
        v-else
        class="no_avatar"
        @click="$router.push('/other_profile/' + itemData.user.id)"
      >
        <span>{{ getFirstLetter(itemData.user.name) }}</span>
        <span>{{ getFirstLetter(itemData.user.surname) }}</span>
        <span></span>
      </div>
      <div class="list_item_grade_icon_wrapper">
        <img
          :src="`${itemGradeType}`"
          alt="grade_icon"
          class="list_item_grade_icon"
        />
      </div>
    </div>
    <div class="list_item_name">
      <span class="list_item_name_value">{{ itemData.user.name }}</span>
      <span class="list_item_name_value">{{ itemData.user.surname }}</span>
    </div>
  </div>
</template>

<script>
import { LIKE_TYPES } from "@/constants/likeTypes";
import { SERVER_IP } from "@/constants/api";

export default {
  name: "ChallengeGradesListItem",
  props: {
    itemData: {
      type: Object,
      requred: true,
    },
  },
  computed: {
    itemAvatar() {
      return `${SERVER_IP}${this.itemData.user.avatar.replace(".", "_thumb.")}`;
    },
    itemGradeType() {
      if (this.itemData.type === LIKE_TYPES.like) {
        return this.getImgUrl("LikePressed");
      } else if (this.itemData.type === LIKE_TYPES.dislike) {
        return this.getImgUrl("DislikePressed");
      }
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/FeedImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getFirstLetter(word) {
      return word.substr(0, 1);
    },
  },
};
</script>

<style scoped>
.grades_list_item_wrapper {
  width: 182px;
  height: 36px;
  background-color: var(--minorInfoSecondaryColor);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  gap: 10px;
}
.list_item_avatar_wrapper {
  width: 36px;
  height: 36px;
  position: relative;
}
.list_item_avatar {
  object-fit: cover;
  width: 36px;
  height: 36px;
  border-radius: 100%;
}
.list_item_avatar:hover {
  cursor: pointer;
}
.no_avatar {
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background: linear-gradient(132.4deg, #f15929 -2.06%, #ffd699 111.97%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: var(--generalColorWhite);
}
.no_avatar:hover {
  cursor: pointer;
}
.list_item_grade_icon_wrapper {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: var(--minorSuccess);
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list_item_grade_icon {
  width: 8px;
}
.list_item_name {
  display: flex;
  flex-direction: column;
}
.list_item_name_value {
  font-family: "Roboto";
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
}
</style>