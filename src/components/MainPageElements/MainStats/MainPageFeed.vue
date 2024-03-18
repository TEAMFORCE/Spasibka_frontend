<template>
  <div
    ref="scrollContainer"
    class="feed main-layout-page general-white-bg"
    @scroll="handleScroll"
  >
    <FeedFilters
      v-if="filtersOpened"
      v-click-outside="closeFilters"
      @applyFilters="applyFilters"
      @closeFilters="closeFilters"
    />
    <h1 class="feed_header general-contrast-color">
      {{ $t("mainPage.events") }}
    </h1>

    <div class="filters_and_transactions">
      <div class="top_category_filters_and_side_filters">
        <div class="item_filters">
          <div class="filter_buttons_row">
            <button
              v-for="category in categories"
              class="filter_button"
              :class="{ active: filter === category.id }"
              @click="setFilter(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
        <button
          v-if="filter === 0"
          class="filter_toggler_button tooltip_container brand-secondary-bg"
          @click="openOrCloseFilters"
          :data-tooltip="$t('feed.filter')"
        >
          <FeedFilterIcon />
        </button>
      </div>
      <div
        class="filters general-white-bg"
        v-if="additionalInfosEnabledCount > 0"
      >
        <div v-if="additionalInfosEnabledCount > 0" class="filter_buttons_row">
          <button
            class="filter_button"
            :class="{ active: !likesVisible }"
            @click="setLikesVisibility(false)"
          >
            Комментарии
          </button>
          <button
            class="filter_button"
            :class="{ active: likesVisible }"
            @click="setLikesVisibility(true)"
          >
            Оценки
          </button>
        </div>
      </div>

      <div class="transactions_list_wrapper">
        <div class="transactions_list" v-for="item in feedItems">
          <FeedItem
            @enableAdditionalInfo="increaseAdditionalInfosEnabledCount"
            @disableAdditionalInfo="decreaseAdditionalInfosEnabledCount"
            :feedItem="item"
            :selfUserID="profileInfo?.profile.id"
            :commentsVisible="!likesVisible"
            :filtersChanged="filtersChanged"
            :windowWidth="windowWidth"
          />
        </div>
        <h4 v-if="feedStore.loading">Загрузка...</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { useStore as useFeedStore } from "@/store/feed";
import { mapStores } from "pinia";

import axios from "axios";
import { API_URIS } from "@/constants/api";

export default {
  name: "MainPageFeed",
  components: {
    FeedItem: defineAsyncComponent(() => import("@/components/FeedItem.vue")),
    BalanceForOtherPages: defineAsyncComponent(() =>
      import("@/components/MainPageElements/BalanceForOtherPages.vue")
    ),
    FeedFilters: defineAsyncComponent(() =>
      import("@/components/FeedElements/FeedFilters.vue")
    ),
    FeedFilterIcon: defineAsyncComponent(() =>
      import("@/components/Icons/FeedIcons/FeedFilterIcon.vue")
    ),
  },
  props: {},
  data() {
    return {
      windowWidth: 0,

      filtersOpened: false,

      filtersChanged: false,
      additionalInfosEnabledCount: 0,
      pagesCount: 1,

      likesVisible: false,
      filter: 0,

      filters: [
        {
          id: 0,
          name: this.$t("feed.all"),
        },
        // transactions: this.$t("feed.transactions"),
        // challenges: this.$t("feed.challenges"),
        // winners: this.$t("feed.winners"),
        // purchases: this.$t("feed.purchases"),
      ],

      reachedEnd: false,
      scrollDetectionBlock: false,
      cantCloseFilters: false,
      profileInfo: null,
    };
  },
  computed: {
    ...mapStores(useFeedStore),
    feedItems() {
      return this.feedStore.feedItems;
    },
    categories() {
      let categoriesList = [...this.filters];
      let eventtypes = this.feedStore?.feedFilters?.eventtypes;
      for (let i = 0; i < eventtypes?.length; ++i) {
        if (eventtypes[i].name !== "Покупки")
          categoriesList.push(eventtypes[i]);
      }
      return categoriesList;
    },
  },
  mounted() {
    this.getProfileInfo();

    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.feedStore.feedItems = [];
    this.feedStore.reachedEnd = false;
    this.fetchFeedItems();

    this.checkScroll();

    const element = document.getElementsByClassName("feed")[0];
    element.addEventListener("scroll", () => {
      if (
        Math.abs(
          element.scrollHeight - element.scrollTop - element.clientHeight
        ) <= 5
      ) {
        if (
          !this.scrollDetectionBlock &&
          !this.feedStore.loading &&
          !this.feedStore.reachedEnd
        ) {
          this.scrollDetectionBlock = true;
          setTimeout(() => {
            this.scrollTrigger();
          }, 500);
        }
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    applyFilters() {
      this.feedStore.feedItems = [];
      this.feedStore.reachedEnd = false;
      this.pagesCount = 1;
      this.fetchFeedItems();
      if (this.filter === 0) {
        this.feedStore.uploadFilterSettings();
      }
    },
    closeFilters() {
      if (!this.cantCloseFilters) this.filtersOpened = false;
    },
    openOrCloseFilters() {
      this.filtersOpened ^= true;
      this.cantCloseFilters = true;
      setTimeout(() => {
        this.cantCloseFilters = false;
      }, 300);
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
      if (
        el.scrollHeight <= el.clientHeight &&
        !this.scrollDetectionBlock &&
        !this.feedStore.loading
      ) {
        this.scrollDetectionBlock = true;
        this.scrollTrigger();
      }
    },
    scrollTrigger() {
      this.pagesCount++;
      this.fetchFeedItems();
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    fetchFeedItems(/*fetchAll = false*/) {
      this.feedStore.fetchFeedItems(
        this.pagesCount,
        20,
        this.filter /*fetchAll*/
      );
      this.scrollDetectionBlock = false;
      this.$nextTick(() => {
        // this.checkScroll();
      });
      this.additionalInfosEnabledCount = 0;
      this.filtersChanged ^= 1;
    },
    setFilter(type) {
      this.feedStore.feedItems = [];
      this.feedStore.reachedEnd = false;
      this.filter = type;
      this.pagesCount = 1;
      /*if (this.filter === 0) this.fetchFeedItems(true);
      else*/ this.fetchFeedItems();
    },
    increaseAdditionalInfosEnabledCount() {
      this.additionalInfosEnabledCount++;
    },
    decreaseAdditionalInfosEnabledCount() {
      this.additionalInfosEnabledCount--;
    },
    setLikesVisibility(value) {
      this.likesVisible = value;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.feed {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 24px 24px 24px;
  overflow-y: auto;
  overflow-x: hidden;
}
.feed::-webkit-scrollbar {
  width: 30px;
}
.feed::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  background-clip: content-box;
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 1440px) {
  .feed {
    width: auto;
  }
}
.feed_header {
  text-align: left;
  /* margin-bottom: -20px; */
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
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
.filters_and_transactions {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.top_category_filters_and_side_filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.filter_toggler_button {
  position: relative;
  align-self: flex-end;
  max-height: 53px;
  max-width: 53px;
  min-width: 53px;
  min-height: 53px;
  border-radius: 50px;
  padding: 14px;
  width: min-content;
  height: min-content;
}
.filters {
  width: 100%;
  padding: 20px;
  position: sticky;
  top: -52px;
  margin: -20px 0px -20px -20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.item_filters {
  display: flex;
  justify-content: space-between;
}
.filter_buttons_row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter_button {
  background-color: var(--minorInfoSecondaryColor);
  padding: 8px 14px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: var(--generalContrast);
  border-radius: 12px;
}
.filter_button.active {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
.transactions_list_wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

button:focus {
  outline: none;
}
</style>
