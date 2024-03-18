<template>
  <div class="transfer_info general-white-bg">
    <h1 class="transfer_info_header general-contrast-color">
      {{ $t("new_transfer.transfer_info") }}
    </h1>
    <ThanksAmount />
    <ThanksMessage class="thanks_message_component" />
    <FileSelectionForm class="file_selection_component" />
    <StickersSelection class="stickers_selection_component" />
    <AddValue class="add_value_component" />
    <AdditionalSettings class="additional_settings_component" />

    <button
      class="transfer_button general-brand-bg general-white-color"
      @click="transfer"
    >
      {{ $t("new_transfer.thank") }}
    </button>
  </div>
</template>

<script>
import ThanksAmount from "./TransferInfoElements/ThanksAmount.vue";
import ThanksMessage from "./TransferInfoElements/ThanksMessage.vue";
import FileSelectionForm from "./TransferInfoElements/FileSelectionForm.vue";
import StickersSelection from "./TransferInfoElements/StickersSelection.vue";
import AddValue from "./TransferInfoElements/AddValue.vue";
import AdditionalSettings from "./TransferInfoElements/AdditionalSettings.vue";

import axios from "axios";

import { notify } from "@/general-scripts/toast-notification";

import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

export default {
  name: "TransferInfo",
  components: {
    ThanksAmount,
    ThanksMessage,
    FileSelectionForm,
    StickersSelection,
    AddValue,
    AdditionalSettings,
  },
  computed: {
    ...mapStores(useNewTransferStore),
  },
  methods: {
    async transfer() {
      try {
        if (!this.newTransferStore.selectedEmployee) {
          throw new Error(this.$t("new_transfer.select_recipient"));
        }
        if (!this.newTransferStore.thanksAmount) {
          throw new Error(this.$t("new_transfer.enter_the_amount"));
        }
        if (
          !this.newTransferStore.thanksMessage &&
          !this.newTransferStore.selectedSticker &&
          this.newTransferStore.selectedTags.length == 0
        ) {
          throw new Error(this.$t("new_transfer.enter_message_to_receiver"));
        }

        let formData = new FormData();
        formData.append(
          "recipient",
          this.newTransferStore.selectedEmployee.user_id
        );
        formData.append("amount", this.newTransferStore.thanksAmount);
        formData.append("is_anonymous", this.newTransferStore.anonSend);
        formData.append("is_public", this.newTransferStore.showEveryone);

        formData.append("reason", this.newTransferStore.thanksMessage);

        if (this.newTransferStore.selectedSticker) {
          formData.append(
            "sticker_id",
            this.newTransferStore.selectedSticker.id
          );
        }

        let tagsToSend = "";
        for (let i = 0; i < this.newTransferStore.selectedTags.length; ++i) {
          if (i > 0) tagsToSend += " ";
          tagsToSend += this.newTransferStore.selectedTags[i].id;
        }
        formData.append("tags", tagsToSend);

        let appendBase64Image = async (base64, formData, fileName) => {
          // Extract MIME type from base64 data URL
          let mimeType = base64.split(",")[0].split(":")[1].split(";")[0];

          let response = await fetch(base64);
          let blob = await response.blob();

          // Create a new blob with the correct MIME type
          let newBlob = new Blob([blob], { type: mimeType });

          // Append the blob as a file named fileName to the FormData object
          formData.append("photo", newBlob, fileName);
        };

        for (let i = 0; i < this.newTransferStore.images.length; i++) {
          let extension = this.newTransferStore.images[i].url
            .split(";")[0]
            .split("/")[1];
          await appendBase64Image(
            this.newTransferStore.images[i].url,
            formData,
            `image${i}.${extension}`
          );
        }

        await axios.post(API_URIS.transferURL, formData);
        this.newTransferStore.transferJustSent = true;
        notify(this.$t("new_transfer.thanks_successfully_sent"), "success");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.transfer_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 52px;
  border-top-left-radius: 24px;
}
@media (max-width: 1280px) {
  .transfer_info {
    padding: 24px;
  }
}
.transfer_info_header {
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
}
.thanks_message_component {
  margin-top: 16px;
}
.file_selection_component {
  margin-top: 16px;
}
.add_value_component {
  margin-top: 16px;
}
.transfer_button {
  width: 200px;
  padding: 16px;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 12px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>