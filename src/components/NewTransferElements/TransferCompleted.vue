<template>
  <div class="transfer_completed">
    <!-- <img class="wallet_icon" :src="walletImage" /> -->
    <SentThanksIcon class="wallet_icon" />
    <h1 class="transfer_sent_text general-contrast-color">
      {{ $t("new_transfer.thanks_successfully_sent") }}
    </h1>
    <div class="transfer_details">
      <div class="recipient_info_section">
        <img class="recipient_photo" :src="recipientPhoto" />
        <div class="recipient_info">
          <h1 class="recipient_name general-contrast-color">
            {{ newTransferStore.selectedEmployee?.name || "" }}
            {{ " " + newTransferStore.selectedEmployee?.surname || "" }}
          </h1>
          <h1 class="recipient_nickname general-secondary-color">
            {{ "@" + newTransferStore.selectedEmployee?.tg_name || "" }}
          </h1>
        </div>
      </div>
      <div class="transfer_amount_section">
        <h1 class="transfer_amount general-brand-color">
          {{ newTransferStore.thanksAmount }}
        </h1>
        <DetailTFLogoIcon />
      </div>
    </div>
    <button
      @click="goToNewTransfer"
      class="next_action_button shadow general-brand-bg"
    >
      <h1 class="next_action_text general-white-color">
        {{ $t("new_transfer.make_new_transfer") }}
      </h1>
    </button>
    <button @click="goToHistory" class="next_action_button transparent-bg">
      <h1 class="next_action_text general-brand-color">
        {{ $t("new_transfer.go_to_history") }}
      </h1>
    </button>
  </div>
</template>


<script>
import SentThanksIcon from "@/components/Icons/NewTransferIcons/SentThanksIcon.vue";
import DetailTFLogoIcon from "@/components/Icons/ChallengesIcons/DetailTFLogoIcon.vue";

import { getImageURL } from "@/general-scripts/get-image-url";
import { photoAddress } from "@/general-scripts/photo-address";

import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

export default {
  name: "TransferCompleted",
  components: {
    SentThanksIcon,
    DetailTFLogoIcon,
  },
  computed: {
    ...mapStores(useNewTransferStore),
    walletImage() {
      return getImageURL("NewTransferImages", "Wallet.png");
    },
    recipientPhoto() {
      const photo = this.newTransferStore.selectedEmployee.photo;
      return photoAddress(photo, "NewTransferImages", "NoUserPhoto.png");
    },
  },
  methods: {
    goToNewTransfer() {
      this.newTransferStore.transferJustSent = false;

      this.newTransferStore.selectedEmployee = null;
      this.newTransferStore.thanksMessage = "";
      this.newTransferStore.images = [];
      this.newTransferStore.selectedSticker = null;
      this.newTransferStore.selectedTags = [];
      this.newTransferStore.anonSend = false;
      this.newTransferStore.showEveryone = true;
    },
    goToHistory() {
      this.goToNewTransfer();
      this.$router.push("/history");
    },
  },
};
</script>

<style scoped>
.transfer_completed {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: auto;
  max-width: 400px;
  margin: auto;
  padding: 52px;
  background: #ffffff;
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
  border-radius: 20px;
}
.wallet_icon {
  height: 196px;
  width: 196px;
}
.transfer_sent_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
}
.transfer_details {
  width: calc(100% - 32px);
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  align-items: center;
}
.recipient_info_section {
  display: flex;
  gap: 16px;
  align-items: center;
}
.transfer_amount_section {
  display: flex;
  gap: 16px;
  align-items: center;
}
.recipient_photo {
  height: 44px;
  width: 44px;
  border-radius: 50%;
}
.recipient_info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.recipient_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.recipient_nickname {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.transfer_amount {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
}
.next_action_button {
  width: 100%;
  border-radius: 12px;
  padding: 16px;
}
.shadow {
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
}
.next_action_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.detail_tf_logo_icon {
  width: 30px;
  display: flex;
  justify-content: center;
}
</style>