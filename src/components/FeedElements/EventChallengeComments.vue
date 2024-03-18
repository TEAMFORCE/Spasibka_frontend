<template>
  <div class="comments">
    <div class="comment" v-for="(item, index) in comments">
      <hr v-if="index > 0" class="comments_separator" />
      <div class="comment_content">
        <button
          v-if="profileStore?.profileInfo?.id === item.authorID"
          class="update_comment_button tooltip_container brand-secondary-bg"
          :data-tooltip="$t('comments.update_comment')"
          @click="editComment(item)"
        >
          <BrandingIcon />
        </button>
        <button
          v-if="item.canDelete"
          class="delete_comment_button tooltip_container brand-secondary-bg"
          @click="deleteComment(item)"
          :data-tooltip="$t('comments.delete_comment')"
        >
          <DeleteIcon />
        </button>
        <Avatar
          :type="'feed'"
          :userID="item.authorID"
          :userName="item.authorFirstName"
          :userSurname="item.authorLastName"
          :userPhoto="item.authorAvatar"
        />

        <div class="comment_text_and_like_dislike_buttons">
          <div class="comment_text">
            <h1
              @click="openOtherProfile(item.authorID)"
              class="comment_user_name general-contrast-color"
            >
              {{ item.authorFirstName }}
              {{ item.authorLastName }}
            </h1>
            <h1
              class="comment_reason general-contrast-color"
              v-html="commentReason(item.text)"
            ></h1>
            <h1 class="comment_time general-secondary-color">
              {{ getDisplayDate(item.createdAt, item.isEdited) }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="feedItem.comments.length < feedItem.commentsCount"
      class="show_next_comments_button"
      @click="fetchComments"
    >
      <h1 class="show_next_comments_text general-brand-color">
        {{ $t("comments.show_next_comments") }}
      </h1>
    </button>

    <div class="comment_input_wrapper">
      <div class="comment_left_side">
        <textarea
          class="comment_input_field general-contrast-color"
          :placeholder="$t('comments.send_message')"
          v-model="commentInput"
          @keydown.shift.enter="sendComment"
        />
      </div>

      <div class="comment_right_side">
        <button class="input_send_comment_button" @click="sendComment">
          <SendCommentIcon />
        </button>
      </div>
    </div>
    <BaseSmallPopup ref="commentEditPopup">
      <CommentEditForm
        :comment="currentComment"
        @cancelEditing="cancelEditing"
        @commentEdited="commentEdited"
      />
    </BaseSmallPopup>
  </div>
</template>


<script>
import { SERVER_IP, API_URIS } from "@/constants/api";
import Avatar from "@/widgets/Avatar.vue";

import DeleteIcon from "@/components/Icons/delete.vue";
import SendCommentIcon from "@/components/Icons/sendComment.vue";
import BrandingIcon from "@/components/Icons/branding.vue";
import BaseSmallPopup from "@/components/app/SmallPopup.vue";
import CommentEditForm from "@/widgets/CommentEditForm.vue";
import { notify } from "@/general-scripts/toast-notification";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";

export default {
  name: "Comments",
  components: {
    Avatar,
    DeleteIcon,
    SendCommentIcon,
    BrandingIcon,
    BaseSmallPopup,
    CommentEditForm,
  },
  props: {
    feedItem: {
      required: true,
    },
    commentsStore: {
      required: true,
    },
  },
  data() {
    return {
      commentInput: "",
      currentComment: "",
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    comments() {
      return this.feedItem.comments;
    },
  },
  methods: {
    cancelEditing() {
      this.$refs.commentEditPopup.close();
      this.currentComment = "item";
    },
    async editComment(item) {
      this.currentComment = item;
      setTimeout(() => {
        this.$refs.commentEditPopup.open();
      }, 100);
    },
    async commentEdited(commentText, commentId) {
      try {
        await axios.put(API_URIS.updateComment + commentId + "/", {
          text: commentText,
        });
        this.commentsStore.fetchCommentsForFeedItem(
          this.feedItem.eventObjectID,
          { clear: true }
        );
        this.cancelEditing();
        this.fetchComments();
        notify(this.$t("comments.edit_completed"), "success");
      } catch (error) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw error;
      }
    },
    async deleteComment(item) {
      try {
        await axios.delete(API_URIS.deleteComment + item.id + "/");
        this.commentsStore.fetchCommentsForFeedItem(
          this.feedItem.eventObjectID,
          { clear: true }
        );
        notify(this.$t("comments.comment_deleted"), "success");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    openOtherProfile(userID) {
      this.$router.push("/other_profile/" + userID);
    },
    commentReason(text) {
      let reason = text.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return reason.replace(/\r\n/g, "<br>");
    },
    contractedUserName(firstName, surname) {
      let result = "";
      if (firstName != null && firstName.length > 0)
        result += firstName.charAt(0);
      if (surname != null && surname.length > 0) result += surname.charAt(0);
      return result;
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
    getDisplayDate(data, isEdited) {
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
        minutes +
        (isEdited ? " (" + this.$t("comments.edited") + ")" : "")
      );
    },
    fetchComments() {
      this.commentsStore.fetchCommentsForFeedItem(this.feedItem.eventObjectID);
    },
    sendComment() {
      let isEmpty = true;
      for (let i = 0; i < this.commentInput.length; ++i) {
        if (this.commentInput.charAt(i) != " ") {
          isEmpty = false;
          break;
        }
      }
      if (!isEmpty) {
        this.commentsStore.commentFeedItem(
          this.feedItem.eventObjectID,
          this.commentInput
        );
        this.commentInput = "";
      }
    },
  },
};
</script>

<style scoped>
.comments {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.comments_separator {
  width: 100%;
  border-top: 1px solid rgba(206, 206, 206, 0.5);
  border-bottom: 0px;
  border-left: 0px;
  border-right: 0px;
}
.comment {
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.comment_content {
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}
.update_comment_button {
  height: 24px;
  width: 24px;
  padding: 6px;
  border-radius: 6px;
  position: absolute;
  right: 38px;
  top: 8px;
}
.delete_comment_button {
  height: 24px;
  width: 24px;
  padding: 6px;
  border-radius: 6px;
  position: absolute;
  right: 8px;
  top: 8px;
}
.comment_text_and_like_dislike_buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment_user_avatar {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
}

.comment_user_avatar_placeholder {
  height: 44px;
  width: 44px;

  background: linear-gradient(
    132.4deg,
    var(--generalBrand) -2.06%,
    var(--secondaryColorBrand) 111.97%
  );
  box-shadow: 0px 10px 20px rgba(var(--generalBrandRGB), 0.3);
  border-radius: 50%;

  display: flex;
  flex-direction: column;
  justify-content: center;
}
.comment_user_name_contracted_wrapper {
  display: flex;
  justify-content: center;
}
.comment_user_name_contracted {
  font-family: "SF Pro Text";
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}

.comment_text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.comment_user_name {
  font-family: "Roboto";
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
}
.comment_user_name:hover {
  cursor: pointer;
}
.comment_reason {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: left;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.comment_time {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
}

.comment_likes_and_dislikes {
  display: flex;
  gap: 4px;
}
.comment_like_or_dislike {
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  gap: 8px;
}
.comment_like_or_dislike_icon {
  height: 16px;
  width: 16px;
}
.comment_like_or_dislike_count {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;
}

.show_next_comments_button {
  padding: 0px;
  background-color: rgba(0, 0, 0, 0);
}
.show_next_comments_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  text-align: left;
}

.comment_input_wrapper {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  border-radius: 16px;
  border: 1px solid var(--generalContrast) !important;
  color: var(--generalContrast);
}

.comment_left_side {
  display: flex;
  width: 100%;
  gap: 16px;
}
.comment_right_side {
  display: flex;
  gap: 16px;
  margin: 0 0 0 10px;
}

.input_emoji_input_button {
  height: 18px;
  width: 18px;

  padding: 0px;
  background-color: rgba(0, 0, 0, 0);

  align-self: center;
}
.input_emoji_icon {
  height: 18px;
  width: 18px;
}

.comment_input_field {
  background-color: var(--generalColorWhite);
  border-style: none;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  flex-grow: 1;
  resize: none;
  height: 100px;
}
.comment_input_field::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  background: var(--secondaryColorBrand);
  border-radius: 50px;
}
.comment_input_field::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: var(--generalBrand);
  width: 8px;
  cursor: pointer !important;
}
.comment_input_field::placeholder {
  color: var(--generalColorSecondary) !important;
}

.input_attach_file_button {
  height: 18px;
  width: 18px;

  padding: 0px;
  background-color: rgba(0, 0, 0, 0);

  align-self: center;
}
.input_attach_file_icon {
  height: 18px;
  width: 18px;
}
.input_send_comment_button {
  height: 32px;
  width: 32px;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0);
}
.input_send_comment_icon {
  height: 32px;
  width: 32px;
}
button:focus {
  outline: none;
}
input:focus {
  outline: none;
}

@media (max-width: 600px) {
  .update_comment_button {
    top: 20px;
  }
  .delete_comment_button {
    top: 20px;
  }
}
</style>

