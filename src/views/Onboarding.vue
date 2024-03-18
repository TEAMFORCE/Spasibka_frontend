<template>
  <div class="onboarding_page">
    <OnboardingWelcomeBlock
      @createOrganization="openCreateOrganizationPopup"
      @openOrganizationCreatedCard="openOrganizationCreatedCard"
      @scrollToPeriod="scrollToPeriod"
      :inviteLink="inviteLink"
    />
    <div class="content_block">
      <h3 class="title_text">
        {{ $t("onboarding.communities.title") }}
      </h3>
      <h5 class="description_text">
        {{ $t("onboarding.communities.description") }}
      </h5>
      <div class="work_with_communities_wrapper" ref="communities">
        <carousel
          :breakpoints="breakpoints"
          :itemsToScroll="1"
          :mouseDrag="dragging"
          :touchDrag="dragging"
        >
          <slide :index="1">
            <div class="action_block">
              <h4 class="action_title">
                {{ $t("onboarding.communities.create") }}
              </h4>
              <div class="action_icon_wrapper">
                <img
                  class="action_icon"
                  src="@/assets/svgIcons/onboardinCreateIcon.svg"
                  alt=""
                />
              </div>
              <div class="action_button_wrapper">
                <button
                  class="action_button"
                  :class="{ disabled: inviteLink !== null }"
                  @click="openCreateOrganizationPopup"
                  :disabled="inviteLink"
                >
                  {{ $t("onboarding.communities.create") }}
                </button>
              </div>
            </div>
          </slide>
          <slide :index="2">
            <div class="action_block">
              <h4 class="action_title">
                {{ $t("onboarding.communities.join") }}
              </h4>
              <div class="action_icon_wrapper">
                <img
                  class="action_icon"
                  src="@/assets/svgIcons/onboardingJoinIcon.svg"
                  alt=""
                />
              </div>
              <div class="action_button_wrapper">
                <input
                  type="text"
                  :placeholder="$t('onboarding.communities.inviteCode')"
                  class="action_input"
                  v-model="inviteLinkForUser"
                />
                <button
                  class="action_button"
                  @click="getOrganizationCodeForUser"
                >
                  {{ $t("onboarding.communities.ivite") }}
                </button>
              </div>
            </div>
          </slide>
          <slide :index="3">
            <div class="action_block">
              <h4 class="action_title">
                {{ $t("onboarding.communities.continue") }}
              </h4>
              <div class="action_icon_wrapper">
                <img
                  class="action_icon"
                  src="@/assets/svgIcons/onboardingInviteIcon.svg"
                  alt=""
                />
              </div>
              <div class="action_button_wrapper">
                <button
                  class="action_button"
                  @click="openOrganizationCreatedCard"
                >
                  {{ $t("onboarding.communities.inviteEmployee") }}
                </button>
              </div>
            </div>
          </slide>
        </carousel>
      </div>

      <h3 class="title_text">
        {{ $t("onboarding.settings.title") }}
      </h3>
      <h5 class="description_text">
        {{ $t("onboarding.settings.description") }}
      </h5>
      <div class="settings_block" ref="period">
        <div class="star_end_date_inputs">
          <div class="inputs_wrapper">
            <h6 class="input_title">
              {{ $t("onboarding.settings.startDate") }}
            </h6>
            <div class="datepicker_wrapper">
              <Datepicker
                v-model="periodStartDate"
                class="period_date_picker"
                text-input
                auto-apply
                format="dd.MM.yyyy"
                locale="ru"
                position="left"
                placeholder="17.03.2023"
                :enable-time-picker="false"
                :disabled="!enterPeriodManualy"
              />
            </div>
          </div>
          <div class="inputs_wrapper">
            <h6 class="input_title">
              {{ $t("onboarding.settings.endDate") }}
            </h6>
            <div class="datepicker_wrapper">
              <Datepicker
                v-model="periodEndDate"
                class="period_date_picker"
                text-input
                auto-apply
                format="dd.MM.yyyy"
                locale="ru"
                position="left"
                placeholder="18.03.2023"
                :enable-time-picker="false"
                :disabled="!enterPeriodManualy"
              />
            </div>
          </div>
        </div>
        <div class="inputs_wrapper_large">
          <h6 class="input_title">
            {{ $t("onboarding.settings.priseFund") }}
          </h6>
          <input
            v-model="distrAmount"
            type="text"
            class="_input"
            placeholder="50"
            :disabled="!enterPeriodManualy"
            :class="{ disabled_period: !enterPeriodManualy }"
          />
        </div>
        <div class="inputs_wrapper_large">
          <h6 class="input_title">
            {{ $t("onboarding.settings.ownerBalance") }}
          </h6>
          <input
            v-model="headDistrAmount"
            type="text"
            class="_input"
            placeholder="50"
            :disabled="!enterPeriodManualy"
            :class="{ disabled_period: !enterPeriodManualy }"
          />
        </div>
        <div class="settings_buttons_wrapper">
          <button class="setting_button start_btn" @click="createPeriod">
            {{ $t("onboarding.settings.start") }}
          </button>
          <button
            class="setting_button fill_btn"
            @click="enterManualy"
            v-if="!enterPeriodManualy"
          >
            {{ $t("onboarding.settings.fillManually") }}
          </button>
          <button class="setting_button fill_btn" @click="enterManualy" v-else>
            {{ $t("onboarding.settings.fillAuto") }}
          </button>
        </div>
      </div>
      <div class="onboarding_education_materials_wrapper">
        <OnboardingEducationMaterials />
      </div>
      <BasePopup ref="createOrganizationPopup">
        <CreateOrganizationCard
          @organizationCreate="organizationCreate"
          @cancelCreation="closeCreateOrganizationPopup"
        />
      </BasePopup>
      <BasePopup ref="organizationCreatedPopup">
        <OrganizationCreatedCard
          :createdOrganization="inviteLink"
          @closeOrganizationCreatedCard="closeOrganizationCreatedCard"
        />
      </BasePopup>
      <BasePopup ref="errorCreationPeriodPopup">
        <ErrorCreationPeriodCard
          @closeErrorPeriodCardCard="closeErrorPeriodCardCard"
        />
      </BasePopup>
      <BasePopup ref="goToMainPopup">
        <AllSuccessCard
          @cancelGoTo="closeGoToMainPopup"
          @goToMain="goToMain"
          :createdOrganization="inviteLink"
          :createdOrganizationName="inviteLinkOrganizationName"
        />
      </BasePopup>
      <BasePopup ref="userInvitedPopup">
        <UserIvitedCard
          @cancelGoTo="closeUserInvitedPopup"
          @goToOrganization="goToInvitedOrganization"
          :communitieName="inviteLinkOrganizationName"
        />
      </BasePopup>
      <BasePopup ref="dontHaveACommunitiePopup">
        <NoCommunityCard @closeErrorNoCommunity="closeErrorNoCommunity" />
      </BasePopup>
    </div>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import Datepicker from "@vuepic/vue-datepicker";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import OnboardingEducationMaterials from "@/components/Onboarding/EducationMaterials.vue";
import OnboardingWelcomeBlock from "@/components/Onboarding/WelcomeBlock.vue";

import BasePopup from "@/components/app/Popup.vue";
import CreateOrganizationCard from "@/components/Onboarding/CreateOrganizationCard.vue";
import OrganizationCreatedCard from "@/components/Onboarding/OrganizationCreatedCard.vue";
import ErrorCreationPeriodCard from "@/components/Onboarding/ErrorCreationPeriodCard.vue";
import AllSuccessCard from "@/components/Onboarding/AllSuccessCard.vue";
import UserIvitedCard from "@/components/Onboarding/UserInvitedCard.vue";
import NoCommunityCard from "@/components/Onboarding/NoCommunitiesCard.vue";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

export default {
  name: "OnboardingPage",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    Datepicker,
    OnboardingEducationMaterials,
    OnboardingWelcomeBlock,
    BasePopup,
    CreateOrganizationCard,
    OrganizationCreatedCard,
    ErrorCreationPeriodCard,
    AllSuccessCard,
    UserIvitedCard,
    NoCommunityCard,
  },
  data() {
    return {
      breakpoints: {
        1920: { itemsToShow: 3, snapAlign: "start" },
        1600: { itemsToShow: 3, snapAlign: "start" },
        1440: { itemsToShow: 3, snapAlign: "start" },
        1280: { itemsToShow: 3, snapAlign: "start" },
        1024: { itemsToShow: 2, snapAlign: "start" },
        768: { itemsToShow: 1, snapAlign: "start" },
      },
      periodStartDate: new Date(),
      periodEndDate: new Date(new Date(new Date().getFullYear()), 11, 31),
      distrAmount: 50,
      headDistrAmount: 50,

      enterPeriodManualy: false,

      inviteLink: null,
      inviteLinkForUser: null,
      inviteLinkOrganizationName: null,
    };
  },
  computed: {
    dragging() {
      let width = window.innerWidth;
      if (width <= 1280) {
        return true;
      } else {
        return false;
      }
    },
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
  },
  methods: {
    scrollToInvite() {
      this.$refs.communities.scrollIntoView({
        behavior: "smooth",
      });
    },
    scrollToPeriod() {
      this.$refs.period.scrollIntoView({
        behavior: "smooth",
      });
    },
    openCreateOrganizationPopup() {
      this.$refs.createOrganizationPopup.open();
    },
    closeCreateOrganizationPopup() {
      this.$refs.createOrganizationPopup.close();
    },
    async openOrganizationCreatedCard() {
      if (!this.inviteLink) {
        await this.getOrganizationInviteCode()
          .then(() => {
            this.$refs.organizationCreatedPopup.open();
          })
          .catch((error) => {
            this.openErrorNoCommunity();
            throw error;
          });
      } else if (this.inviteLink) {
        this.$refs.organizationCreatedPopup.open();
      }
    },
    closeOrganizationCreatedCard() {
      this.$refs.organizationCreatedPopup.close();
    },
    closeErrorPeriodCardCard() {
      this.$refs.errorCreationPeriodPopup.close();
    },
    closeGoToMainPopup() {
      this.$refs.goToMainPopup.close();
    },
    goToMain() {
      this.$router.push("/main");
    },
    closeUserInvitedPopup() {
      this.$refs.userInvitedPopup.close();
    },
    openErrorNoCommunity() {
      this.$refs.dontHaveACommunitiePopup.open();
    },
    closeErrorNoCommunity() {
      this.$refs.dontHaveACommunitiePopup.close();
    },

    enterManualy() {
      if (this.enterPeriodManualy == false) {
        this.enterPeriodManualy = true;
      } else if (this.enterPeriodManualy == true) {
        this.enterPeriodManualy = false;
        this.periodStartDate = new Date();
        this.periodEndDate = new Date(
          new Date(new Date().getFullYear()),
          11,
          31
        );
        this.distrAmount = null;
        this.headDistrAmount = null;
      }
    },
    async getProfileInfo() {
      await this.profileStore.getProfileInfo();
    },
    async organizationCreate(organizationName) {
      if (organizationName) {
        try {
          let response = await axios.post(API_URIS.community, {
            name: organizationName,
          });

          this.$refs.createOrganizationPopup.close();
          this.$moshaToast(
            {
              title: response.data.text,
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
          await this.getProfileInfo();
          await this.getOrganizationInviteCode();
          this.scrollToPeriod();
        } catch (error) {
          this.$refs.createOrganizationPopup.close();
          this.$moshaToast(
            {
              title: this.$t("onboarding.communities.creationError"),
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "danger",
            }
          );
          throw error;
        }
      }
    },
    async getOrganizationInviteCode() {
      let response = await axios.get(API_URIS.inviteLink);
      if (response.status == 403) {
      } else {
        this.inviteLink = response.data.invite_link;
      }
    },

    async createPeriod() {
      if (
        this.profileInfo?.profile?.organization_id &&
        this.periodStartDate &&
        this.periodEndDate
      ) {
        let response = await axios.post(API_URIS.communityPeriod, {
          start_date: `${this.periodStartDate.toISOString().slice(0, 10)}`,
          end_date: `${this.periodEndDate.toISOString().slice(0, 10)}`,
          distr_amount: this.distrAmount,
          head_distr_amount: this.headDistrAmount,
        });
        if (response.status === 200 || 201 || 202) {
          this.$refs.goToMainPopup.open();
        }
      } else if (
        this.profileInfo?.profile?.organization_id &&
        !this.periodStartDate &&
        !this.periodEndDate
      ) {
        return;
      } else {
        this.$refs.errorCreationPeriodPopup.open();
      }
    },
    async getOrganizationCodeForUser() {
      if (this.inviteLinkForUser) {
        try {
          let params = {
            invite: this.inviteLinkForUser.slice(29),
          };
          let response = await axios.get(API_URIS.communityInvite, { params });
          this.inviteLinkOrganizationName = response.data.organization_name;
          this.$refs.userInvitedPopup.open();
        } catch (error) {
          throw error;
        }
      }
    },
    async goToInvitedOrganization() {
      try {
        localStorage.removeItem("VKAccessToken");
        await axios.get(API_URIS.logOutURL);
        this.$router.push({
          path: "/login",
          query: { invite: this.inviteLinkForUser.slice(29) },
        });
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.profileInfo.profile.organization_id) {
        return;
      } else {
        this.getOrganizationInviteCode();
      }
    }, 500);
  },
};
</script>


<style >
.onboarding_page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: flex-end;
  overflow-x: hidden;
}
.onboarding_page::-webkit-scrollbar {
  width: 8px !important;
  background-color: var(--negativeSecondary) !important;
}
.onboarding_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary) !important;
  border: 12px solid transparent !important;
  border-radius: 20px !important;
  width: 10px !important;
}
.content_block {
  width: 89.3%;
  border-radius: 24px 0px 0px 24px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* padding: 52px 51px 71px 52px; */

  margin: 0 0 71px 0;
  overflow: visible !important;
}
.title_text {
  margin: 52px 0 0 52px;
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
}
.description_text {
  margin: 12px 0 0 52px;
  font-family: "Golos";
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: var(--generalColorSecondary);
  text-align: left;
}
.work_with_communities_wrapper {
  gap: 20px;
  width: 98%;
  margin: 20px 0 0 0;
  min-height: 600px;
  overflow: visible;
  margin: 20px 0 0 36px;
}
.action_block {
  width: 100%;
  height: 100%;
  max-height: 545px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 52px 24px 32px 52px;
  z-index: 2000;
  position: relative;
  margin: 20px 20px;
}
.action_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
  min-height: 72px;
}
.action_icon_wrapper {
  width: 100%;
  height: 332px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.action_icon {
  height: 100%;
  max-height: 310px;
}
.action_button_wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: relative;
}
.action_input {
  position: absolute;
  left: 0;
  width: 73%;
  height: 46px;
  outline: none;
  border: 1px solid var(--negativeSecondary);
  border-radius: 12px;
  padding: 0 0 0 12px;
}
.action_button {
  position: relative;
  z-index: 2;
  background-color: var(--generalBrand);
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalColorWhite);
  padding: 11.5px 14px;
  border-radius: 12px;
  transition: 0.3s;
}
.action_button:active {
  transform: scale(0.99);
}
.disabled {
  background-color: var(--generalColorSecondary);
}

.settings_block {
  margin: 12px 0 0 52px;
  width: 89.2%;
  /* height: 245px; */
  padding: 52px 41px 37px 41px;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
}
.star_end_date_inputs {
  display: flex;
  gap: 10px;
  width: 100%;
}
.inputs_wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 50%;
}
.input_title {
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--generalColorSecondary);
  margin: 0;
}
.datepicker_wrapper {
  width: 100%;
}
.dp__input {
  border-radius: 5px !important;
  font-size: 14px !important;
  background-color: var(--conditionalItemBackgroundHover) !important;
}
.dp__disabled {
  background-color: var(--generalColorGrey) !important;
}
.inputs_wrapper_large {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  width: 100%;
  margin: 10px 0 0 0;
}
._input {
  width: 99%;
  height: 46px;
  padding: 0 0 0 12px;
  outline: none;
  background-color: var(--conditionalItemBackgroundHover) !important;
  border: 1px solid var(--negativeSecondary);
  border-radius: 5px;
}
.disabled_period {
  background-color: var(--generalColorGrey) !important;
}

.settings_buttons_wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 27px 0 0 0;
}
.setting_button {
  width: 274px;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  padding: 16px 0;
  border-radius: 6px;
  transition: 0.3s;
}
.setting_button:active {
  transform: scale(0.99);
}
.start_btn {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
.fill_btn {
  color: var(--generalBrand);
  background-color: var(--secondaryColorBrand);
}
.onboarding_education_materials_wrapper {
  margin: 52px 0 0 0;
  width: 100%;
}
@media (max-width: 1440px) {
  .action_block {
    gap: 24px;
  }
  .action_icon_wrapper {
    width: 100%;
    height: 292px;
  }
  .work_with_communities_wrapper {
    width: 97%;
  }
}
@media (max-width: 1280px) {
  .action_block {
    gap: 20px;
    padding: 52px 24px 32px 52px;
  }
  .action_icon_wrapper {
    width: 100%;
    height: 292px;
  }
  .work_with_communities_wrapper {
    width: 97%;
  }
  .action_block {
    padding: 32px 24px 24px 32px;
    margin: 40px 5px;
  }
}
@media (max-width: 1024px) {
  .content_block {
    width: 97%;
  }
  .title_text {
    margin: 52px 0 0 24px;
  }
  .description_text {
    margin: 12px 0 0 24px;
  }
  .work_with_communities_wrapper {
    margin: 20px 0 0 6px;
    width: 100%;
  }
  .action_block {
    margin: 40px 20px;
  }
  .settings_block {
    margin: 12px 0 0 24px;
    width: 88%;
    padding: 52px 24px 37px 24px;
  }
  ._input {
    width: 98%;
    height: 46px;
  }
}
@media (max-width: 600px) {
  .title_text {
    margin: 24px 0 0 24px;
    font-size: 20px;
  }
  .description_text {
    margin: 2px 0 0 24px;
    font-size: 14px;
    line-height: 28px;
    padding: 0 8px 0 0;
  }
  .action_block {
    gap: 20px;
    padding: 32px 24px 24px 32px;
  }
  .action_icon_wrapper {
    width: 100%;
    height: 292px;
  }
  .action_title {
    font-size: 24px;
  }
  /* .settings_block {
    height: 445px;
  } */
  .star_end_date_inputs {
    flex-direction: column;
  }
  .inputs_wrapper {
    width: 100%;
  }
  ._input {
    width: 97%;
  }
  .settings_buttons_wrapper {
    flex-direction: column;
  }
  .setting_button {
    width: 100%;
  }
  .onboarding_education_materials_wrapper {
    width: 100%;
    margin: 0 0 0 6px;
  }
}
@media (max-width: 520px) {
  .star_end_date_inputs {
    width: 96%;
  }
  ._input {
    width: 93%;
  }
  .settings_buttons_wrapper {
    width: 96%;
  }
}
</style>