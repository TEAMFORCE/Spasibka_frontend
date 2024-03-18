<template>
  <div class="create_challenge_select_photo">
    <label class="challenge_photo_select_wrapper">
      <div class="challenge_photo_select transparent-bg">
        <SelectChallengeCoverIcon class="challenge_photo_select_icon" />
        <h1 class="challenge_photo_select_text">
          {{ $t("challenges.create_challenge.challenge_cover") }}
        </h1>
      </div>
      <h1
        v-if="createChallengeStore?.challengePhoto"
        class="challenge_selected_file_name general-contrast-color"
      >
        {{ createChallengeStore.challengePhoto.name }}
      </h1>
      <input type="file" accept="image/*" @change="handleFileSelect" />
    </label>
    <div
      v-if="createChallengeStore?.challengePhotoLink"
      class="selected_photo_wrapper"
    >
      <CancelSelectedImageIcon
        class="cancel_selected_image_icon"
        @click="deleteSelectedImage"
      />
      <img
        class="selected_photo"
        :src="createChallengeStore.challengePhotoLink"
        alt="Selected photo"
      />
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import { getImageURL } from "@/general-scripts/get-image-url";

import CancelSelectedImageIcon from "@/components/Icons/ChallengesIcons/CancelSelectedImageIcon.vue";
import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";

export default {
  name: "CreateChallengeSelectSponsor",
  components: {
    CancelSelectedImageIcon,
    SelectChallengeCoverIcon,
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
  methods: {
    getImgUrl: getImageURL,
    deleteSelectedImage() {
      this.createChallengeStore.challengePhoto = null;
      this.createChallengeStore.challengePhotoLink = null;
    },
    handleFileSelect(e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.createChallengeStore.challengePhoto = file;
        this.createChallengeStore.challengePhotoLink =
          URL.createObjectURL(file);
      } else {
        alert(this.$t("challenges.create_challenge.please_select_image_file"));
        e.target.value = null;
      }
    },
  },
};
</script>

<style scoped>
.create_challenge_select_photo {
  position: relative;
}
.challenge_photo_select_wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.challenge_photo_select {
  border: 1px solid var(--generalBrand);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}
.challenge_photo_select_icon {
  width: 24px;
  height: 24px;
}
.challenge_photo_select_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.challenge_photo_select_wrapper > input[type="file"] {
  display: none;
}
.challenge_selected_file_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
}
.selected_photo_wrapper {
  width: 100px;
  height: 100px;
  position: relative;
}
.cancel_selected_image_icon {
  position: absolute;
  top: 5px;
  right: 5px;
  height: 24px;
  width: 24px;
  z-index: 5;
}
.cancel_selected_image_icon:hover {
  cursor: pointer;
}
.selected_photo {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  filter: brightness(70%);
}
</style>