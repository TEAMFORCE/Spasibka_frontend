<template>
  <div class="item_details general-white-bg">
    <button class="close_filters transparent-bg" @click="closeItemDetails">
      <img class="close_filters_icon" :src="closeFiltersIcon" />
    </button>
    <div class="item_info">
      <div class="main_info">
        <div class="name_and_photo">
          <h1 class="item_name general-dark-color">{{ currentOffer?.name }}</h1>
          <div class="item_images">
            <img
              v-if="currentOffer?.images.length > 1"
              class="arrow_icon"
              :src="leftArrow"
              @click="showPreviousImage"
            />
            <img
              class="item_photo"
              :src="offerPhoto"
              :class="{ full_width: currentOffer?.images.length <= 1 }"
            />
            <img
              v-if="currentOffer?.images.length > 1"
              class="arrow_icon"
              :src="rightArrow"
              @click="showNextImage"
            />
          </div>
        </div>
        <div class="buy_info">
          <div class="description">
            <h1 class="description_header general-contrast-color">Описание</h1>
            <h1 class="description_text general-secondary-color">
              {{ currentOffer?.description }}
            </h1>
          </div>
          <div class="amount_info">
            <div class="amount_info_container minor-info-secondary-bg">
              <h1 class="amount_info_type general-contrast-color">
                Оставшееся количество
              </h1>
              <div class="amount_wrapper general-white-bg">
                <h1 class="amount_text general-brand-color">
                  {{ currentOffer?.rest }} шт.
                </h1>
              </div>
            </div>
            <div class="amount_info_container minor-info-secondary-bg">
              <h1 class="amount_info_type general-contrast-color">
                Выбрано пользователями
              </h1>
              <div class="amount_wrapper general-white-bg">
                <h1 class="amount_text general-brand-color">
                  {{ currentOffer?.selected }} шт.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order_info">
      <div class="price">
        <h1 class="price_text general-contrast-color">Стоимость</h1>
        <div class="price_amount brand-secondary-bg">
          <h1 class="price_amount_text general-brand-color">
            {{ currentOffer?.price.price_in_thanks }}
          </h1>
          <DetailTFLogoIcon />
        </div>
      </div>
      <!-- <div class="cart_info">
                <button 
                    @click="addToCart" 
                    class="select general-brand-bg"
                    :class="{ in_cart: currentOffer?.order_status == 'C' }"
                >
                    <h1 
                        class="select_text general-white-color"
                        :class="{ in_cart: currentOffer?.order_status == 'C' }"
                    >
                        {{ currentOffer?.order_status != "C" ? "Выбрать" : "В корзине"}}
                    </h1>
                </button>
                <div class="select_amount main-background-bg">
                    <button 
                        class="change_amount transparent-bg"
                        @click="decreaseSelectedAmount"
                    >
                        <img class="change_amount_icon" :src="minusIcon"/>
                    </button>
                    <h1 class="selected_amount main-black-color">{{ selectedAmount }}</h1>
                    <button 
                        class="change_amount transparent-bg"
                        @click="increaseSelectedAmount"    
                    >
                        <img class="change_amount_icon" :src="plusIcon"/>
                    </button>
                </div>
            </div> -->
    </div>
  </div>
</template>

<script>
import { SERVER_IP } from "@/constants/api";

import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

export default {
  name: "PublicMarketItemDetails",
  components: {
    DetailTFLogoIcon,
  },
  props: {
    offerID: {
      required: true,
    },
    selectedMarketplaceID: {
      required: true,
    },
    currentOffer: {
      required: true,
    },
  },
  data() {
    return {
      selectedAmount: 0,
      currentImageIndex: 0,
    };
  },
  mounted() {
    // this.getCurrentOffer();
  },
  computed: {
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
    // async getCurrentOffer(){
    //     try {
    //         const response = await axios.get(API_URIS.marketOffers.replace("id", this.selectedMarketplaceID) + this.offerID + "/");
    //         this.currentOffer = response.data;
    //     } catch(err) {
    //         throw err;
    //     }
    // },
    // async addToCart(){
    //     try {
    //         if (this.currentOffer.order_status != "C"){
    //             await axios.post(API_URIS.addToCart.replace("id", this.selectedMarketplaceID), {
    //                 offer_id: this.currentOffer.id,
    //                 quantity: 1
    //             });
    //             this.currentOffer.order_status = "C";
    //         }
    //         else {
    //             this.$emit("closeItemDetails");
    //             this.$emit("openCart");
    //         }

    //     } catch(err) {
    //         throw err;
    //     }
    // }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.item_details {
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
  .item_details {
    padding-bottom: 108px;
  }
}
@media (max-width: 550px) {
  .item_details {
    padding-bottom: 94px;
  }
}
@media (max-width: 750px) {
  .item_details {
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
.item_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.main_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.name_and_photo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.item_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  text-align: left;
}
.item_images {
  display: flex;
  gap: 10px;
  align-items: center;
}
.arrow_icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.arrow_icon:hover {
  cursor: pointer;
}
.item_photo {
  border-radius: 12px;
  width: calc(100% - 68px);
}
.item_photo.full_width {
  width: 100%;
}
.buy_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.amount_info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.amount_info_container {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
}
.amount_info_type {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
}
.amount_wrapper {
  padding: 8px 12px;
  border-radius: 12px;
}
.amount_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.order_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.price {
  display: flex;
  justify-content: space-between;
}
.price_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.price_amount {
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  gap: 4px;
  align-items: center;
}
.price_amount_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}
.cart_info {
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
  width: 14px;
  display: flex;
  justify-content: center;
}
</style>