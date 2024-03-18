import { defineStore } from "pinia";
import router from "@/router/index"

export const useStore = defineStore("newTransfer", {
  state: () => ({
    selectedEmployee: null,
    thanksAmount: null,
    thanksMessage: "",
    images: [],
    selectedSticker: null,
    selectedTags: [],
    anonSend: false,
    showEveryone: true,

    transferJustSent: false
  }),
  actions: {
    restoreTransferState() {
      this.selectedEmployee = null;
      this.thanksAmount = null;
      this.thanksMessage = "";
      this.images = [];
      this.selectedSticker = null;
      this.selectedTags = [];
      this.anonSend = false;
      this.showEveryone = true;
      this.transferJustSent = false
    }
  }
})