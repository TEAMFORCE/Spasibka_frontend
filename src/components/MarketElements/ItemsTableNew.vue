<template>
  <div class="items_table_wrapper">
    <ImagePopup
      :images="imagesForPopup"
      ref="imagePopup"
      v-if="imageIncreased"
    />
    <div class="items_table">
      <vue-good-table
        mode="remote"
        @sort-change="onSortChange"
        :columns="columns"
        :rows="rows"
        styleClass="vgt-table striped"
      >
        <template #table-row="props">
          <div v-if="props.column.field === 'actual_to'">
            {{
              props.row.actual_to
                ? formatTimestamp(props.row.actual_to)
                : $t("market.offer_expiration_not_set")
            }}
          </div>
          <div
            class="item_photo_element"
            v-if="props.column.field === 'pictures'"
          >
            <button
              @click="increasePictureSize(props.row.pictures)"
              v-if="props.row.pictures.length > 0"
              class="item_photo_wrapper transparent-bg"
            >
              <img class="item_photo" :src="getPhoto(props.row.pictures)" />
            </button>
            <div
              v-if="props.row.pictures.length > 1"
              class="other_photos_info general-grey-bg"
            >
              <h1 class="other_photos_info_text general-contrast-color">
                +{{ props.row.pictures.length - 1 }}
              </h1>
            </div>
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
                @click="$emit('enableEditItem')"
              >
                {{ $t("market.edit_offer") }}
              </button>
              <button
                v-if="props.row.can_delete"
                class="option_button general-white-bg"
                @click="$emit('enableDeleteItem')"
              >
                {{ $t("market.delete_offer") }}
              </button>
            </div>
          </div>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { formatTimestamp } from "@/general-scripts/timestamps";
import { photoAddress } from "@/general-scripts/photo-address";
import OfferOptionsIcon from "@/components/Icons/MarketIcons/OfferOptionsIcon.vue";
import ImagePopup from "@/components/app/ImagePopup.vue";

export default {
  name: "ItemsTable",
  emits: [
    "changeActiveItemIndex",
    "enableEditItem",
    "enableDeleteItem",
    "onSortChange",
  ],
  props: {
    rows: {
      required: true,
    },
  },
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
    OfferOptionsIcon,
    ImagePopup,
  },
  data() {
    return {
      currentItemPhotos: [],
      currentPhotoIndex: 0,
      imageIncreased: false,

      imagesForPopup: null,
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          label: this.$t("market.offer_name"),
          field: "name",
          width: "200px",
        },
        {
          label: this.$t("market.offer_pictures"),
          field: "pictures",
          width: "150px",
        },
        {
          label: this.$t("market.offer_description"),
          field: "description",
          width: "200px",
        },
        {
          label: this.$t("market.offer_expires_at"),
          field: "actual_to",
          width: "150px",
        },
        {
          label: this.$t("market.offer_category"),
          field: "categories_list",
          width: "100px",
        },
        {
          label: this.$t("market.offer_price"),
          field: "actual_thanks_price",
          width: "70px",
          type: "number",
          thClass: "vgt-left-align",
          tdClass: "vgt-left-align",
        },
        {
          label: this.$t("market.offer_remaining"),
          field: "rest",
          width: "70px",
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
    closeOptions(row) {
      return function (event, el) {
        if (row.optionsEnabled) {
          let nextButton = document.getElementById(`enable_options_button_${row.index + 1}`);
          if (nextButton) nextButton.style.zIndex = 10000;
          row.optionsEnabled = false;
        }
      };
    },
    toggleOptions(row) {
      this.$emit("changeActiveItemIndex", row.id);
      row.optionsEnabled ^= true;
      if (row.optionsEnabled){
        let nextButton = document.getElementById(`enable_options_button_${row.index + 1}`);
        if (nextButton && row.can_delete) {
          nextButton.style.zIndex = -1;
        }
      } else {
        let nextButton = document.getElementById(`enable_options_button_${row.index + 1}`);
        if (nextButton) {
          nextButton.style.zIndex = 10000;
        }
      }
    },
    increasePictureSize(item) {
      this.imagesForPopup = item;
      this.imageIncreased = true;
      setTimeout(() => {
        this.$refs.imagePopup.open();
      }, 100);
    },
    getPhoto(item) {
      for (let i = 0; i < item.length; ++i) {
        if (item[i].for_showcase) {
          return photoAddress(item[i].link);
        }
      }
      return photoAddress(item[0].link);
    },
    photoAddress: photoAddress,
  },
};
</script>

<style scoped>
.items_table {
  position: relative;
  transform: rotateX(180deg);
}
::v-deep(.vgt-table) {
  transform: rotateX(180deg) !important;
}
.increased_photo_wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 1000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.change_photo_button {
  height: 30px;
  width: 30px;
}
.arrow_icon {
  height: 30px;
  width: 30px;
}
.increased_photo {
  max-height: 80%;
  max-width: 70%;
  object-fit: cover;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.item_photo_element {
  display: flex;
  gap: 4px;
}
.item_photo_wrapper {
  min-width: 44px;
  height: 44px;
  width: 44px;
}
.item_photo {
  min-width: 42px;
  height: 42px;
  width: 42px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--secondOverlay);
}
.other_photos_info {
  border-radius: 12px;
  height: 44px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.other_photos_info_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.sticky_button_wrapper {
  position: absolute !important;
  right: 25px;
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
  position: relative;
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
}
.option_button {
  padding: 16px;
}
</style>