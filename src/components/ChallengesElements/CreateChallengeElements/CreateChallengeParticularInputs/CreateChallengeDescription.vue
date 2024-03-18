<template>
  <div class="create_challenge_description">
    <textarea
      class="challenge_description_input general-contrast-color"
      :placeholder="$t('challenges.create_challenge.description_placeholder')"
      v-model="createChallengeStore.challengeDescription"
    ></textarea>
    <div class="input_header_wrapper general-white-bg">
      <h1
        class="challenge_description_placeholder_when_text_entered general-secondary-color"
        v-if="createChallengeStore?.challengeDescription"
      >
        {{ $t("challenges.create_challenge.description_placeholder") }}
      </h1>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

export default {
  name: "CreateChallengeDescription",
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
.create_challenge_description {
  position: relative;
}
.challenge_description_input {
  position: relative;
  border: 1px solid var(--generalColorGrey);
  background-color: var(--generalColorWhite);
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  height: 130px;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}
.challenge_description_input::placeholder {
  color: var(--generalColorSecondary);
}
.input_header_wrapper {
  padding: 5px;
  position: absolute;
  top: -14px;
  left: 15px;
  z-index: 5;
}
.challenge_description_placeholder_when_text_entered {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>