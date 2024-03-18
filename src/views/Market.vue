<template>
  <div @click="closeAll" ref="market" class="market main-layout-page general-white-bg">
    <Loading
      class="spinner_loader"
      :active="isLoading || marketplaceLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <template v-if="defer(2)">
      <SideFilters
        @click.stop
        v-if="filtersOpened"
        :categories="categories"
        :setActiveCategoryID="activeCategoryID"
        :setMinPrice="minPrice"
        :setMaxPrice="maxPrice"
        @applyFilters="applyFilters"
        @closeFilters="closeFilters"
      />
    </template>
    <template v-if="defer(3)">
      <ItemDetails
        @click.stop
        v-if="itemDetailsOpened"
        :offerID="currentOffer.id"
        :selectedMarketplaceID="selectedMarketplaceID"
        :offersCount="offers.length"
        @closeItemDetails="closeItemDetails"
        @openCart="openCart"
        @showPreviousOffer="showPreviousOffer"
        @showNextOffer="showNextOffer"
      />
    </template>
    <template v-if="defer(4)">
      <Cart
        @click.stop
        v-if="cartOpened"
        @closeCart="closeCart"
        :selectedMarketplaceID="selectedMarketplaceID"
      />
    </template>
    <template v-if="defer(5)">
      <div class="header brand-secondary-bg" v-if="!selectedMarketplaceID">
        <h1 class="header_text general-contrast-color">
          {{ $t("market.dont_have_market") }}
        </h1>
        <BannerBrandIcon
          class="banner"
        />
      </div>
    </template>
    <template v-if="defer(6)">
      <div class="header brand-secondary-bg" v-if="selectedMarketplaceID">
        <h1 class="header_text general-contrast-color">
          {{ $t("market.title") }}
        </h1>
        <BannerBrandIcon
          class="banner"
        />
      </div>
    </template>
    <template v-if="defer(7)">
      <div class="filters_and_content" v-if="selectedMarketplaceID">
        <div class="filters">
          <div class="top_filters">
            <div class="search">
              <input
                class="search_field general-contrast-color"
                :placeholder="$t('market.search')"
                v-model="searchString"
              />
              <button class="search_button transparent-bg">
                <SearchIcon :currentColor="getGeneralColorSecondary()" />
              </button>
            </div>
            <div class="history_filters_cart">
              <button
                class="history_button brand-secondary-bg"
                @click.stop="goToMarketOrders"
              >
                <h1 class="history_button_text general-brand-color">
                  {{ $t("market.order_history") }}
                </h1>
              </button>
              <button
                class="filter_button tooltip_container brand-secondary-bg"
                @click.stop="openFilters"
                :data-tooltip="$t('market.filter.title')"
              >
                <div class="filter_button_shadow"></div>
                <FilterIcon />
              </button>
              <button
                class="cart_button tooltip_container brand-secondary-bg"
                @click.stop="openCart"
                :data-tooltip="$t('market.cart.title')"
              >
                <div class="cart_button_shadow"></div>
                <CartIcon />
              </button>
              <button
                v-if="isMarketAdmin"
                class="history_button brand-secondary-bg"
                @click.stop="goToMarketAdministration"
              >
                <h1 class="history_button_text general-brand-color">
                  {{ $t("market.admin_panel") }}
                </h1>
              </button>
            </div>
          </div>
          <div class="bottom_filters">
            <div class="category_filter" v-for="category in categories">
              <button
                class="category_filter_button"
                :class="{ active: category.id == activeCategoryID }"
                @click.stop="chooseCategory(category)"
              >
                <CategoryAllIcon />
              </button>
              <h1 class="category_name general-contrast-color">
                {{ category.name }}
              </h1>
            </div>
          </div>
          <div class="offers">
            <div
              class="offer"
              v-for="(offer, index) in offers"
              @click.stop="openItemDetails(offer, index)"
            >
              <div class="offer_info">
                <button class="offer_images">
                  <img class="offer_image" :src="offerPhoto(offer)" />
                  <div class="price_wrapper brand-secondary-bg">
                    <h1 class="price_text general-brand-color">
                      {{ offer.price.price_in_thanks }}
                    </h1>
                    <DetailTFLogoIcon />
                  </div>
                </button>
                <h1 class="offer_name general-dark-color">{{ offer.name }}</h1>
              </div>
              <button class="order_button general-white-bg">
                <h1 class="order_text general-contrast-color">
                  {{ $t("market.cart.order") }}
                </h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Loading from "vue3-loading-overlay";
import { defineAsyncComponent } from "vue";
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";

import Defer from "@/mixins/defer";
import BannerBrandIcon from "@/components/Icons/MarketIcons/BannerBrandIcon.vue";

export default {
  name: "Market",
  components: {
    Loading,
    SideFilters: defineAsyncComponent(() => import("@/components/MarketElements/SideFilters.vue")),
    ItemDetails: defineAsyncComponent(() => import("@/components/MarketElements/ItemDetails.vue")),
    Cart: defineAsyncComponent(() => import("@/components/MarketElements/Cart.vue")),
    SearchIcon: defineAsyncComponent(() => import("@/components/Icons/search.vue")),
    FilterIcon: defineAsyncComponent(() => import("@/components/Icons/filter.vue")),
    CartIcon: defineAsyncComponent(() => import("@/components/Icons/cart.vue")),
    CategoryAllIcon: defineAsyncComponent(() => import("@/components/Icons/categoryAll.vue")),
    DetailTFLogoIcon: defineAsyncComponent(() => import("@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue")),
    BannerBrandIcon
},
  mixins: [Defer()],
  data() {
    return {
      marketplaces: [],
      selectedMarketplaceID: null,
      offers: [],
      categories: [
        {
          id: 0,
          name: "Все",
        },
      ],
      activeCategoryID: 0,
      offersOffset: 1,
      offersLimit: 3,
      searchString: "",
      minPrice: null,
      maxPrice: null,

      filtersOpened: false,
      itemDetailsOpened: false,
      cartOpened: false,

      scrollDetectionBlock: false,
      currentOffer: null,
      currentOfferIndex: 0,
      isLoading: false,
      marketplaceLoading: false,
      stopFetching: false,

      isMarketAdmin: false,
    };
  },
  mounted() {
    this.getMarketplaces();
    this.addScrollEvent();
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal) this.positionLoader();
      }
    },
    marketplaceLoading: {
      handler(newVal) {
        if (newVal) this.positionLoader();
      }
    },
    itemDetailsOpened() {
      let footer = document.getElementsByClassName("footer");
      if (this.itemDetailsOpened) {
        footer[0].style.display = "none";
      } else {
        footer[0].style.display = "flex";
      }
    },
    searchString: {
      handler() {
        this.stopFetching = false;
        this.offersOffset = 1;
        this.getOffers();
      },
      flush: "post",
    },
  },
  computed: {
    ...mapStores(useProfileStore),
    marketBanner() {
      return this.getImgUrl("MarketBanner");
    },
    searchIcon() {
      return this.getImgUrl("SearchIcon");
    },
    filterIcon() {
      return this.getImgUrl("FilterIcon");
    },
    cartIcon() {
      return this.getImgUrl("CartIcon");
    },
    categoryFilterIcon() {
      return this.getImgUrl("CategoryFilterIcon");
    },
  },
  methods: {
    positionLoader() {
      const el = this.$refs.market;
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.display = "flex";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    getGeneralColorSecondary() {
      let generalColorSecondary = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorSecondary");
      return generalColorSecondary;
    },
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
    goToMarketAdministration() {
      this.$router.push("/admin_market_goods");
    },
    goToMarketOrders() {
      this.$router.push("/market_orders");
    },
    addScrollEvent() {
      const element = document.getElementsByClassName("market")[0];
      element.addEventListener("scroll", () => {
        if (
          Math.abs(
            element.scrollHeight - element.scrollTop - element.clientHeight
          ) <= 1
        ) {
          if (!this.scrollDetectionBlock && !this.stopFetching) {
            this.scrollDetectionBlock = true;
            // setTimeout(() => {
              this.scrollTrigger();
            // }, 500);
          }
        }
      });
    },
    scrollTrigger() {
      this.offersOffset++;
      this.getOffers();
    },
    offerPhoto(offer) {
      if (offer.images.length > 0) {
        return this.photoAddress(`${offer.images[0].link}?thumbnail=1`);
      } else {
        return this.photoAddress(null);
      }
    },
    showPreviousOffer() {
      this.currentOfferIndex--;
      if (this.currentOfferIndex < 0) {
        this.currentOfferIndex = this.offers.length - 1;
      }
      this.currentOffer = this.offers[this.currentOfferIndex];
    },
    showNextOffer() {
      this.currentOfferIndex++;
      if (this.currentOfferIndex >= this.offers.length) {
        this.currentOfferIndex = 0;
      }
      this.currentOffer = this.offers[this.currentOfferIndex];
    },
    applyFilters(categoryID, minPrice, maxPrice) {
      this.closeFilters();
      this.offersOffset = 1;
      this.stopFetching = false;
      this.activeCategoryID = categoryID;
      this.minPrice = minPrice;
      this.maxPrice = maxPrice;
      this.getOffers();
    },
    closeAll() {
      this.closeFilters();
      this.closeCart();
      this.closeItemDetails();
    },
    openFilters() {
      this.filtersOpened = true;
    },
    closeFilters() {
      this.filtersOpened = false;
    },
    openCart() {
      this.cartOpened = true;
    },
    closeCart() {
      this.cartOpened = false;
    },
    openItemDetails(offer, index) {
      this.closeCart();
      this.closeFilters();
      this.itemDetailsOpened = false;
      this.currentOffer = offer;
      this.currentOfferIndex = index;
      this.$nextTick(() => {
        this.itemDetailsOpened = true;
      });
    },
    closeItemDetails() {
      this.itemDetailsOpened = false;
      this.currentOffer = null;
      this.currentOfferIndex = 0;
    },
    async checkIfAdmin() {
      try {
        const response = await axios.post(
          API_URIS.marketAdminOffers.replace("id", this.selectedMarketplaceID) +
            "/?offset=1&limit=1"
        );
        this.isMarketAdmin = true;
      } catch (err) {
        throw err;
      }
    },
    async getMarketplaces() {
      try {
        this.marketplaceLoading = true;
        const response = await axios.get(API_URIS.marketsAvailable);
        this.marketplaces = response.data;
        if (this.marketplaces.length > 0) {
          this.selectedMarketplaceID = this.marketplaces[0].id;
          await Promise.all([
            this.checkIfAdmin(),
            this.getCategories(),
            this.getOffers(),
          ]);
        }
        this.marketplaceLoading = false;
      } catch (err) {
        this.marketplaceLoading = false;
        throw err;
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(
          API_URIS.marketCategories.replace("id", this.selectedMarketplaceID)
        );
        this.categories.push(...response.data);
      } catch (err) {
        throw err;
      }
    },
    async getOffers(orderBy, isDescendingOrder) {
      try {
        this.isLoading = true;
        let params = {
          offset: this.offersOffset,
          limit: this.offersLimit
        };
        if (orderBy) params.order_by = orderBy;
        if (isDescendingOrder) params.desc = 1;
        if (this.activeCategoryID > 0) params.category = this.activeCategoryID;
        if (this.searchString) params.contain = this.searchString;
        if (this.minPrice) params.min_price = this.minPrice;
        if (this.maxPrice) params.max_price = this.maxPrice;
        const response = await axios.get(
          API_URIS.marketOffers.replace("id", this.selectedMarketplaceID), {
            params
          }
        );
        if (response.data.length < this.offersLimit) {
          this.stopFetching = true;
        }
        this.scrollDetectionBlock = false;
        if (this.offersOffset > 1) {
          this.offers.push(...response.data);
        } else {
          this.offers = response.data;
        }
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        throw err;
      }
    },
    chooseCategory(category) {
      this.offersOffset = 1;
      this.activeCategoryID = category.id;
      this.stopFetching = false;
      this.getOffers();
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.market {
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
.market::-webkit-scrollbar {
  width: 8px;
}
.market::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.header {
  position: relative;
  align-items: center;
  padding: 45px 42px;
  border-radius: 20px;
}
.header_text {
  position: relative;
  z-index: 3;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
}
.banner {
  position: absolute;
  top: 0px;
  right: 25px;
  height: 126px;
}
@media (max-width: 600px) {
  .banner {
    display: none;
  }
}
.filters_and_content {
  display: flex;
  flex-direction: column;
  gap: 38px;
}
.filters {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.top_filters {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
@media (max-width: 750px) {
  .top_filters {
    flex-wrap: wrap;
  }
}
.search {
  max-width: 702px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 4px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 14px 16px;
}

.search_field {
  width: 100%;
  border-style: none;
  background-color: var(--generalColorWhite);
}
.search_field::placeholder {
  color: var(--generalColorSecondary);
}
.search_button {
  height: 24px;
  width: 24px;
}
.search_icon {
  height: 24px;
  width: 24px;
}

.history_filters_cart {
  display: flex;
  gap: 20px;
}
@media (max-width: 520px) {
  .history_filters_cart {
    flex-wrap: wrap;
  }
}
.history_button {
  padding: 15px 20px;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.07);
  border-radius: 30px;
}
.history_button_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}
.filter_button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  border-radius: 50px;
  width: 52px;
  height: 52px;
  position: relative;
}
.filter_button_shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 52px;
  height: 52px;
  border-radius: 50px;
  box-shadow: 0px 10px 20px var(--generalBrand);
  opacity: 0.3;
}

.cart_button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  border-radius: 50px;
  width: 52px;
  height: 52px;
  position: relative;
}
.cart_button_shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 52px;
  height: 52px;
  border-radius: 50px;
  box-shadow: 0px 10px 20px var(--generalBrand);
  opacity: 0.3;
}
.bottom_filters {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}
.category_filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.category_filter_button {
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eef2fa;
  border-radius: 50%;
}
.category_filter_button.active {
  background-color: var(--secondaryColorBrand);
}
.category_filter_icon {
  width: 32px;
  height: 32px;
}
.category_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.offers {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.offer {
  max-width: 268px;
  width: 100%;
  padding: 8px 8px 16px 8px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
}
.offer_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.offer_images {
  height: 144px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}
.offer_image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.price_wrapper {
  position: absolute;
  padding: 7px 12px;
  left: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  justify-content: space-between;
}
.price_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
}
.thanks_icon {
  height: 12px;
  width: 12px;
}
.offer_name {
  margin: 0px 8px;
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}
.order_button {
  margin: 0px 8px;
  padding: 4px;
  display: flex;
  justify-content: center;
  border: 1px solid var(--generalColorGrey);
  border-radius: 6px;
}
.order_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.search_icon {
  width: 18px;
  height: 18px;
}
.filter_icon {
  width: 14px;
  height: 14px;
}
.cart_icon {
  width: 14px;
  height: 18px;
}
.category_all_icon {
  width: 21px;
  height: 21px;
}
.detail_tf_logo_icon {
  width: 14px;
  display: flex;
  justify-content: center;
  margin: 2px 0 0 0;
}
</style>