<template>
  <div class="app_main_page">
    <MainPageBalance />
    <!-- <template v-if="defer(2)">
      <MainPageVotings />
    </template>
    <template v-if="defer(3)">
      <MainPageCharts />
    </template>
    <template v-if="defer(4)">
      <MainPageStats />
    </template>
    <template v-if="defer(5)">
      <MainPageBirthday />
    </template>
    <template v-if="defer(6)">
      <MainPageChallenges />
    </template> -->
    <template v-if="defer(2)">
      <MainPageCharts />
    </template>
    <template v-if="defer(3)">
      <MainPageStats />
    </template>
    <template v-if="defer(4)">
      <MainPageBirthday />
    </template>
    <template v-if="defer(5)">
      <MainPageChallenges />
    </template>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import Defer from "@/mixins/defer";

export default {
  name: "MainPage",
  components: {
    SentThanksIcon: defineAsyncComponent(() =>
      import("@/components/Icons/NewTransferIcons/SentThanksIcon.vue")
    ),
    MainPageBalance: defineAsyncComponent(() =>
      import("@/components/MainPageElements/main-balance.vue")
    ),
    MainPageVotings: defineAsyncComponent(() =>
      import("@/components/MainPageElements/main-votings.vue")
    ),
    MainPageCharts: defineAsyncComponent(() =>
      import("@/components/MainPageElements/MainCharts/main-charts.vue")
    ),
    MainPageStats: defineAsyncComponent(() =>
      import("@/components/MainPageElements/MainStats/main-stats.vue")
    ),
    MainPageBirthday: defineAsyncComponent(() =>
      import("@/components/MainPageElements/MainBirthday/main-birthday.vue")
    ),
    MainPageChallenges: defineAsyncComponent(() =>
      import("@/components/MainPageElements/MainChallenges/main-challenges.vue")
    ),
  },
  mixins: [Defer()],
};
</script>

<style scoped>
.app_main_page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  overflow-y: auto;
}
.app_main_page::-webkit-scrollbar {
  width: 8px;
  background-color: var(--negativeSecondary);
}
.app_main_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
</style>