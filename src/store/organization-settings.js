import { defineStore } from "pinia";
import axios from "axios";
import { API_URIS } from "@/constants/api";

export const organizationSettingsStore = defineStore("counter", {
  state: () => {
    return {
      settings: {},
      colorScheme: {},
      isActivePeriod: false,
      schemeIsLoading: false,
      marketsExist: false,
      periodStartDate: "",
      periodEndDate: "",
    };
  },
  getters: {
    getColorScheme(state) {
      return state.colorScheme;
    },
    getSettings(state) {
      return state.settings;
    },
  },
  actions: {
    setMarketsExist(val) {
      this.marketsExist = val;
    },
    setIsActivePeriod(val) {
      this.isActivePeriod = val;
    },
    setPeriodStartDate(date) {
      this.periodStartDate = date
    },
    setPeriodEndDate(date) {
      this.periodEndDate = date
    },
    async getOrganizationSettings() {
      try {
        this.schemeIsLoading = true;
        const response = await axios.get(API_URIS.organizationsSettings);
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          this.settings = response.data;
          this.colorScheme = response.data.colors_json;
          if (this.colorScheme && Object.keys(this.colorScheme).length > 0) {
            this.setOrganizationColorScheme();
          } else {
            this.schemeIsLoading = false;
          }
        } else {
        }
      } catch (error) {
        this.schemeIsLoading = false;
        throw error;
      }
    },
    hexToRgb(hex) {
      // Ensure the hex string has a "#" at the start
      let sanitizedHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;

      // Parse the r, g, b values
      let bigint = parseInt(sanitizedHex, 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;

      return { r, g, b };
    },
    setOrganizationColorScheme() {
      document.documentElement.style.setProperty(
        "--extra1",
        `${this.colorScheme["extra1"]}`
      );
      document.documentElement.style.setProperty(
        "--extra2",
        `${this.colorScheme["extra2"]}`
      );
      document.documentElement.style.setProperty(
        "--generalBrand",
        `${this.colorScheme["general-brand"]}`
      );
      let generalBrandRGB = this.hexToRgb(this.colorScheme["general-brand"]);
      document.documentElement.style.setProperty(
        "--generalBrandRGB",
        `${generalBrandRGB.r}, ${generalBrandRGB.g}, ${generalBrandRGB.b}`
      );

      document.documentElement.style.setProperty(
        "--secondaryColorBrand",
        `${this.colorScheme["general-brand-secondary"]}`
      );
      document.documentElement.style.setProperty(
        "--generalColorWhite",
        `${this.colorScheme["general-negative"]}`
      );
      document.documentElement.style.setProperty(
        "--negativeSecondary",
        `${this.colorScheme["minor-negative-secondary"]}`
      );
      document.documentElement.style.setProperty(
        "--generalContrast",
        `${this.colorScheme["general-contrast"]}`
      );
      document.documentElement.style.setProperty(
        "--generalColorSecondary",
        `${this.colorScheme["general-contrast-secondary"]}`
      );
      document.documentElement.style.setProperty(
        "--generalColorGrey",
        `${this.colorScheme["general-midpoint"]}`
      );
      document.documentElement.style.setProperty(
        "--minorSuccess",
        `${this.colorScheme["minor-success"]}`
      );
      document.documentElement.style.setProperty(
        "--minorSuccessSecondary",
        `${this.colorScheme["minor-success-secondary"]}`
      );
      document.documentElement.style.setProperty(
        "--minorError",
        `${this.colorScheme["minor-error"]}`
      );
      document.documentElement.style.setProperty(
        "--minorErrorSecondary",
        `${this.colorScheme["minor-error-secondary"]}`
      );
      document.documentElement.style.setProperty(
        "--minorWarning",
        `${this.colorScheme["minor-warning"]}`
      );
      document.documentElement.style.setProperty(
        "--minorWarningSecondary",
        `${this.colorScheme["minor-warning-secondary"]}`
      );
      document.documentElement.style.setProperty(
        "--minorInfo",
        `${this.colorScheme["minor-info"]}`
      );
      document.documentElement.style.setProperty(
        "--minorInfoSecondaryColor",
        `${this.colorScheme["minor-info-secondary"]}`
      );
      this.schemeIsLoading = false;
    },
  },
});

// async getOrganizationInfo() {
//     try {
//       const response = await axios.get(API_URIS.organizationsSettings);
//       this.organizationSettings = response.data;Z
//     } catch (err) {
//       throw err;
//     }
//   },
