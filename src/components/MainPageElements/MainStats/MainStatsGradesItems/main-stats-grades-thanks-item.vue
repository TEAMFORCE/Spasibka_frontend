<template>
  <div class="grades_thanks_item_wrapper">
    <div class="grades_thanks_item_top">
      <div class="item_photo_wrapper">
        <img
          class="item_photo"
          :src="photoAddress(thanksData.transaction.recipient_photo)"
          alt="user_photo"
        />
      </div>
      <div class="item_info">
        <p class="info_name">
          {{
            `${thanksData.transaction.recipient_first_name} ${thanksData.transaction.recipient_surname}`
          }}
        </p>
        <p class="info_date">
          {{ getDisplayDate(thanksData.transaction.updated_at) }}
        </p>
        <p class="info_from_who">
          <span
            class="user_tg_name"
            @click="goToProfile(thanksData.transaction.recipient_id)"
          >
            @{{ thanksData.transaction.recipient_tg_name }}
          </span>
          {{ $t("feed.somebody_received") }}
          <span class="thanks_amount">
            {{
              `${thanksData.transaction.amount} ` +
              `${getNoun(thanksData.transaction.amount)}`
            }}
          </span>
          {{ $t("general.from") }}
          <span
            class="user_tg_name"
            @click="goToProfile(thanksData.transaction.sender_id)"
          >
            @{{ thanksData.transaction.sender_tg_name }}
          </span>
        </p>
        <div class="info_tags_wrapper">
          <p class="info_tag" v-for="tag in thanksData.transaction.tags">
            #{{ tag.name }}
          </p>
        </div>
      </div>
      <div class="item_buttons">
        <button class="item_button" @click.stop="getComments">
          <!-- <img class="button_icon" src="@/assets/comment.png" alt="" /> -->
          <CommentIcon :currentColor="getIconColor()" />
          <span class="button_value">{{ itemData.comments_amount }}</span>
        </button>
        <button
          :class="{ item_button_pressed: itemData.transaction.user_liked }"
          class="item_button"
          @click="likeTransaction"
        >
          <LikeIcon
            :currentColor="getIconColor(itemData.transaction.user_liked)"
          />

          <span v-if="!itemData.transaction.user_liked" class="button_value">{{
            thanksData.likes_amount
          }}</span>
          <span
            v-if="itemData.transaction.user_liked"
            class="button_value_white"
            >{{ thanksData.likes_amount }}</span
          >
        </button>
      </div>
    </div>
    <div class="grades_thanks_item_bottom" v-if="showCommentsBlock">
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

import { organizationSettingsStore } from "@/store/organization-settings";

import StatsGradesCommentsBlock from "@/components/MainPageElements/MainStats/MainStatsGradesItems/main-stats-grades-comments-block.vue";

import CommentIcon from "@/components/Icons/comment.vue";
import LikeIcon from "@/components/Icons/like.vue";

export default {
  name: "GradesThanksItem",
  components: {
    StatsGradesCommentsBlock,
    CommentIcon,
    LikeIcon,
  },
  props: {
    thanksData: {
      required: true,
    },
  },
  data() {
    return {
      itemData: this.thanksData,
      comments: null,
      showCommentsBlock: false,
      countOfComments: null,

      organizationSettings: organizationSettingsStore(),
    };
  },
  methods: {
    getNoun(number) {
      let n = Math.abs(number);
      n %= 100;
      if (n >= 5 && n <= 20) {
        return this.organizationSettings.settings.bonusname.RU.form4;
      }
      n %= 10;
      if (n === 1) {
        return this.organizationSettings.settings.bonusname.RU.form1;
      }
      if (n >= 2 && n <= 4) {
        return this.organizationSettings.settings.bonusname.RU.form5;
      }
      return this.organizationSettings.settings.bonusname.RU.form4;
    },
    async likeTransaction() {
      await axios
        .post(API_URIS.pressReaction, {
          like_kind: LIKE_TYPES.like,
          transaction_id: this.thanksData.event_object_id,
        })
        .then(() => {
          if (this.itemData.transaction.user_liked) {
            this.itemData.transaction.user_liked = false;
            this.getCommentsAndLikes();
          } else {
            this.itemData.transaction.user_liked = true;
            this.getCommentsAndLikes();
          }
        });
    },
    async getCommentsAndLikes() {
      let res = await axios.post(API_URIS.getLikesCommentsStatistics, {
        transaction_id: this.thanksData.event_object_id,
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
          transaction_id: this.thanksData.event_object_id,
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
          transaction_id: this.thanksData.event_object_id,
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
          transaction_id: this.thanksData.event_object_id,
        })
        .then(() => {
          this.getComments();
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
.grades_thanks_item_wrapper {
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
.grades_thanks_item_top {
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  position: relative;
}
.grades_thanks_item_bottom {
  width: 100%;
}
.item_photo_wrapper {
  min-width: 44px !important;
  min-height: 44px !important;
  max-width: 44px !important;
  max-height: 44px !important;
  overflow: hidden;
  border-radius: 100%;
}
.item_photo {
  min-width: 44px;
  width: 100%;
  height: 100%;
}
.item_info {
  margin: 0 0 0 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 62%;
}
.info_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin: 0;
  color: var(--generalContrast);
  text-align: left;
}
.info_date {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin: 0;
  color: var(--generalContrast);
  text-align: left;
}
.info_from_who {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin: 12px 0 0 0;
  color: var(--generalContrast);
  text-align: left;
}
.user_tg_name {
  color: var(--generalBrand);
  cursor: pointer;
}
.thanks_amount {
  color: var(--generalBrand);
}
.info_tags_wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0 0 0;
}
.info_tag {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: var(--generalBrand);
  border-radius: 100px;
  padding: 0px 8px;
  background-color: var(--secondaryColorBrand);
  margin: 0;
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
  .grades_thanks_item_wrapper {
    width: auto;
  }
}
@media (max-width: 1280px) {
  .grades_thanks_item_wrapper {
    width: auto;
  }
}
@media (max-width: 768px) {
  .grades_thanks_item_wrapper {
    width: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 72px;
  }
  .item_info {
    margin: 0;
    text-align: left;
    max-width: 100%;
  }
  .item_buttons {
    right: auto;
    bottom: -48px;
    left: 0px;
  }
}
</style>