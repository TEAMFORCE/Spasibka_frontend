<template>
  <div class="cart general-white-bg">
    <button class="close_filters transparent-bg" @click="closeCart">
      <img class="close_filters_icon" :src="closeFiltersIcon" />
    </button>
    <div class="main_info">
      <h1 class="cart_header general-dark-color">
        {{ $t("market.cart.title") }}
      </h1>
      <div class="cart_items">
        <div v-for="(item, index) in cartItems" class="item_and_separator">
          <hr v-if="index > 0" class="separator" />
          <div class="item_and_counter">
            <div class="select_button_and_info">
              <button
                class="select_item transparent-bg"
                :class="{ active: item.is_chosen }"
                @click="selectItem(item)"
              >
                <img
                  v-if="item.is_chosen"
                  class="select_icon"
                  :src="selectIcon"
                />
              </button>
              <div class="item_container">
                <button class="increase_item_image transparent-bg">
                  <img class="item_image" :src="itemPhoto(item)" />
                </button>
                <div class="item_info">
                  <h1 class="item_name general-dark-color">{{ item.name }}</h1>
                  <div class="price_wrapper brand-secondary-bg">
                    <h1 class="price general-brand-color">{{ item.price }}</h1>
                    <DetailTFLogoIcon />
                  </div>
                </div>
              </div>
            </div>
            <div class="change_amount_and_delete">
              <div class="select_amount main-background-bg">
                <button
                  class="change_amount transparent-bg"
                  :disabled="item.quantity === 1"
                  @click="decreaseSelectedAmount(item)"
                >
                  <MinusIcon :currentColor="getBlackColor()" />
                </button>
                <h1 class="selected_amount main-black-color">
                  {{ item.quantity }}
                </h1>
                <button
                  class="change_amount transparent-bg"
                  @click="increaseSelectedAmount(item)"
                >
                  <PlusIcon />
                </button>
              </div>
              <button
                @click="deleteFromCart(item)"
                class="delete_from_cart tooltip_container brand-secondary-bg"
                :data-tooltip="$t('market.delete_from_cart')"
              >
                <DeleteIcon :currentColor="getIconColor()" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="total">
        <h1 class="total_header general-dark-color">
          {{ $t("market.cart.amount") }}
        </h1>
        <div class="total_price_wrapper brand-secondary-bg">
          <h1 class="price general-brand-color">{{ totalPrice }}</h1>
          <DetailTFLogoIcon />
        </div>
      </div>
    </div>
    <button
      class="order_button general-brand-bg"
      :class="{ inactive: totalPrice == 0 }"
      :disabled="totalPrice == 0"
      @click="order"
    >
      <h1
        class="order_text general-white-color"
        :class="{ inactive: totalPrice == 0 }"
      >
        {{ $t("market.cart.order") }}
      </h1>
    </button>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import { SERVER_IP } from "@/constants/api";
import axios from "axios";

import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";
import DeleteIcon from "@/components/Icons/delete.vue";
import MinusIcon from "@/components/Icons/minus.vue";
import PlusIcon from "@/components/Icons/plus.vue";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "Cart",
  components: {
    DetailTFLogoIcon,
    DeleteIcon,
    MinusIcon,
    PlusIcon,
  },
  props: {
    selectedMarketplaceID: {
      required: true,
    },
  },
  data() {
    return {
      cartItems: [],
    };
  },
  computed: {
    closeFiltersIcon() {
      return this.getImgUrl("CloseFiltersIcon");
    },
    deleteIcon() {
      return this.getImgUrl("DeleteIcon");
    },
    selectIcon() {
      return this.getImgUrl("SelectIcon");
    },
    minusIcon() {
      return this.getImgUrl("Minus");
    },
    plusIcon() {
      return this.getImgUrl("Plus");
    },
    totalPrice() {
      let totalPrice = 0;
      for (let i = 0; i < this.cartItems.length; ++i) {
        totalPrice +=
          this.cartItems[i].price *
          this.cartItems[i].quantity *
          this.cartItems[i].is_chosen;
      }
      return totalPrice;
    },
  },
  mounted() {
    this.getCartItems();
  },
  methods: {
    getIconColor() {
      let generalBrand = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalBrand");
      return generalBrand;
    },
    getBlackColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalContrast;
    },
    closeCart() {
      this.$emit("closeCart");
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
    async getCartItems() {
      try {
        const response = await axios.get(
          API_URIS.cartItems.replace("id", this.selectedMarketplaceID)
        );
        this.cartItems = response.data;
      } catch (err) {
        throw err;
      }
    },
    async deleteFromCart(item) {
      try {
        const response = await axios.delete(
          API_URIS.cartItems.replace("id", this.selectedMarketplaceID) +
            item.id +
            "/"
        );
        this.getCartItems();
      } catch (err) {
        throw err;
      }
    },
    itemPhoto(item) {
      if (item.images.length > 0) {
        return this.photoAddress(item.images[0].link);
      } else {
        return this.photoAddress(null);
      }
    },
    async selectItem(item) {
      try {
        item.is_chosen ^= true;
        await axios.post(
          API_URIS.addToCart.replace("id", this.selectedMarketplaceID),
          {
            offer_id: item.offer_id,
            quantity: item.quantity,
            status: item.is_chosen ? "A" : "D",
          }
        );
      } catch (err) {
        item.is_chosen ^= true;
        throw err;
      }
    },
    async increaseSelectedAmount(item) {
      try {
        item.quantity++;
        await axios.post(
          API_URIS.addToCart.replace("id", this.selectedMarketplaceID),
          {
            offer_id: item.offer_id,
            quantity: item.quantity,
            status: item.is_chosen ? "A" : "D",
          }
        );
      } catch (err) {
        item.quantity--;
        throw err;
      }
    },
    async decreaseSelectedAmount(item) {
      try {
        if (item.quantity > 0) {
          item.quantity--;
          await axios.post(
            API_URIS.addToCart.replace("id", this.selectedMarketplaceID),
            {
              offer_id: item.offer_id,
              quantity: item.quantity,
              status: item.is_chosen ? "A" : "D",
            }
          );
        }
      } catch (err) {
        item.quantity++;
        throw err;
      }
    },
    async order() {
      try {
        await axios.post(
          API_URIS.marketOrders.replace("id", this.selectedMarketplaceID),
          {
            order_status: 1,
          }
        );
        this.$emit("closeCart");
        notify(this.$t("market.order_created"), "success");
      } catch (err) {
        notify(
          err?.response?.data?.errors ||
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
.cart {
  position: fixed;
  z-index: 10;
  top: 0px;
  right: 0px;
  width: 100%;
  max-width: 605px;
  bottom: 0px;
  padding: 32px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  overflow-y: auto;
}
@media (max-width: 1000px) {
  .cart {
    padding-bottom: 108px;
  }
}
@media (max-width: 550px) {
  .cart {
    padding-bottom: 94px;
  }
}
@media (max-width: 750px) {
  .cart {
    max-width: 300px;
  }
}
.close_filters {
  position: absolute;
  top: 18.67px;
  right: 18.67px;
  width: 26.67px;
  height: 26.67px;
}
.close_filters_icon {
  width: 26.67px;
  height: 26.67px;
}
.main_info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cart_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
}
.cart_items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.item_and_separator {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.separator {
  border: 1px solid var(--generalColorGrey);
  margin: 0px;
}
.item_and_counter {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.select_button_and_info {
  display: flex;
  gap: 16px;
}
.select_item {
  border: 2px solid var(--generalColorGrey);
  height: 20px;
  width: 20px;
}
.select_item.active {
  background-color: var(--generalBrand);
  border: none;
  padding: 5.98px 3.39px 6px 3.64px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.select_icon {
  height: 12.02px;
  width: 16.97px;
}
.item_container {
  display: flex;
  gap: 12px;
}
.increase_item_image {
  width: 90px;
  height: 90px;
}
.item_image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}
.item_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}
.price_wrapper {
  width: fit-content;
  display: flex;
  padding: 6px 12px;
  gap: 4px;
  align-items: center;
  border-radius: 8px;
}
.price {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
}
.change_amount_and_delete {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}
.delete_from_cart {
  position: relative;
  padding: 6px;
  height: 28px;
  width: 28px;
  border-radius: 6px;
}
.select_amount {
  height: 56px;
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
.total {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}
.total_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
}
.total_price_wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
}
.order_button {
  padding: 17px;
  box-shadow: 0px 10px 20px rgba(237, 125, 43, 0.3);
  border-radius: 12px;
}
.order_button.inactive {
  box-shadow: none;
  background-color: var(--neutral93);
}
.order_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.order_text.inactive {
  color: var(--generalColorGrey);
}
.delete_icon {
  width: 12px;
  height: 12px;
  margin: 0 0 0 2px;
}
.minus_icon {
  width: 12px;
  height: 12px;
  margin: 0 0 0;
}
.plus_icon {
  width: 16px;
  height: 16px;
  margin: 0 0 0;
}
.detail_tf_logo_icon {
  width: 14px;
  display: flex;
  justify-content: center;
}
</style>