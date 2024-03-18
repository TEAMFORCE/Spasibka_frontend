<template>
  <div class="challenge_template_cover_updater_wrapper">
    <div class="no_images_wrapper" v-if="incomingPhotos.length">
      <SlickList
        class="cover_loader_images_wrapper"
        v-model:list="incomingPhotos"
        @sort-end="sortEnded"
      >
      </SlickList>
    </div>
  </div>
</template>

<script>
import { SERVER_IP } from "@/constants/api";

import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";
import CloseImageIcon from "@/components/Icons/closeImage.vue";
import ChallengePreviewCropper from "@/components/ChallengeItemElements/ChallengePreviewCropper.vue";

import { SlickList, SlickItem } from "vue-slicksort";

export default {
  name: "ChallengeTemplateCoverUpdater",
  components: {
    SelectChallengeCoverIcon,
    CloseImageIcon,
    ChallengePreviewCropper,
    SlickList,
    SlickItem,
  },
  props: {
    photos: {
      default: null,
    },
  },
  data() {
    return {
      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],
      fileListForSend: [],
      incomingPhotos: [],

      newImageIsLoaded: false,
      cropperVisible: false,
      coverImageChanged: false,

      newCover: null,
    };
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>