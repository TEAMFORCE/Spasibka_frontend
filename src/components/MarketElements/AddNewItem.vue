<template>
  <div class="add_new_item_screen_wrapper">
    <Transition name="fade" mode="out-in">
      <ChallengePreviewCropper
        v-if="cropperVisible"
        :image="imageForCropp"
        :descriptionText="this.$t('market.cropperDescription')"
        @imageCrooped="addMarketItem"
        @cropCancel="cropCancel"
      />
    </Transition>
    <div class="add_new_item_wrapper">
      <div class="add_new_item general-white-bg">
        <h1 class="add_new_item_header general-contrast-color">
          {{ $t("market.offerCard.title") }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="itemName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("market.offerCard.name") }}
          </div>
          <input
            class="input_field general-contrast-color"
            :placeholder="$t('market.offerCard.name')"
            v-model="itemName"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="itemDescription"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("market.offerCard.description") }}
          </div>
          <textarea
            class="input_field general-contrast-color"
            :placeholder="$t('market.offerCard.description')"
            v-model="itemDescription"
          >
          </textarea>
        </div>
        <h1 class="photos_header">{{ $t("market.offerCard.image") }}</h1>
        <div class="file-upload">
          <div class="file-upload__text general-secondary-color">
            {{ $t("market.offerCard.files") }}
          </div>
          <button
            class="file-upload__button general-brand-bg"
            @click="openFileSelection"
          >
            <h1 class="general-white-color open_filesystem_text">
              {{ $t("market.offerCard.view") }}
            </h1>
          </button>
          <input
            ref="fileInput"
            type="file"
            multiple
            class="file-upload__input"
            @change="handleFileInput"
          />
        </div>
        <div
          v-if="selectedFiles && selectedFiles.length > 0"
          class="selected_files_list"
        >
          <h1
            class="selected_files_text general-dark-color"
            v-for="file in selectedFiles"
          >
            {{ file.name }}
          </h1>
        </div>
        <h1 class="photos_header">
          {{ $t("market.offerCard.term") }}
        </h1>
        <div class="from_to">
          <div class="input_field_wrapper">
            <div
              v-if="actualFrom"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("market.offerCard.from") }}
            </div>
            <Datepicker
              class="offer_date_picker"
              v-model="actualFrom"
              text-input
              auto-apply
              format="dd.MM.yyyy HH:mm"
              locale="ru"
              position="left"
              :placeholder="$t('market.offerCard.from')"
              @update:model-value="setActualFromDate"
              :enable-time-picker="true"
            >
              <template #clear-icon="{ clear }">
                <CloseIcon @click="clear" />
              </template>
            </Datepicker>
          </div>
          <div class="input_field_wrapper">
            <div
              v-if="actualTo"
              class="input_field_placeholder general-secondary-color general-white-bg"
            >
              {{ $t("market.offerCard.to") }}
            </div>
            <Datepicker
              class="offer_date_picker"
              v-model="actualTo"
              text-input
              auto-apply
              format="dd.MM.yyyy HH:mm"
              locale="ru"
              position="left"
              :placeholder="$t('market.offerCard.to')"
              @update:model-value="setActualToDate"
              :enable-time-picker="true"
            >
              <template #clear-icon="{ clear }">
                <CloseIcon @click="clear" />
              </template>
            </Datepicker>
          </div>
        </div>
        <h1 class="photos_header">
          {{ $t("market.offerCard.category") }}
        </h1>
        <div class="category_selectors">
          <div
            class="category_selector"
            v-for="item in marketCategories"
            :key="item.id"
          >
            <input
              type="checkbox"
              class="checkbox"
              :value="item.id"
              v-model="selectedCategoryIDs"
            />
            <label>
              <h1 class="category_option_text">{{ item.name }}</h1>
            </label>
          </div>
        </div>

        <div class="input_field_wrapper">
          <div
            v-if="selectedStatus"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("market.offerCard.status") }}
          </div>
          <vSelect
            v-model="selectedStatus"
            :options="statuses"
            :placeholder="$t('market.offerCard.status')"
            @option:selected="selectStatus"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="price"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("market.offerCard.price") + " " + valueName }}
          </div>
          <input
            class="input_field general-contrast-color"
            :placeholder="`${$t('market.offerCard.price')} ${valueName}`"
            v-model="price"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="remaining"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("market.offerCard.count") }}
          </div>
          <input
            class="input_field general-contrast-color"
            :placeholder="$t('market.offerCard.count')"
            v-model="remaining"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="sortingFactor"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("market.sorting_factor") }}
          </div>
          <input
            class="input_field general-contrast-color"
            :placeholder="$t('market.sorting_factor')"
            v-model="sortingFactor"
          />
        </div>
        <h1 class="photos_header">
          {{ $t("market.offerCard.remainder") }}
        </h1>
        <div class="actions_with_remainder">
          <div class="action_wrap">
            <input
              type="radio"
              name="remaind_action"
              id="ignoreRest"
              value="1"
              class="radioButton"
              v-model="remainder"
            />
            <label for="ignoreRest">
              {{ $t("market.offerCard.remainderIgnore") }}
            </label>
          </div>

          <div class="action_wrap">
            <input
              type="radio"
              name="remaind_action"
              id="setQuantity"
              value="2"
              class="radioButton"
              v-model="remainder"
            />
            <label for="setQuantity">
              {{ $t("market.offerCard.remainderValue") }}
            </label>
          </div>

          <div class="action_wrap">
            <input
              type="radio"
              name="remaind_action"
              id="errorWhenQuantity"
              value="3"
              class="radioButton"
              v-model="remainder"
            />
            <label for="errorWhenQuantity">
              {{ $t("market.offerCard.remainderError") }}
            </label>
          </div>
          <div class="action_wrap">
            <input
              type="checkbox"
              class="checkbox"
              v-model="immediateDelivery"
            />
            <label>
              <h1 class="category_option_text">
                {{ $t("market.immediateDelivery") }}
              </h1>
            </label>
          </div>
        </div>
        <div class="action_buttons">
          <button @click="checkImage" class="action_button general-brand-bg">
            <h1 class="action_button_text general-white-color">
              {{ $t("market.offerCard.create") }}
            </h1>
          </button>
          <button
            class="action_button brand-secondary-bg"
            @click="closeItemAddition"
          >
            <h1 class="action_button_text general-brand-color">
              {{ $t("market.offerCard.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import axios from "axios";
import { organizationSettingsStore } from "@/store/organization-settings";
import ChallengePreviewCropper from "@/components/ChallengeItemElements/ChallengePreviewCropper.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "AddNewItem",
  props: {
    currentMarketID: {
      required: true,
    },
  },
  components: {
    Datepicker,
    vSelect,
    ChallengePreviewCropper,
    CloseIcon,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      immediateDelivery: false,
      remainder: null,
      itemName: "",
      itemDescription: "",
      price: "",
      remaining: "",
      sortingFactor: "",
      actualFrom: "",
      actualTo: "",

      // selectedLimitType: "",
      // noPeriodLimitOnItems: false,
      // limitTypes: [
      //   this.$t("market.offerCard.day"),
      //   this.$t("market.offerCard.week"),
      //   this.$t("market.offerCard.month"),
      //   this.$t("market.offerCard.period"),
      //   this.$t("market.offerCard.year"),
      //   this.$t("market.offerCard.no_limit"),
      //   this.$t("market.offerCard.custom_period"),
      // ],
      // customDays: 0,
      // customMonths: 0,
      // customYears: 0,

      marketCategories: [],
      selectedCategory: "",

      selectedCategoryIDs: [],

      statuses: [
        this.$t("market.offerCard.active"),
        this.$t("market.offerCard.notActive"),
      ],
      selectedStatus: null,

      errorMessage: "",

      selectedFiles: null,

      cropperVisible: false,
      imageForCropp: null,
      croppedImage: null,

      creationBlock: false,
    };
  },

  mounted() {
    this.getCategories();
  },
  computed: {
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form7;
    },
    getSelectedCategoryIDs() {
      return this.selectedCategoryIDs.join(", ");
    },
  },
  methods: {
    openCropper() {
      this.cropperVisible = true;
    },
    cropCancel() {
      this.cropperVisible = false;
    },
    closeItemAddition() {
      this.$emit("closeItemAddition");
    },
    openFileSelection() {
      this.$refs.fileInput.click();
    },
    handleFileInput(event) {
      this.selectedFiles = event.target.files;
      this.imageForCropp = event.target.files[0];
    },
    checkImage() {
      if (this.selectedFiles) {
        this.openCropper();
      } else {
        this.addMarketItem();
      }
    },
    async addMarketItem(file) {
      if (this.creationBlock) return;
      try {
        this.creationBlock = true;
        let requestObject = new FormData();
        requestObject.append("name", this.itemName);
        requestObject.append("description", this.itemDescription);
        requestObject.append("price", this.price);

        requestObject.append("rest", this.remaining);

        if (this.sortingFactor)
          requestObject.append("sorting", this.sortingFactor);

        requestObject.append("immediate_delivery", this.immediateDelivery);
        if (this.remainder) {
          requestObject.append("rest_state", this.remainder);
        }

        if (this.selectedFiles) {
          for (let i = 0; i < this.selectedFiles.length; ++i) {
            requestObject.append("photo", this.selectedFiles[i]);
          }
        }
        if (file) {
          requestObject.append("cropped_photo", file);
        }

        if (this.actualFrom) {
          requestObject.append(
            "actual_from",
            this.actualFrom.slice(0, 10) +
              " " +
              this.actualFrom.slice(11, 19) +
              this.actualFrom.slice(23, 24)
          );
        }
        if (this.actualTo) {
          requestObject.append(
            "actual_to",
            this.actualTo.slice(0, 10) +
              " " +
              this.actualTo.slice(11, 19) +
              this.actualTo.slice(23, 24)
          );
        }
        if (this.getSelectedCategoryIDs.trim() != "") {
          requestObject.append("categories", this.getSelectedCategoryIDs);
        }
        requestObject.append(
          "is_active",
          this.selectedStatus == this.$t("market.offerCard.active")
            ? true
            : false
        );

        const response = await axios.post(
          API_URIS.marketAdminAddOffers.replace("id", this.currentMarketID),
          requestObject
        );
        this.$emit("closeItemAddition", true);
        this.creationBlock = false;
      } catch (err) {
        this.creationBlock = false;
        this.errorMessage = "";

        const currentError = err.response.data;
        if (currentError.status == "name is required") {
          this.errorMessage = "Введите имя предложения";
        } else if (currentError.status == "price should be int or digit str") {
          this.errorMessage = "Цена должна быть числом";
        } else if (currentError.status == "rest should be int or digit str") {
          this.errorMessage = "Остаток должен быть числом";
        } else if (
          currentError.status ==
          "Check if time_from (actual_from) less than time_to (actual_to)"
        ) {
          this.errorMessage =
            "Дата 'активен от' должна быть раньше чем 'активен до'";
        }
        this.displayErrorMessage();
        throw err;
      }
    },
    displayErrorMessage() {
      this.$moshaToast(
        {
          title: this.errorMessage || this.$t("notification.error"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "danger",
        }
      );
    },
    setActualFromDate() {
      this.actualFrom = this.actualFrom.toISOString();
    },
    setActualToDate() {
      this.actualTo = this.actualTo.toISOString();
    },
    changeCategory(category) {
      this.selectedCategory = category;
    },
    selectStatus(status) {
      this.selectedStatus = status;
    },
    async getCategories() {
      try {
        const response = await axios.get(
          API_URIS.marketCategories.replace("id", this.currentMarketID),
          {
            params: {
              all: 1,
            },
          }
        );
        this.marketCategories = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.checkbox {
  accent-color: var(--generalBrand);
}
.actions_with_remainder {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.action_wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}
.radioButton {
  accent-color: var(--generalBrand);
}
.add_new_item_screen_wrapper {
  position: fixed;
  z-index: 1000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.add_new_item_wrapper {
  max-width: 477px;
  width: 100%;
  height: 90%;
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow-x: auto;
  padding: 0;
  background-color: var(--generalColorWhite);
}
.add_new_item_wrapper::-webkit-scrollbar {
  border-radius: 24px;
  width: 30px;
  background: var(--generalColorWhite);
}
.add_new_item_wrapper::-webkit-scrollbar-thumb {
  background: var(--generalBrand);
  background-clip: content-box;
  border: 12px solid transparent;
  border-radius: 20px;
}
.add_new_item {
  padding: 32px 2px 32px 32px;

  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: var(--generalColorWhite);
}

.add_new_item_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.input_field {
  width: 100%;
  box-sizing: border-box;
  padding: 18px 16px;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border-radius: 16px;
  border: 1px solid var(--generalColorGrey);
}
.input_field::placeholder {
  color: var(--generalColorSecondary);
}
.photos_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  text-align: left;
  color: var(--generalContrast);
}
/* .checkbox_wrapper {
  display: flex;
  gap: 8px;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
}
.custom_period_inputs {
  display: flex;
  gap: 12px;
  width: 100%;
} */
.file-upload {
  display: flex;
  width: auto;
  justify-content: space-between;
  padding: 4px 4px 4px 16px;
  align-items: center;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
}

.file-upload__text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.file-upload__button {
  display: flex;
  align-items: center;
  padding: 8px 26px;
  border-radius: 12px;
  cursor: pointer;
}
.open_filesystem_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.file-upload__input {
  display: none;
}
.selected_files_list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.selected_files_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
}
.from_to {
  display: flex;
  gap: 12px;
}
.offer_date_picker {
  width: 100%;
}
::v-deep(.dp__input::placeholder) {
  color: var(--generalColorSecondary);
  font-family: "Golos";
}
::v-deep(.dp__input) {
  color: var(--generalContrast) !important;
  font-family: "Golos";
}
.category_selectors {
  margin-top: -15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  accent-color: var(--generalBrand);
}
.category_selector {
  display: flex;
  align-items: center;
  gap: 5px;
}
.category_option_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  /* identical to box height, or 157% */
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
<style >
.dp__input_wrap > svg {
  display: none;
}
.dp__input_wrap > input::placeholder {
  color: var(--generalContrast) !important;
  font-size: 14px;
}
.dp__input {
  padding: 12px !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  background-color: var(--generalColorWhite) !important;
}
</style>