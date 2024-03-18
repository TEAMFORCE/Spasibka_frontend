<template>
  <div class="event">
    <img
      v-if="feedItem.objectSelector === 'B'"
      class="birthday_icon"
      src="@/assets/FeedImages/BirthdayCheersIcon.svg"
    />
    <div class="transaction_basic_info" @click="openOrCloseAdditionalInfo">
      <div
        class="event_component_reason_and_like_buttons"
        v-if="feedItem.objectSelector !== 'P'"
      >
        <div class="event_component_and_reason">
          <EventTransaction
            v-if="feedItem.objectSelector == 'T'"
            :feedItem="feedItem"
            :selfUserID="selfUserID"
          />
          <EventChallengeCreation
            v-if="feedItem.objectSelector == 'Q'"
            :feedItem="feedItem"
            :selfUserID="selfUserID"
          />
          <EventChallengeWinner
            v-if="feedItem.objectSelector == 'R'"
            :feedItem="feedItem"
            :selfUserID="selfUserID"
          />
          <EventBirthday
            v-if="feedItem.objectSelector == 'B'"
            :feedItem="feedItem"
            :selfUserID="selfUserID"
          />

          <div
            class="transfer_reason"
            v-if="feedItem.reason && additionalInfoEnabled"
          >
            <!-- <EventTransactionText
              v-if="feedItem.objectSelector == 'T'"
              :selfUserID="selfUserID"
              :feedItem="feedItem"
            /> -->
            <div class="transaction_reason_header_and_text">
              <h1 class="transaction_text general-contrast-color">
                Сообщение:
              </h1>
              <h1 class="transaction_text general-contrast-color">
                {{ feedItem.reason }}
              </h1>
            </div>
          </div>
        </div>
        <div
          class="likes_and_comments_wrapper"
          v-if="
            feedItem.objectSelector !== 'P' &&
            feedItem.objectSelector !== 'B' &&
            (!additionalInfoEnabled || !commentsVisible) &&
            windowWidth > 550
          "
        >
          <LikeAndCommentButtons
            @fetchRatedUsersIfEnabled="fetchRatedUsersIfEnabled"
            :commentPressed="false"
            :feedItem="feedItem"
          />
        </div>
      </div>
      <!-- <EventTransactionText
        v-if="feedItem.objectSelector == 'T' && (!feedItem.reason || !additionalInfoEnabled)"
        :selfUserID="selfUserID"
        :feedItem="feedItem"
      /> -->
      <h1 class="event_text" v-html="feedItemText"></h1>
      <div
        v-if="feedItem.attachmentPhotos?.length > 0 && additionalInfoEnabled"
        class="added_photo_wrapper"
      >
        <button
          v-for="photo in feedItem.attachmentPhotos"
          @click.stop="increasePhotoSize(photo)"
        >
          <img class="added_photo" :src="photoAddress(photo)" />
        </button>
      </div>

      <div
        @click.stop="decreasePhotoSize"
        v-if="increasedPhotoEnabled"
        class="increased_photo_wrapper"
      >
        <img class="increased_photo" :src="photoAddress(selectedPhoto)" />
      </div>

      <div
        v-if="feedItem.attachmentSticker && additionalInfoEnabled"
        class="added_sticker_wrapper"
      >
        <h1 class="transaction_text general-contrast-color">Стикер:</h1>
        <img
          class="added_sticker"
          :src="photoAddress(feedItem.attachmentSticker)"
        />
      </div>

      <LikeAndCommentButtons
        v-if="
          (feedItem.objectSelector !== 'P' &&
            feedItem.objectSelector !== 'B' &&
            additionalInfoEnabled &&
            commentsVisible) ||
          windowWidth <= 550
        "
        :commentPressed="true"
        :feedItem="feedItem"
      />

      <div
        class="transaction_tags_wrapper"
        v-if="feedItem.transactionTags?.length > 0"
      >
        <div class="transaction_tag" v-for="item in feedItem.transactionTags">
          <h1 class="transaction_tag_text primary6-color">#{{ item.name }}</h1>
        </div>
      </div>
    </div>
    <div
      v-if="
        additionalInfoEnabled &&
        (commentsVisible || feedItem.likesCount > 0) &&
        feedItem.objectSelector !== 'P' &&
        feedItem.objectSelector !== 'B'
      "
      class="transaction_additional_info"
    >
      <Comments
        v-if="commentsVisible"
        :feedItem="feedItem"
        :commentsStore="commentsStore"
      />

      <RatedUsers
        v-if="!commentsVisible"
        :feedItem="feedItem"
        :ratedUsersStore="ratedUsersStore"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { SERVER_IP } from "@/constants/api";
import { FeedItem as FeedItemClass } from "../store/feed";
import { useStore as useCommentsStore } from "../store/comments";
import { useStore as useRatedUsersStore } from "../store/rated_users";
import { mapStores } from "pinia";

export default {
  name: "FeedItem",
  props: {
    feedItem: {
      required: true,
      type: FeedItemClass,
    },
    commentsVisible: {
      type: Boolean,
    },
    filtersChanged: {
      required: true,
    },
    selfUserID: {
      required: true,
    },
    windowWidth: {
      required: true,
    },
  },
  components: {
    EventTransaction: defineAsyncComponent(() =>
      import("./FeedElements/EventTransaction.vue")
    ),
    LikeAndCommentButtons: defineAsyncComponent(() =>
      import("./FeedElements/LikeAndCommentButtons.vue")
    ),
    Comments: defineAsyncComponent(() =>
      import("./FeedElements/EventChallengeComments.vue")
    ),
    RatedUsers: defineAsyncComponent(() =>
      import("./FeedElements/RatedUsers.vue")
    ),
    EventChallengeCreation: defineAsyncComponent(() =>
      import("./FeedElements/EventChallengeCreation.vue")
    ),
    EventChallengeWinner: defineAsyncComponent(() =>
      import("./FeedElements/EventChallengeWinner.vue")
    ),
    EventTransactionText: defineAsyncComponent(() =>
      import("./FeedElements/EventTransactionText.vue")
    ),
    EventBirthday: defineAsyncComponent(() =>
      import("./FeedElements/EventBirthday.vue")
    ),
  },
  data() {
    return {
      increasedPhotoEnabled: false,
      additionalInfoEnabled: false,
      selectedPhoto: null,
      commentInput: "",
      ratedUsersFilter: "all",
    };
  },
  watch: {
    filtersChanged: {
      handler(newValue) {
        this.additionalInfoEnabled = false;
      },
    },
    commentsVisible: {
      handler(newValue) {
        if (this.additionalInfoEnabled) {
          if (newValue) this.fetchComments();
          else this.fetchRatedUsers();
        }
      },
    },
  },
  computed: {
    ...mapStores(useCommentsStore),
    ...mapStores(useRatedUsersStore),
    feedItemText() {
      if (this.feedItem.text) {
        const inputStr = this.feedItem.text;
        var regex = /https?:\/\/[^\/]+(\/[^ ]*)/g;
        const replaced = inputStr.replace(regex, function (match) {
          var url = new URL(match);
          return url.pathname + url.search + url.hash;
        });
        return decodeURIComponent(replaced);
      } else {
        return this.feedItem.text;
      }
    },
  },
  methods: {
    increasePhotoSize(photo) {
      this.selectedPhoto = photo;
      this.increasedPhotoEnabled = true;
    },
    decreasePhotoSize() {
      this.increasedPhotoEnabled = false;
    },
    openOtherProfile(userID) {
      this.$router.push("/other_profile/" + userID);
    },
    contractedUserName(firstName, surname) {
      let result = "";
      if (firstName != null && firstName.length > 0)
        result += firstName.charAt(0);
      if (surname != null && surname.length > 0) result += surname.charAt(0);
      return result;
    },
    openOrCloseAdditionalInfo() {
      if (this.feedItem.objectSelector !== "P") {
        this.additionalInfoEnabled ^= true;
        if (this.additionalInfoEnabled) {
          this.$emit("enableAdditionalInfo");
          if (this.feedItem.objectSelector == "T") this.fetchAdditionalInfo();
          if (this.commentsVisible) this.fetchComments();
          else this.fetchRatedUsers();
        } else {
          this.$emit("disableAdditionalInfo");
          this.feedItem.setComments([]);
        }
      }
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getFeedImgUrl(imageName) {
      var images = require.context("@/assets/FeedImages/", false, /\.png$/);
      return images("./" + imageName + ".png");
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
    fetchRatedUsers(limit = 15) {
      this.ratedUsersStore.fetchRatedUsersForFeedItem(
        this.feedItem.eventObjectID,
        limit
      );
    },
    fetchRatedUsersIfEnabled() {
      if (this.additionalInfoEnabled && !this.commentsVisible)
        this.fetchRatedUsers();
    },
    setRatedUsersFilter(filterType) {
      this.ratedUsersFilter = filterType;
    },
    fetchComments() {
      this.commentsStore.fetchCommentsForFeedItem(this.feedItem.eventObjectID);
    },
    fetchAdditionalInfo() {
      this.feedItem.fetchAdditionalInfo();
    },
  },
};
</script>

<style scoped>
.event {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 24px;
  gap: 16px;
  background: #ffffff;
  box-shadow: 0px 8px 24px 2px rgba(74, 77, 69, 0.12);
  border-radius: 20px;
}
.birthday_icon {
  position: absolute;
  right: 0;
}
.event_component_reason_and_like_buttons {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
@media (max-width: 550px) {
  .event_component_reason_and_like_buttons {
    flex-direction: column;
  }
}
.event_component_and_reason {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.likes_and_comments_wrapper {
  right: 24px;
  top: 24px;
}
.transaction_basic_info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.transfer_reason {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.transaction_reason_header_and_text {
  display: flex;
  flex-direction: column;
}
.transaction_text {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  word-break: break-word;
}
.event_text {
  position: relative;
  z-index: 100;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
::v-deep(a) {
  color: var(--generalBrand);
  text-decoration: none;
  font-weight: 600;
}
.added_photo_wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.added_photo {
  height: 60px;
  width: 60px;
  object-fit: cover;
  border: 1px solid var(--generalContrast);
}
.added_sticker_wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 550px;
}
.added_sticker {
  border-radius: 12px;
  max-width: 288px;
  width: 100%;
  aspect-ratio: 9/16;
  height: 512px;
}
.increased_photo_wrapper {
  position: fixed;
  z-index: 3;
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
.transaction_tags_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.transaction_tag {
  border-radius: 100px;
  padding: 0px 8px;
  background-color: var(--secondaryColorBrand);
}
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Roboto&display=swap");
.transaction_tag_text {
  font-family: "Montserrat";
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  word-break: break-word;
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
button:focus {
  outline: none;
}
input:focus {
  outline: none;
}
</style>
