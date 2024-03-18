<template>
  <div class="thanks_amount">
    <h1 class="input_field_description general-secondary-color">
      {{ $t("new_transfer.amount") }}
    </h1>
    <input
      class="thanks_amount_input"
      :placeholder="$t('new_transfer.enter_the_amount')"
      v-model.number="amount"
      @input="onInputChange"
    />
    <div class="amount_options">
      <button
        v-for="option in amountOptions"
        class="amount_option brand-secondary-bg"
        @click="selectOption(option)"
      >
        <h1 class="amount_option_text general-brand-color">{{ option }}</h1>
        <DetailTFLogoIcon />
      </button>
    </div>
  </div>
</template>

<script>
import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";
import { mapStores } from "pinia";

export default {
  name: "ThanksAmount",
  components: {
    DetailTFLogoIcon,
  },
  data() {
    return {
      amount: null,

      amountOptions: [1, 5, 10, 25],
    };
  },
  computed: {
    ...mapStores(useNewTransferStore),
  },
  watch: {
    amount: {
      handler() {
        this.newTransferStore.thanksAmount = this.amount;
      },
      immediate: true,
    },
  },
  methods: {
    selectOption(option) {
      this.amount = option;
    },
    onInputChange(event) {
      const inputValue = event.target.value;
      const numericValue = inputValue.replace(/[^\d]/g, "");
      const noLeadingZerosValue = numericValue.replace(/^0+/, "");
      if (inputValue !== noLeadingZerosValue) {
        event.target.value = noLeadingZerosValue;
        this.amount = Number(noLeadingZerosValue);
      }
    },
  },
};
</script>

<style scoped>
.thanks_amount {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.thanks_amount_input {
  background-color: var(--generalColorWhite);
  max-width: 1104px;
  padding: 12px;
  border: 1px solid var(--neutral5);
  border-radius: 8px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.thanks_amount_input::placeholder {
  color: var(--generalContrast);
  font-family: "Roboto";
}
.input_field_description {
  text-align: left;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.amount_options {
  margin-top: 4px;
  display: flex;
  gap: 16px;
}
.amount_option {
  border-radius: 8px;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 8px 13.5px;
}
.amount_option_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: -0.3px;
}
.detail_tf_logo_icon {
  width: 14px;
  display: flex;
  justify-content: center;
}
</style>