<template>
  <div class="create_challenge_deferred_launch">
    <div class="deferred_challenge_creation">
      <div class="deferred_challenge_checkbox general-contrast-color">
        <input
          type="checkbox"
          class="checkbox general-white-bg"
          v-model="createChallengeStore.challengeDeferred"
        />
        {{ $t("challenges.create_challenge.deferred_creation") }}
      </div>
      <div class="input_field_wrapper">
        <div
          v-if="
            createChallengeStore?.challengeDeferred &&
            createChallengeStore.challengeStartDate
          "
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("challenges.create_challenge.start_date") }}
        </div>
        <Datepicker
          v-if="createChallengeStore?.challengeDeferred"
          v-model="createChallengeStore.challengeStartDate"
          class="challenge_date_picker"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          locale="ru"
          position="left"
          :placeholder="$t('challenges.create_challenge.start_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "CreateChallengeDeferredLaunch",
  components: {
    Datepicker,
    CloseIcon,
  },
  data() {
    return {};
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
};
</script>

<style scoped>
.deferred_challenge_creation {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.deferred_challenge_checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.checkbox {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: var(--generalColorWhite);
  border-radius: 2px !important;
  border: 1px solid var(--neutral5) !important;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>
