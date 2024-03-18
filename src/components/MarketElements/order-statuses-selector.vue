<template>
  <div class="order_statuses_selector_wrapper">
    <h2 class="statuses_title">
      {{ `${$t("market.orderNumber")} ${rowData.id}` }}
    </h2>
    <div class="statuses_input_wrapper">
      <h3 class="input_title">{{ $t("market.orderStatus") }}</h3>
      <div class="statuses_iput">
        <vSelect
          class="style-chooser"
          v-model="selectedStatus"
          :options="currentAvailableStatuses"
          :placeholder="$t('market.choseStatus')"
          label="title"
        >
          <template #no-options>
            {{ $t("market.no_available_options") }}
          </template>
        </vSelect>
      </div>
    </div>
    <div class="buttons_wrapper">
      <button class="save_button" @click="saveStatus">
        {{ $t("market.save") }}
      </button>
      <button class="cancel_button" @click="cancelStatus">
        {{ $t("market.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import { ITEM_STATUS } from "@/infrastructure/constants/item-status";
import { ITEMS_STATUSES } from "@/infrastructure/data-sources/items-statuses";

import vSelect from "vue-select";

export default {
  name: "OrderStatusesSelector",
  components: {
    vSelect,
  },
  props: {
    rowData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedStatus: null,
      currentAvailableStatuses: [],
    };
  },
  computed: {
    itemStatus() {
      return ITEM_STATUS(this);
    },
    itemsStatuses() {
      return ITEMS_STATUSES(this);
    },
  },
  methods: {
    findStatuses() {
      // Iterate over keys in the rowData.available_status object
      for (let key in this.rowData.available_status) {
        // Check if the object has the key as its own property (not from prototype chain)
        if (key == this.rowData.order_status) {
          // Iterate over array values of each key
          this.rowData.available_status[key].forEach(status => {
            let foundStatus = this.itemsStatuses.find(el => el.status === status);
            if (foundStatus && foundStatus.status != this.rowData.order_status) {
              this.currentAvailableStatuses.push(foundStatus);
            }
          });
        }
      }
    },
    saveStatus() {
      if (this.selectedStatus) {
        this.$emit("saveStatus", {
          orderId: this.rowData.id,
          status: this.selectedStatus.status,
        });
      }
    },
    cancelStatus() {
      this.$emit("cancel");
    },
  },
  mounted() {
    this.findStatuses();
  },
};
</script>

<style scoped>
.order_statuses_selector_wrapper {
  width: 477px;
  height: 217px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 32px;
  gap: 24px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.statuses_title {
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  color: var(--generalContrast);
  margin: 0;
}
.statuses_input_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}
.input_title {
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: var(--generalColorDark);
  margin: 0;
}
.statuses_iput {
  width: 100%;
}
.buttons_wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
}
.save_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  transition: 0.4s;
}
.save_button:hover {
  background-color: var(--generalBrandLight);
}
.save_button:active {
  transform: scale(0.99);
}
.cancel_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  transition: 0.4s;
}
.cancel_button:hover {
  background-color: var(--secondaryColorBrandDark);
}
.cancel_button:active {
  transform: scale(0.99);
}
</style>