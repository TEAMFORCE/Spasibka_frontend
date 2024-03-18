<template>
  <div class="edit_item_screen_wrapper">
    <div class="edit_item_wrapper">
      <div class="edit_item general-white-bg">
        <h1 class="edit_item_header general-contrast-color">
          {{ $t("market.offerCard.change") }}
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
        <h1 class="photos_header">
          {{ $t("market.offerCard.image") }}
        </h1>
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
        <h1 v-if="this.pictures.length > 0" class="photos_header">
          {{ $t("market.offerCard.image") }}
        </h1>
        <ImageGrid
          v-if="this.pictures.length > 0"
          :pictures="pictures"
          @getPicturesToDelete="getPicturesToDelete"
        />
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
          <button @click="editItem" class="action_button general-brand-bg">
            <h1 class="action_button_text general-white-color">
              {{ $t("market.offerCard.update") }}
            </h1>
          </button>
          <button
            class="action_button brand-secondary-bg"
            @click="closeItemEdition"
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
import { organizationSettingsStore } from "@/store/organization-settings";
import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import axios from "axios";
import ImageGrid from "@/components/MarketElements/ImageGrid.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "EditNewItem",
  props: {
    currentMarketID: {
      required: true,
    },
    offerID: {
      required: true,
    },
  },
  components: {
    ImageGrid,
    Datepicker,
    vSelect,
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

      marketCategories: [],
      selectedCategory: "",

      selectedCategoryIDs: [],

      statuses: [
        this.$t("market.offerCard.active"),
        this.$t("market.offerCard.notActive"),
      ],
      selectedStatus: null,
      defualtStatus: null,

      errorMessage: "",

      selectedFiles: null,

      pictures: [],
      picturesToDelete: "",
    };
  },
  mounted() {
    this.getCategories();
    this.getItemInfo();
  },
  computed: {
    getSelectedCategoryIDs() {
      return this.selectedCategoryIDs.join(", ");
    },
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form7;
    },
  },
  methods: {
    closeItemEdition() {
      this.$emit("closeItemEdition");
    },
    openFileSelection() {
      this.$refs.fileInput.click();
    },
    handleFileInput(event) {
      this.selectedFiles = event.target.files;
    },
    getPicturesToDelete(selectedIDs) {
      this.picturesToDelete = selectedIDs;
    },
    async getItemInfo() {
      try {
        const response = await axios.get(
          API_URIS.marketAdminOffers.replace("id", this.currentMarketID) +
            this.offerID +
            "/"
        );
        this.remainder = response.data.rest_state;
        this.immediateDelivery = response.data.immediate_delivery;

        this.itemName = response.data.name;
        this.itemDescription = response.data.description;
        this.actualFrom = response.data.actual_from;
        this.actualTo = response.data.actual_to;

        this.price = response.data.actual_thanks_price;
        this.remaining = response.data.rest;
        this.sortingFactor = response.data.sorting;
        this.selectedStatus =
          response.data.status == "A"
            ? this.$t("market.offerCard.active")
            : this.$t("market.offerCard.notActive");
        this.defaultStatus =
          response.data.status == "A"
            ? this.$t("market.offerCard.active")
            : this.$t("market.offerCard.notActive");
        this.selectedCategoryIDs = response.data.categories.map(
          (el) => el.category_id
        );

        this.pictures = response.data.pictures;
      } catch (err) {
        throw err;
      }
    },
    async editItem() {
      try {
        let requestObject = new FormData();
        requestObject.append("name", this.itemName);
        requestObject.append("description", this.itemDescription);
        requestObject.append("price", this.price);

        requestObject.append("rest", this.remaining);
        if (this.sortingFactor)
          requestObject.append("sorted", this.sortingFactor);

        requestObject.append("immediate_delivery", this.immediateDelivery);
        if (this.remainder) {
          requestObject.append("rest_state", this.remainder);
        }

        if (this.selectedFiles) {
          for (let i = 0; i < this.selectedFiles.length; ++i) {
            requestObject.append("photo", this.selectedFiles[i]);
          }
        }

        if (this.picturesToDelete.trim() != "") {
          requestObject.append("images_to_delete", this.picturesToDelete);
        }

        if (this.actualFrom) {
          if (this.actualFrom.length == 24) {
            requestObject.append(
              "actual_from",
              this.actualFrom.slice(0, 10) +
                " " +
                this.actualFrom.slice(11, 19) +
                this.actualFrom.slice(23, 24)
            );
          } else {
            requestObject.append(
              "actual_from",
              this.actualFrom.slice(0, 10) + " " + this.actualFrom.slice(11, 20)
            );
          }
        }
        if (this.actualTo) {
          if (this.actualTo.length == 24) {
            requestObject.append(
              "actual_to",
              this.actualTo.slice(0, 10) +
                " " +
                this.actualTo.slice(11, 19) +
                this.actualTo.slice(23, 24)
            );
          } else {
            requestObject.append(
              "actual_to",
              this.actualTo.slice(0, 10) + " " + this.actualTo.slice(11, 20)
            );
          }
        }
        if (this.getSelectedCategoryIDs.trim() != "") {
          requestObject.append("categories", this.getSelectedCategoryIDs);
        }

        if (this.selectedStatus) {
          requestObject.append(
            "is_active",
            this.selectedStatus == "Активен" ? true : false
          );
        } else {
          requestObject.append(
            "is_active",
            this.defaultStatus == "Активен" ? true : false
          );
        }

        const response = await axios.put(
          API_URIS.marketAdminOffers.replace("id", this.currentMarketID) +
            this.offerID +
            "/",
          requestObject
        );
        this.$emit("closeItemEdition", true);
      } catch (err) {
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
      if (this.actualFrom) this.actualFrom = this.actualFrom.toISOString();
    },
    setActualToDate() {
      if (this.actualTo) this.actualTo = this.actualTo.toISOString();
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
          API_URIS.marketCategories.replace("id", this.currentMarketID)
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
.edit_item_screen_wrapper {
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
.edit_item_wrapper {
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
.edit_item {
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.edit_item_header {
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
}
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
  font-family: "Ubuntu";
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
  /* identical to box height, or 157% */
  text-align: left;
}
.from_to {
  display: flex;
  gap: 12px;
}
.offer_date_picker {
  width: 100%;
}

.category_selectors {
  margin-top: -15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
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