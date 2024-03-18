<template>
  <div class="purchases_table">
    <vue-good-table
      mode="remote"
      @sort-change="onSortChange"
      :columns="columns"
      :rows="rows"
      styleClass="vgt-table striped"
    >
      <template #table-row="props">
        <div v-if="props.column.field === 'created_at'">
          {{
            props.row.created_at
              ? formatTimestamp(props.row.created_at)
              : $t("market.order_creation_not_set")
          }}
        </div>
        <div
          v-if="props.column.field === 'customer_name'"
          class="customer_name"
          @click="$router.push('/other_profile/' + props.row.customer_id)"
        >
          {{ customerName(props.row) }}
        </div>
        <div v-if="props.column.field === 'order_status'">
          {{ getStatusName(props.row.order_status) }}
        </div>
        <div
          v-if="props.column.field === 'options'"
          class="sticky_button_wrapper general-white-bg"
          v-click-outside="closeOptions(props.row)"
        >
          <button
            class="enable_options_button brand-secondary-bg"
            @click="toggleOptions(props.row)"
          >
            <OfferOptionsIcon class="offer_options_icon" />
          </button>
          <div
            v-if="props.row.optionsEnabled"
            class="option_buttons second-overlay-bg"
          >
            <button
              class="option_button general-white-bg"
              @click="$emit('enableChangeStatus', props.row)"
            >
              {{ $t("market.change_status") }}
            </button>
          </div>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { formatTimestamp } from "@/general-scripts/timestamps";
import { photoAddress } from "@/general-scripts/photo-address";
import OfferOptionsIcon from "@/components/Icons/MarketIcons/OfferOptionsIcon.vue";
import PrevPictureArrowIcon from "../Icons/MarketIcons/PrevPictureArrowIcon.vue";
import NextPictureArrowIcon from "../Icons/MarketIcons/NextPictureArrowIcon.vue";

export default {
  name: "PurchasesTable",
  emits: ["enableChangeStatus", "onSortChange"],
  props: {
    rows: {
      required: true,
    },
    statusesMapping: {
      default: [],
    },
  },
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
    OfferOptionsIcon,
    PrevPictureArrowIcon,
    NextPictureArrowIcon,
  },
  data() {
    return {
      currentItemPhotos: [],
      currentPhotoIndex: 0,
      imageIncreased: false,
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          label: this.$t("market.order_id"),
          field: "id",
          type: "number",
          thClass: "vgt-left-align",
          tdClass: "vgt-left-align",
        },
        {
          label: this.$t("market.offer_name"),
          field: "offer_name",
        },
        {
          label: this.$t("market.order_customer_name"),
          field: "customer_name",
          tdClass: "cursor_pointer",
        },
        {
          label: this.$t("market.order_created_at"),
          field: "created_at",
        },
        {
          label: this.$t("market.order_status"),
          field: "order_status",
        },
        {
          label: this.$t("market.offer_price"),
          field: "price",
          type: "number",
          thClass: "vgt-left-align",
          tdClass: "vgt-left-align",
        },
        {
          label: this.$t("market.order_quantity"),
          field: "quantity",
          type: "number",
          thClass: "vgt-left-align",
          tdClass: "vgt-left-align",
        },
        {
          field: "options",
          width: "50px",
          tdClass: "sticky_button",
          sortable: false,
        },
      ];
      return columns;
    },
    increasedPicture() {
      if (this.currentItemPhotos.length > 0) {
        return this.currentItemPhotos[this.currentPhotoIndex].link;
      }
      return null;
    },
  },
  methods: {
    onSortChange(sortDetails) {
      this.$emit("onSortChange", sortDetails);
    },
    formatTimestamp(timestamp) {
      let formattedTimeStamp = formatTimestamp(timestamp);

      let day = formattedTimeStamp.day;
      day = day < 10 ? "0" + day : day;
      let month = formattedTimeStamp.month + 1;
      month = month < 10 ? "0" + month : month;
      let year = formattedTimeStamp.year;
      let date = day + "." + month + "." + year;

      let hours = formattedTimeStamp.hours;
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = formattedTimeStamp.minutes;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let time = hours + ":" + minutes;

      return date + " " + this.$t("general.date.at") + " " + time;
    },
    customerName(order) {
      let customerName = order.customer_name;
      let customerSurname = order.customer_surname;
      let customerTgName = order.customer_tg_name;
      let customerNickname = order.customer_nickname;
      let displayName = "";
      if (customerName || customerSurname) {
        displayName += `${customerSurname || ""} ${customerName || ""}`.trim();
      } else if (customerTgName) {
        displayName = customerTgName;
      } else {
        displayName = customerNickname || "";
      }
      return displayName;
    },
    getStatusName(status) {
      let neededStatus = this.statusesMapping.find((el) => el.id === status);
      if (neededStatus) return neededStatus.name;
      else return "Неизвестен";
    },
    closeOptions(row) {
      return function (event, el) {
        if (row.optionsEnabled) {
          row.optionsEnabled = false;
        }
      };
    },
    toggleOptions(row) {
      // this.$emit("changeActiveItemIndex", row);
      row.optionsEnabled ^= true;
    },
    increasePictureSize(item) {
      this.currentItemPhotos = item;
      let pictureFound = false;
      for (let i = 0; i < item.length; ++i) {
        if (item[i].for_showcase) {
          this.currentPhotoIndex = i;
          pictureFound = true;
          break;
        }
      }
      if (!pictureFound) {
        this.currentPhotoIndex = 0;
      }
      this.imageIncreased = true;
    },
    getPhoto(item) {
      for (let i = 0; i < item.length; ++i) {
        if (item[i].for_showcase) {
          return photoAddress(item[i].link);
        }
      }
      return photoAddress(item[0].link);
    },
    decreasePicture() {
      if (this.imageIncreased) {
        this.imageIncreased = false;
        this.currentItemPhotos = [];
      }
    },
    goToPrevPhoto() {
      this.currentPhotoIndex--;
      if (this.currentPhotoIndex < 0) {
        this.currentPhotoIndex = this.currentItemPhotos.length - 1;
      }
    },
    goToNextPhoto() {
      this.currentPhotoIndex++;
      if (this.currentPhotoIndex >= this.currentItemPhotos.length) {
        this.currentPhotoIndex = 0;
      }
    },
    photoAddress: photoAddress,
  },
};
</script>

<style scoped>
.purchases_table {
  position: relative;
  transform: rotateX(180deg);
}
::v-deep(.vgt-table) {
  transform: rotateX(180deg) !important;
}
.customer_name {
  height: 100%;
}
.sticky_button_wrapper {
  position: absolute !important;
  right: 25px;
}
.cursor_pointer {
  cursor: pointer;
}
::v-deep(.vgt-responsive) {
  position: relative;
}
::v-deep(.sticky_button) {
  position: sticky;
  right: 0px;
}
::v-deep(.vgt-left-align) {
  color: var(--generalContrast) !important;
  height: 60px;
}
::v-deep(.vgt-left-align span) {
  font-family: "Golos";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
}
.enable_options_button {
  border-radius: 8px;
  padding: 8px;
}
.offer_options_icon {
  height: 24px;
  width: 24px;
}
.option_buttons {
  z-index: 100;
  display: flex;
  right: 0px;
  flex-direction: column;
  gap: 1px;
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
  white-space: nowrap;
}
.option_button {
  padding: 16px;
}
</style>