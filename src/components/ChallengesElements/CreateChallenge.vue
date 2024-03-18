<template>
  <div class="create_challenge_wrapper">
    <CreateChallengeMainInputs
      @click.stop
      v-show="createChallengeStore.selectedTab === 'mainInputs'"
    />
    <CreateChallengeSettings
      @click.stop
      v-show="createChallengeStore.selectedTab === 'settings'"
    />
    <CreateChallengeLinkDependencies
      @click.stop
      v-show="createChallengeStore.selectedTab === 'dependencies'"
    />
    <CreateChallengeAssignChains
      @click.stop
      v-show="createChallengeStore.selectedTab === 'chains'"
    />
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";
import { useStore as useProfileStore } from "@/store/profile";
import { photoAddress } from "@/general-scripts/photo-address";

import CreateChallengeMainInputs from "./CreateChallengeElements/CreateChallengeMainInputs.vue";
import CreateChallengeSettings from "./CreateChallengeElements/CreateChallengeSettings.vue";
import CreateChallengeLinkDependencies from "./CreateChallengeElements/CreateChallengeLinkDependencies.vue";
import CreateChallengeAssignChains from "./CreateChallengeElements/CreateChallengeAssignChains.vue";

export default {
  name: "CreateChallenge",
  props: {
    challengeTemplate: {
      default: null,
    },
  },
  components: {
    CreateChallengeMainInputs,
    CreateChallengeSettings,
    CreateChallengeLinkDependencies,
    CreateChallengeAssignChains,
  },
  mounted() {
    this.loadFormFromLocalStorage();
    this.createChallengeStore.getSponsors();
    this.fillPredefinedValues();
  },
  watch: {
    "createChallengeStore.challengeName": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.challengeDescription": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.challengePrizeFund": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.challengePrizePlaces": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.challengeStartDate": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.challengeEndDate": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.selectedSponsor": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.challengeDeferred": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.multipleReports": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.showParticipants": {
      handler: "onFormDataChange",
    },
    "createChallengeStore.simplifiedCreation": {
      handler: "onFormDataChange"
    }
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
    ...mapStores(useProfileStore),
    userID() {
      return this.profileStore?.profileInfo?.id;
    },
    userOrgID() {
      return this.profileStore?.profileInfo?.profile?.organization_id;
    },
    localStorageKey() {
      return `${this.userID}-${this.userOrgID}-createChallengeForm`;
    },
  },
  methods: {
    fillPredefinedValues() {
      if (this.challengeTemplate) {
        this.createChallengeStore.challengeDeferred = false;
        this.createChallengeStore.challengeEndDate = null;
        this.createChallengeStore.challengeStartDate = null;
        this.createChallengeStore.challengePrizePlaces = null;
        this.createChallengeStore.challengePrizeFund = null;

        let challengeType = this.challengeTemplate.challenge_type;
        let challengeTypes = this.createChallengeStore?.challengeTypes;
        for (let i = 0; i < challengeTypes?.length; ++i) {
          if (challengeTypes[i].type === challengeType) {
            this.createChallengeStore.selectedChallengeType = challengeTypes[i];
            break;
          }
        }

        this.createChallengeStore.showParticipants =
          this.challengeTemplate.show_contenders;
        this.createChallengeStore.multipleReports =
          this.challengeTemplate.multiple_reports;

        this.createChallengeStore.challengeName = this.challengeTemplate.name;
        this.createChallengeStore.challengeDescription =
          this.challengeTemplate.description;
        if (this.challengeTemplate.photo) {
          this.createChallengeStore.challengePhotoLink = photoAddress(
            this.challengeTemplate.photo
          );
          fetch("/api" + this.challengeTemplate.photo)
            .then((response) => response.blob())
            .then((imageBlob) => {
              const file = new File([imageBlob], "filename.jpg", {
                type: imageBlob.type,
              });
              this.createChallengeStore.challengePhoto = file;
            });
        } else {
          this.createChallengeStore.challengePhotoLink = null;
          this.createChallengeStore.challengePhoto = null;
        }
      }
    },
    onFormDataChange() {
      let form = JSON.stringify({
        challengeName: this.createChallengeStore?.challengeName,
        challengeDescription: this.createChallengeStore?.challengeDescription,
        challengePrizeFund: this.createChallengeStore?.challengePrizeFund,
        challengePrizePlaces: this.createChallengeStore?.challengePrizePlaces,
        challengeStartDate: this.createChallengeStore?.challengeStartDate,
        challengeEndDate: this.createChallengeStore?.challengeEndDate,
        challengeDeferred: this.createChallengeStore?.challengeDeferred,
        multipleReports: this.createChallengeStore?.multipleReports,
        showParticipants: this.createChallengeStore?.showParticipants,
        selectedSponsor: this.createChallengeStore?.selectedSponsor,
        simplifiedCreation: this.createChallengeStore?.simplifiedCreation
      });
      localStorage.setItem(this.localStorageKey, form);
    },
    loadFormFromLocalStorage() {
      const value = localStorage.getItem(this.localStorageKey);
      if (value) {
        const form = JSON.parse(value);
        this.createChallengeStore.simplifiedCreation = form.simplifiedCreation;
        this.createChallengeStore.challengeName = form.challengeName;
        this.createChallengeStore.challengeDescription =
          form.challengeDescription;
        this.createChallengeStore.challengePrizeFund = form.challengePrizeFund;
        this.createChallengeStore.challengePrizePlaces =
          form.challengePrizePlaces;
        this.createChallengeStore.challengeStartDate = form.challengeStartDate;
        this.createChallengeStore.challengeEndDate = form.challengeEndDate;
        this.createChallengeStore.challengeDeferred = form.challengeDeferred;
        this.createChallengeStore.multipleReports = form.multipleReports;
        this.createChallengeStore.showParticipants = form.showParticipants;
        this.createChallengeStore.selectedSponsor = form.selectedSponsor;
      }
    },
  },
};
</script>

<style scoped>
.create_challenge_wrapper {
  position: fixed;
  z-index: 1000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>