<template>
  <div class="analytics_reports" :style="{ minHeight: computedWindowHeight }">
    <vue-good-table
      ref="vgt"
      mode="remote"
      @sort-change="onSortChange"
      :columns="columns"
      :rows="currentRows"
      styleClass="vgt-table"
    >
      <!---->
      <template #table-row="props">
        <div
          @click="openProfile(props.row)"
          v-if="props.column.field == 'surname'"
          class="user_ceil cursor_pointer"
        >
          <img
            v-if="props.row.user.photo"
            :src="getAvatar(props.row.user.photo)"
            alt="user_photo"
            class="user_ceil_photo"
          />
          <img
            v-else
            :src="getImgUrl('userNoPhoto')"
            alt="user_no_photo"
            class="user_ceil_photo"
          />
          <span class="user_ceil_name">
            {{
              props.row.user.name
                ? props.row.user.surname +
                  " " +
                  props.row.user.name +
                  " " +
                  props.row.user.middle_name
                : props.row.user.tg_name
                ? props.row.user.tg_name
                : props.row.user.nickname
            }}
          </span>
        </div>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { SERVER_IP } from "@/constants/api";
import { organizationSettingsStore } from "@/store/organization-settings";

export default {
  name: "ReportsByRating",
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  props: {
    rows: {
      default: [],
    },
    isAdmin: {
      default: false,
    },
    selectedFilter: {},
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      organizationSettings: organizationSettingsStore(),
      currentRows: [],
    };
  },
  watch: {
    rows() {
      this.currentRows = this.rows;
      for (let i = 0; i < this.currentRows.length; i++) {
        this.currentRows[i].id = i + 1;
      }
    },
  },
  computed: {
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form4;
    },
    computedWindowHeight() {
      return this.windowHeight - 100 + "px";
    },
    columns() {
      let columns = [
        {
          label: this.$t("analyticsPage.reports.gridByRating.place"),
          field: "id",
          width: "50px",
          sortable: true,
          sortFn: this.sortFn,
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("analyticsPage.reports.gridByRating.user"),
          field: "surname",
          width: "140px",
          sortable: true,
          sortFn: this.alpbSort,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("analyticsPage.reports.gridByRating.rating"),
          field: "rating",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: `${this.$t(
            "analyticsPage.reports.gridByRating.receivedThanks"
          )} ${this.valueName}`,
          field: "receivedThanks",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: `${this.$t(
            "analyticsPage.reports.gridByRating.sendedThanks"
          )} ${this.valueName}`,
          field: "sentThanks",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByRating.receivedTransactions"
          ),
          field: "receivedTransactions",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByRating.sendedTransactions"
          ),
          field: "sentTransactions",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("analyticsPage.reports.gridByRating.sentToChallenges"),
          field: "sentToChallenges",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByRating.challengesCreated"
          ),
          field: "countChallenges",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByRating.rewardsFromChallenges"
          ),
          field: "receivedFromChallenges",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByRating.challengeParticipations"
          ),
          field: "participatedInChallenges",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("analyticsPage.reports.gridByRating.surveyPassed"),
          field: "questionnairesFinished",
          width: "140px",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
      ];

      if (this.selectedFilter == "thanks") {
        columns.splice(15, 4);
        columns.splice(7, 4);
      } else if (this.selectedFilter == "challenges") {
        columns.splice(11, 4);
        columns.splice(3, 4);
      } else if (!this.isAdmin) {
        columns.splice(3, 16);
      }

      return columns;
    },
  },
  methods: {
    checkScroll(event) {
      // Check if the table has been scrolled to the bottom.
      const tableWrap = event.target;
      const tolerance = 3;
      if (
        tableWrap.scrollTop + tableWrap.clientHeight >=
        tableWrap.scrollHeight
      ) {
        this.$emit("scrolledToBottom");
        // Do something here when the table has been scrolled to the bottom...
      }
    },
    onSortChange(sortDetails) {
      this.$emit("onSortChange", sortDetails);
    },
    openProfile(row) {
      if (row?.user?.userId) {
        this.$router.push({
          path: "/other_profile/" + row.user.userId,
          query: { prev: "rating" },
        });
      }
    },
    onResize() {
      this.windowHeight = window.innerHeight;
    },
    alpbSort(x, y) {
      return x.name < y.name ? -1 : x.name > y.name ? 1 : 0;
    },
    sortFn(x, y, col, rowX, rowY) {
      return x < y ? -1 : x > y ? 1 : 0;
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    goToUserProfile(userId) {
      this.$router.push(`/other_profile/${userId}`);
    },
  },
  mounted() {
    const tableWrap = this.$refs.vgt.$el.querySelector(".vgt-responsive");
    if (tableWrap) {
      tableWrap.addEventListener("scroll", this.checkScroll);
    }
    window.addEventListener("resize", this.onResize);
    setTimeout(() => {
      this.$emit("getRating");
    }, 1000);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    const tableWrap = this.$refs.vgt.$el.querySelector(".vgt-responsive");
    if (tableWrap) {
      tableWrap.removeEventListener("scroll", this.checkScroll);
    }
  },
};
</script>

<style>
.vgt-table th.sortable button:before {
  left: 10px;
}
.vgt-table th.sortable button:after {
  left: 10px;
}
.vgt-table th.sortable span:not(.sr-only) {
  position: relative;
  left: 20px;
}

.vgt-table thead {
  z-index: 100;
}

.vgt-table thead th {
  background: var(--generalColorWhite);
  vertical-align: inherit;
  color: var(--generalContrast) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 18px !important;
}

.vgt-left-align {
  position: relative;
  color: var(--generalBrand) !important;
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
.text-center {
  text-align: center !important;
  position: relative;
  color: var(--generalBrand) !important;
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
.text-center span {
  position: relative !important;
  top: 10px !important;
}
.analytics_reports .vgt-left-align span:not(.user_ceil_name) {
  position: absolute;
  transform: translateY(10px);
}
.analytics_reports_by_detailing .vgt-right-align span:not(.user_ceil_name) {
  position: absolute;
  transform: translateY(15px);
}

.vgt-responsive {
  width: 100% !important;
  overflow-x: scroll;
  overflow-y: visible;
  /* position: absolute; */
}

.vgt-table {
  border: none !important;
}
thead {
  position: sticky !important;
  top: 0 !important;
}

.analytics_reports {
  /* min-height: 500px; */
  width: 100%;
  position: relative;
  /* overflow-y: scroll; */
}
.analytics_reports::-webkit-scrollbar {
  width: 4px;
  background: var(--minorInfoSecondaryColor);
  border-radius: 50px;
}
.analytics_reports::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: var(--minorInfo);
  width: 4px;
  cursor: pointer !important;
}
.user_ceil {
  display: flex;
  align-items: center;
  gap: 15px;
}
.user_ceil_photo {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 100%;
  object-fit: cover;
}
.user_ceil_name {
  color: var(--generalContrast);
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
.cursor_pointer {
  cursor: pointer;
}
</style>