<template>
  <div class="transaction_cancel_wrapper">
    <div class="transaction_cancel general-white-bg">
      <h1 class="transaction_cancel_header">
        {{ $t("history.transaction_cancel_header") }}
      </h1>
      <TransactionCancelIcon
        class="transaction_cancel_icon"
      />
      <div class="action_buttons">
        <button 
          class="action_button brand-secondary-bg general-brand-color"
          @click="$emit('cancelTransaction')"
        >
          {{ $t("history.cancel") }}
        </button>
        <button 
          @click="$emit('returnBack')"
          class="action_button general-brand-bg general-white-color"
        >
          {{ $t("history.return_back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TransactionCancelIcon from "@/components/Icons/HistoryIcons/TransactionCancelIcon.vue";

export default {
  name: "TransactionCancel",
  components: {
    TransactionCancelIcon
  },
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.transaction_cancel_wrapper {
  position: fixed;
  z-index: 1000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
.transaction_cancel {
  width: 100%;
  max-width: 1000px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;   
  padding: 32px;
  gap: 16px;
}
@media (max-width: 1920px) {
  .transaction_cancel {
    max-width: 938px;
  }
}
@media (max-width: 1440px) {
  .transaction_cancel {
    max-width: 702px;
  }
}
@media (max-width: 768px) {
  .transaction_cancel_icon {
    display: none;
  }
  .transaction_cancel_wrapper {
    align-items: flex-end;
  }
  .transaction_cancel {
    width: 360px;
  }
  .action_buttons {
    flex-direction: column;
  }
  .action_button {
    width: 100% !important;
  }
}

.transaction_cancel_header {
  font-family: "Golos";
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 36px;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>