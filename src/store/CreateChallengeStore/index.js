import { defineStore } from "pinia";
import { API_URIS } from "@/constants/api";
import i18n from "@/i18n";
import axios from "axios";

export const useStore = defineStore("createChallenge", {
  state: () => ({
    currentChainStep: -1,

    dependencies: [],
    groups: [],

    simplifiedCreation: true,
    challengeCreationStep: 1,

    selectedTab: "mainInputs",
    challengeName: "",
    challengeDescription: "",
    challengeStartDate: null,
    challengeEndDate: null,
    challengePrizeFund: null,
    challengePrizePlaces: null,
    selectedSponsor: null,

    challengePhoto: null,
    challengePhotoLink: null,

    challengePhotos: [],
    challengePhotosLink: [],

    multipleReports: false,
    showParticipants: false,
    challengeDeferred: false,
    selectedChallengeType: {
      name: i18n.global.t("challenges.challenge_settings.default_type"),
      id: 1,
      type: "default"
    },
    challengeTypes: [
      {
        name: i18n.global.t("challenges.challenge_settings.default_type"),
        id: 1,
        type: "default"
      },
      {
        name: i18n.global.t("challenges.challenge_settings.voting_type"),
        id: 2,
        type: "voting"
      },
    ],

    challengeCreationSettings: null,
  }),
  actions: {
    async getSponsors() {
      try {
        const response = await axios.get(API_URIS.createChallenge);
        this.challengeCreationSettings = response.data;
      } catch (err) {
        throw err;
      }
    },
    resetState() {
      this.challengeName = "";
      this.challengeDescription = "";
      this.challengePrizeFund = null;
      this.challengePrizePlaces = null;
      this.challengeStartDate = null;
      this.challengeEndDate = null;
      this.selectedSponsor = null;
      this.challengePhoto = null;
      this.challengePhotoLink = null;
      this.challengePhotos = [];
      this.challengePhotosLink = [];
      this.dependencies = [];
      this.groups = [];
      this.challengeDeferred = false;
      this.multipleReports = false;
      this.showParticipants = false;
      this.challengeCreationStep = 1;
    },
    removeImageFromList(index) {
      this.challengePhotos.splice(index, 1);
      this.challengePhotosLink.splice(index, 1);
    },
    refreshImages() {

      setTimeout(() => {

        this.challengePhotosLink = this.challengePhotosLink.filter(el => el !== undefined)

        if (this.challengePhotosLink.length > 1 && this.challengePhotos.length > 1) {
          let sortedChallengePhotos = this.challengePhotosLink.map(item => {
            const { name } = item;
            return this.challengePhotos.find(item => item.name === name)
          })
          this.challengePhotos = sortedChallengePhotos
        }
      }, 150);

    },
  },
});
