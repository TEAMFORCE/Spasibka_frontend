<template>
  <div class="custom-table-container">
    <div
      @click="decreasePicture"
      class="increased_photo_wrapper"
      v-if="imageIncreased"
    >
      <button
        v-if="currentItemPhotos.length > 1"
        class="change_photo_button transparent-bg"
        @click.stop="goToPrevPhoto"
      >
        <img class="arrow_icon" :src="getImgUrl('LeftArrow')" />
      </button>
      <img class="increased_photo" :src="photoAddress(increasedPicture)" />
      <button
        v-if="currentItemPhotos.length > 1"
        class="change_photo_button transparent-bg"
        @click.stop="goToNextPhoto"
      >
        <img class="arrow_icon" :src="getImgUrl('RightArrow')" />
      </button>
    </div>
    <div class="custom-table">
      <table>
        <thead class="sticky-header">
          <tr>
            <th
              class="general-white-bg"
              v-for="(column, columnIndex) in columns"
              :key="columnIndex"
              @click="sortRows(column)"
            >
              {{ column }}
            </th>
            <th class="general-white-bg"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="data_row"
            v-for="(row, rowIndex) in sortedRows"
            :key="rowIndex"
          >
            <td
              v-for="(column, columnIndex) in columns"
              :key="columnIndex"
              :class="'column_' + columnsClasses[columnIndex]"
            >
              <div
                class="item_photo_element"
                v-if="columnsClasses[columnIndex] == 'photo'"
              >
                <button
                  @click="increasePictureSize(row[column])"
                  v-if="row[column].length > 0"
                  class="item_photo_wrapper transparent-bg"
                >
                  <img class="item_photo" :src="getPhoto(row[column])" />
                </button>
                <div
                  v-if="row[column].length > 1"
                  class="other_photos_info general-grey-bg"
                >
                  <h1 class="other_photos_info_text general-contrast-color">
                    +{{ row[column].length - 1 }}
                  </h1>
                </div>
              </div>
              <h1
                v-else-if="columnsClasses[columnIndex] == 'actual_to'"
                class="column_text general-contrast-color"
                :class="'column_text_' + columnsClasses[columnIndex]"
              >
                {{ formatDate(row[column], true) }}
              </h1>
              <h1
                v-else-if="columnsClasses[columnIndex] == 'created_at'"
                class="column_text general-contrast-color"
                :class="'column_text_' + columnsClasses[columnIndex]"
              >
                {{ formatDate(row[column]) }}
              </h1>
              <h1
                v-else-if="columnsClasses[columnIndex] == 'order_status'"
                class="column_text general-contrast-color"
                :class="'column_text_' + columnsClasses[columnIndex]"
              >
                {{ getStatusName(row[column]) }}
              </h1>
              <h1
                v-else-if="columnsClasses[columnIndex] == 'customer_name'"
                class="column_text general-contrast-color cursor_pointer"
                @click="goToProfile(row)"
                :class="'column_text_' + columnsClasses[columnIndex]"
              >
                {{ row[column] }}
              </h1>
              <h1
                v-else
                class="column_text general-contrast-color"
                :class="'column_text_' + columnsClasses[columnIndex]"
              >
                {{ row[column] }}
              </h1>
            </td>
            <td class="sticky-button">
              <button
                class="sticky_button brand-secondary-bg"
                @click.stop="activateOptions(rowIndex, row)"
              >
                <img class="options_icon" :src="getImgUrl('MoreButton')" />
                <div
                  class="options_list general-grey-bg"
                  v-if="activeOptionsIndex == rowIndex"
                  v-click-outside="hideOptions"
                >
                  <button
                    v-for="option in options"
                    class="option_button general-white-bg"
                    @click="option.click(row)"
                  >
                    <!-- @click="openStatusesPopup(row)" -->
                    <h1 class="option_text main-black-color">
                      {{ option.text }}
                    </h1>
                  </button>
                </div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { SERVER_IP } from "@/constants/api";

export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    columnsClasses: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    statuses: {
      type: Array,
    },
  },
  data() {
    return {
      sortColumn: null,
      sortDirection: null,
      activeOptionsIndex: null,

      currentItemPhotos: [],
      currentPhotoIndex: 0,
      imageIncreased: false,

      localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },
  mounted() {
    this.addScrollEndEvent();
  },
  computed: {
    increasedPicture() {
      if (this.currentItemPhotos.length > 0) {
        return this.currentItemPhotos[this.currentPhotoIndex].link;
      }
      return null;
    },
    sortedRows() {
      let rows = this.rows.slice();
      if (this.sortColumn !== null && this.sortColumn !== "Фото") {
        rows.sort((a, b) => {
          const aVal = a[this.sortColumn];
          const bVal = b[this.sortColumn];

          const multiplier = this.sortDirection === "asc" ? 1 : -1;
          if (typeof aVal === "number" && typeof bVal === "number") {
            return (aVal - bVal) * multiplier;
          } else {
            return aVal.localeCompare(bVal) * multiplier;
          }
        });
      }
      return rows;
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/MarketImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    addScrollEndEvent() {
      var table = document.getElementsByClassName("custom-table-container")[0];
      table.addEventListener("scroll", () => {
        if (table.scrollTop + table.clientHeight === table.scrollHeight) {
          this.$emit("scrolledToBottom");
        }
      });
    },
    goToProfile(row) {
      this.$router.push("/other_profile/" + row.customer_id);
    },
    formatDate(date, addPrefix = false) {
      if (date == "Не указано") return date;

      const orderDateTime = new Date(date);
      const localDateTime = new Date(
        orderDateTime.toLocaleString("en-US", { timeZone: this.localTimezone })
      );

      const timeDiff =
        (orderDateTime.getTimezoneOffset() -
          localDateTime.getTimezoneOffset()) *
        60000; // Convert to milliseconds

      orderDateTime.setTime(orderDateTime.getTime() - timeDiff);

      const formattedDate = orderDateTime.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const formattedTime = orderDateTime.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return `${formattedDate} в ${formattedTime}`;

      // const actualTo = new Date(Date.parse(date));
      // const year = actualTo.getFullYear();
      // const month = actualTo.getMonth() + 1;
      // const day = actualTo.getDate();
      // return (addPrefix ? "до " : "") + (day < 10 ? "0" : "") + day + "." + (month < 10 ? "0" : "") + month + "." + year;
    },
    getStatusName(status) {
      let neededStatus = this.statuses.find((el) => el.id === status);
      if (neededStatus) return neededStatus.name;
      else return "Неизвестен";
    },
    sortRows(column) {
      if (column === this.sortColumn) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
    },
    activateOptions(index, row) {
      if (index == this.activeOptionsIndex) {
        this.activeOptionsIndex = null;
      } else {
        this.activeOptionsIndex = index;
        if (row["ID предложения"])
          this.$emit("activeItemIndex", row["ID предложения"]);
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
    decreasePicture() {
      if (this.imageIncreased) {
        this.imageIncreased = false;
        this.currentItemPhotos = [];
      }
    },
    hideOptions() {
      this.activeOptionsIndex = null;
    },
    getPhoto(item) {
      for (let i = 0; i < item.length; ++i) {
        if (item[i].for_showcase) {
          return this.photoAddress(item[i].link);
        }
      }
      return this.photoAddress(item[0].link);
    },
    photoAddress(photo) {
      if (photo == null) {
        let images = require.context("@/assets/", false, /\.png$/);
        return images("./Logo.png");
      } else {
        if (photo.slice(0, 7) == "http://") {
          return photo;
        }
        return SERVER_IP + photo;
      }
    },
  },
};
</script>
<style scoped>
.custom-table-container {
  /* min-height: 500px; */
  /* height: 500px !important; */
  overflow-y: auto;
}

.increased_photo_wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 100;
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
  /* position: fixed; */
  max-height: 80%;
  max-width: 70%;
  object-fit: cover;
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */
  /* z-index: 2; */
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.custom-table {
  border-collapse: collapse;
}

.custom-table table {
  border-spacing: 0px;
}

.custom-table th {
  padding: 20px 40px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid #ddd;
}

.custom-table th:hover {
  background-color: #ddd;
}

.custom-table td {
  padding: 20px 40px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.custom-table .sticky-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f7f7f7;
  border-bottom: 2px solid #ddd;
}

.custom-table .sticky-button {
  position: sticky;
  right: 0;
  border-bottom: 1px solid #ddd;
  padding: 8px;
}

.column_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.column_text_description {
  overflow: hidden;
  max-height: 100px;
  width: 200px;
}

.column_actual_to {
  min-width: 100px;
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

.sticky_button {
  border-radius: 8px;
  height: 40px;
  width: 40px;
  position: relative;
}

.options_icon {
  height: 40px;
  width: 40px;
  border-radius: 8px;
}

.options_list {
  position: absolute;
  right: 50px;
  top: -12px;
  filter: drop-shadow(0px 12px 24px rgba(138, 138, 138, 0.15));
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  gap: 1px;
  flex-direction: column;
  min-width: 300px;
}

.option_button {
  padding: 16px;
  text-align: left;
}

.option_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>
  