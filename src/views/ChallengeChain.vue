<template>
  <div
    class="challenge_item main-layout-page general-white-bg"
    v-scroll-end="handleScrollEnd"
  >
    <div
      @click.stop="disableIncreasedPhoto"
      v-if="increasedPhotoEnabled"
      class="increased_photo_wrapper"
    >
      <button
        class="switch_photos_button transparent-bg"
        @click.stop="proceedToPreviousPhoto"
      >
        <PrevPictureArrowIcon />
      </button>
      <img class="increased_photo" :src="currentImage" />
      <button
        class="switch_photos_button transparent-bg"
        @click.stop="proceedToNextPhoto"
      >
        <NextPictureArrowIcon />
      </button>
    </div>

    <div class="challenge_settings">
      <button
        class="back_to_challenges tooltip_container brand-secondary-bg"
        :data-tooltip="$t('challenges.back')"
        @click="
          $router.push({
            path: '/challenges',
            query: {
              filter: $route.query.active,
            },
          })
        "
      >
        <BackArrowIcon />
      </button>
      <div class="challenge_update_delete" v-if="showChallengeSettingsButton">
        <button
          class="challenge_button tooltip_container"
          :data-tooltip="$t('challenges.edit_chain')"
          v-if="!isClosed"
          @click="openChallengeUpdatePopup"
        >
          <BrandingIcon />
        </button>
        <button
          v-if="!isClosed && !hasParticipant"
          :data-tooltip="$t('challenges.delete_chain')"
          class="challenge_button tooltip_container"
          @click="openChallengeDeletePopup"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
    <div class="challenge_preview">
      <button
        @click="enableIncreasedPhoto"
        @wheel.stop.prevent="handleScroll"
        class="challenge_item_top_info brand-secondary-bg"
        :class="{ no_pointer_on_hover: !challengeCover }"
      >
        <img
          v-if="!challengeCover"
          class="default_pic"
          :src="getImgUrl('ChallengeDefaultPicture')"
        />
        <div
          v-else-if="challengeInfo?.photos?.length <= 1"
          class="picture_wrapper"
        >
          <img class="challenge_pic" :src="getImg(challengeCover)" />
        </div>
        <div v-else class="picture_wrapper">
          <img class="challenge_pic" :src="currentImage" />
        </div>
        <div v-if="challengeInfo?.photos?.length > 1" class="circles-container">
          <div
            v-for="(image, index) in challengeInfo?.photos"
            :key="index"
            class="circle general-white-bg"
            :class="{ active: index === currentImageIndex }"
            @click.stop="currentImageIndex = index"
          ></div>
        </div>
        <div class="name_and_stats">
          <h1
            class="challenge_name general-contrast-color"
            :class="{ 'general-white-color': challengeCover }"
          >
            {{ challengeInfo?.name }}
          </h1>

          <div class="challenge_info">
            <div v-for="info in infoTypes" class="challenge_particular_info">
              <h1
                class="info_number general-contrast-color"
                :class="{ 'general-white-color': challengeCover }"
              >
                {{ info.number }}
              </h1>
              <h1
                class="info_text general-contrast-color"
                :class="{ 'general-white-color': challengeCover }"
              >
                {{ info.name }}
              </h1>
            </div>
          </div>
        </div>
        <!-- <div class="organizator_and_status"> -->
        <button
          class="challenge_host general-white-bg"
          @click="$router.push('/other_profile/' + challengeInfo.author_id)"
        >
          <img
            class="challenge_host_photo"
            :src="photoAddress(challengeInfo?.creator_photo)"
          />
          <div class="challenge_host_info">
            <h1 class="challenge_host_text general-contrast-color">
              {{ $t("challenges.challenge_host") }}
            </h1>
            <h1 class="challenge_host_telegram general-brand-color">
              {{ challengeInfo?.author }}
            </h1>
          </div>
        </button>
        <div
          class="status"
          :class="{
            active: challengeInfo?.current_state === 'A',
            ended: challengeInfo?.current_state === 'F',
            upcoming: challengeInfo?.current_state === 'W',
          }"
        >
          {{ challengeStatus }}
        </div>
        <!-- </div> -->
      </button>
    </div>
    <button
      class="challenge_host_mobile relative general-white-bg"
      @click="$router.push('/other_profile/' + challengeInfo.author_id)"
    >
      <img
        class="challenge_host_photo"
        :src="photoAddress(challengeInfo?.creator_photo)"
      />
      <div class="challenge_host_info">
        <h1 class="challenge_host_text general-contrast-color">
          {{ $t("challenges.challenge_host") }}
        </h1>
        <h1 class="challenge_host_telegram general-brand-color">
          {{ challengeInfo?.author }}
        </h1>
      </div>
    </button>
    <div class="challenge_detail_modules">
      <button
        v-for="challengeDetailModule in challengeDetailModules"
        @click="challengeDetailModule.changeCurrentDetail"
        class="challenge_detail_button minor-info-secondary-bg"
        :class="{
          active: currentChallengeDetail == challengeDetailModule.header,
        }"
      >
        <h1
          class="challenge_detail_header general-contrast-color"
          :class="{
            active: currentChallengeDetail == challengeDetailModule.header,
          }"
        >
          {{ challengeDetailModule.header }}
        </h1>
      </button>
    </div>
    <ChallengeChainDetails
      v-if="currentChallengeDetail == detailsButton.header"
      :challengeDetails="challengeInfo"
      :isCreator="isCreator"
      @updateMyResult="updateResultAndChallengeInfo"
      @updateLikesAmount="getChallengeInfo"
    />
    <ChallengeChainChallenges
      v-if="currentChallengeDetail === challengesButton.header"
      :scrolledToBottom="scrolledToBottom"
    />
    <ChallengeChainParticipants
      v-if="currentChallengeDetail === participantsButton.header"
      :scrolledToBottom="scrolledToBottom"
    />
    <ChallengeMyResult
      v-if="currentChallengeDetail == myResultButton.header"
      :myResult="myResult"
    />
    <ChallengeWinners v-if="currentChallengeDetail == winnersButton.header" />
    <BaseSmallPopup ref="challengeUpdatePopup">
      <ChallengeChainUpdateCard
        :chainData="challengeInfo"
        @cancelChainUpdate="closeChallengeUpdatePopup"
        @updateChain="challengeUpdated"
      />
    </BaseSmallPopup>
    <BaseSmallPopup ref="challengeDeletePopup">
      <ChallengeChainDeleteCard
        @cancelChainDelete="closeChallengeDeletePopup"
        @deleteChain="deleteChallenge"
      />
    </BaseSmallPopup>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import { ROLE_TYPE } from "@/infrastructure/constants/role-type";
import { formatTimestamp } from "@/general-scripts/timestamps";

import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { organizationSettingsStore } from "@/store/organization-settings";
import { notify } from "@/general-scripts/toast-notification";
import PrevPictureArrowIcon from "@/components/Icons/MarketIcons/PrevPictureArrowIcon.vue";
import NextPictureArrowIcon from "@/components/Icons/MarketIcons/NextPictureArrowIcon.vue";

export default {
  name: "ChallengeChain",
  components: {
    ChallengeChainDetails: defineAsyncComponent(() =>
      import("@/components/ChallengeChainsElements/ChallengeChainDetails.vue")
    ),
    ChallengeChainChallenges: defineAsyncComponent(() =>
      import(
        "@/components/ChallengeChainsElements/ChallengeChainChallenges.vue"
      )
    ),
    ChallengeMyResult: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeMyResult.vue")
    ),
    ChallengeChainParticipants: defineAsyncComponent(() =>
      import(
        "@/components/ChallengeChainsElements/ChallengeChainParticipants.vue"
      )
    ),
    ChallengeWinners: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeWinners.vue")
    ),
    ChallengeGrades: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeGrades/index.vue")
    ),
    ChallengeChainUpdateCard: defineAsyncComponent(() =>
      import(
        "@/components/ChallengeChainsElements/ChallengeChainUpdateCard.vue"
      )
    ),
    ChallengeChainDeleteCard: defineAsyncComponent(() =>
      import(
        "@/components/ChallengeChainsElements/ChallengeChainDeleteCard.vue"
      )
    ),
    Comments: defineAsyncComponent(() => import("@/widgets/Comments.vue")),
    BackArrowIcon: defineAsyncComponent(() =>
      import("@/components/Icons/backArrow.vue")
    ),
    DeleteIcon: defineAsyncComponent(() =>
      import("@/components/Icons/delete.vue")
    ),
    BrandingIcon: defineAsyncComponent(() =>
      import("@/components/Icons/branding.vue")
    ),
    BaseSmallPopup: defineAsyncComponent(() =>
      import("@/components/app/SmallPopup.vue")
    ),
    PrevPictureArrowIcon,
    NextPictureArrowIcon,
  },
  directives: {
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler; // Store the handler on the element
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  data() {
    return {
      scrolledToBottom: false,

      currentImageIndex: 0,
      lastScrollTime: Date.now(),

      currentChainURL: null,

      isClosed: false,
      hasParticipant: false,
      increasedPhotoEnabled: false,
      myResult: null,
      challengeInfo: null,
      currentChallengeDetail: this.$t(
        "challenges.challenge_item_navigation.details"
      ),

      detailsButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.details"
          )),
        header: this.$t("challenges.challenge_item_navigation.details"),
      },
      challengesButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_chains.challenges"
          )),
        header: this.$t("challenges.challenge_chains.challenges"),
      },
      participantsButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_chains.challenge_chain_participants"
          )),
        header: this.$t(
          "challenges.challenge_chains.challenge_chain_participants"
        ),
      },
      winnersButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.winners"
          )),
        header: this.$t("challenges.challenge_item_navigation.winners"),
      },
      myResultButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.myResult"
          )),
        header: this.$t("challenges.challenge_item_navigation.myResult"),
      },
      gradesButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.grades"
          )),
        header: this.$t("challenges.challenge_item_navigation.grades"),
      },
      challengeCover: null,
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      if (this.profileStore?.profileInfo) {
        this.currentChainURL = API_URIS.challengeGroups.replace(
          "organization_id",
          this.profileStore?.profileInfo?.profile.organization_id
        );
        this.getChallengeInfo();
        // this.getMyResult();
      }
      return this.profileStore?.profileInfo;
    },
    challengeStatus() {
      if (this.challengeInfo?.current_state === "W")
        return this.$t("challenges.status_waiting");
      else if (this.challengeInfo?.current_state === "A")
        return this.$t("challenges.status_active");
      else if (this.challengeInfo?.current_state === "F")
        return this.$t("challenges.status_ended");
      else return "";
    },
    currentImage() {
      return this.getImg(this.challengeInfo?.photos[this.currentImageIndex]);
    },
    infoTypes() {
      return [
        {
          name: this.$t("challenges.challenge_chains.challenge_start_date"),
          number: this.challengeLastUpdated(this.challengeInfo?.start_at),
        },
        {
          name: this.$t("challenges.challenge_chains.challenge_end_date"),
          number: this.challengeLastUpdated(this.challengeInfo?.end_at),
        },
      ];
    },
    isCreator() {
      if (this.profileInfo?.id && this.challengeInfo?.author_id) {
        return this.profileInfo?.id === this.challengeInfo?.author_id;
      } else {
        return false;
      }
    },
    isAdmin() {
      if (this.profileInfo?.privileged.length > 0) {
        if (
          this.profileInfo.privileged.some((el) => el.role == ROLE_TYPE.admin)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },

    showChallengeSettingsButton() {
      if (this.isAdmin || this.isCreator) {
        return true;
      } else {
        return false;
      }
    },
    challengeDetailModules() {
      let challengeDetailModules = [];
      challengeDetailModules.push(this.detailsButton);
      challengeDetailModules.push(this.challengesButton);
      challengeDetailModules.push(this.participantsButton);
      return challengeDetailModules;
    },
  },
  watch: {
    isCreator: {
      handler(newVal) {
        if (newVal) this.currentChallengeDetail = "Участники";
      },
      immediate: true,
    },
    challengeInfo: {
      handler() {
        if (
          this.challengeInfo?.photo ||
          this.challengeInfo?.photos?.length > 0
        ) {
          this.challengeCover =
            this.challengeInfo?.photo || this.challengeInfo?.photos[0];
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleScrollEnd() {
      this.scrolledToBottom ^= true;
    },
    proceedToNextPhoto() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.challengeInfo?.photos.length;
    },
    proceedToPreviousPhoto() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.challengeInfo?.photos.length) %
        this.challengeInfo?.photos.length;
    },
    handleScroll(event) {
      const now = Date.now();
      if (now - this.lastScrollTime < 500) return; // Debounce for 200ms
      this.lastScrollTime = now;
      if (this.challengeInfo?.photos) {
        if (event.deltaY > 0) {
          // Scrolling down
          this.proceedToNextPhoto();
        } else {
          // Scrolling up
          this.proceedToPreviousPhoto();
        }
      }
    },
    challengeLastUpdated(date) {
      let formattedTime = formatTimestamp(date);

      let day = formattedTime.day;
      if (day < 10) day = "0" + day;
      let month = formattedTime.month + 1;
      if (month < 10) month = "0" + month;
      let year = formattedTime.year;

      return day + "." + month + "." + year;
    },
    challengeUpdated() {
      this.$refs.challengeUpdatePopup.close();
      this.getChallengeInfo();
    },
    openChallengeUpdatePopup() {
      this.$refs.challengeUpdatePopup.open();
    },
    closeChallengeUpdatePopup() {
      this.$refs.challengeUpdatePopup.close();
    },
    openChallengeDeletePopup() {
      this.$refs.challengeDeletePopup.open();
    },
    closeChallengeDeletePopup() {
      this.$refs.challengeDeletePopup.close();
    },
    async deleteChallenge() {
      try {
        let response = await axios.delete(
          API_URIS.challengeGroups.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ) + this.$route.params.id
        );
        notify(this.$t("challenges.challenge_chains.chain_deleted"), "success");
        this.closeChallengeDeletePopup();
        this.$router.push("/challenge_chains");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        this.closeChallengeDeletePopup();
        throw err;
      }
    },
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/ChallengeDetailsImages/",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    getImg(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
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
    enableIncreasedPhoto() {
      if (this.challengeCover) this.increasedPhotoEnabled = true;
    },
    disableIncreasedPhoto() {
      this.increasedPhotoEnabled = false;
    },
    updateResultAndChallengeInfo() {
      this.getChallengeInfo();
      this.getMyResult();
    },
    async getChallengeInfo() {
      try {
        const response = await axios.get(
          this.currentChainURL + this.$route.params.id
        );
        this.challengeInfo = response.data;
        if (response.data.current_state === "C") {
          this.isClosed = true;
        }
        if (response.data.contenders_total > 0) {
          this.hasParticipant = true;
        }
      } catch (err) {
        throw err;
      }
    },
    async getMyResult() {
      try {
        const response = await axios.get(
          API_URIS.challengeResult + this.$route.params.id + "/"
        );
        this.myResult = response.data;
      } catch (err) {
        this.myResult = err.response.data;
        throw err;
      }
    },
  },
  mounted() {
    // this.getChallengeInfo();
    // this.getMyResult();
    if (this.$route.query.showWinners)
      this.currentChallengeDetail = "Победители";
  },
};
</script>

<style scoped>
.challenge_item {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.challenge_item::-webkit-scrollbar {
  width: 8px;
}
.challenge_item::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}

.increased_photo_wrapper {
  position: fixed;
  z-index: 100;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  gap: 20px;
}
.switch_photos_button {
  height: 50px;
  align-self: center;
}
.increased_photo {
  position: relative;
  max-width: 80%;
  max-height: 80%;
  margin-top: auto;
  margin-bottom: auto;
  object-fit: cover;
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.challenge_settings {
  display: flex;
  justify-content: space-between;
}
.challenge_update_delete {
  display: flex;
  gap: 12px;
}
.challenge_button {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  padding: 7px;
  background-color: var(--secondaryColorBrand);
}

.back_to_challenges {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 7px;
  padding: 7px;
  background-color: var(--secondaryColorBrand);
}
.back_arrow_icon {
  height: 12px;
}

.challenge_preview {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.challenge_item_top_info {
  position: relative;
  border-radius: 20px;
  padding: 16px 16px 16px 32px;
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  /* overflow: hidden; */
}
.challenge_item_top_info.no_pointer_on_hover {
  cursor: default;
}
.picture_wrapper {
  position: absolute;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  filter: brightness(60%);
}

.default_pic {
  position: absolute;
  left: 50%;
  top: 0px;
  height: 100%;
}
.challenge_pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.circles-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10px; /* Adjust this value to position the circles from the bottom */
  left: 50%;
  transform: translateX(-50%);
}

.circle {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 4px;
}

.circle.active {
  background-color: var(--generalBrand); /* Active color */
}

@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.name_and_stats {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-top: 32px;
  z-index: 3;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
}
.challenge_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}
.challenge_info {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}
.challenge_particular_info {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  /* width: min-content; */
}
.info_number {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  text-align: left;
}
.info_text {
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  /* width: min-content; */
  /* white-space: nowrap; */
}

/* .organizator_and_status {
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  gap: 20px;
} */
.challenge_host {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 12px;
  height: 76px;
}
.challenge_host_mobile {
  display: none;
  position: relative;
  z-index: 3;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  padding: 12px;
  gap: 12px;
  height: 76px;
  margin-top: -12px;
}
@media (max-width: 800px) {
  .challenge_host {
    display: none;
  }
  .challenge_host_mobile {
    display: flex;
  }
  .status {
    top: 12px;
  }
}
.challenge_host_photo {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
}
.challenge_host_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.challenge_host_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
}
.challenge_host_telegram {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
}
.status {
  z-index: 3;
  position: absolute;
  bottom: 12px;
  right: 12px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 8px;
  padding: 2px 8px;
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.status.active {
  color: var(--minorInfoSecondaryColor);
  background-color: var(--minorInfo);
}
.status.ended {
  color: var(--minorInfoSecondaryColor);
  background-color: var(--generalColorSecondary);
}
.status.upcoming {
  background-color: var(--generalColorGrey);
  color: var(--generalContrast);
}

.challenge_detail_modules {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.challenge_detail_button {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 14px;
}
.challenge_detail_button.active {
  background-color: var(--generalBrand);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.challenge_detail_header {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.challenge_detail_header.active {
  color: var(--generalColorWhite);
}
</style>
