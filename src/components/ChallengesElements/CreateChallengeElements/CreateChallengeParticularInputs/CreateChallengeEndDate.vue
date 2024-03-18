<template>
  <div class="create_challenge_end_date">
    <div class="input_field_wrapper">
      <div
        v-if="createChallengeStore.challengeEndDate"
        class="input_field_placeholder general-secondary-color general-white-bg"
      >
        {{ $t("challenges.create_challenge.end_date") }}
      </div>
      <Datepicker
        v-model="createChallengeStore.challengeEndDate"
        class="challenge_date_picker"
        text-input
        auto-apply
        format="dd.MM.yyyy"
        position="left"
        :placeholder="$t('challenges.create_challenge.end_date')"
        :enable-time-picker="false"
      />
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";
import Datepicker from "@vuepic/vue-datepicker";

export default {
  name: "CreateChallengeEndDate",
  components: {
    Datepicker,
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
};
</script>

<style scoped>
.create_challenge_end_date {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.challenge_end_date_input {
  position: relative;
  border: 1px solid var(--generalColorGrey);
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
.challenge_end_date_input::placeholder {
  color: var(--generalColorSecondary);
}

.challenge_end_date_placeholder_when_text_entered {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
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

<style>
.dp__input_wrap > svg {
  display: none;
}
.dp__input_wrap > input::placeholder {
  color: var(--generalContrast) !important;
  font-size: 14px;
}
.dp__input {
  padding: 12px !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  background-color: var(--generalColorWhite) !important;
}
</style>