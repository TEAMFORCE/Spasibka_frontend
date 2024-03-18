<template>
  <div class="challenge_template_item" @click.self="openChallengeCreation">
    <BaseSmallPopup ref="templateDeletePopup">
      <div class="delete_wrapper">
        <h2 class="delete_question">
          {{ $t("challenges.challenge_templates.deleteConfirmation") }}
        </h2>
        <div class="delete_buttons">
          <button class="delete_button" @click="deleteTemplate">
            {{ $t("challenges.challenge_delete.delete") }}
          </button>
          <button class="cancel_button" @click="cancelDeletion">
            {{ $t("challenges.challenge_delete.cancel") }}
          </button>
        </div>
      </div>
    </BaseSmallPopup>
    <NotClosingPopup ref="createChainFromTemplate">
      <CreateChainFromTemplate
        :chainTemplate="this.challengeTemplate"
        @closeChainCreation="closeChainCreation"
      />
    </NotClosingPopup>
    <div class="challenge_template_item_header">
      <div class="challenge_template_item_type">
        {{ templateType }}
      </div>
      <div class="challenge_template_item_edit_buttons">
        <button
          v-if="privilegedToEdit"
          class="challenge_template_item_edit_button tooltip_container"
          @click.stop="openDeletionConfirmation"
          :data-tooltip="$t('challenges.delete_template')"
        >
          <DeleteIcon />
        </button>
        <button
          v-if="privilegedToEdit"
          class="challenge_template_item_edit_button tooltip_container"
          @click.stop="goToTemplateEdition"
          :data-tooltip="$t('challenges.edit_template')"
        >
          <BrandingIcon />
        </button>
      </div>
    </div>
    <div
      class="challenge_template_item_cover"
      @click.stop="openChallengeCreation"
    >
      <img
        v-if="challengePhoto"
        class="challenge_template_item_cover_img"
        :src="challengePhoto"
        alt="challenge template cover"
      />
      <img
        v-else
        class="challenge_template_item_cover_img"
        :src="getImgUrl()"
        alt="challenge template cover"
      />
    </div>
    <h2 class="challenge_template_item_name">
      {{ challengeTemplate.name }}
    </h2>
    <div class="challenge_template_item_categories">
      <div
        class="challenge_template_item_categories_item"
        v-for="category in challengeTemplate.sections"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index";
import { photoAddress } from "@/general-scripts/photo-address";
import { TEMPLATE_TYPE } from "@/infrastructure/constants/template-type";
import CreateChallenge from "@/components/ChallengesElements/CreateChallenge.vue";
import BrandingIcon from "@/components/Icons/branding.vue";
import DeleteIcon from "@/components/Icons/delete.vue";
import BaseSmallPopup from "@/components/app/SmallPopup.vue";
import NotClosingPopup from "@/components/app/NotClosingPopup.vue";
import CreateChainFromTemplate from "@/components/ChallengeChainsElements/CreateChainFromTemplate/ChainForm.vue";

export default {
  name: "ChallengeTemplateItem",
  components: {
    CreateChallenge,
    BrandingIcon,
    DeleteIcon,
    BaseSmallPopup,
    NotClosingPopup,
    CreateChainFromTemplate,
  },
  props: {
    challengeTemplate: {
      required: true,
    },
  },
  computed: {
    templateType() {
      return this.challengeTemplate.type === TEMPLATE_TYPE.challenge
        ? this.$t("challenges.templateTypes.challenge")
        : this.$t("challenges.templateTypes.chain");
    },
    challengePhoto() {
      if (this.challengeTemplate?.photo) {
        return this.photoAddress(`${this.challengeTemplate.photo}?thumbnail=1`);
      } else if (
        this.challengeTemplate?.photos &&
        this.challengeTemplate?.photos?.length > 0
      ) {
        return this.photoAddress(
          `${this.challengeTemplate.photos[0]}?thumbnail=1`
        );
      } else {
        return null;
      }
    },

    ...mapStores(useProfileStore),
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useChallengesStore),
    privilegedToEdit() {
      if (this.challengeTemplatesStore.selectedFilter.scope == 0) {
        return true;
      } else if (this.challengeTemplatesStore.selectedFilter.scope == 1) {
        for (
          let i = 0;
          i < this.profileStore?.profileInfo?.privileged.length;
          ++i
        ) {
          if (
            this.profileStore.profileInfo.privileged[i].role_name ==
            "Администратор"
          ) {
            return true;
          }
        }
        return false;
      } else if (this.challengeTemplatesStore.selectedFilter.scope == 2) {
        if (this.profileStore?.profileInfo?.superuser) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  methods: {
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
    getImgUrl() {
      var images = require.context(
        "@/assets/svgIcons/challengeIcons/",
        false,
        /\.svg$/
      );
      return images(
        "./" +
          `${"challenge"}${this.reduceNumber(this.challengeTemplate.id)}` +
          ".svg"
      );
    },
    photoAddress: photoAddress,
    openChallengeCreation() {
      if (this.challengeTemplate.type == TEMPLATE_TYPE.challenge) {
        this.challengeTemplatesStore.selectedTemplate = this.challengeTemplate;
        this.challengesStore.createChallengeEnabled = true;
      } else if (this.challengeTemplate.type == TEMPLATE_TYPE.chain) {
        this.$refs.createChainFromTemplate.open();
      }
    },
    closeChainCreation() {
      this.$refs.createChainFromTemplate.close();
    },
    goToTemplateEdition() {
      this.challengeTemplatesStore.selectedTemplate = this.challengeTemplate;
      this.challengeTemplatesStore.createChallengeTemplateEnabled = true;
    },
    openDeletionConfirmation() {
      this.$refs.templateDeletePopup.open();
    },
    cancelDeletion() {
      this.$refs.templateDeletePopup.close();
    },
    async deleteTemplate() {
      try {
        let response = await axios.delete(
          `${API_URIS.deleteChallengeTemplate}${this.challengeTemplate.id}`
        );
        this.cancelDeletion();

        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          this.$moshaToast(
            {
              title: this.$t("challenges.challenge_templates.deleteSuccess"),
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
        }
        this.$emit("challengeDeleted");
      } catch (err) {
        this.cancelDeletion();

        this.$moshaToast(
          {
            title: this.$t("challenges.challenge_templates.deleteError"),
          },
          {
            position: "bottom-left",
            timeout: 3000,
            transition: "slide",
            type: "danger",
          }
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenge_template_item {
  width: 358px;
  height: 376px;
  border-radius: 20px;
  background-color: var(--generalColorWhite);
  box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 5px 5px 30px 0px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.challenge_template_item_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.challenge_template_item_type {
  height: 24px;
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalContrast);
  padding: 2px 8px;
  border: 1px solid var(--generalContrast);
  border-radius: 8px;
  box-sizing: border-box;
}
.challenge_template_item_edit_buttons {
  display: flex;
  gap: 8px;
}
.challenge_template_item_edit_button {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: var(--secondaryColorBrand);
}
.branding_icon {
  width: 14px;
  height: 14px;
}
.delete_icon {
  width: 14px;
  height: 14px;
}
.challenge_template_item_cover {
  width: 100%;
  height: 212px;
  border-radius: 20px;
  overflow: hidden;
}
.challenge_template_item_cover_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.challenge_template_item_name {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  color: var(--generalContrast);
  margin: 0;
}
.challenge_template_item_categories {
  display: flex;
  align-items: center;
  gap: 4px;
}
.challenge_template_item_categories_item {
  height: 24px;
  font-family: "SF Pro Text";
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--generalContrast);
  padding: 2px 8px;
  border: 1px solid var(--generalBrand);
  border-radius: 8px;
  box-sizing: border-box;
}
.delete_wrapper {
  width: 100%;
}
.delete_question {
  font-size: 22px;
  line-height: 36px;
  font-family: "SF Pro Text";
  font-weight: 500;
  color: var(--generalContrast);
}
.delete_buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.delete_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  font-size: 16px;
  font-family: "Roboto";
}
.cancel_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
  font-size: 16px;
  font-family: "Roboto";
}
</style>