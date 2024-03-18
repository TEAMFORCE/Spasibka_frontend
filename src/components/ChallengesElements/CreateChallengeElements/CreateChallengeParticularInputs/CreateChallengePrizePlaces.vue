<template>
  <div class="create_challenge_prize_places">
    <input
      class="challenge_prize_places_input general-contrast-color"
      :placeholder="$t('challenges.create_challenge.prize_places')"
      maxlength="3"
      v-model="createChallengeStore.challengePrizePlaces"
      @keypress="validate(event)"
    />
    <div class="input_header_wrapper general-white-bg">
      <h1
        class="challenge_prize_places_placeholder_when_text_entered general-secondary-color"
        v-if="createChallengeStore?.challengePrizePlaces"
      >
        {{ $t("challenges.create_challenge.prize_places") }}
      </h1>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

export default {
  name: "CreateChallengePrizePlaces",
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
  methods: {
    validate(evt) {
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
      var regex = /[0-9]|\./;
      if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
.create_challenge_prize_places {
  position: relative;
}
.challenge_prize_places_input {
  position: relative;
  border: 1px solid var(--generalColorGrey);
  background-color: var(--generalColorWhite);
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
.challenge_prize_places_input::placeholder {
  color: var(--generalColorSecondary);
}
.input_header_wrapper {
  padding: 5px;
  position: absolute;
  top: -14px;
  left: 15px;
  z-index: 5;
}
.challenge_prize_places_placeholder_when_text_entered {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>