<template>
  <div class="organization_settings_transactions">
    <CreateTransaction
      v-if="transactionCreationEnabled"
      @cancelTransactionCreation="cancelTransactionCreation"
      @createTransactionMultipleRecipients="createTransactionMultipleRecipients"
      @createTransaction="createTransaction"
    />
    <h1 class="tab_description general-contrast-color">
      {{ $t("organization.settings.transactions_tab_description") }}
    </h1>
    <div 
      class="create_and_filter"
    >
      <button 
        class="create_transaction_button tooltip_container brand-secondary-bg" 
        @click="openTransactionCreation"
        :data-tooltip="$t('organization.create_transaction')"
      >
        <AddTransactionIcon />
      </button>
      <!-- <vSelect
        class="transaction_type_filter"
        v-model="selectedTransactionType"
        :options="transactionTypes"
        :placeholder="$t('organization.settings.transaction_type')"
        label="name"
      /> -->
      <div class="checkbox_and_filter_name">
        <input
          v-model="onlyManualTransactions"
          type="checkbox"
        />
        {{ $t("organization.settings.manual_thanks_by_admin") }}
      </div>
    </div>
    <TransactionsTable
      :transactionsList="transactionsList"
    />
  </div>
</template>

<script>
import AddTransactionIcon from "@/components/Icons/OrganizationAdministrationIcons/AddTransactionIcon.vue";
import CreateTransaction from "@/components/OrganizationAdministrationElements/SettingsComponents/TransactionsAdminComponents/CreateTransaction.vue";
import TransactionsTable from "@/components/OrganizationAdministrationElements/SettingsComponents/TransactionsAdminComponents/TransactionsTable.vue";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import vSelect from "vue-select";
import axios from "axios";

export default {
  name: "OrganizationSettingsTransactions",
  components: { 
    AddTransactionIcon, 
    CreateTransaction, 
    TransactionsTable,
    vSelect 
  },
  data() {
    return {
      onlyManualTransactions: false,

      transactionCreationEnabled: false,
      transactionsList: [],

      selectedTransactionType: null,
      transactionTypes: [
        {
          name: this.$t("organization.settings.thanks_between_people"),
          class: "T",
        },
        {
          name: this.$t("organization.settings.thanks_sent_to_challenges"),
          class: "H",
        },
        {
          name: this.$t("organization.settings.returns_from_challenges"),
          class: "F",
        },
        {
          name: this.$t("organization.settings.manual_thanks_by_admin"),
          class: "M",
        },
        {
          name: this.$t("organization.settings.winnings_from_challenges"),
          class: "W",
        },
        {
          name: this.$t("organization.settings.purchases_in_market"),
          class: "P",
        },
      ]
    };
  },
  mounted() {
    this.updateTransactionsList();
  },
  watch: {
    onlyManualTransactions: {
      handler() {
        this.updateTransactionsList();
      },
    }
  },
  methods: {
    openTransactionCreation() {
      this.transactionCreationEnabled = true;
    },
    closeTransactionCreation() {
      this.transactionCreationEnabled = false;
    },
    cancelTransactionCreation() {
      this.closeTransactionCreation();
    },
    async createTransaction(selectedSenderAccount, selectedRecipientAccount, transactionSum) {
      try {
        let requestObject = {
          amount: transactionSum
        };
        if (selectedSenderAccount) {
          requestObject.sender_account_id = selectedSenderAccount.id;
        }
        if (selectedRecipientAccount) {
          requestObject.recipient_account_id = selectedRecipientAccount.id;
        }
        await axios.post(API_URIS.transactionsAdmtransaction, requestObject);
        this.closeTransactionCreation();
        this.updateTransactionsList();
        notify(this.$t("organization.settings.transaction_created"), "success");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    },
    async createTransactionMultipleRecipients(selectedIDs, executeAt, transactionSum) {
      try {
        let areAllTrue = Array.from(selectedIDs.values()).every(value => value === true);
        let multiple = {};
        if (areAllTrue) {
          multiple.all = areAllTrue;
        } else {
          let trueCount = 0, falseCount = 0;
          let trueList = [], falseList = [];
          selectedIDs.forEach((value, key) => {
            if (value) {
              trueCount++;
              trueList.push(key);
            }
            else { 
              falseCount++;
              falseList.push(key);
            }
          });
          if (trueCount >= falseCount) { 
            multiple.black_list = falseList;
          } else {
            multiple.white_list = trueList;
          }
        }
        if (executeAt) multiple.execute_at = executeAt.toISOString(),
        await axios.post(API_URIS.transactionsAdmtransaction, {
          multiple: multiple,
          amount: transactionSum
        })
        this.closeTransactionCreation();
        this.updateTransactionsList();
        notify(this.$t("organization.settings.transaction_created"), "success");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    },
    getDisplayName(firstName, surname, tgName) {
      return (surname || firstName) ? `${surname || ''} ${firstName || ''}`.trim() : tgName;
    },
    async updateTransactionsList() {
      try {
        let params = {
          offset: 1,
          limit: 50,
        };
        if (this.onlyManualTransactions) {
          params.transaction_class = "M";
        }
        const response = await axios.get(API_URIS.analyticsByDetailing, {
          params
        });
        this.transactionsList = response.data.map(transaction => {
          const senderDisplayName = this.getDisplayName(transaction.sender?.sender_first_name, transaction.sender?.sender_surname, transaction.sender?.sender_tg_name);
          let recipientDisplayName = this.getDisplayName(transaction.recipient?.recipient_first_name, transaction.recipient?.recipient_surname, transaction.recipient?.recipient_tg_name);
          if (!recipientDisplayName) {
            if (transaction.transaction_class.id === "P") {
              recipientDisplayName = this.$t("organization.settings.purchase");
            } else {
              recipientDisplayName = this.$t("organization.settings.unknown");
            }
          }
          return {
            ...transaction,
            senderDisplayName,
            recipientDisplayName,
          };
        });
      } catch(err) {
        throw err;
      }
    }
  }
};
</script>

<style scoped>
.organization_settings_transactions {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.tab_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
}
.create_and_filter {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}
.create_transaction_button {
  position: relative;
  width: 146px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.checkbox_and_filter_name {
  align-items: center;
  display: flex;
  gap: 10px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
}
</style>
