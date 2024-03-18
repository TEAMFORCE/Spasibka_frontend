<template>
  <div ref="scrollContainer" class="history main-layout-page general-white-bg">
    <TransactionCancel
      v-if="transactionCancelEnabled"
      @cancelTransaction="cancelTransaction"
      @returnBack="closeTransactionCancel"
    />
    <div class="name_and_balance transparent-bg">
      <h1 class="page_name">
        {{ $t("history.history") }}
      </h1>
    </div>
    <div v-if="!groupByUser" class="history_filters general-white-bg">
      <div class="recipient_filters">
        <button
          class="recipient_filter minor-info-secondary-bg"
          v-for="item in recipientFilters"
          :class="{ active: item.id == recipientFilterId }"
          @click="item.click"
        >
          <h1
            class="recipient_filter_text general-contrast-color"
            :class="{ active: item.id == recipientFilterId }"
          >
            {{ item.name }}
          </h1>
        </button>
      </div>
    </div>
    <!-- <div class="user_and_period_filter">
      <div class="group_by_user general-contrast-color">
        <input v-model="groupByUser" type="checkbox" class="checkbox" />
        {{ $t("history.group_by_user") }}
      </div>
    </div> -->
    <div class="transactions">
      <div
        class="transactions_by_dates general-white-bg"
        v-for="(day, index) in transactionsByDates"
      >
        <hr v-if="index > 0" class="days_separator" />
        <h1 class="transaction_updated_time general-contrast-color">
          {{ getDisplayDate(day.updated_at) }}
        </h1>
        <div
          class="transactions_of_day"
          v-for="(item, index) in day.transactions"
        >
          <hr v-if="index > 0" class="transactions_separator" />
          <TransactionItemGrouped
            v-if="groupByUser"
            :transaction="item"
            :myUserID="profileInfo?.profile.id"
          />
          <TransactionItem
            v-else
            @enableTransactionCancel="enableTransactionCancel"
            :transaction="item"
            :myUserID="profileInfo?.profile.id"
          />
        </div>
      </div>
      <h4 v-if="loading">
        {{ $t("history.loading") }}
      </h4>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import { notify } from "@/general-scripts/toast-notification";
import Datepicker from "@vuepic/vue-datepicker";

export default {
  name: "History",
  components: {
    TransactionItem: defineAsyncComponent(() =>
      import("@/components/TransactionItem.vue")
    ),
    BalanceForOtherPages: defineAsyncComponent(() =>
      import("@/components/MainPageElements/BalanceForOtherPages.vue")
    ),
    TransactionCancel: defineAsyncComponent(() =>
      import("@/components/HistoryElements/TransactionCancel.vue")
    ),
    TransactionItemGrouped: defineAsyncComponent(() =>
      import("@/components/HistoryElements/TransactionItemGrouped.vue")
    ),
    Datepicker,
  },
  data() {
    return {
      dateRangeStart: null,
      dateRangeEnd: null,
      groupByUser: false,

      selectedTransaction: null,
      transactionCancelEnabled: false,
      loading: false,
      reachedEnd: false,
      pagesCount: 1,
      transactions: [],
      recipientFilterId: 1,
      recipientFilters: [
        {
          id: 1,
          name: this.$t("history.filters.all"),
          click: () => (this.recipientFilterId = 1),
        },
        {
          id: 2,
          name: this.$t("history.filters.received"),
          click: () => (this.recipientFilterId = 2),
        },
        {
          id: 3,
          name: this.$t("history.filters.sended"),
          click: () => (this.recipientFilterId = 3),
        },
      ],
      profileInfo: null,
      scrollDetectionBlock: false,
    };
  },
  mounted() {
    this.getProfileInfo();
    this.getTransactions();
    const element = document.getElementsByClassName("history")[0];
    element.addEventListener("scroll", () => {
      if (
        Math.abs(
          element.scrollHeight - element.scrollTop - element.clientHeight
        ) <= 1
      ) {
        if (!this.scrollDetectionBlock) {
          this.scrollDetectionBlock = true;
          setTimeout(() => {
            this.scrollTrigger();
          }, 500);
        }
      }
    });
  },
  watch: {
    recipientFilterId() {
      (this.reachedEnd = false), (this.pagesCount = 1);
      this.transactions = [];
      this.getTransactions();
    },
    groupByUser: {
      handler(newVal) {
        if (newVal) {
          this.reachedEnd = false;
          this.pagesCount = 1;
          this.transactions = [];
          this.getTransactionsGrouped();
        } else {
          this.reachedEnd = false;
          this.pagesCount = 1;
          this.transactions = [];
          this.getTransactions();
        }
      },
    },
  },
  computed: {
    transactionsByDates() {
      let transactionsByDates = [];
      if (this.transactions?.length > 0) {
        let firstDay = {
          updated_at:
            this.transactions[0].updated_at || this.transactions[0].date,
          transactions: [this.transactions[0]],
        };
        transactionsByDates.push(firstDay);
      }
      for (let i = 1; i < this.transactions.length; ++i) {
        let prevTransactionDate = new Date(
          Date.parse(
            this.transactions[i - 1].updated_at || this.transactions[i - 1].date
          )
        );
        let curTransactionDate = new Date(
          Date.parse(
            this.transactions[i].updated_at || this.transactions[i].date
          )
        );
        let localDate = new Date(Date.now());

        let prevTransactionTimeZoneOffset =
          prevTransactionDate.getTimezoneOffset();
        let curTransactionTimeZoneOffset =
          curTransactionDate.getTimezoneOffset();
        let localTimeZoneOffset = localDate.getTimezoneOffset();

        prevTransactionDate.setTime(
          prevTransactionDate.getTime() -
            (localTimeZoneOffset - prevTransactionTimeZoneOffset) * 60 * 1000
        );
        curTransactionDate.setTime(
          curTransactionDate.getTime() -
            (localTimeZoneOffset - curTransactionTimeZoneOffset) * 60 * 1000
        );

        if (
          prevTransactionDate.getFullYear() ==
            curTransactionDate.getFullYear() &&
          prevTransactionDate.getMonth() == curTransactionDate.getMonth() &&
          prevTransactionDate.getDate() == curTransactionDate.getDate()
        ) {
          transactionsByDates[transactionsByDates.length - 1].transactions.push(
            this.transactions[i]
          );
        } else {
          let currentDay = {
            updated_at:
              this.transactions[i].updated_at || this.transactions[i].date,
            transactions: [this.transactions[i]],
          };
          transactionsByDates.push(currentDay);
        }
      }
      return transactionsByDates;
    },
  },
  methods: {
    async cancelTransaction() {
      try {
        await axios.put(
          API_URIS.cancelTransactionURL + this.selectedTransaction.id + "/",
          {
            status: "C",
          }
        );
        notify(this.$t("history.transaction_cancelled"), "success");
        this.closeTransactionCancel();
        this.pagesCount = 1;
        this.reachedEnd = false;
        this.transactions = [];
        this.getTransactions();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    closeTransactionCancel() {
      this.transactionCancelEnabled = false;
    },
    enableTransactionCancel(transaction) {
      this.selectedTransaction = transaction;
      this.transactionCancelEnabled = true;
    },
    async getProfileInfo() {
      try {
        const response = await axios.get(API_URIS.userProfileURL);
        this.profileInfo = response.data;
      } catch (err) {
        throw err;
      }
    },
    checkScroll() {
      const el = this.$refs.scrollContainer;
      if (el.scrollHeight <= el.clientHeight && !this.scrollDetectionBlock) {
        this.scrollDetectionBlock = true;
        this.scrollTrigger();
      }
    },
    scrollTrigger() {
      this.pagesCount++;
      if (this.groupByUser) this.getTransactionsGrouped();
      else this.getTransactions();
    },
    async getTransactionsGrouped() {
      if (!this.reachedEnd) {
        try {
          this.loading = true;
          const response = await axios.get(
            API_URIS.userTransactionsGroup +
              "?offset=" +
              this.pagesCount +
              "&limit=20"
          );
          this.transactions.push(...response.data.data);
          this.loading = false;
          if (response.data.data.length < 20) {
            this.reachedEnd = true;
          }
          this.scrollDetectionBlock = false;
          this.$nextTick(() => {
            this.checkScroll();
          });
        } catch (err) {
          this.loading = false;
          throw err;
        }
      }
    },
    async getTransactions() {
      if (!this.reachedEnd) {
        try {
          this.loading = true;
          let filterParameter = "";
          if (this.recipientFilterId == 2) filterParameter = "&received_only=1";
          else if (this.recipientFilterId == 3)
            filterParameter = "&sent_only=1";
          const response = await axios.get(
            API_URIS.userTransactionsURL +
              "?offset=" +
              this.pagesCount +
              "&limit=20" +
              filterParameter
          );
          this.transactions.push(...response.data);
          this.loading = false;
          if (response.data.length < 20) {
            this.reachedEnd = true;
          }
          this.scrollDetectionBlock = false;

          this.$nextTick(() => {
            this.checkScroll();
          });
        } catch (err) {
          this.loading = false;
          throw err;
        }
      }
    },
    getDisplayDate(data) {
      let createdAt = new Date(Date.parse(data));
      let currentDate = new Date(Date.now());

      let createdAtTimeZoneOffset = createdAt.getTimezoneOffset();
      let currentTimeZoneOffset = currentDate.getTimezoneOffset();
      let timeZoneOffsetDifference =
        currentTimeZoneOffset - createdAtTimeZoneOffset;

      createdAt.setTime(
        createdAt.getTime() - timeZoneOffsetDifference * 60 * 1000
      );

      if (
        createdAt.getFullYear() == currentDate.getFullYear() &&
        createdAt.getMonth() == currentDate.getMonth() &&
        createdAt.getDate() == currentDate.getDate()
      ) {
        return this.$t("history.displayedDate.today");
      } else {
        createdAt.setDate(createdAt.getDate() + 1);
        if (
          createdAt.getFullYear() == currentDate.getFullYear() &&
          createdAt.getMonth() == currentDate.getMonth() &&
          createdAt.getDate() == currentDate.getDate()
        ) {
          return this.$t("history.displayedDate.yesterday");
        } else {
          createdAt.setDate(createdAt.getDate() - 1);
        }
      }

      let day = createdAt.getDate();
      let month = createdAt.getMonth();
      let months = [
        this.$t("history.displayedDate.months.January"),
        this.$t("history.displayedDate.months.February"),
        this.$t("history.displayedDate.months.March"),
        this.$t("history.displayedDate.months.April"),
        this.$t("history.displayedDate.months.May"),
        this.$t("history.displayedDate.months.June"),
        this.$t("history.displayedDate.months.July"),
        this.$t("history.displayedDate.months.August"),
        this.$t("history.displayedDate.months.September"),
        this.$t("history.displayedDate.months.October"),
        this.$t("history.displayedDate.months.November"),
        this.$t("history.displayedDate.months.December"),
      ];
      return day + " " + months[month];
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
.history {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.history::-webkit-scrollbar {
  width: 8px;
}
.history::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.name_and_balance {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.page_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
}
.history_filters {
  width: 100%;
  padding: 20px;
  position: sticky;
  top: -52px;
  margin: -20px 0px -20px -20px;
  z-index: 3;
  display: flex;
  justify-content: space-between;
}
.recipient_filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.recipient_filter {
  padding: 8px 14px;
  border-radius: 12px;
}
.recipient_filter_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.recipient_filter_text.active {
  color: var(--generalColorWhite);
}
.recipient_filter.active {
  background-color: var(--generalBrand);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
.user_and_period_filter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}
.group_by_user {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
}
::v-deep(.dp__input) {
  height: 40px !important;
  border-radius: 8px;
}
.period_selector {
  width: 130px;
}

.period_filter {
  display: flex;
  gap: 16px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
}
.transactions {
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.transactions_by_dates {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
hr {
  margin: 0px;
}
.days_separator {
  border: 0px;
  border-top: 1px solid var(--minorInfoSecondaryColor);
}
.transaction_updated_time {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 36px;
  text-align: left;
}
.transactions_of_day {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.transactions_separator {
  border: 0px;
  border-top: 1px solid var(--generalColorGrey);
  opacity: 0.5;
}
</style>
