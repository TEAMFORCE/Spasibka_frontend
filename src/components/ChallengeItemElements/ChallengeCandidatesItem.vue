<template>
  <div class="challenge_candidates_item">
    <ChallengeCheckReport
      v-if="rejectReportFormEnabled"
      @sendReportCheckCancel="rejectReportFormEnabled = false"
      @refreshCandidates="$emit('refreshCandidates')"
      :reportID="challengeCandidate.report_id"
    />
    <div class="candidates_top_info_wrapper" @click="openOrCloseAdditionalInfo">
      <div class="candidates_top_info">
        <div class="report_info">
          <Avatar
            :type="'challenges'"
            :userID="challengeCandidate?.participant_id"
            :userName="challengeCandidate?.participant_name"
            :userSurname="challengeCandidate?.participant_surname"
            :userPhoto="challengeCandidate?.participant_photo"
          />
          <div class="candidate_name_and_time">
            <h1 class="candidate_name general-contrast-color">
              {{
                challengeCandidate?.participant_name +
                " " +
                challengeCandidate?.participant_surname
              }}
            </h1>
            <h1 class="report_time general-secondary-color">
              {{ getDisplayDate(challengeCandidate?.report_created_at) }}
            </h1>
          </div>
          <h1
            class="report_text general-contrast-color"
            v-html="reportWithLineBreaks"
          ></h1>
        </div>
        <img
          @click.stop="enableIncreasedPhoto"
          v-if="challengeCandidate?.report_photo"
          class="report_photo"
          :src="photoAddress(challengeCandidate.report_photo)"
        />
        <div
          @click.stop="disableIncreasedPhoto"
          v-if="increasedPhotoEnabled"
          class="increased_photo_wrapper"
        >
          <img
            class="increased_photo"
            :src="
              photoAddress(
                challengeCandidate.report_photo.replace('_thumb', '')
              )
            "
          />
        </div>
      </div>
      <div
        class="report_check_buttons"
        v-if="
          challengeData?.creator_id === selfUserID &&
          challengeData?.algorithm_name !== 'voting'
        "
      >
        <button
          class="report_check_button brand-secondary-bg"
          @click.stop="enableReportRejectionForm(challengeCandidate)"
        >
          <h1 class="report_check_button_text general-brand-color">
            {{ $t("challenges.candidates.reject") }}
          </h1>
        </button>
        <button
          class="report_check_button general-brand-bg"
          @click.stop="approveReport(challengeCandidate?.report_id)"
        >
          <h1 class="report_check_button_text general-white-color">
            {{ $t("challenges.candidates.accept") }}
          </h1>
        </button>
      </div>
      <ChallengeLikeAndCommentButtons
        :itemData="itemData"
        @itemLiked="itemLiked"
      />
    </div>
    <div v-if="additionalInfoEnabled" class="challenge_winner_additional_info">
      <ChallengeComments
        :comments="itemComments"
        :countOfComments="countOfLikesAndComments"
        @sendComment="sendComment"
        @showAllComments="showAllComments"
      />
    </div>
  </div>
</template>

<script>
import ChallengeLikeAndCommentButtons from "./ChallengeLikeAndCommentButtons.vue";
import ChallengeCheckReport from "./ChallengeCheckReport.vue";
import ChallengeComments from "./ChallengeComments.vue";
import Avatar from "@/widgets/Avatar.vue";
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import { LIKE_TYPES } from "@/constants/likeTypes";

import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

export default {
  name: "ChallengeCandidatesItem",
  components: {
    ChallengeLikeAndCommentButtons,
    ChallengeCheckReport,
    ChallengeComments,
    Avatar,
  },
  props: {
    challengeCandidate: {
      required: true,
    },
    challengeData: {
      required: true,
    },
  },
  data() {
    return {
      additionalInfoEnabled: false,
      itemComments: null,
      countOfLikesAndComments: null,
      itemData: this.challengeCandidate,
      rejectReportFormEnabled: false,
      increasedPhotoEnabled: false,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    reportWithLineBreaks() {
      return this.challengeCandidate?.report_text.replace(/\r\n/g, "<br>");
    },
    selfUserID() {
      return this.profileStore?.profileInfo?.id;
    },
  },
  methods: {
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
    enableReportRejectionForm(report) {
      this.currentReportID = report.report_id;
      this.rejectReportFormEnabled = true;
    },
    enableIncreasedPhoto() {
      this.increasedPhotoEnabled = true;
    },
    disableIncreasedPhoto() {
      this.increasedPhotoEnabled = false;
    },
    async approveReport(reportID) {
      try {
        await axios.put(API_URIS.checkChallengeReport + reportID + "/", {
          state: "W",
          text: "",
        });
        this.$emit("refreshCandidates");
      } catch (err) {
        throw err;
      }
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
  },
};
</script>

<style scoped>
.challenge_candidates_item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.candidates_top_info_wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.candidates_top_info {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
@media (max-width: 550px) {
  .candidates_top_info {
    flex-wrap: wrap;
  }
  .report_info {
    flex-wrap: wrap;
  }
}

.report_info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.candidate_photo {
  height: 44px;
  width: 44px;
  object-fit: cover;
  border-radius: 50%;
}
.candidate_name_and_time {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
}
.candidate_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
}
.report_time {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
}
.report_text {
  margin-left: 4px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: -0.28px;
  text-align: left;
}
.report_photo {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 16px;
}
.report_check_buttons {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 10;
}
.report_check_button {
  width: 187px;
  border-radius: 8px;
  padding: 8px 16px;
}
.report_check_button_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
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
