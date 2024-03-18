<template>
  <div class="create_challenge_prize_fund">
    <input
      class="challenge_prize_fund_input general-contrast-color"
      :placeholder="$t('challenges.create_challenge.prize_fund')"
      v-model="createChallengeStore.challengePrizeFund"
    />
    <div class="input_header_wrapper general-white-bg">
      <h1
        class="challenge_prize_fund_placeholder_when_text_entered general-secondary-color"
        v-if="createChallengeStore?.challengePrizeFund"
      >
        {{ $t("challenges.create_challenge.prize_fund") }}
      </h1>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

export default {
  name: "CreateChallengePrizeFund",
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
.create_challenge_prize_fund {
  position: relative;
}
.challenge_prize_fund_input {
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
.challenge_prize_fund_input::placeholder {
  color: var(--generalColorSecondary);
}
.input_header_wrapper {
  padding: 5px;
  position: absolute;
  top: -14px;
  left: 15px;
  z-index: 5;
}
.challenge_prize_fund_placeholder_when_text_entered {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>