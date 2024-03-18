<template>
  <div class="transactions_table">
    <vue-good-table
      :columns="columns"
      :rows="transactionsList"
      styleClass="vgt-table striped"
    >
    </vue-good-table>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";

export default {
  name: "TransactionsTable",
  props: {
    transactionsList: {
      required: true
    }
  },
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      columns: [
        {
          label: this.$t("organization.settings.sender"),
          field: 'senderDisplayName',
          tdClass: "brand-colored"
        },
        {
          label: this.$t("organization.settings.sender_account"),
          field: 'sender_account',
          tdClass: "contrast-colored"
        },
        {
          label: this.$t("organization.settings.recipient"),
          field: 'recipientDisplayName',
          tdClass: "brand-colored"
        },
        {
          label: this.$t("organization.settings.recipient_account"),
          field: 'recipient_account',
          tdClass: "contrast-colored"
        },
        {
          label: this.$t("organization.settings.transaction_amount"),
          field: 'amount',
          tdClass: "contrast-colored"
        },
      ],
    }
  },
}
</script>

<style scoped>
.transactions_table {
  overflow-x: auto;
  padding-right: 52px;
  padding-bottom: 52px;
}
::v-deep(.vgt-table) {
  border: none;
}
::v-deep(.vgt-table th.sortable button:before) {
  display: none;
}
::v-deep(.vgt-table th.sortable button:after) {
  display: none;
}
::v-deep(.vgt-table thead th) {
  color: var(--generalContrast);
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  border-bottom: 2px solid var(--generalColorGrey);
  background: none;
}
::v-deep(.vgt-table.striped tbody tr:nth-of-type(odd)) {
  background-color: var(--generalColorWhite);
}
::v-deep(.vgt-inner-wrap) {
  box-shadow: none;
}
::v-deep(.brand-colored) {
  color: var(--generalBrand);
}
::v-deep(.contrast-colored) {
  color: var(--generalContrast);
}
</style>