<template>
  <div class="delete_item_screen_wrapper">
    <div class="delete_item_wrapper">
      <div class="delete_item general-white-bg">
        <h1 class="delete_item_header general-contrast-color">
          {{ $t("market.deleteCard.title") }}
        </h1>
        <div class="action_buttons">
          <button @click="deleteItem" class="action_button general-brand-bg">
            <h1 class="action_button_text general-white-color">
              {{ $t("market.deleteCard.accept") }}
            </h1>
          </button>
          <button
            class="action_button brand-secondary-bg"
            @click="closeItemDeletion"
          >
            <h1 class="action_button_text general-brand-color">
              {{ $t("market.deleteCard.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";

export default {
  name: "DeleteItem",
  props: {
    currentMarketID: {
      required: true,
    },
    offerID: {
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    closeItemDeletion() {
      this.$emit("closeItemDeletion");
    },
    async deleteItem() {
      try {
        await axios.delete(
          API_URIS.marketAdminOffers.replace("id", this.currentMarketID) +
            this.offerID +
            "/"
        );
        this.$emit("closeItemDeletion", true);
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.delete_item_screen_wrapper {
  position: fixed;
  z-index: 1000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}
.delete_item_wrapper {
  position: relative;
  margin-top: 50px;
  max-width: 477px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.delete_item {
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.delete_item_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}

.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  border-radius: 6px;
  padding: 16px;
  width: 50%;
}
.action_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>