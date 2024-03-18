<template>
  <div
    class="admin_market_purchases general-white-bg main-layout-page"
    ref="scrollContainer"
  >
    <Loading
      class="spinner_loader"
      :active="getOrdersLock"
      :isFullPage="false"
      ref="spinnerLoader"
    />
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
    </div>
    <div class="search_and_actions">
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
      <button
        v-if="isReportLoading"
        class="download_excel brand-secondary-bg general-brand-color"
      >
        {{ $t("market.report_is_loading") }}
      </button>
      <button
        v-else
        class="download_excel general-brand-bg general-white-color"
        @click="downloadExcel"
      >
        <DownloadReportIcon class="top_bar_icon" />
        {{ $t("market.download_as_excel") }}
      </button>
    </div>
    <h1 class="status_text">
      {{ $t("market.status") }}
    </h1>
    <div class="selected_statuses">
      <button
        @click="selectStatus(status)"
        class="selected_status"
        v-for="status in statuses"
        :class="{
          'general-brand-bg': selectedStatuses.includes(status),
          'transparent-bg': !selectedStatuses.includes(status),
        }"
      >
        <h1
          class="selected_status_name general-contrast-color"
          :class="{
            'general-white-color': selectedStatuses.includes(status),
          }"
        >
          {{ status.name }}
        </h1>
      </button>
    </div>
    <!-- <ItemsTable
      @scrolledToBottom="scrolledToBottom"
      :rows="rows"
      :columns="columns"
      :columnsClasses="columnsClasses"
      :options="options"
      :statuses="statuses"
    /> -->
    <PurchasesTable
      @enableChangeStatus="openStatusesPopup"
      @onSortChange="onSortChange"
      :rows="rows"
      :columns="columns"
      :columnsClasses="columnsClasses"
      :options="options"
      :statusesMapping="statusesMapping"
    />
    <Transition>
      <div
        class="statuses_popup_wrapper"
        v-if="statusesPopupVisible"
        @click.self="closePopup"
      >
        <OrderStatusesSelector
          :rowData="currentRow"
          @cancel="closePopup"
          @saveStatus="saveStatus"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import axios from "axios";

import vSelect from "vue-select";

import ItemsTable from "@/components/MarketElements/ItemsTable.vue";
import OrderStatusesSelector from "@/components/MarketElements/order-statuses-selector.vue";
import PurchasesTable from "@/components/MarketElements/PurchasesTable.vue";
import Loading from "vue3-loading-overlay";
import SearchItemIcon from "@/components/Icons/MarketIcons/SearchItemIcon.vue";
import DownloadReportIcon from "@/components/Icons/MarketIcons/DownloadReportIcon.vue";

export default {
  name: "AdminMarketPurchases",
  components: {
    vSelect,
    ItemsTable,
    OrderStatusesSelector,
    PurchasesTable,
    Loading,
    SearchItemIcon,
    DownloadReportIcon,
  },
  data() {
    return {
      statusesPopupVisible: false,
      currentRow: () => {},
      columns: [
        "Номер заказа",
        "Имя предложения",
        "Покупатель",
        "Дата создания",
        "Статус",
        "Цена",
        "Количество",
      ],
      columnsClasses: [
        "id",
        "offer_name",
        "customer_name",
        "created_at",
        "order_status",
        "price",
        "quantity",
      ],
      rows: [],
      statuses: [
        {
          id: 1,
          name: this.$t("market.orderStatuses.underConsideration"),
          color: "info",
        },
        // { id: 5, name: "Принято, ожидает", color: "info" },
        // { id: 6, name: "Принято покупателем", color: "success" },
        {
          id: 7,
          name: this.$t("market.orderStatuses.purchased"),
          color: "success",
        },
        // { id: 8, name: "Готово для доставки", color: "info" },
        {
          id: 9,
          name: this.$t("market.orderStatuses.dispatchedDelivered"),
          color: "success",
        },
        // { id: 10, name: "Готово", color: "success" },
        {
          id: 20,
          name: this.$t("market.orderStatuses.rejected"),
          color: "error",
        },
        // { id: 21, name: "Отменено", color: "error" },
      ],
      statusesMapping: [
        {
          id: 1,
          name: this.$t("market.order_table_statuses.underConsideration"),
          color: "info",
        },
        {
          id: 5,
          name: this.$t("market.order_table_statuses.acceptedAwaiting"),
          color: "info",
        },
        // { id: 6, name: this.$t("market.order_table_statuses.acceptedByBuyer"), color: "success" },
        {
          id: 7,
          name: this.$t("market.order_table_statuses.paid"),
          color: "success",
        },
        {
          id: 8,
          name: this.$t("market.order_table_statuses.readyForPickup"),
          color: "info",
        },
        {
          id: 9,
          name: this.$t("market.order_table_statuses.issuedShippedToBuyer"),
          color: "success",
        },
        // { id: 10, name: this.$t("market.order_table_statuses.ready"), color: "success" },
        {
          id: 20,
          name: this.$t("market.order_table_statuses.rejected"),
          color: "error",
        },
        {
          id: 21,
          name: this.$t("market.order_table_statuses.canceled"),
          color: "error",
        },
      ],
      selectedStatuses: [],
      options: [
        {
          text: "Изменить статус",
          click: (row) => {
            this.openStatusesPopup(row);
          },
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
          routeName: "AdminMarketPurchases",
          click: () => {
            this.$router.push("/admin_market_purchases");
          },
        },
      ],
      // statusFilters: [
      //     {
      //         name: "Все"
      //     },
      //     {
      //         name: "Оплачен"
      //     },
      //     {
      //         name: "Требует подтверждения"
      //     },
      //     {
      //         name: "Передан"
      //     },
      //     {
      //         name: "Отменён"
      //     },
      // ],

      // currentFilter: { name: "Все" },
      searchString: "",
      marketID: null,
      pageCount: 1,
      getOrdersLock: false,
      reachedEnd: false,
      searchOrdersTimeout: null,
      orderBy: null,

      isReportLoading: false,

      fieldsMapper: {
        id: "order_number",
        offer_name: "offer_name",
        customer_name: "surname",
        created_at: "created_at",
        quantity: "amount",
        price: "price",
        order_status: "order_status",
      },
    };
  },
  mounted() {
    this.addScrollEndEvent();
    this.getAvailableMarkets();
  },
  watch: {
    getOrdersLock: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    statusesPopupVisible() {
      if (this.statusesPopupVisible) {
        window.addEventListener("scroll", (e) => {
          window.scrollTo(0, 0);
        });
      } else {
        window.removeEventListener("scroll", (e) => {
          window.scrollTo(0, 0);
        });
      }
    },
    searchString: {
      handler() {
        this.fetchOrdersWithSearch();
      },
      flush: "post",
    },
  },
  computed: {
    searchIcon() {
      return this.getImgUrl("SearchIcon");
    },
    // unselectedStatuses(){
    //     return this.statuses.filter(item => !this.selectedStatuses.includes(item));
    // },
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
      this.resetOrders();
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
      var table = document.getElementsByClassName("admin_market_purchases")[0];
      table.addEventListener("scroll", () => {
        if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
          this.scrolledToBottom();
        }
      });
    },
    openSuccess() {
      this.$moshaToast(
        {
          title: this.$t("organization.settings.notification.success"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "success",
        }
      );
    },
    openError(err = "") {
      this.$moshaToast(
        {
          title: err
            ? err
            : this.$t("organization.settings.notification.error"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "danger",
        }
      );
    },
    openStatusesPopup(data) {
      this.currentRow = data;
      this.statusesPopupVisible = true;
    },
    closePopup() {
      this.statusesPopupVisible = false;
    },
    async saveStatus(data) {
      try {
        let response = await axios.post(
          `${API_URIS.market}${this.marketID}${API_URIS.orderStatusAdmin}${data.orderId}/`,
          {
            order_status: data.status,
          }
        );
        // if (response.status === 200 || 201 || 202) {
        //   this.resetOrders();
        //   this.openSuccess();
        //   this.closePopup();
        // } else {
        //   notify(err?.response?.data || err?.message || this.$t("notification.error"));
        // }
        notify(
          this.$t("market.market_admin.status_successfully_changed"),
          "success"
        );
        this.resetOrders();
        this.closePopup();
      } catch (err) {
        let errorMessage = err?.response?.data?.status;
        if (errorMessage === "Not enough thanks to pay")
          errorMessage = this.$t("market.market_admin.insufficient_funds");
        notify(
          errorMessage ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
      // try {
      //   let response = await axios.post(API_URIS.organizationsSettings, {
      //     settings: {
      //       t_grace_period: this.transactionCancelEndPeriod,
      //     },
      //   });
      //   if (response.status === 200 || 201 || 202) {
      //     this.openSuccess();
      //   } else {
      //     this.openError();
      //   }
      // } catch (err) {
      //   this.openError();
      //   throw err;
      // }
    },
    selectStatus(status) {
      if (this.selectedStatuses.includes(status)) {
        let indexOfStatus = this.selectedStatuses.indexOf(status);
        if (indexOfStatus !== -1)
          this.selectedStatuses.splice(indexOfStatus, 1);
      } else {
        this.selectedStatuses.push(status);
      }
      if (this.searchOrdersTimeout) {
        clearTimeout(this.searchOrdersTimeout);
      }
      this.searchOrdersTimeout = setTimeout(this.resetOrders, 300);
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/MarketImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    fetchOrdersWithSearch() {
      if (this.searchOrdersTimeout) {
        clearTimeout(this.searchOrdersTimeout);
      }
      this.searchOrdersTimeout = setTimeout(this.resetOrders, 300);
    },
    resetOrders() {
      this.reachedEnd = false;
      this.rows = [];
      this.pageCount = 1;
      this.getOrders();
    },
    scrolledToBottom() {
      if (!this.getOrdersLock) {
        this.getOrders();
      }
    },
    disableAddNewItem(update = false) {
      this.addNewItemEnabled = false;
      if (update) {
        this.resetOrders();
      }
    },
    async getAvailableMarkets() {
      try {
        const response = await axios.get(API_URIS.marketsAvailable);
        if (response.data.length > 0) {
          this.marketID = response.data[0].id;
          this.getOrders();
        }
      } catch (err) {
        throw err;
      }
    },
    async getOrders() {
      if (this.reachedEnd) return;
      try {
        this.getOrdersLock = true;
        let requestObject = {
          offset: this.pageCount,
          limit: 20,
        };
        if (this.orderBy) {
          if (this.orderBy === "surname")
            requestObject["order_by"] = ["surname", "tg_name", "nickname"];
          else if (this.orderBy === "surname-")
            requestObject["order_by"] = ["surname-", "tg_name-", "nickname-"];
          else if (this.orderBy === "order_status")
            requestObject["order_by"] = ["status"];
          else if (this.orderBy === "order_status-")
            requestObject["order_by"] = ["status-"];
          else requestObject["order_by"] = [this.orderBy];
        }
        if (this.searchString.trim() != "") {
          requestObject["name"] = this.searchString.trim();
        }
        if (this.selectedStatuses.length) {
          let statusesToSend = [];
          for (let i = 0; i < this.selectedStatuses.length; ++i) {
            statusesToSend.push(this.selectedStatuses[i].id);
          }
          requestObject["status_list"] = statusesToSend;
        }
        const response = await axios.post(
          API_URIS.marketAdminOrders.replace("id", this.marketID),
          requestObject
        );
        if (response.data.orders?.length == 0) {
          this.reachedEnd = true;
        }
        this.pageCount++;
        for (let i = 0; i < response.data.orders?.length; ++i) {
          let curRow = response.data.orders[i];
          curRow["Номер заказа"] = curRow.id;
          curRow["Имя предложения"] = curRow.offer_name;
          curRow["Покупатель"] = curRow.customer_name
            ? curRow.customer_name + " " + curRow.customer_surname
            : curRow.customer_tg_name
            ? curRow.customer_tg_name
            : curRow.customer_nickname;
          curRow["Дата создания"] = curRow.created_at || "Не указано";
          curRow["Статус"] = curRow.order_status;
          curRow["Цена"] = curRow.price;
          curRow["Количество"] = curRow.quantity;
          this.rows.push(curRow);
        }
        this.getOrdersLock = false;
      } catch (err) {
        this.getOrdersLock = false;
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
        if (this.orderBy === "surname")
          requestObject["order_by"] = ["surname", "tg_name", "nickname"];
        else if (this.orderBy === "surname-")
          requestObject["order_by"] = ["surname-", "tg_name-", "nickname-"];
        else requestObject["order_by"] = [this.orderBy];
      }
      if (this.searchString.trim() != "") {
        requestObject["name"] = this.searchString.trim();
      }
      if (this.selectedStatuses.length) {
        let statusesToSend = [];
        for (let i = 0; i < this.selectedStatuses.length; ++i) {
          statusesToSend.push(this.selectedStatuses[i].id);
        }
        requestObject["status_list"] = statusesToSend;
      }
      try {
        this.isReportLoading = true;
        let response = await axios.post(
          API_URIS.marketAdminOrders.replace("id", this.marketID),
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
        link.download = this.$t("market.market_orders") + ".xlsx";
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.admin_market_purchases {
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.admin_market_purchases::-webkit-scrollbar {
  width: 8px;
}
.admin_market_purchases::-webkit-scrollbar-thumb {
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
.status_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-align: left;
}
.selected_statuses {
  margin-top: -8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.selected_status {
  border-radius: 12px;
  gap: 6px;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--generalBrand);
}
.selected_status_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  word-break: break-word;
}
/* .status_filter {
    width: 100%;
    max-width: 400px;
    padding: 0px !important;
}
.status_filters {
    display: flex;
    gap: 8px;
}
.status_filter {
    padding: 8px 14px;
    border-radius: 12px;
}
.status_filter.active {
    background-color: var(--generalBrand);
    box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02), 0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
.status_filter_text {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
}
.status_filter_text.active {
    color: var(--generalColorWhite);
} */
.search_and_actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
.download_excel {
  padding: 8px 14px;
  box-shadow: 0px 10px 20px rgba(237, 125, 43, 0.3);
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
.statuses_popup_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(12px);
}
</style>