<template>
  <div
    ref="scrollContainer"
    class="market_orders main-layout-page general-white-bg"
  >
    <button class="back_button brand-secondary-bg" @click="goBack">
      <h1 class="back_text back-to-challenges-color">
        {{ $t("market.back") }}
      </h1>
      <img class="back_icon" :src="backIcon" />
    </button>
    <div class="header_and_filters">
      <h1 class="header_text general-contrast-color">
        {{ $t("market.order_history") }}
      </h1>
      <div class="filters">
        <button
          class="filter_button minor-info-secondary-bg"
          v-for="filter in filters"
          :class="{ active: filter.name == currentFilter.name }"
          @click="changeActiveFilter(filter)"
        >
          <h1
            class="filter_text general-contrast-color"
            :class="{ active: filter.name == currentFilter.name }"
          >
            {{ filter.name }}
          </h1>
        </button>
      </div>
    </div>
    <div class="orders">
      <div class="order_item" v-for="order in orders">
        <img class="order_photo" :src="orderImage(order)" />
        <h1 class="order_date general-secondary-color">
          {{ orderDate(order) }}
        </h1>
        <div class="order_name_and_description">
          <h1 class="order_name general-contrast-color">
            {{ order.name }} ({{ order.quantity }} шт.)
          </h1>
          <h1 class="order_description general-secondary-color">
            {{ order.description }}
          </h1>
        </div>
        <div class="order_cost_and_status">
          <div class="order_cost brand-secondary-bg">
            <h1 class="order_cost_text general-brand-color">
              {{ order.total }}
            </h1>

            <DetailTFLogoIcon />
          </div>
          <div
            class="order_status minor-success-secondary-bg"
            :class="{
              considering: order.current_status == 1,
              cancelled:
                order.current_status == 20 || order.current_status == 21,
            }"
          >
            <h1
              class="order_status_text minor-success-color"
              :class="{
                considering: order.current_status == 1,
                cancelled:
                  order.current_status == 20 || order.current_status == 21,
              }"
            >
              {{ orderStatus(order) }}
            </h1>
          </div>
        </div>
      </div>
    </div>
    <h4 v-if="loading">Загрузка...</h4>
  </div>
</template>

<script>
import { API_URIS, SERVER_IP } from "@/constants/api";
import axios from "axios";

import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

export default {
  name: "MarketOrders",
  components: {
    DetailTFLogoIcon,
  },
  data() {
    return {
      marketplaces: [],
      selectedMarketplaceID: null,

      loading: false,
      reachedEnd: false,
      pagesCount: 1,
      scrollDetectionBlock: false,

      orders: [],
      currentFilter: {
        name: this.$t("market.order_filters.all"),
        click: () => {
          this.currentFilter = this.$t("market.order_filters.all");
        },
      },
    };
  },
  mounted() {
    this.getMarketplaces();
    this.addScrollEvent();
  },
  computed: {
    backIcon() {
      return this.getImgUrl("BackIcon");
    },

    filters() {
      let filters = [];
      filters.push({
        name: this.$t("market.order_filters.all"),
        click: () => {
          this.currentFilter = this.$t("market.order_filters.all");
        },
      });
      return filters;
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/MarketImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    photoAddress(photo) {
      if (photo == null) {
        let images = require.context("@/assets/", false, /\.png$/);
        return images("./Logo.png");
      } else {
        if (photo.slice(0, 7) == "http://") {
          return photo;
        }
        return SERVER_IP + photo;
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

      const hours =
        createdAt.getHours() > 9
          ? createdAt.getHours()
          : "0" + createdAt.getHours();
      const minutes =
        createdAt.getMinutes() > 9
          ? createdAt.getMinutes()
          : "0" + createdAt.getMinutes();

      const year = createdAt.getFullYear();
      const month = createdAt.getMonth() + 1;
      const day = createdAt.getDate();

      let formattedMonth = month;
      let formattedDay = day;

      if (month < 10) formattedMonth = "0" + month;
      if (day < 10) formattedDay = "0" + day;

      return (
        hours +
        ":" +
        minutes +
        " " +
        formattedDay +
        "." +
        formattedMonth +
        "." +
        year
      );
    },
    addScrollEvent() {
      const element = document.getElementsByClassName("market_orders")[0];
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
    checkScroll() {
      const el = this.$refs.scrollContainer;
      if (el.scrollHeight <= el.clientHeight && !this.scrollDetectionBlock) {
        this.scrollDetectionBlock = true;
        this.scrollTrigger();
      }
    },
    scrollTrigger() {
      this.pagesCount++;
      this.getOrders();
    },
    orderImage(order) {
      if (order.images.length > 0) {
        return this.photoAddress(order.images[0].link);
      } else {
        return this.photoAddress(null);
      }
    },
    orderDate(order) {
      let dateString = "#";
      dateString += order.id;
      dateString += this.$t("market.ordered_at");
      dateString += this.getDisplayDate(order.created_at);
      return dateString;
    },
    orderStatus(order) {
      if (order.current_status == 1)
        return this.$t("market.orderStatuses.underConsideration");
      if (order.current_status == 5)
        return this.$t("market.orderStatuses.acceptedAwaiting");
      if (order.current_status == 6)
        return this.$t("market.orderStatuses.acceptedByUser");
      if (order.current_status == 7)
        return this.$t("market.orderStatuses.purchased");
      if (order.current_status == 8)
        return this.$t("market.orderStatuses.readyForDelivery");
      if (order.current_status == 9)
        return this.$t("market.orderStatuses.dispatchedDelivered");
      if (order.current_status == 10)
        return this.$t("market.orderStatuses.ready");
      if (order.current_status == 20)
        return this.$t("market.orderStatuses.rejected");
      if (order.current_status == 21)
        return this.$t("market.orderStatuses.canceled");
    },
    goBack() {
      this.$router.go(-1);
    },
    changeActiveFilter(filter) {
      this.currentFilter = filter;
    },
    async getMarketplaces() {
      try {
        const response = await axios.get(API_URIS.marketsAvailable);
        this.marketplaces = response.data;
        if (this.marketplaces.length > 0) {
          this.selectedMarketplaceID = this.marketplaces[0].id;
          this.getOrders();
        }
      } catch (err) {
        throw err;
      }
    },
    async getOrders() {
      if (!this.reachedEnd) {
        try {
          this.loading = true;
          const response = await axios.get(
            API_URIS.marketOrders.replace("id", this.selectedMarketplaceID) +
              "?offset=" +
              this.pagesCount +
              "&limit=20"
          );
          this.orders.push(...response.data);

          this.loading = false;
          if (response.data.length == 0) {
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
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.market_orders {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.market_orders::-webkit-scrollbar {
  width: 8px;
}
.market_orders::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.back_button {
  border-radius: 16px;
  padding: 12px 20px;
  align-items: center;
  display: flex;
  gap: 10px;
  width: fit-content;
}
.back_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
.back_icon {
  height: 24px;
  width: 24px;
}
.header_and_filters {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.header_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
}
.filters {
  display: flex;
  gap: 8px;
}
.filter_button {
  padding: 8px 14px;
  border-radius: 12px;
}
.filter_button.active {
  background-color: var(--generalBrand);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
.filter_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.filter_text.active {
  color: var(--generalColorWhite);
}
.orders {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.order_item {
  width: auto;
  max-width: 350px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}
.order_photo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
.order_date {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: left;
}
.order_name_and_description {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}
.order_description {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}
.order_cost_and_status {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.order_cost {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
}
.order_cost_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
}
.order_status {
  border-radius: 8px;
  padding: 6px 12px;
}
.order_status.considering {
  background-color: var(--minorInfoSecondaryColor);
}
.order_status.cancelled {
  background-color: var(--minorErrorSecondary);
}
.order_status_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
}
.order_status_text.considering {
  color: var(--minorInfo);
}
.order_status.cancelled {
  color: var(--minorError);
}
.detail_tf_logo_icon {
  width: 14px;
  display: flex;
  justify-content: center;
}
</style>