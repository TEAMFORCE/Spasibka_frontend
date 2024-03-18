<template>
  <div class="challenges_list">
    <ChallengeItem
      v-for="challenge in challengesStore.challengesList"
      :challenge="challenge"
    />
  </div>
</template>

<script>
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index.js";
import { mapStores } from "pinia";

import ChallengeItem from "./ChallengesListElements/ChallengeItem.vue";

export default {
  name: "ChallengesList",
  components: {
    ChallengeItem,
  },

  computed: {
    ...mapStores(useChallengesStore),
  },
};
</script>

<style scoped>
.challenges_list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 0 0 40px 0;
}
</style>