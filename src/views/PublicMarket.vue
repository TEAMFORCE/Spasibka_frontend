<template>
  <div class="market_wrapper">
    <div @click="closeAll" class="market main-layout-page general-white-bg">
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
      <PublicMarketItemDetails
        @click.stop
        v-if="itemDetailsOpened"
        :currentOffer="currentOffer"
        :offerID="currentOffer.id"
        :selectedMarketplaceID="selectedMarketplaceID"
        @closeItemDetails="closeItemDetails"
      />

      <div class="header brand-secondary-bg">
        <h1 class="header_text general-contrast-color">
          {{ $t("market.title") }}
        </h1>
        <img class="banner" :src="marketBanner" />
      </div>
      <div class="filters_and_content">
        <div class="filters">
          <div class="top_filters">
            <div class="search">
              <input
                class="search_field general-contrast-color"
                :placeholder="'Поиск'"
                v-model="searchString"
              />
              <button class="search_button transparent-bg">
                <img class="search_icon" :src="searchIcon" />
              </button>
            </div>
            <div class="history_filters_cart">
              <button
                class="filter_button brand-secondary-bg"
                @click.stop="openFilters"
              >
                <img class="filter_icon" :src="filterIcon" />
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
                <img class="category_filter_icon" :src="categoryFilterIcon" />
              </button>
              <h1 class="category_name general-contrast-color">
                {{ category.name }}
              </h1>
            </div>
          </div>
          <div class="offers">
            <div
              class="offer"
              v-for="offer in offers"
              @click.stop="openItemDetails(offer)"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import SideFilters from "@/components/MarketElements/SideFilters.vue";
import PublicMarketItemDetails from "@/components/MarketElements/PublicMarketItemDetails.vue";
import Cart from "@/components/MarketElements/Cart.vue";
import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

export default {
  name: "PublicMarket",
  components: {
    SideFilters,
    PublicMarketItemDetails,
    Cart,
    DetailTFLogoIcon,
  },
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
      searchString: "",
      minPrice: null,
      maxPrice: null,

      filtersOpened: false,
      itemDetailsOpened: false,
      cartOpened: false,

      scrollDetectionBlock: false,
      currentOffer: null,
    };
  },
  mounted() {
    // this.getMarketplaces();
    this.getCategories();
    this.getOffers();
    this.addScrollEvent();
  },
  watch: {
    searchString: {
      handler() {
        this.offersOffset = 1;
        this.getOffers();
      },
      flush: "post",
    },
  },
  computed: {
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
    addScrollEvent() {
      const element = document.getElementsByClassName("market_wrapper")[0];
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
    applyFilters(categoryID, minPrice, maxPrice) {
      this.closeFilters();
      this.offersOffset = 1;
      this.activeCategoryID = categoryID;
      this.minPrice = minPrice;
      this.maxPrice = maxPrice;
      this.getOffers();
    },
    closeAll() {
      this.closeFilters();
      // this.closeCart();
      this.closeItemDetails();
    },
    openFilters() {
      this.filtersOpened = true;
    },
    closeFilters() {
      this.filtersOpened = false;
    },
    openItemDetails(offer) {
      // this.closeCart();
      this.closeFilters();
      this.itemDetailsOpened = false;
      this.currentOffer = offer;
      this.$nextTick(() => {
        this.itemDetailsOpened = true;
      });
    },
    closeItemDetails() {
      this.itemDetailsOpened = false;
      this.currentOffer = null;
    },

    async getCategories() {
      try {
        const params = "?public_key=" + this.$route.query.public_key;
        const response = await axios.get(
          API_URIS.marketCategories.replace("id", this.$route.params.id) +
            params
        );
        this.categories.push(...response.data);
      } catch (err) {
        throw err;
      }
    },
    async getOffers(orderBy, isDescendingOrder) {
      try {
        let params = "?offset=" + this.offersOffset + "&limit=20";
        if (orderBy) params += "&order_by=" + orderBy;
        if (isDescendingOrder) params += "&desc=" + 1;
        if (this.activeCategoryID > 0)
          params += "&category=" + this.activeCategoryID;
        if (this.searchString) params += "&contain=" + this.searchString;
        if (this.minPrice) params += "&min_price=" + this.minPrice;
        if (this.maxPrice) params += "&max_price=" + this.maxPrice;
        params += "&public_key=" + this.$route.query.public_key;
        const response = await axios.get(
          API_URIS.marketOffers.replace("id", this.$route.params.id) + params
        );
        this.scrollDetectionBlock = false;
        if (this.offersOffset > 1) {
          this.offers.push(...response.data);
        } else {
          this.offers = response.data;
        }
      } catch (err) {
        throw err;
      }
    },
    chooseCategory(category) {
      this.offersOffset = 1;
      this.activeCategoryID = category.id;
      this.getOffers();
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.market_wrapper {
  height: 100vh;
  overflow-y: scroll;
}
.market {
  position: relative;
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
}
.market::-webkit-scrollbar {
  width: 8px;
  background-color: var(--negativeSecondary);
}
.market::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.header {
  width: auto;
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
  right: 0px;
  height: 126px;
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
  box-shadow: 0px 10px 20px rgba(237, 125, 43, 0.3);
  border-radius: 50px;
}
.filter_icon {
  height: 24px;
  width: 24px;
}

.cart_button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  box-shadow: 0px 10px 20px rgba(237, 125, 43, 0.3);
  border-radius: 50px;
}
.cart_icon {
  height: 24px;
  width: 24px;
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
.detail_tf_logo_icon {
  width: 14px;
  display: flex;
  justify-content: center;
}
</style>
