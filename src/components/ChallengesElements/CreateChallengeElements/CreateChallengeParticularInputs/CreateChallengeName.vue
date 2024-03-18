<template>
  <div class="create_challenge_name">
    <input
      class="challenge_name_input general-contrast-color"
      maxlength="255"
      :placeholder="$t('challenges.create_challenge.name')"
      v-model="createChallengeStore.challengeName"
    />
    <div class="input_header_wrapper general-white-bg">
      <h1
        class="challenge_name_placeholder_when_text_entered general-secondary-color"
        v-if="createChallengeStore?.challengeName"
      >
        {{ $t("challenges.create_challenge.name") }}
      </h1>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

export default {
  name: "CreateChallengeName",
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
};
</script>

<style scoped>
.create_challenge_name {
  position: relative;
}
.challenge_name_input {
  position: relative;
  background-color: var(--generalColorWhite);
  border: 1px solid var(--generalColorGrey);
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}
.challenge_name_input::placeholder {
  color: var(--generalColorSecondary);
}
.input_header_wrapper {
  padding: 5px;
  position: absolute;
  top: -14px;
  left: 15px;
  z-index: 5;
}
.challenge_name_placeholder_when_text_entered {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>