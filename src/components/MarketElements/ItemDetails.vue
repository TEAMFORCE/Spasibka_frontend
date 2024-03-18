<template>
  <div @click="closeItemDetails" class="item_details_wrapper">
    <PrevPictureArrowIcon
      v-if="offersCount > 1"
      class="arrow_icon"
      @click.stop="showPreviousOffer"
    />
    <div @click.stop class="item_details general-white-bg">
      <div class="item_info">
        <div class="main_info">
          <div class="name_and_photo">
            <div
              class="actual_to_and_close"
              :class="{ flex_end: !currentOffer?.actual_to }"
            >
              <div v-if="currentOffer?.actual_to" class="icon_and_timestamp">
                <ActualToIcon />
                <h1 class="item_actual_to general-secondary-color">
                  {{ actualTo }}
                </h1>
              </div>
              <button
                class="close_filters transparent-bg"
                @click="closeItemDetails"
              >
                <img class="close_filters_icon" :src="closeFiltersIcon" />
              </button>
            </div>
            <div class="item_images">
              <img class="item_photo" :src="offerPhoto" />
            </div>
          </div>
          <div class="buy_info">
            <div class="name_and_price">
              <h1 class="offer_name general-dark-color">
                {{ currentOffer?.name }}
              </h1>
              <div class="price_and_icon">
                <h1 class="offer_price general-brand-color">
                  {{ currentOffer?.price?.price_in_thanks }}
                </h1>
                <DetailTFLogoIcon />
              </div>
            </div>
            <div class="description">
              <h1
                class="description_text general-secondary-color"
                v-html="offerDescription"
              ></h1>
            </div>
          </div>
        </div>
      </div>
      <div class="amounts_and_button">
        <div class="offer_amounts">
          <div class="left_amount">
            <h1 class="left_amount_header general-contrast-color">
              {{ $t("market.left_amount") }}
            </h1>
            <h1 class="left_amount_value general-brand-color">
              {{ currentOffer?.rest + " " + $t("market.pcs") }}
            </h1>
          </div>
          <div class="chosen_amount">
            <h1 class="chosen_amount_header general-contrast-color">
              {{ $t("market.chosen_amount") }}
            </h1>
            <h1 class="chosen_amount_value general-brand-color">
              {{ currentOffer?.selected_by_users + " " + $t("market.pcs") }}
            </h1>
          </div>
        </div>
        <div class="cart_info">
          <button
            @click="addToCart"
            class="select general-brand-bg"
            :class="{ in_cart: currentOffer?.order_status == 'C' }"
          >
            <h1
              class="select_text general-white-color"
              :class="{ in_cart: currentOffer?.order_status == 'C' }"
            >
              {{
                currentOffer?.order_status != "C"
                  ? $t("market.add_to_cart")
                  : $t("market.in_cart")
              }}
            </h1>
          </button>
        </div>
      </div>
    </div>
    <NextPictureArrowIcon
      v-if="offersCount > 1"
      class="arrow_icon"
      @click.stop="showNextOffer"
    />
  </div>
</template>

<script>
import { SERVER_IP } from "@/constants/api";
import { API_URIS } from "@/constants/api";
import axios from "axios";

import { notify } from "@/general-scripts/toast-notification";
import PrevPictureArrowIcon from "../Icons/MarketIcons/PrevPictureArrowIcon.vue";
import NextPictureArrowIcon from "../Icons/MarketIcons/NextPictureArrowIcon.vue";
import { formatTimestamp } from "@/general-scripts/timestamps";
import ActualToIcon from "../Icons/MarketIcons/ActualToIcon.vue";
import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

export default {
  name: "ItemDetails",
  components: {
    PrevPictureArrowIcon,
    NextPictureArrowIcon,
    ActualToIcon,
    DetailTFLogoIcon,
  },
  props: {
    offerID: {
      required: true,
    },
    selectedMarketplaceID: {
      required: true,
    },
    offersCount: {
      required: true,
    },
  },
  data() {
    return {
      selectedAmount: 0,
      currentOffer: null,
      currentImageIndex: 0,
    };
  },
  mounted() {
    // this.getCurrentOffer();
  },
  watch: {
    offerID: {
      handler() {
        if (this.offerID) this.getCurrentOffer();
      },
      immediate: true,
    },
  },
  computed: {
    actualTo() {
      const formattedDate = this.formatTimestamp(this.currentOffer?.actual_to);
      let formattedString = this.$t("market.until");
      formattedString += " " + formattedDate.day;
      const months = [
        this.$t("general.date.months.at_january"),
        this.$t("general.date.months.at_february"),
        this.$t("general.date.months.at_march"),
        this.$t("general.date.months.at_april"),
        this.$t("general.date.months.at_may"),
        this.$t("general.date.months.at_june"),
        this.$t("general.date.months.at_july"),
        this.$t("general.date.months.at_august"),
        this.$t("general.date.months.at_september"),
        this.$t("general.date.months.at_october"),
        this.$t("general.date.months.at_november"),
        this.$t("general.date.months.at_december"),
      ];
      formattedString += " " + months[formattedDate.month];
      formattedString += " " + formattedDate.year;
      formattedString += " " + this.$t("general.date.year_contracted");
      return formattedString;
    },
    offerDescription() {
      let description = this.currentOffer?.description || "";
      description = description.replace(
        /(http[s]?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return description.replace(/\r\n/g, "<br>");
    },
    leftArrow() {
      return this.getImgUrl("LeftArrow");
    },
    rightArrow() {
      return this.getImgUrl("RightArrow");
    },
    closeFiltersIcon() {
      return this.getImgUrl("CloseFiltersIcon");
    },
    minusIcon() {
      return this.getImgUrl("Minus");
    },
    plusIcon() {
      return this.getImgUrl("Plus");
    },
    offerPhoto() {
      if (this.currentOffer?.images.length > this.currentImageIndex) {
        return this.photoAddress(
          this.currentOffer.images[this.currentImageIndex].link
        );
      } else {
        return this.photoAddress(null);
      }
    },
  },
  methods: {
    formatTimestamp: formatTimestamp,
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
    closeItemDetails() {
      this.$emit("closeItemDetails");
    },
    increaseSelectedAmount() {
      if (this.selectedAmount < this.currentOffer.rest) this.selectedAmount++;
    },
    decreaseSelectedAmount() {
      if (this.selectedAmount > 0) this.selectedAmount--;
    },
    showPreviousOffer() {
      this.$emit("showPreviousOffer");
    },
    showNextOffer() {
      this.$emit("showNextOffer");
    },
    showPreviousImage() {
      this.currentImageIndex--;
      if (this.currentImageIndex < 0)
        this.currentImageIndex = this.currentOffer.images.length - 1;
    },
    showNextImage() {
      this.currentImageIndex++;
      if (this.currentImageIndex >= this.currentOffer.images.length)
        this.currentImageIndex = 0;
    },
    async getCurrentOffer() {
      try {
        const response = await axios.get(
          API_URIS.marketOffers.replace("id", this.selectedMarketplaceID) +
            this.offerID +
            "/"
        );
        this.currentOffer = response.data;
      } catch (err) {
        throw err;
      }
    },
    async addToCart() {
      try {
        if (this.currentOffer.order_status != "C") {
          await axios.post(
            API_URIS.addToCart.replace("id", this.selectedMarketplaceID),
            {
              offer_id: this.currentOffer.id,
              quantity: 1,
            }
          );
          this.currentOffer.order_status = "C";
        } else {
          this.$emit("closeItemDetails");
          this.$emit("openCart");
        }
      } catch (err) {
        let errorMessage = err?.response?.data?.status;
        if (errorMessage) errorMessage = this.$t("market.no_items_left");
        notify(
          errorMessage ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.item_details_wrapper {
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
  gap: 15px;
  overflow-y: auto;
}
.item_details {
  margin-top: auto;
  margin-bottom: auto;
  width: 100%;
  max-width: 782px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}
.close_filters_icon {
  width: 26.67px;
  height: 26.67px;
}
.item_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.main_info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.name_and_photo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.actual_to_and_close {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.actual_to_and_close.flex_end {
  justify-content: flex-end;
}
.icon_and_timestamp {
  display: flex;
  gap: 8px;
}
.item_actual_to {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.item_images {
  display: flex;
  gap: 10px;
  align-items: center;
}
.arrow_icon {
  margin-top: auto;
  margin-bottom: auto;
}
.arrow_icon:hover {
  cursor: pointer;
}
.item_photo {
  border-radius: 12px;
  width: 100%;
  height: 376px;
  object-fit: cover;
}
.buy_info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.name_and_price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.offer_name {
  font-family: "Golos";
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
}

.price_and_icon {
  display: flex;
  align-items: center;
  gap: 4px;
}
.offer_price {
  font-family: "Golos";
  font-size: 32px;
  font-weight: 500;
  line-height: 16px;
  text-align: left;
}
.description {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.description_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.description_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}

.amounts_and_button {
  width: 100%;
  display: flex;
  gap: 20px;
}
@media (max-width: 768px) {
  .item_details_wrapper {
    gap: 5px;
  }
  .item_details {
    padding: 12px 12px 100px 12px;
  }
  .amounts_and_button {
    flex-wrap: wrap;
  }
  .offer_amounts {
    width: 100% !important;
  }
  .cart_info {
    width: 100% !important;
  }
}
.offer_amounts {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.left_amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left_amount_header {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  text-align: left;
}
.left_amount_value {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.chosen_amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chosen_amount_header {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  text-align: left;
}
.chosen_amount_value {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.cart_info {
  width: 50%;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.select {
  padding: 17px;
  flex-grow: 1;
  box-shadow: 0px 10px 20px rgba(237, 125, 43, 0.3);
  border-radius: 12px;
}
.select.in_cart {
  background-color: var(--secondaryColorBrand);
  box-shadow: none;
}
.select.inactive {
  box-shadow: none;
  background-color: var(--neutral93);
}
.select_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.select_text.in_cart {
  color: var(--generalBrand);
}
.select_text.inactive {
  color: var(--generalColorSecondary);
}
.select_amount {
  display: flex;
  border-radius: 12px;
  gap: 3px;
  align-items: center;
  overflow: hidden;
}
.change_amount {
  padding: 20px 13px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.change_amount_icon {
  height: 16px;
  width: 16px;
}
.selected_amount {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.detail_tf_logo_icon {
  width: 30px;
  display: flex;
  justify-content: center;
}

.next_picture_arrow_icon {
  height: 60px !important;
}
.prev_picture_arrow_icon {
  height: 60px !important;
}
</style>