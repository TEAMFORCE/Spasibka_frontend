<template>
  <div class="main_page_balance_wrapper">
    <div class="thanks_button_wrapper" @click="goToThanksGiving">
      <!-- <img
        class="thanks_button_icon"
        src="@/assets/MainPage/thanks_button.png"
        alt="thanks_button_icon"
      /> -->
      <SendThanksIcon />
      <p class="thanks_button_title">{{ $t("mainPage.thanksGiving") }}</p>
    </div>
    <div class="current_balance_block">
      <p class="balance_title balance_text">{{ $t("mainPage.balance") }}</p>
      <p class="balance_amount balance_text">{{ balance.income.amount }}</p>
      <p class="balance_distributed balance_text">
        {{ $t("mainPage.balanceDistributed") }}
        <span>{{ balance.income.sent }}</span>
      </p>
    </div>
    <div class="distribute_balance_block">
      <div class="distribute_balance_values">
        <p class="balance_title">{{ $t("mainPage.remainToDistribute") }}</p>
        <p class="balance_amount">{{ balance.distr.amount }}</p>
        <p class="balance_distributed">
          {{ $t("mainPage.remainToDistributeDistributed") }}
          <span>{{ balance.distr.sent }}</span>
        </p>
      </div>
      <div class="distribute_balance_expire">
        <img
          src="@/assets/expireWhite.png"
          alt="expire_date_icon"
          class="expire_icon"
        />
        <p class="expire_text">
          <span v-if="periodExists">{{ $t("mainPage.expiredTo") }}</span>
          <span v-if="periodExists">{{
            `${daysLeft} ` + `${getNoun(daysLeft)}`
          }}</span>
          <span v-else>{{ $t("mainPage.periodExpired") }}</span>
        </p>
      </div>
    </div>
    <div class="little_blocks">
      <div class="canceled_block">
        <p class="canceled_amount">
          {{ `${balance.income.cancelled + balance.distr.cancelled}` }}
        </p>
        <p class="canceled_title">{{ $t("mainPage.canceled") }}</p>
      </div>
      <!-- <div class="toAgreed_block">
        <p class="toAgreed_amount">
          {{ `${balance.income.frozen}` }}
        </p>
        <p class="toAgreed_title">{{ $t("mainPage.toAgreed") }}</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { organizationSettingsStore } from "@/store/organization-settings";

import SendThanksIcon from "@/components/Icons/BalanceIcons/SendThanksIcon.vue";

export default {
  name: "MainPageBalance",
  components: {
    SendThanksIcon,
  },
  data() {
    return {
      balance: {
        income: {
          amount: 0,
          frozen: 0,
          sent: 0,
          received: 0,
          cancelled: 0,
        },
        distr: {
          amount: 0,
          expire_date: "",
          frozen: 0,
          sent: 0,
          received: 0,
          cancelled: 0,
        },
      },
      daysLeft: 0,
    };
  },
  computed: {
    periodExists() {
      const store = organizationSettingsStore();
      return store?.isActivePeriod;
    },
  },
  methods: {
    getNoun(number) {
      let n = Math.abs(number);
      n %= 100;
      if (n >= 5 && n <= 20) {
        return this.$t("mainPage.dayMany");
      }
      n %= 10;
      if (n === 1) {
        return this.$t("mainPage.dayOne");
      }
      if (n >= 2 && n <= 4) {
        return this.$t("mainPage.dayPlur");
      }
      return this.$t("mainPage.dayMany");
    },
    async getBalance() {
      try {
        let response = await axios.get(API_URIS.getBalanceURL);
        this.balance = response.data;
        this.getNumberOfDays(new Date(), response.data.distr.expire_date);
      } catch (error) {
        throw error;
      }
    },
    getNumberOfDays(start, end) {
      const date1 = new Date(start);
      const date2 = new Date(end);
      // One day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      // Calculating the time difference between two dates
      const diffInTime = date2.getTime() - date1.getTime();
      // Calculating the no. of days between two dates
      const diffInDays = Math.ceil(diffInTime / oneDay);

      // return diffInDays;
      this.daysLeft = Math.max(0, diffInDays);
    },
    goToThanksGiving() {
      this.$router.push("/new_transfer");
    },
  },
  mounted() {
    this.getBalance();
  },
};
</script>

<style scoped>
@media (max-width: 11520px) {
  .main_page_balance_wrapper {
    width: auto;
    background-color: var(--generalColorWhite);
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
    padding: 52px 52px 52px 52px;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
  .thanks_button_wrapper {
    width: 200px;
    height: 155px;
    border-radius: 20px;
    background-color: var(--generalBrand);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: 0.3s;
  }
  .thanks_button_wrapper:hover {
    background-color: #e43500;
    cursor: pointer;
  }
  .thanks_button_icon {
    width: 70px;
  }
  .thanks_button_title {
    font-family: "Golos";
    font-weight: 700;
    font-size: 16px;
    margin: 0;
    color: var(--generalColorWhite);
  }
  .current_balance_block {
    width: 36%;
    height: 131px;
    border-radius: 20px;
    background: linear-gradient(94.94deg, #f5ae4c -3.24%, #9745ff 100.13%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 24px 0 0 23px;
  }
  .balance_title {
    font-family: "Golos";
    font-weight: 600;
    font-size: 16px;
    margin: 0;
    color: var(--generalColorWhite);
    text-align: left;
  }
  .balance_amount {
    font-family: "Golos";
    font-weight: 700;
    font-size: 32px;
    margin: 0;
    color: var(--generalColorWhite);
  }
  .balance_distributed {
    font-family: "Golos";
    font-weight: 400;
    font-size: 16px;
    margin: 0;
    color: var(--generalColorWhite);
    text-align: left;
  }
  .distribute_balance_block {
    width: 36%;
    height: 131px;
    border-radius: 20px;
    background: linear-gradient(93.97deg, #52c0ff 6.49%, #634fe6 93.51%),
      #f15929;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 6px;
    padding: 24px 0 0 23px;
  }
  .distribute_balance_values {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .distribute_balance_expire {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 116px;
    height: 90px;
    border: 1px solid var(--generalColorWhite);
    border-radius: 12px;
    margin: 0 24px 0 0;
  }
  .expire_icon {
    width: 12px;
  }
  .expire_text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--generalColorWhite);
    font-family: "Golos";
    font-weight: 500;
    font-size: 12px;
  }
  .little_blocks {
    width: 34%;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
  .canceled_block {
    padding: 24px;
    background-color: var(--minorErrorSecondary);
    height: 107px;
    width: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .toAgreed_block {
    padding: 24px;
    background-color: var(--minorSuccessSecondary);
    height: 107px;
    width: 48%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
  .canceled_amount {
    font-family: "Golos";
    font-weight: 500;
    font-size: 32px;
    margin: 0;
    color: #dc283a;
  }
  .canceled_title {
    font-family: "Golos";
    font-weight: 500;
    font-size: 16px;
    margin: 0;
    color: #dc283a;
  }
  .toAgreed_amount {
    font-family: "Golos";
    font-weight: 500;
    font-size: 32px;
    margin: 0;
    color: #2ac673;
  }
  .toAgreed_title {
    font-family: "Golos";
    font-weight: 500;
    font-size: 16px;
    margin: 0;
    color: #2ac673;
    text-align: left;
  }
}

@media (max-width: 1920px) {
  .current_balance_block {
    width: 24.5%;
  }
  .distribute_balance_block {
    width: 24.5%;
  }
}

@media (max-width: 1600px) {
  .current_balance_block {
    width: 30%;
  }
  .distribute_balance_block {
    width: 30%;
    /* flex-direction: column; */
  }
  /* .distribute_balance_expire {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    width: 170px;
    border: 1px solid var(--generalColorWhite);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin: 0;
  } */
  /* .expire_text {
    display: flex;
    flex-direction: row;
    gap: 4px;
  } */
  .little_blocks {
    width: 20%;
  }
  .canceled_block {
    width: 100%;
  }
  .toAgreed_block {
    width: 36%;
  }
}
@media (max-width: 1440px) {
  .current_balance_block {
    width: 30%;
  }
  .distribute_balance_block {
    flex-direction: column;
    width: 30%;
  }
  .little_blocks {
    width: 20%;
  }
  .canceled_block {
    width: 100%;
  }
  .toAgreed_block {
    width: 36%;
  }
  .distribute_balance_expire {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    width: 170px;
    border: 1px solid var(--generalColorWhite);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin: 0;
  }
  .expire_text {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
}
@media (max-width: 1280px) {
  .main_page_balance_wrapper {
    flex-direction: column;
    padding: 24px;
  }
  .thanks_button_wrapper {
    display: none;
  }
  .current_balance_block {
    width: 100%;
    height: 89px;
    padding: 24px 0;
  }
  .balance_text {
    margin: 0 0 0 24px;
  }
  .distribute_balance_block {
    width: 100%;
    flex-direction: row;
    padding: 0;
    height: auto;
  }
  .distribute_balance_values {
    padding: 24px 0 24px 24px;
  }
  .distribute_balance_expire {
    margin: 24px 24px 24px 0;
  }
  .distribute_balance_expire {
    border-radius: 12px;
  }
  .little_blocks {
    width: 100%;
  }
  .canceled_block {
    width: 100%;
    flex-direction: row;
    align-items: center;
    height: 40px;
  }
  .toAgreed_block {
    width: 44%;
    flex-direction: row;
    align-items: center;
    height: 40px;
  }
}
@media (max-width: 768px) {
  .little_blocks {
    flex-direction: column;
  }
  .canceled_block {
    width: 100%;
    padding: 0;
    height: auto;
  }
  .canceled_amount {
    padding: 24px 0 24px 24px;
  }
  .canceled_title {
    padding: 24px 24px 24px 0;
  }
  .toAgreed_block {
    width: 100%;
    padding: 0;
    height: auto;
  }
  .toAgreed_amount {
    padding: 24px 0 24px 24px;
  }
  .toAgreed_title {
    padding: 24px 24px 24px 0;
  }
}
@media (max-width: 462px) {
  .distribute_balance_block {
    flex-direction: column;
  }
  .distribute_balance_expire {
    margin: 0 0 24px 40px;
    height: auto;
  }
}
</style>