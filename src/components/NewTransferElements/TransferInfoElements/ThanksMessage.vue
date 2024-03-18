<template>
  <div class="thanks_message">
    <h1 class="input_field_description general-secondary-color">
      {{ $t("new_transfer.message_to_receiver") }}
    </h1>
    <div class="textarea_wrapper">
      <textarea
        ref="thanks_message_textarea"
        class="input_field general-contrast-color"
        v-model="thanksMessage"
        :maxLength="maxInputLength"
        :placeholder="$t('new_transfer.enter_message_to_receiver')"
      >
      </textarea>
      <h1 class="input_symbols_count general-secondary-color">
        {{ thanksMessage.length }} / {{ maxInputLength }}
      </h1>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

export default {
  name: "ThanksMessage",
  data() {
    return {
      maxInputLength: 1000,
      thanksMessage: "",
    };
  },
  computed: {
    ...mapStores(useNewTransferStore),
  },
  watch: {
    thanksMessage: {
      handler() {
        this.newTransferStore.thanksMessage = this.thanksMessage;
        this.adjustTextareaHeight();
      },
    },
  },
  methods: {
    adjustTextareaHeight() {
      this.$refs.thanks_message_textarea.style.height = "auto";
      this.$refs.thanks_message_textarea.style.height =
        this.$refs.thanks_message_textarea.scrollHeight + "px";
    },
  },
};
</script>

<style >
.thanks_message {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input_field_description {
  text-align: left;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalColorSecondary);
}
.textarea_wrapper {
  max-width: 1130px;
  position: relative;
  display: flex;
}
.input_field {
  width: 100%;
  max-width: 1104px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--neutral5);
  background-color: var(--generalColorWhite);
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: var(--generalContrast);
}
.input_field::placeholder {
  color: var(--generalContrast);
  font-family: "Roboto";
  font-size: 16px;
}
.vs__selected {
  text-align: left !important;
  margin: 2px 0 0 0;
  color: var(--generalContrast) !important;
}

.input_symbols_count {
  position: absolute;
  right: 10px;
  bottom: 0px;

  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
</style>