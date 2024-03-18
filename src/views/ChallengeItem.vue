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
              scrollToID: $route.params.id,
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
          v-if="!isClosed"
          @click="openChallengeUpdatePopup"
          :data-tooltip="$t('challenges.edit_challenge')"
        >
          <BrandingIcon />
        </button>
        <button
          v-if="!isClosed && !hasParticipant"
          class="challenge_button tooltip_container"
          @click="openChallengeDeletePopup"
          :data-tooltip="$t('challenges.delete_challenge')"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
    <div
      class="challenge_unavailable general-grey-bg"
      v-if="dependenciesNotDone"
    >
      <LockIcon />
      <div class="banner_text">
        <h1 class="banner_header general-white-color">
          {{ challengeUnavailableBannerHeader }}
        </h1>
        <h1 class="banner_description general-white-color">
          {{ challengeUnavailableBannerDescription }}
        </h1>
      </div>
    </div>
    <div class="challenge_preview">
      <button
        @click="enableIncreasedPhoto"
        @wheel.stop.prevent="handleScroll"
        class="challenge_item_top_info brand-secondary-bg"
        :class="{ no_pointer_on_hover: !challengeCover }"
      >
        <!-- <ChallengeDefaultCoverIcon v-if="!challengeCover" class="default_pic" /> -->
        <div
          v-if="!challengeCover && challengeInfo"
          class="no_cover"
          :style="{ background: getCoverColor() }"
        >
          <img :src="getDefaultCoverUrl()" class="no_cover_img" />
        </div>
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
            :class="{
              'general-white-color': challengeCover,
              narrow: !challengeCover,
            }"
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
          @click="$router.push('/other_profile/' + challengeInfo.creator_id)"
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
              {{ creatorInfo }}
            </h1>
          </div>
        </button>
        <div class="chain_and_icon">
          <button
            v-if="challengeInfo?.chains?.length"
            @click="goToChallengeChain"
            class="challenge_chain_icon_wrapper tooltip_container"
            :data-tooltip="`${$t('challenges.challenge_in_chain')} “${challengeInfo?.chains[0].chain_name}”`"
          >
            <ChallengeChainIcon
              class="challenge_chain_icon"
            />
          </button>
          <div class="challenge_status minor-info-bg">
            <h1 class="challenge_status_text general-white-color">
              {{ challengeInfo?.active ? "Активен" : "Завершен" }}
            </h1>
          </div>
        </div>
        <!-- </div> -->
      </button>
    </div>
    <button
      class="challenge_host_mobile general-white-bg"
      @click="$router.push('/other_profile/' + challengeInfo.creator_id)"
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
          {{ creatorInfo }}
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
    <ChallengeDetails
      v-if="currentChallengeDetail == detailsButton.header"
      :challengeDetails="challengeInfo"
      :isCreator="isCreator"
      @goToWinners="goToWinners"
      @updateMyResult="updateResultAndChallengeInfo"
      @updateLikesAmount="getChallengeInfo"
      @goToChallengeGrades="goToChallengeGrades"
    />
    <Comments
      v-if="currentChallengeDetail == commentsButton.header"
      :challengeDetails="challengeInfo"
      @updateCommentsAmount="getChallengeInfo"
    />
    <ChallengeGrades
      v-if="currentChallengeDetail == gradesButton.header"
      :challengeData="challengeInfo"
    />
    <ChallengeCandidates
      v-if="currentChallengeDetail == candidatesButton.header"
      :selfUserID="profileInfo?.profile.id"
      :challengeData="challengeInfo"
    />
    <ChallengeMyResult
      v-if="currentChallengeDetail == myResultButton.header"
      :myResult="myResult"
    />
    <ChallengeWinners v-if="currentChallengeDetail == winnersButton.header" />
    <ChallengeChallenges
      v-if="currentChallengeDetail == challengesButton.header"
      :scrolledToBottom="scrolledToBottom"
    />
    <BaseSmallPopup ref="challengeUpdatePopup">
      <ChallengeUpdateCard
        v-show="challengeUpdateWindow === 'main'"
        :challengeData="challengeInfo"
        :challengeGroupsList="challengeGroupsList"
        :challengesList="curDependencies"
        :chainSteps="chainSteps"
        @challengeNameChanged="challengeNameChanged"
        @cancel="closeChallengeUpdatePopup"
        @challengeUpdated="challengeUpdated"
        @challengeUpdationError="closeChallengeUpdatePopup"
        @goToGroupsLinking="goToGroupsLinking"
        @goToDependenciesLinking="goToDependenciesLinking"
      />
      <AssignChains
        v-if="challengeUpdateWindow === 'chains'"
        :selectedChains="challengeGroupsList"
        :isLoading="chainsIsLoading"
        :stopFetching="chainsStopFetching"
        @goToMainInfo="goToMainInfo"
        @selectChains="selectChains"
        @getChains="getChainsList"
      />
      <LinkDependencies
        v-if="challengeUpdateWindow === 'dependencies'"
        :selectedChallenges="challengesList"
        :isLoading="dependenciesIsLoading"
        :stopFetching="dependenciesStopFetching"
        :curDependencies="curDependencies"
        :chainSteps="chainSteps"
        :curChallengeID="challengeInfo?.id"
        @goToMainInfo="goToMainInfoFromChallenges"
        @selectChallenges="selectChallenges"
        @getDependencies="getChallengesList"
      />
    </BaseSmallPopup>
    <BaseSmallPopup ref="challengeDeletePopup">
      <ChallengeDeleteCard
        @cancel="closeChallengeDeletePopup"
        @deleteChallenge="deleteChallenge"
      />
    </BaseSmallPopup>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import { ROLE_TYPE } from "@/infrastructure/constants/role-type";
import { CHALLENGE_CONDITIONS } from "@/infrastructure/constants/challenge-conditions";
import { CHALLENGE_CONDITION } from "@/infrastructure/data-sources/challenge-condition";

import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { organizationSettingsStore } from "@/store/organization-settings";
import NextPictureArrowIcon from "@/components/Icons/MarketIcons/NextPictureArrowIcon.vue";
import PrevPictureArrowIcon from "@/components/Icons/MarketIcons/PrevPictureArrowIcon.vue";
import ChallengeDefaultCoverIcon from "@/components/Icons/ChallengesIcons/ChallengeDefaultCoverIcon.vue";
import { notify } from "@/general-scripts/toast-notification";
import ChallengeChainIcon from "@/components/Icons/ChallengesIcons/ChallengeChainIcon.vue";

export default {
  name: "ChallengeItem",
  components: {
    ChallengeDetails: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeDetails.vue")
    ),
    ChallengeMyResult: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeMyResult.vue")
    ),
    ChallengeCandidates: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeCandidates.vue")
    ),
    ChallengeWinners: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeWinners.vue")
    ),
    ChallengeGrades: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeGrades/index.vue")
    ),
    ChallengeUpdateCard: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeUpdateCard.vue")
    ),
    ChallengeDeleteCard: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeDeleteCard.vue")
    ),
    ChallengeChallenges: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/ChallengeChallenges.vue")
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
    AssignChains: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/AssignChains.vue")
    ),
    LinkDependencies: defineAsyncComponent(() =>
      import("@/components/ChallengeItemElements/LinkDependencies.vue")
    ),
    LockIcon: defineAsyncComponent(() =>
      import("@/components/Icons/ChallengesIcons/LockIcon.vue")
    ),
    ChallengeDefaultCoverIcon,
    NextPictureArrowIcon,
    PrevPictureArrowIcon,
    ChallengeChainIcon
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

      dependenciesOffset: 1,
      dependenciesLimit: 20,
      dependenciesIsLoading: false,
      dependenciesStopFetching: false,

      chainsOffset: 1,
      chainsLimit: 20,
      chainsIsLoading: false,
      chainsStopFetching: false,

      currentImageIndex: 0,
      lastScrollTime: Date.now(),

      challengeUpdateOpened: false,
      isClosed: false,
      hasParticipant: false,
      increasedPhotoEnabled: false,
      myResult: null,
      challengeInfo: null,
      currentChallengeDetail: this.$t(
        "challenges.challenge_item_navigation.details"
      ),
      challengeUpdateWindow: "main",
      challengeGroupsList: [],
      challengesList: [],

      curDependencies: [],

      chainChallenges: [],
      chainSteps: [],
      currentChallengeName: "",

      detailsButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.details"
          )),
        header: this.$t("challenges.challenge_item_navigation.details"),
      },
      commentsButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.comments"
          )),
        header: this.$t("challenges.challenge_item_navigation.comments"),
      },
      candidatesButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.candidates"
          )),
        header: this.$t("challenges.challenge_item_navigation.candidates"),
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
      challengesButton: {
        changeCurrentDetail: () =>
          (this.currentChallengeDetail = this.$t(
            "challenges.challenge_item_navigation.challenges"
          )),
        header: this.$t("challenges.challenge_item_navigation.challenges"),
      },
      challengeCover: null,
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    currentImage() {
      return this.getImg(this.challengeInfo?.photos[this.currentImageIndex]);
    },
    infoTypes() {
      let currentTypes = [
        {
          name: this.$t("challenges.winners_amount"),
          number: this.challengeInfo?.winners_count,
        },
        {
          name:
            this.$t("challenges.prize_fund_amount") +
            " " +
            this.organizationSettings.settings.bonusname.RU.form4,
          number: this.challengeInfo?.fund,
        },
        {
          name: this.$t("challenges.prize_place_amount"),
          number: this.challengeInfo?.awardees,
        },
      ];
      return currentTypes;
    },
    isActive() {
      if (this.challengeInfo) {
        return (
          this.challengeInfo?.challenge_condition ===
          CHALLENGE_CONDITIONS.active
        );
      } else return false;
    },
    dependenciesNotDone() {
      if (
        !this.isCreator &&
        this.isActive &&
        ((this.challengeInfo?.multiple_reports &&
          this.challengeInfo?.status == "Отчёт отправлен") ||
          this.challengeInfo?.status == "Можно отправить отчёт") &&
        !this.challengeInfo?.is_available
      ) {
        return true;
      } else return false;
    },
    challengeUnavailableBannerHeader() {
      return this.$t("challenges.unavailable_for_report_submission");
    },
    challengeUnavailableBannerDescription() {
      let text = this.$t("challenges.need_to_finish_challenges") + ":";
      for (let i = 0; i < this.challengeInfo?.dependencies?.length; ++i) {
        let curDependency = this.challengeInfo.dependencies[i];
        if (i === 0) text += ` "${curDependency.dependency_name}"`;
        else text += `, "${curDependency.dependency_name}"`;
      }
      return text;
    },
    isCreator() {
      if (this.profileInfo?.id && this.challengeInfo?.creator_id) {
        return this.profileInfo?.id === this.challengeInfo?.creator_id;
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
    creatorInfo() {
      let displayName = "";
      displayName += (this.challengeInfo?.creator_surname || "") + " ";
      displayName += this.challengeInfo?.creator_name || "";
      if (displayName.trim() === "") return this.challengeInfo?.creator_tg_name;
      return displayName;
    },
    challengeDetailModules() {
      let challengeDetailModules = [];
      challengeDetailModules.push(this.detailsButton);
      challengeDetailModules.push(this.commentsButton);
      challengeDetailModules.push(this.gradesButton);
      if (
        this.isCreator ||
        this.challengeInfo?.algorithm_name == "voting" ||
        this.challengeInfo?.show_contenders
      ) {
        challengeDetailModules.push(this.candidatesButton);
      }
      challengeDetailModules.push(this.winnersButton);
      if (this.myResult && this.myResult.status != "not found") {
        challengeDetailModules.push(this.myResultButton);
      }
      if (this.challengeInfo?.dependencies?.length) {
        challengeDetailModules.push(this.challengesButton);
      }
      return challengeDetailModules;
    },
  },
  watch: {
    "profileStore.profileInfo.profile.organization_id": {
      handler(newVal) {
        if (newVal) {
          this.getChainsList();
        }
      },
    },
    "$route.params.id": {
      handler(newVal) {
        if (newVal) {
          window.location.reload();
        }
      },
      flush: "post",
    },
    challengeGroupsList: {
      handler(newVal) {
        if (newVal) {
          let chainID = 0;
          for (let i = 0; i < newVal.length; ++i) {
            if (newVal[i].selected) {
              chainID = newVal[i].id;
              break;
            }
          }
          if (chainID > 0) {
            this.getChainSteps(chainID);
          }
        }
      },
      flush: "post",
      immediate: true,
      deep: true,
    },
    challengeUpdateOpened: {
      handler(newVal) {
        if (newVal) {
          this.curDependencies = this.challengeInfo?.dependencies;
        }
      },
    },
    challengeUpdateWindow: {
      handler(newVal) {
        if (newVal === "dependencies") {
          this.challengesList = [];
          this.dependenciesIsLoading = false;
          this.dependenciesStopFetching = false;
          this.dependenciesOffset = 1;
          this.getChallengesList();
        }
      },
    },
    isCreator: {
      handler(newVal) {
        if (newVal) this.currentChallengeDetail = "Кандидаты";
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
    challengeCover() {
      this;
    },
  },
  methods: {
    goToChallengeChain() {
      this.$router.push("/challenge_chain/" + this.challengeInfo?.chains[0].chain_id)
    },
    goToChallengeGrades() {
      this.currentChallengeDetail = this.gradesButton.header;
    },
    reduceNumber(num) {
      while (num >= 10) {
        num = this.digSumm(num);
      }
      return (num % 5) + 1;
    },
    digSumm(num) {
      let summ = 0;
      while (num !== 0) {
        summ += num % 10;
        num = Math.floor(num / 10);
      }
      return summ;
    },
    getDefaultCoverUrl() {
      var images = require.context(
        "@/assets/svgIcons/challengeIcons/",
        false,
        /\.svg$/
      );
      return images(
        "./" +
          `${"challengeSmall"}${this.reduceNumber(this.challengeInfo?.id)}` +
          ".svg"
      );
    },
    getCoverColor() {
      let numberOfCover = this.reduceNumber(this.challengeInfo?.id);
      if (numberOfCover == 1 || numberOfCover == 3 || numberOfCover == 4) {
        return "#FFF0D9";
      } else if (numberOfCover == 2) {
        return "linear-gradient(135deg, rgba(151,69,255,0.5) 5%, rgba(245,174,76,0.5018382352941176) 95%)";
      } else if (numberOfCover == 5) {
        return "linear-gradient(135deg, rgba(146,196,242,1) 5%, rgba(201,231,255,1) 95%)";
      }
    },
    challengeNameChanged(challengeName) {
      this.currentChallengeName = challengeName;
      for (let i = 0; i < this.chainSteps.length; ++i) {
        let nameChanged = false;
        for (let j = 0; j < this.chainSteps[i].items.length; ++j) {
          if (this.chainSteps[i].items[j].id === this.challengeInfo.id) {
            this.chainSteps[i].items[j].name = challengeName;
            nameChanged = true;
            break;
          }
        }
        if (nameChanged) break;
      }
    },
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

      if (this.challengeInfo.photos) {
        if (event.deltaY > 0) {
          // Scrolling down
          this.proceedToNextPhoto();
        } else {
          // Scrolling up
          this.proceedToPreviousPhoto();
        }
      }
    },
    autofillChains() {
      for (let i = 0; i < this.challengeInfo?.groups.length; ++i) {
        let curGroup = this.challengeInfo.groups[i].group_id;
        for (let j = 0; j < this.challengeGroupsList?.length; ++j) {
          if (this.challengeGroupsList[j].id === curGroup) {
            this.challengeGroupsList[j].selected = true;
            break;
          }
        }
      }
    },
    async getChainsList() {
      try {
        this.chainsIsLoading = true;
        let params = {
          offset: this.chainsOffset,
          limit: this.chainsLimit,
        };
        const response = await axios.get(
          API_URIS.challengeGroups.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ),
          {
            params,
          }
        );
        this.challengeGroupsList.push(...response.data.data);
        this.autofillChains();
        if (response.data.data.length < this.chainsLimit) {
          this.chainsStopFetching = true;
        }
        this.chainsOffset++;
        this.chainsIsLoading = false;
      } catch (err) {
        this.chainsIsLoading = false;
        throw err;
      }
    },
    async getChallengesList() {
      try {
        this.dependenciesIsLoading = true;
        let groupID = -1;
        for (let i = 0; i < this.challengeGroupsList?.length; ++i) {
          let curGroup = this.challengeGroupsList[i];
          if (curGroup.selected) {
            groupID = curGroup.id;
            break;
          }
        }
        if (groupID === -1) return;
        let params = {
          offset: this.dependenciesOffset,
          limit: this.dependenciesLimit,
          group_id: groupID,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        this.challengesList.push(...response.data.data);
        if (response.data.data.length < this.dependenciesLimit) {
          this.dependenciesStopFetching = true;
        }
        this.dependenciesOffset++;
        this.dependenciesIsLoading = false;
      } catch (err) {
        this.dependenciesIsLoading = false;
        throw err;
      }
    },
    async getChainSteps(chainID) {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          group_id: chainID,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        this.chainChallenges = response.data.data;
        this.assignSteps();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    assignSteps() {
      this.chainSteps = [];
      let challenges = this.chainChallenges;
      let maxStep = 0;
      let isChallengeInChain = false;
      for (let i = 0; i < challenges.length; ++i) {
        let curItem = challenges[i];
        maxStep = Math.max(curItem.step, maxStep);
        if (curItem.id === this.challengeInfo.id) {
          isChallengeInChain = true;
        }
      }
      if (maxStep === 0) maxStep++;
      for (let i = 0; i < maxStep; ++i) {
        this.chainSteps.push({
          title: this.$t("challenges.create_challenge.step") + " " + (i + 1),
          items: [],
        });
      }
      for (let i = 0; i < challenges.length; ++i) {
        let curStep = challenges[i].step;
        if (curStep > 0) curStep--;
        if (challenges[i].id === this.challengeInfo.id) {
          challenges[i].name = this.currentChallengeName;
        }
        this.chainSteps[curStep].items.push(challenges[i]);
      }
      if (!isChallengeInChain) {
        this.chainSteps[0].items.push({
          id: this.challengeInfo.id,
          name: this.currentChallengeName,
        });
      }
    },
    selectChains(newChains) {
      this.challengeGroupsList = JSON.parse(JSON.stringify(newChains));
      this.challengeUpdateWindow = "main";
    },
    goToMainInfo(newChains) {
      this.challengeGroupsList = JSON.parse(JSON.stringify(newChains));
      this.challengeUpdateWindow = "main";
    },
    selectChallenges(newChallenges) {
      this.curDependencies = [];
      for (let i = 0; i < newChallenges?.length; ++i) {
        let curChallenge = newChallenges[i];
        if (curChallenge.selected) {
          this.curDependencies.push({
            dependency_id: curChallenge.id,
            dependency_name: curChallenge.name,
          });
        }
      }
      this.challengeUpdateWindow = "main";
    },
    goToMainInfoFromChallenges() {
      this.challengeUpdateWindow = "main";
    },
    goToGroupsLinking() {
      this.challengeUpdateWindow = "chains";
    },
    goToDependenciesLinking() {
      this.challengeUpdateWindow = "dependencies";
    },
    challengeUpdated() {
      this.$refs.challengeUpdatePopup.close();
      this.challengeUpdateOpened = false;
    },
    openChallengeUpdatePopup() {
      this.$refs.challengeUpdatePopup.open();
      this.challengeUpdateOpened = true;
    },
    closeChallengeUpdatePopup() {
      this.$refs.challengeUpdatePopup.close();
      this.challengeUpdateOpened = false;
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
          `${API_URIS.challengesUpdate}${this.$route.params.id}/`
        );
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          this.$moshaToast(
            {
              title: this.$t("challenges.challenge_delete.challenge_deleted"),
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
          this.closeChallengeDeletePopup();
          this.$router.push("/challenges");
        }
      } catch (error) {
        this.$moshaToast(
          {
            title: this.$t(
              "challenges.challenge_delete.challenge_deletion_error"
            ),
          },
          {
            position: "bottom-right",
            timeout: 3000,
            transition: "slide",
            type: "danger",
          }
        );
        this.closeChallengeDeletePopup();
        throw error;
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
    goToWinners() {
      this.currentChallengeDetail = this.winnersButton.header;
    },
    updateResultAndChallengeInfo() {
      this.getChallengeInfo();
      this.getMyResult();
    },
    async getChallengeInfo() {
      try {
        const response = await axios.get(
          API_URIS.challengesUpdate + this.$route.params.id + "/"
        );
        this.challengeInfo = response.data;

        if (response.data.completed) {
          this.isClosed = true;
        }
        if (response.data.participants_total > 0) {
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
    this.getChallengeInfo();
    this.getMyResult();
    if (this.profileInfo?.profile?.organization_id) this.getChainsList();
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
  z-index: 105;
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
.challenge_unavailable {
  padding: 21px 26px;
  box-sizing: border-box;
  border-radius: 20px;
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}
.banner_text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.banner_header {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
}
.banner_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
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
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.challenge_item_top_info.no_pointer_on_hover {
  cursor: default;
}
.no_cover {
  position: absolute;
  border-radius: 20px;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.no_cover_img {
  width: 100%;
  height: 100%;
  max-width: 176px;
  position: absolute;
  right: 17%;
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
  right: 100px;
  top: 0px;
  height: 100%;
  background-color: red;
}
@media (max-width: 1600px) {
  .no_cover_img {
    right: 20%;
  }
}
@media (max-width: 1360px) {
  .no_cover_img {
    right: 24%;
  }
}
@media (max-width: 1280px) {
  .no_cover_img {
    right: 30%;
  }
}
@media (max-width: 800px) {
  /* .challenge_status {
    top: 12px;
  } */
  .chain_and_icon {
    top: 12px;
  }
  .default_pic {
    display: none;
  }
  .challenge_name {
    width: 100% !important;
  }
  .challenge_name.narrow {
    width: 100% !important;
  }
  .challenge_host {
    display: none !important;
  }
  .challenge_host_mobile {
    display: flex !important;
  }
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
  width: 100%;
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
  width: calc(100% - 220px);
  height: 102px;
  word-break: break-word;
  text-align: left;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.3em;
}
.challenge_name.narrow {
  width: calc(100% - 320px);
}

.challenge_info {
  display: flex;
  justify-content: space-between;
  gap: 32px;
}
.challenge_particular_info {
  display: flex;
  flex-direction: column;
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
}
.chain_and_icon {
  z-index: 3;
  position: absolute;
  bottom: 12px;
  right: 12px;
  height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.challenge_chain_icon_wrapper {
  height: 24px; 
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  border-radius: 8px;
  background: radial-gradient(73.87% 73.87% at 62.12% 36.94%, #FFFFFF 0%, #FEE6C1 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.challenge_chain_icon_wrapper.tooltip_container:hover::after {
  transform: translate(-40px, -7px);
}
.challenge_chain_icon_wrapper.tooltip_container:hover::before {
  transform: translateX(-120px);
  max-width: 150px;
  width: 150px;
  white-space: normal;
  word-break: break-word;
  /* transform: translateX(-30px); */
}
.challenge_status {
  /* z-index: 3;
  position: absolute;
  bottom: 12px;
  right: 12px;*/
  height: 24px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 8px;
  border-radius: 8px;
}

.challenge_status_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.challenge_host {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 76px;
}
.challenge_host_mobile {
  display: none;
  align-items: center;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  padding: 12px;
  gap: 12px;
  height: 76px;
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
