<template>
  <div class="awards_page general-white-bg">
    <div class="header">
      <h1 class="page_name general-contrast-color">
        {{ $t("awards_page.awards") }}
      </h1>
      <h1 class="my_awards_text general-brand-color">
        <!-- {{ $t("awards_page.my_awards") }} -->
      </h1>
    </div>
    <!-- <div class="awards_group_tabs">
      <button
        class="award_group_button minor-info-secondary-bg general-contrast-color"
        :class="{ active: currentAwardGroup.id === group.id }"
        v-for="group in awardGroups"
        @click="currentAwardGroup = group"
      >
        {{ group.name }}
      </button>
    </div> -->
    <div class="award_category">
      <h1 class="award_category_name general-contrast-color">
        {{ $t("general.all") }}
      </h1>
      <!-- <div class="awards_list_in_category general-white-bg"> -->
      <carousel :itemsToScroll="1" :breakpoints="breakpoints">
        <slide v-for="award in awardsList" :key="award">
          <div class="award_claim_card">
            <div
              v-if="award.received || award.reward > 0"
              class="award_receipt_status general-white-bg"
            >
              <AwardReceivedIcon
                v-if="award.received"
                class="award_received_icon"
              />
              <h1
                v-if="!award.received && award.reward > 0"
                class="reward_amount_text general-contrast-color"
              >
                {{ award.reward }}
              </h1>
              <RewardAmountIcon
                v-if="!award.received && award.reward > 0"
                class="reward_amount_icon"
              />
            </div>
            <img
              class="award_cover image"
              v-if="award.cover"
              :src="photoAddress(award.cover)"
            />
            <img
              class="award_cover image"
              v-else-if="award.received || award.scored >= award.to_score"
              :src="getImageURL('AwardsImages', 'AwardColorful.png')"
            />
            <img
              class="award_cover image"
              v-else
              :src="getImageURL('AwardsImages', 'AwardBlackAndWhite.png')"
            />              
            <!-- <div class="award_cover general-secondary-bg" v-else></div> -->
            <div
              class="award_description_wrapper general-white-bg general-secondary-color"
            >
              <div
                class="award_name_wrapper general-white-bg general-contrast-color"
              >
                {{ award.name }}
              </div>
              <div class="award_description_text general-secondary-color">
                {{ award.description }}
              </div>
              <div
                class="award_progress_wrapper general-white-color general-brand-bg"
                :class="{
                  claimed: award.received,
                  could_be_claimed:
                    !award.received && award.scored >= award.to_score,
                }"
                @click="claimAward(award)"
              >
                {{ awardProgress(award) }}
              </div>
            </div>
          </div>
        </slide>
        <template #addons>
          <navigation />
        </template>
      </carousel>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { photoAddress } from "@/general-scripts/photo-address";
import { notify } from "@/general-scripts/toast-notification";
import AwardReceivedIcon from "@/components/Icons/AwardsPageIcons/AwardReceivedIcon.vue";
import RewardAmountIcon from "@/components/Icons/AwardsPageIcons/RewardAmountIcon.vue";

import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { getImageURL } from "@/general-scripts/get-image-url";

export default {
  name: "AwardsPage",
  components: {
    AwardReceivedIcon,
    RewardAmountIcon,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      awardGroupsList: [],
      awardsList: [],
      myOrganizationID: null,
      currentAwardGroup: {
        name: this.$t("general.all"),
        id: 0,
      },
    };
  },
  mounted() {},
  watch: {
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal?.profile?.organization_id) {
          this.myOrganizationID = newVal.profile.organization_id;
          this.getAwardGroups();
          this.getAwards();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapStores(useProfileStore),
    breakpoints() {
      return {
        2250: { itemsToShow: 10, snapAlign: "start" },
        2050: { itemsToShow: 9, snapAlign: "start" },
        1850: { itemsToShow: 8, snapAlign: "start" },
        1650: { itemsToShow: 7, snapAlign: "start" },
        1450: { itemsToShow: 6, snapAlign: "start" },
        1060: { itemsToShow: 5, snapAlign: "start" },
        860: { itemsToShow: 4, snapAlign: "start" },
        660: { itemsToShow: 3, snapAlign: "start" },
        460: { itemsToShow: 2, snapAlign: "start" },
        250: { itemsToShow: 1, snapAlign: "start" },
      };
    },
    awardGroups() {
      let awardGroups = [{ name: this.$t("general.all"), id: 0 }];
      awardGroups.push(...this.awardGroupsList);
      return awardGroups;
    },
  },
  methods: {
    getImageURL: getImageURL,
    photoAddress: photoAddress,
    awardProgress(award) {
      if (award.received) {
        return this.$t("awards_page.received");
      } else if (award.scored >= award.to_score) {
        return this.$t("awards_page.receive");
      } else {
        return award.scored + "/" + award.to_score;
      }
    },
    async claimAward(award) {
      if (!award.received && award.scored >= award.to_score) {
        try {
          await axios.post(
            API_URIS.awards.replace("organization_id", this.myOrganizationID),
            {
              user_id: this.profileStore.profileInfo.id,
              award_type_id: award.id,
            }
          );
          notify(this.$t("awards_page.award_received"), "success");
          this.getAwards();
        } catch (err) {
          notify(
            err?.response?.data || err?.message || this.$t("notification.error")
          );
        }
      }
    },
    async getAwardGroups() {
      try {
        const response = await axios.get(
          API_URIS.awardGroups.replace("organization_id", this.myOrganizationID)
        );
        this.awardGroupsList = response.data.data;
      } catch (err) {
        throw err;
      }
    },
    async getAwards() {
      try {
        const response = await axios.get(
          API_URIS.awards.replace("organization_id", this.myOrganizationID)
        );
        this.awardsList = response.data.data;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.awards_page {
  width: 100%;
  padding: 52px;
  border-top-left-radius: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow: hidden;
}
.awards_page::-webkit-scrollbar {
  width: 8px;
  background-color: var(--negativeSecondary);
}
.awards_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}
.page_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
}
.my_awards_text {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: underline;
  cursor: pointer;
}
.awards_group_tabs {
  display: flex;
  gap: 8px;
}
.award_group_button {
  padding: 8px 14px;
  border-radius: 12px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.award_group_button.active {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
.award_category {
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* overflow: hidden; */
}
.award_category_name {
  font-family: "Ubuntu";
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  line-height: 36px;
}
::v-deep(.carousel__prev) {
  width: 44px;
  height: 44px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 100%;
  left: -30px;
}
::v-deep(.carousel__next) {
  width: 44px;
  height: 44px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 100%;
  /* right: 55px; */
  right: -30px;
}
::v-deep(.carousel__prev.carousel__prev--disabled) {
  display: none !important;
}
::v-deep(.carousel__next.carousel__next--disabled) {
  display: none !important;
}
::v-deep(.carousel__track) {
  margin: 0;
}
::v-deep(.carousel__viewport) {
  overflow: visible;
}
::v-deep(.carousel__slide) {
  justify-content: flex-start;
  align-items: stretch;
  width: 199px !important;
}
.awards_list_in_category {
  display: flex;
  gap: 32px;
}
.award_claim_card {
  position: relative;
  border-radius: 12px;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
}
.award_receipt_status {
  border-radius: 50%;
  height: 43px;
  width: 43px;
  position: absolute;
  top: -9px;
  right: -13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.award_received_icon {
  height: 31px;
  width: 31px;
}
.reward_amount_text {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}
.award_cover {
  width: 167px;
  height: 118px;
  border-radius: 12px 12px 0 0;
}
.award_cover.image {
  object-fit: cover;
}
.award_description_wrapper {
  border-radius: 0 0 12px 12px;
  height: 95px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  width: 167px;
}
.award_description_text {
  max-height: 42px;
  width: 167px;
  font-family: "Golos";
  font-size: 10px;
  font-weight: 400;
  line-height: 18px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.award_name_wrapper {
  padding: 6px;
  width: 146px;
  left: 11px;
  box-sizing: border-box;
  position: absolute;
  top: -10px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  border-radius: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.award_progress_wrapper {
  position: absolute;
  box-sizing: border-box;
  width: 117px;
  bottom: -9px;
  border-radius: 14px;
  padding: 6px;
  left: 25px;
  font-family: "Golos";
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
}
.award_progress_wrapper.claimed {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
.award_progress_wrapper.could_be_claimed {
  cursor: pointer;
}
</style>