<template>
  <div class="create_transaction_wrapper">
    <div class="create_transaction general-white-bg">
      <h1 class="create_transaction_header general-contrast-color">
        {{ $t("organization.settings.transaction_addition") }}
      </h1>
      <h1 class="create_transaction_additional_info general-secondary-color">
        {{ $t("organization.settings.create_transaction_additional_info") }}
      </h1>
      <div v-show="!multipleRecipients" class="input_field_wrapper">
        <div
          v-if="selectedSender"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("organization.settings.create_transaction_sender") }}
        </div>
        <vSelect
          v-model="selectedSender"
          :options="employees"
          label="display_name"
          :placeholder="$t('organization.settings.create_transaction_sender')"
          @option:selected="getSenderAccounts"
          @option:deselected="clearSenderAccounts"
        />
      </div>
      <div v-show="!multipleRecipients" class="input_field_wrapper">
        <div
          v-if="selectedSenderAccount"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("organization.settings.create_transaction_sender_account") }}
        </div>
        <vSelect
          v-model="selectedSenderAccount"
          :options="senderAccounts"
          label="name"
          :placeholder="
            $t('organization.settings.create_transaction_sender_account')
          "
        />
      </div>
      <div v-show="!multipleRecipients" class="input_field_wrapper">
        <div
          v-if="selectedRecipient"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("organization.settings.create_transaction_recipient") }}
        </div>
        <vSelect
          v-model="selectedRecipient"
          :options="employees"
          label="display_name"
          :placeholder="
            $t('organization.settings.create_transaction_recipient')
          "
          @option:selected="getRecipientAccounts"
          @option:deselected="clearRecipientAccounts"
        />
      </div>
      <div v-show="!multipleRecipients" class="input_field_wrapper">
        <div
          v-if="selectedRecipientAccount"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("organization.settings.create_transaction_recipient_account") }}
        </div>
        <vSelect
          v-model="selectedRecipientAccount"
          :options="recipientAccounts"
          label="name"
          :placeholder="
            $t('organization.settings.create_transaction_recipient_account')
          "
        />
      </div>
      <UsersMultiselect
        v-show="multipleRecipients"
        :createTransactions="createTransactions"
        @emitSelectedUsers="createTransactionMultipleRecipients"
      />
      <div class="input_field_wrapper">
        <div
          v-if="transactionSum"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("organization.settings.transaction_amount") }}
        </div>
        <input
          :placeholder="$t('organization.settings.transaction_amount')"
          class="transaction_sum general-contrast-color"
          v-model.number="transactionSum"
        />
      </div>
      <div v-if="multipleRecipients" class="input_field_wrapper">
        <div
          v-if="executeAt"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("organization.settings.execution_time") }}
        </div>
        <Datepicker
          v-model="executeAt"
          text-input
          auto-apply
          format="dd.MM.yyyy HH:mm"
          position="left"
          :clearable="true"
          :placeholder="$t('organization.settings.execution_time')"
          :enable-time-picker="true"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
      <div class="multiple_recipients general-contrast-color">
        <input class="checkbox" type="checkbox" v-model="multipleRecipients" />
        {{ $t("organization.send_from_org") }}
      </div>
      <div class="action_buttons">
        <button
          class="action_button general-white-color general-brand-bg"
          @click="createTransaction"
        >
          {{ $t("organization.settings.save_transaction") }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="cancelTransactionCreation"
        >
          {{ $t("organization.settings.cancel_transaction_creation") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import { API_URIS } from "@/constants/api";
import axios from "axios";
import UsersMultiselect from "./UsersMultiselect.vue";
import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "CreateTransaction",
  components: {
    vSelect,
    UsersMultiselect,
    Datepicker,
    CloseIcon,
  },
  data() {
    return {
      employees: [],

      selectedSender: null,
      selectedSenderAccount: null,
      senderAccounts: [],

      selectedRecipient: null,
      selectedRecipientAccount: null,
      recipientAccounts: [],

      orgAccounts: [],

      transactionSum: null,

      multipleRecipients: false,

      selectedOptions: [],

      createTransactions: false,

      executeAt: null,
    };
  },
  mounted() {
    this.getUsersList();
    this.getOrgAccountsList();
  },
  watch: {
    selectedSender: {
      handler() {
        this.selectedSenderAccount = null;
        if (!this.selectedSender) {
          this.senderAccounts = this.orgAccounts;
          this.processAccounts(this.senderAccounts);
        }
      },
      deep: true,
    },
    selectedRecipient: {
      handler() {
        this.selectedRecipientAccount = null;
        if (!this.selectedRecipient) {
          this.recipientAccounts = this.orgAccounts;
          this.processAccounts(this.recipientAccounts);
        }
      },
      deep: true,
    },
  },
  methods: {
    toggleSelection(optionName) {
      if (this.selectedOptions.some((obj) => obj.name === optionName)) {
        this.selectedOptions = this.selectedOptions.filter(
          (obj) => obj.name !== optionName
        );
      } else {
        this.selectedOptions.push({ name: optionName });
      }
    },
    processAccounts(array) {
      array.forEach((entry) => {
        switch (entry.type) {
          case "I":
            entry.name = this.$t("organization.settings.income_account");
            break;
          case "D":
            if (entry.challenge_name)
              entry.name = this.$t("organization.settings.challenge_account", {
                challenge_name: entry.challenge_name,
              });
            else
              entry.name = this.$t(
                "organization.settings.distribution_account"
              );
            break;
          case "F":
            entry.name = this.$t(
              "organization.settings.waiting_transactions_account"
            );
            break;
          case "P":
            entry.name = this.$t(
              "organization.settings.market_purchases_account"
            );
            break;
          default:
            entry.name = this.$t("organization.settings.unknown_account");
        }
        entry.name += ` (${this.$t("organization.settings.balance")}: ${
          entry.amount
        })`;
      });
    },
    async getUsersList() {
      try {
        const response = await axios.get(API_URIS.employees, {
          params: {
            offset: 1,
            limit: 99999,
          },
        });
        this.employees = response.data;
        this.employees.forEach((entry) => {
          let displayNameParts = [
            entry.surname,
            entry.first_name,
            entry.middle_name,
          ];
          displayNameParts = displayNameParts.filter((name) => name);
          if (displayNameParts.length > 0) {
            entry.display_name = displayNameParts.join(" ");
          } else if (entry.tg_name) {
            entry.display_name = entry.tg_name;
          } else {
            entry.display_name = entry.nickname;
          }
        });
      } catch (err) {
        throw err;
      }
    },
    async getOrgAccountsList() {
      const response = await axios.get(API_URIS.transactionsAccounts, {
        params: {
          org_id: this.$route.params.id,
        },
      });
      this.orgAccounts = response.data.data;
      if (this.senderAccounts.length === 0) {
        this.senderAccounts = this.orgAccounts;
        this.processAccounts(this.senderAccounts);
      }
      if (this.recipientAccounts.length === 0) {
        this.recipientAccounts = this.orgAccounts;
        this.processAccounts(this.recipientAccounts);
      }
    },
    async getSenderAccounts() {
      try {
        const response = await axios.get(API_URIS.transactionsAccounts, {
          params: {
            user_id: this.selectedSender.id,
            org_id: this.$route.params.id,
          },
        });
        this.senderAccounts = response.data.data;
        this.processAccounts(this.senderAccounts);
      } catch (err) {
        throw err;
      }
    },
    async getRecipientAccounts() {
      try {
        const response = await axios.get(API_URIS.transactionsAccounts, {
          params: {
            user_id: this.selectedRecipient.id,
            org_id: this.$route.params.id,
          },
        });
        this.recipientAccounts = response.data.data;
        this.processAccounts(this.recipientAccounts);
      } catch (err) {
        throw err;
      }
    },
    async createTransaction() {
      if (this.multipleRecipients) {
        this.createTransactions ^= true;
      } else {
        this.$emit(
          "createTransaction",
          this.selectedSenderAccount,
          this.selectedRecipientAccount,
          this.transactionSum
        );
      }
    },
    createTransactionMultipleRecipients(selectedIDs) {
      this.$emit(
        "createTransactionMultipleRecipients",
        selectedIDs,
        this.executeAt,
        this.transactionSum
      );
    },
    clearSenderAccounts() {
      this.selectedSenderAccount = null;
      this.senderAccounts = [];
    },
    clearRecipientAccounts() {
      this.recipientSenderAccount = null;
      this.recipientAccounts = [];
    },
    cancelTransactionCreation() {
      this.$emit("cancelTransactionCreation");
    },
  },
};
</script>

<style scoped>
.create_transaction_wrapper {
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

.create_transaction {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
}

.create_transaction_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}

.create_transaction_additional_info {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
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
.transaction_sum {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--generalColorSecondary);
  border-radius: 12px;
  padding: 12px 20px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}
.multiple_recipients {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
