<template>
  <div class="create_challenge_select_sponsor">
    <div class="input_header_wrapper general-white-bg">
      <h1
        class="challenge_select_sponsor_placeholder_when_text_entered general-secondary-color"
        v-if="createChallengeStore?.selectedSponsor"
      >
        {{ $t("challenges.challenge_settings.challenge_sponsor") }}
      </h1>
    </div>
    <vSelect
      v-model="createChallengeStore.selectedSponsor"
      :options="spendingAccounts"
      :placeholder="
        $t('challenges.challenge_settings.choose_challenge_sponsor')
      "
      label="displayLabel"
    />
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import vSelect from "vue-select";

export default {
  name: "CreateChallengeSelectSponsor",
  components: {
    vSelect,
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
    spendingAccounts() {
      let personalAccounts =
        this.createChallengeStore?.challengeCreationSettings?.accounts
          ?.personal_accounts;
      let orgAccounts =
        this.createChallengeStore?.challengeCreationSettings?.accounts
          ?.organization_accounts;

      if (!personalAccounts || !orgAccounts) return [];

      personalAccounts.map((el) => {
        el.personal = true;
      });
      orgAccounts.map((el) => {
        el.personal = false;
      });

      let accounts = personalAccounts.concat(orgAccounts);
      accounts.map((el) => {
        let displayLabel = null;
        if (el.personal) {
          displayLabel = this.$t(
            "challenges.challenge_settings.personal_account"
          );
        } else {
          displayLabel = this.$t(
            "challenges.challenge_settings.organization_account"
          );
        }
        displayLabel += " (" + el.organization_name + ")";
        displayLabel +=
          ", " +
          this.$t("challenges.challenge_settings.balance") +
          ": " +
          el.amount;
        el.displayLabel = displayLabel;
      });
      return accounts;
    },
  },
};
</script>

<style scoped>
.create_challenge_select_sponsor {
  position: relative;
}
.challenge_select_sponsor_input {
  position: relative;
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
.challenge_select_sponsor_input::placeholder {
  color: var(--generalColorSecondary);
}
.input_header_wrapper {
  padding: 5px;
  position: absolute;
  top: -14px;
  left: 15px;
  z-index: 5;
}
.challenge_select_sponsor_placeholder_when_text_entered {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

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