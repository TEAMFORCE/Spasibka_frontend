<template>
  <div
    class="admin_market_goods general-white-bg main-layout-page"
    ref="scrollContainer"
  >
    <Loading
      class="spinner_loader"
      :active="getOffersLock"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <template v-if="defer(2)">
      <AddNewItem
        v-if="addNewItemEnabled"
        @closeItemAddition="disableAddNewItem"
        :currentMarketID="marketID"
        :offerID="activeItemIndex"
      />
    </template>
    <template v-if="defer(3)">
      <DeleteItem
        v-if="deleteItemEnabled"
        @closeItemDeletion="disableDeleteItem"
        :currentMarketID="marketID"
        :offerID="activeItemIndex"
      />
    </template>
    <template v-if="defer(4)">
      <EditItem
        v-if="editItemEnabled"
        @closeItemEdition="disableEditItem"
        :currentMarketID="marketID"
        :offerID="activeItemIndex"
      />
    </template>
    <template v-if="defer(5)">
      <div class="general_filters">
        <div class="admin_tabs">
          <h1
            class="admin_tab general-secondary-color"
            :class="{ active: $route.name == tab.routeName }"
            v-for="tab in tabs"
            @click="tab.click"
          >
            {{ tab.name }}
          </h1>
        </div>
        <div class="search_and_add_item">
          <div class="search">
            <input
              class="search_field general-contrast-color"
              :placeholder="$t('market.search')"
              v-model="searchString"
            />
            <button class="search_button transparent-bg">
              <SearchItemIcon class="top_bar_icon" />
            </button>
          </div>
          <div class="market_admin_actions">
            <button
              class="add_item_button general-brand-bg general-white-color"
              @click="enableAddNewItem"
            >
              <AddNewItemIcon class="top_bar_icon" />
              {{ $t("market.add_offer") }}
            </button>
            <button
              v-if="isReportLoading"
              class="copy_link_button brand-secondary-bg general-brand-color"
            >
              {{ $t("market.report_is_loading") }}
            </button>
            <button
              v-else
              class="copy_link_button general-brand-bg general-white-color"
              @click="downloadExcel"
            >
              <DownloadReportIcon class="top_bar_icon" />
              {{ $t("market.download_as_excel") }}
            </button>
            <button
              class="copy_link_button general-brand-bg general-white-color"
              @click="copyLink"
            >
              <CopyLinkIcon class="top_bar_icon" />
              {{ $t("market.copy_link") }}
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-if="defer(6)">
      <h1 class="category_text">{{ $t("market.filter.categories") }}</h1>
      <div class="selected_categories">
        <button
          @click="selectCategory(category)"
          class="selected_category"
          v-for="category in categories"
          :class="{
            'general-brand-bg': selectedCategories.includes(category),
            'transparent-bg': !selectedCategories.includes(category),
          }"
        >
          <h1
            class="selected_category_name general-contrast-color"
            :class="{
              'general-white-color': selectedCategories.includes(category),
            }"
          >
            {{ category.name }}
          </h1>
        </button>
      </div>
    </template>
    <!-- <GoodsTable/> -->
    <!-- <ItemsTable
      @scrolledToBottom="scrolledToBottom"
      @activeItemIndex="changeActiveItemIndex"
      :rows="rows"
      :columns="columns"
      :columnsClasses="columnsClasses"
      :options="options"
    /> -->
    <template v-if="defer(7)">
      <ItemsTable
        @changeActiveItemIndex="changeActiveItemIndex"
        @enableEditItem="enableEditItem"
        @enableDeleteItem="enableDeleteItem"
        @onSortChange="onSortChange"
        :rows="rows"
        :columns="columns"
        :columnsClasses="columnsClasses"
        :options="options"
      />
    </template>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import AddNewItemIcon from "@/components/Icons/MarketIcons/AddNewItemIcon.vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import Defer from "@/mixins/defer";

import Loading from "vue3-loading-overlay";
import CopyLinkIcon from "@/components/Icons/MarketIcons/CopyLinkIcon.vue";
import SearchItemIcon from "@/components/Icons/MarketIcons/SearchItemIcon.vue";
import DownloadReportIcon from "@/components/Icons/MarketIcons/DownloadReportIcon.vue";

export default {
  name: "AdminMarketGoods",
  components: {
    GoodsTable: defineAsyncComponent(() =>
      import("@/components/MarketElements/GoodsTable.vue")
    ),
    AddNewItem: defineAsyncComponent(() =>
      import("@/components/MarketElements/AddNewItem.vue")
    ),
    DeleteItem: defineAsyncComponent(() =>
      import("@/components/MarketElements/DeleteItem.vue")
    ),
    ItemsTable: defineAsyncComponent(() =>
      import("@/components/MarketElements/ItemsTableNew.vue")
    ),
    EditItem: defineAsyncComponent(() =>
      import("@/components/MarketElements/EditItem.vue")
    ),
    Loading,
    AddNewItemIcon,
    CopyLinkIcon,
    SearchItemIcon,
    DownloadReportIcon,
  },
  mixins: [Defer()],
  data() {
    return {
      columns: [
        "Название предложения",
        "Фото",
        "Описание",
        "Срок истечения",
        "Категория",
        // "Статус",
        "Цена",
        "Остаток",
      ],
      columnsClasses: [
        "name",
        "photo",
        "description",
        "actual_to",
        "category",
        // "status",
        "actual_thanks_price",
        "rest",
      ],
      rows: [],
      categories: [],
      selectedCategories: [],

      options: [
        {
          text: "Редактировать",
          click: this.enableEditItem,
        },
        {
          text: "Удалить",
          click: this.enableDeleteItem,
        },
      ],

      tabs: [
        {
          name: this.$t("market.market_admin_navigation.products"),
          routeName: "AdminMarketGoods",
          click: () => {
            this.$router.push("/admin_market_goods");
          },
        },
        {
          name: this.$t("market.market_admin_navigation.shoppingList"),
          routeName: "",
          click: () => {
            this.$router.push("/admin_market_purchases");
          },
        },
      ],

      searchString: "",

      addNewItemEnabled: false,
      deleteItemEnabled: false,
      editItemEnabled: false,
      marketID: null,
      pageCount: 1,
      getOffersLock: false,
      reachedEnd: false,
      searchOffersTimeout: null,
      orderBy: null,

      isReportLoading: false,

      activeItemIndex: null,

      marketKey: null,

      fieldsMapper: {
        name: "name",
        pictures: "pictures",
        description: "description",
        actual_to: "actual_to",
        categories_list: "categories_list",
        actual_thanks_price: "price",
        rest: "rest",
      },
    };
  },
  mounted() {
    this.addScrollEndEvent();
    this.getAvailableMarkets();
  },
  watch: {
    getOffersLock: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    searchString: {
      handler() {
        this.fetchOffersWithSearch();
      },
      flush: "post",
    },
  },
  computed: {
    searchIcon() {
      return this.getImgUrl("SearchIcon");
    },
  },
  methods: {
    onSortChange(sortDetails) {
      if (sortDetails.length) {
        if (sortDetails[0].type === "none") {
          this.orderBy = null;
        } else if (sortDetails[0].type === "desc") {
          this.orderBy = this.fieldsMapper[sortDetails[0].field];
        } else {
          this.orderBy = this.fieldsMapper[sortDetails[0].field] + "-";
        }
      } else {
        this.orderBy = null;
      }
      this.resetOffers();
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    addScrollEndEvent() {
      var table = document.getElementsByClassName("admin_market_goods")[0];
      table.addEventListener("scroll", () => {
        if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
          this.scrolledToBottom();
        }
      });
    },
    async copyLink() {
      const marketLink =
        window.location.origin +
        "/market/" +
        this.marketID +
        "/offers/?public_key=" +
        this.marketKey;
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(marketLink);
          this.$moshaToast(
            {
              title: "Ссылка скопирована",
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
        } catch (err) {
          this.$moshaToast(
            {
              title: "Не удалось скопировать ссылку",
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "danger",
            }
          );
          throw err;
        }
      } else {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = marketLink;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          this.$moshaToast(
            {
              title: "Ссылка скопирована1",
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
        } catch (err) {
          this.$moshaToast(
            {
              title: "Не удалось скопировать ссылку",
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "danger",
            }
          );
          throw err;
        }
      }
    },
    selectCategory(category) {
      if (this.selectedCategories.includes(category)) {
        let indexOfCategory = this.selectedCategories.indexOf(category);
        if (indexOfCategory !== -1)
          this.selectedCategories.splice(indexOfCategory, 1);
      } else {
        this.selectedCategories.push(category);
      }
      if (this.searchOffersTimeout) {
        clearTimeout(this.searchOffersTimeout);
      }
      this.searchOffersTimeout = setTimeout(this.resetOffers, 300);
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/MarketImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    changeActiveItemIndex(index) {
      this.activeItemIndex = index;
    },
    enableAddNewItem() {
      this.addNewItemEnabled = true;
    },
    disableAddNewItem(update = false) {
      this.addNewItemEnabled = false;
      if (update) {
        this.resetOffers();
      }
    },
    enableDeleteItem() {
      this.deleteItemEnabled = true;
    },
    enableEditItem() {
      this.editItemEnabled = true;
    },
    disableDeleteItem(update = false) {
      this.deleteItemEnabled = false;
      if (update) {
        this.resetOffers();
      }
    },
    disableEditItem(update = false) {
      this.editItemEnabled = false;
      if (update) {
        this.resetOffers();
      }
    },
    fetchOffersWithSearch() {
      if (this.searchOffersTimeout) {
        clearTimeout(this.searchOffersTimeout);
      }
      this.searchOffersTimeout = setTimeout(this.resetOffers, 800);
    },
    resetOffers() {
      this.reachedEnd = false;
      this.rows = [];
      this.pageCount = 1;
      this.getOffers();
    },
    scrolledToBottom() {
      if (!this.getOffersLock) {
        this.getOffers();
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(
          API_URIS.marketCategories.replace("id", this.marketID)
        );
        this.categories = response.data;
      } catch (err) {
        throw err;
      }
    },
    async getAvailableMarkets() {
      try {
        const response = await axios.get(API_URIS.marketsAvailable);
        if (response.data.length > 0) {
          this.marketID = response.data[0].id;
          this.getCategories();
          this.getOffers();
        }
      } catch (err) {
        throw err;
      }
    },
    async getOffers() {
      if (this.reachedEnd) return;
      try {
        this.getOffersLock = true;
        let requestObject = {
          offset: this.pageCount,
          limit: 20,
        };
        if (this.orderBy) {
          requestObject["order_by"] = this.orderBy;
        }
        if (this.searchString.trim() != "") {
          requestObject["name"] = this.searchString.trim();
        }
        if (this.selectedCategories.length) {
          let categoriesToSend = [];
          for (let i = 0; i < this.selectedCategories.length; ++i) {
            categoriesToSend.push(this.selectedCategories[i].id);
          }
          requestObject["categories"] = categoriesToSend;
        }
        const response = await axios.post(
          API_URIS.marketAdminOffers.replace("id", this.marketID),
          requestObject
        );
        this.marketKey = response.data.public_key;
        if (response.data.offers?.length == 0) {
          this.reachedEnd = true;
        }
        this.pageCount++;
        for (let i = 0; i < response.data.offers?.length; ++i) {
          let curRow = response.data.offers[i];
          curRow["ID предложения"] = curRow.id;
          curRow["Название предложения"] = curRow.name;
          curRow["Фото"] = curRow.pictures;
          curRow["Описание"] = curRow.description;
          curRow["Срок истечения"] = curRow.actual_to || "Не указано";
          curRow["Категория"] =
            curRow.categories.length > 0
              ? curRow.categories.map((c) => c.category_name).join(", ")
              : "Не указано";

          curRow.categories_list =
            curRow.categories.length > 0
              ? curRow.categories.map((c) => c.category_name).join(", ")
              : "Не указано";
          // curRow["Статус"] = curRow.status;
          curRow["Цена"] = curRow.actual_thanks_price;
          curRow["Остаток"] = curRow.rest;
          this.rows.push(curRow);
          this.rows[i].index = i;
        }
        setTimeout(() => {
          let elementsArray = [...document.querySelectorAll('.vgt-left-align.sticky_button')];
          for (let i = 0; i < elementsArray.length; ++i) {
            elementsArray[i].id = `enable_options_button_${i}`;
          }
        }, 500);
        this.getOffersLock = false;
      } catch (err) {
        this.getOffersLock = false;
        throw err;
      }
    },
    async downloadExcel() {
      let requestObject = {
        ext: "xlsx",
        limit: 10000,
        offset: 1,
      };
      if (this.orderBy) {
        requestObject["order_by"] = this.orderBy;
      }
      if (this.searchString.trim() != "") {
        requestObject["name"] = this.searchString.trim();
      }
      if (this.selectedCategories.length) {
        let categoriesToSend = [];
        for (let i = 0; i < this.selectedCategories.length; ++i) {
          categoriesToSend.push(this.selectedCategories[i].id);
        }
        requestObject["categories"] = categoriesToSend;
      }
      try {
        this.isReportLoading = true;
        let response = await axios.post(
          API_URIS.marketAdminOffers.replace("id", this.marketID),
          requestObject,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        link.download = this.$t("market.market_offers") + ".xlsx";
        link.click();
        this.isReportLoading = false;
      } catch (err) {
        this.isReportLoading = false;
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.admin_market_goods {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.admin_market_goods::-webkit-scrollbar {
  width: 8px;
  background-color: var(--negativeSecondary);
}
.admin_market_goods::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.general_filters {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.admin_tabs {
  display: flex;
  gap: 20px;
}
.admin_tab {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}
.admin_tab.active {
  color: var(--generalContrast);
}
.admin_tab:hover {
  cursor: pointer;
}

.search_and_add_item {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-between;
}
.search {
  flex: 1;
  /* max-width: 702px; */
  min-width: 250px;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 7px 16px;
}

.search_field {
  min-width: 200px;
  width: 100%;
  border-style: none;
  background-color: var(--generalColorWhite);
}
.search_field::placeholder {
  color: var(--generalColorSecondary);
}
.search_button {
  height: 24px;
  width: 24px;
}
.top_bar_icon {
  height: 24px;
}
.market_admin_actions {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
}
.add_item_button {
  /* min-width: 200px; */
  padding: 8px 14px;
  box-shadow: 0px 10px 20px rgba(var(--generalBrandRGB), 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;
}

.copy_link_button {
  padding: 8px 14px;
  box-shadow: 0px 10px 20px rgba(var(--generalBrandRGB), 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;
}
.category_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-align: left;
}
.selected_categories {
  margin-top: -8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.selected_category {
  border-radius: 12px;
  gap: 6px;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--generalBrand);
}
.selected_category_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  word-break: break-word;
}
</style>