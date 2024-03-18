<template>
  <div class="new_transfer" @click="closeTags">
    <h1
      v-if="!isPeriodActive"
      class="no_active_period_text general-contrast-color"
    >
      {{ $t("new_transfer.no_active_period") }}
    </h1>

    <div
      class="new_transfer_wrapper"
      v-else-if="!newTransferStore.transferJustSent"
    >
      <MainPageBalance />
      <Recipient />
      <TransferInfo />
    </div>

    <TransferCompleted v-else />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

import { defineAsyncComponent } from "vue";

export default {
  name: "NewTransfer",
  components: {
    TransferCompleted: defineAsyncComponent(() =>
      import("@/components/NewTransferElements/TransferCompleted.vue")
    ),
    MainPageBalance: defineAsyncComponent(() =>
      import("@/components/MainPageElements/main-balance.vue")
    ),
    Recipient: defineAsyncComponent(() =>
      import("@/components/NewTransferElements/Recipient.vue")
    ),
    TransferInfo: defineAsyncComponent(() =>
      import("@/components/NewTransferElements/TransferInfo.vue")
    ),
  },
  data() {
    return {
      isPeriodActive: true,
    };
  },
  computed: {
    ...mapStores(useNewTransferStore),
  },
  methods: {
    async checkCurrentPeriod() {
      try {
        await axios.get(API_URIS.getCurrentPeriod);
        this.isPeriodActive = true;
      } catch (err) {
        this.isPeriodActive = false;
        throw err;
      }
    },
    restoreTransferState() {
      this.newTransferStore.restoreTransferState();
    },
  },
  mounted() {
    this.checkCurrentPeriod();
  },
  beforeUnmount() {
    this.restoreTransferState();
  },
};
</script>

<style scoped>
.new_transfer {
  width: 100%;
  position: relative;
  overflow-y: auto;
}
.new_transfer::-webkit-scrollbar {
  width: 8px;
  /* background-color: var(--negativeSecondary); */
}
.new_transfer::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.new_transfer_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>