<template>
  <div class="challenges_list">
    <ChallengeChainCard
      v-for="challengeChainInfo in challengeChainsList"
      :challengeChainInfo="challengeChainInfo"
    />
  </div>
</template>

<script>
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index.js";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

import ChallengeChainCard from "./ChallengeChainCard.vue";
import axios from "axios";
import { API_URIS } from "@/constants/api";

export default {
  name: "ChallengeChainsList",
  components: {
    ChallengeChainCard,
  },
  data() {
    return {
      challengeChainsList: [],
    };
  },
  watch: {
    "challengesStore.createChallengeChainEnabled": {
      handler(newValue) {
        if (!newValue) {
          this.fetchChallengeChainsList();
        }
      },
    },
  },
  computed: {
    ...mapStores(useChallengesStore),
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    challengeGroupsAPI() {
      return API_URIS.challengeGroups.replace(
        "organization_id",
        this.profileInfo?.profile.organization_id
      );
    },
  },
  mounted() {
    this.fetchChallengeChainsList();
  },
  methods: {
    async fetchChallengeChainsList() {
      try {
        const response = await axios.get(this.challengeGroupsAPI);
        this.challengeChainsList = response.data.data;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenges_list {
  display: flex;
  flex-wrap: wrap;
  gap: 0px;
}
</style>