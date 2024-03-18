import { defineStore } from "pinia";
import axios from "axios";
import { API_URIS } from "@/constants/api";

export const useStore = defineStore("profile", {
  state: () => ({
    profileInfo: null,
  }),
  actions: {
    async getProfileInfo() {
      try {
        const response = await axios.get(API_URIS.userProfileURL);
        this.profileInfo = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
});
