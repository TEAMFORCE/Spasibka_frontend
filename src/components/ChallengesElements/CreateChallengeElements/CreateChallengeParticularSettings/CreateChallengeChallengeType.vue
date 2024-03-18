<template>
  <div class="create_challenge_challenge_type">
    <vSelect
      v-model="createChallengeStore.selectedChallengeType"
      :options="createChallengeStore.challengeTypes"
      :placeholder="$t('challenges.challenge_settings.choose_challenge_type')"
      :clearable="false"
      label="name"
    />
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import vSelect from "vue-select";

export default {
  name: "CreateChallengeChallengeType",
  components: {
    vSelect,
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
};
</script>

<style scoped>
::v-deep(.vs__selected) {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
::v-deep(.vs__selected-options) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep(.vs__dropdown-option) {
  white-space: normal;
  word-wrap: break-word;
}
</style>