<template>
  <div
    class="analytics_reports_by_detailing"
    :style="{ minHeight: computedWindowHeight }"
  >
    <vue-good-table
      ref="vgt"
      mode="remote"
      @sort-change="onSortChange"
      :columns="columns"
      :rows="rows"
      styleClass="vgt-table"
    >
      <template #table-row="props">
        <div v-if="props.column.field == 'sender'" class="user_ceil">
          <div class="user_ceil" v-if="props.row.sender?.challenge_name">
            <span
              v-if="props.row.transaction_class.id === 'F'"
              class="user_ceil_name"
            >
              {{
                $t(
                  "analyticsPage.reports.gridByDetailing.return_from_challenge"
                ) +
                " " +
                props.row.sender.challenge_name
              }}
            </span>
            <span
              v-else-if="props.row.transaction_class.id === 'H'"
              class="user_ceil_name"
            >
              {{
                $t(
                  "analyticsPage.reports.gridByDetailing.challenge_creation_fee"
                ) +
                " " +
                props.row.sender.challenge_name
              }}
            </span>
            <span
              v-else-if="props.row.transaction_class.id === 'W'"
              class="user_ceil_name"
            >
              {{
                $t(
                  "analyticsPage.reports.gridByDetailing.win_in_the_challenge"
                ) +
                " " +
                props.row.sender.challenge_name
              }}
            </span>
            <span v-else class="user_ceil_name">{{
              props.row.sender.challenge_name
            }}</span>
          </div>
          <div
            v-else
            @click="
              $router.push({
                path: '/other_profile/' + props.row.sender.sender_id,
                query: { prev: 'detailing' },
              })
            "
            class="user_ceil cursor_pointer"
          >
            <img
              v-if="props.row.sender?.sender_photo"
              :src="getAvatar(props.row.sender.sender_photo)"
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
              {{ props?.row?.sender?.sender_surname }}
              {{ props?.row?.sender?.sender_first_name }}
              {{ props?.row?.sender?.sender_middle_name }}
            </span>
            <span
              v-if="
                !props.row.sender?.sender_first_name &&
                !props.row.sender?.sender_surname
              "
              class="user_ceil_name"
            >
              {{ props.row.sender?.sender_tg_name }}
            </span>
          </div>
        </div>
        <div v-if="props.column.field == 'recipient'" class="user_ceil">
          <img
            @click="
              $router.push({
                path: '/other_profile/' + props.row.recipient?.recipient_id,
                query: { prev: 'detailing' },
              })
            "
            v-if="props.row.recipient?.recipient_photo"
            :src="getAvatar(props.row.recipient.recipient_photo)"
            alt="user_photo"
            class="user_ceil_photo cursor_pointer"
          />
          <img
            @click="
              $router.push({
                path: '/other_profile/' + props.row.recipient?.recipient_id,
                query: { prev: 'detailing' },
              })
            "
            v-else-if="props.row.recipient?.recipient_id > 0"
            :src="getImgUrl('userNoPhoto')"
            alt="user_no_photo"
            class="user_ceil_photo cursor_pointer"
          />
          <span
            @click="
              $router.push({
                path: '/other_profile/' + props.row.recipient?.recipient_id,
                query: { prev: 'detailing' },
              })
            "
            class="user_ceil_name cursor_pointer"
          >
            {{ props.row.recipient?.recipient_surname }}
            {{ props.row.recipient?.recipient_first_name }}
            {{ props.row.recipient?.recipient_middle_name }}
          </span>
          <span
            @click="
              $router.push({
                path: '/other_profile/' + props.row.recipient?.recipient_id,
                query: { prev: 'detailing' },
              })
            "
            v-if="
              props.row.recipient?.recipient_id > 0 &&
              !props.row.recipient?.recipient_first_name &&
              !props.row.recipient?.recipient_surname
            "
            class="user_ceil_name cursor_pointer"
          >
            {{ props.row.recipient.recipient_tg_name }}
          </span>
          <span
            v-else-if="props.row.transaction_class.id === 'P'"
            class="user_ceil_name"
          >
            {{ $t("analyticsPage.reports.gridByDetailing.benefitCafe") }}
          </span>
        </div>
        <div
          v-if="props.column.field == 'reason'"
          class="value_ceil reason_ceil"
        >
          <span class="gray_text_ceil_value reason_ceil_value">
            {{ props.row.reason }}
          </span>
        </div>
        <div v-if="props.column.field == 'tags'" class="user_tags">
          <span class="gray_text_ceil_value">
            {{ getTags(props.row.tags) }}
          </span>
        </div>
        <div
          v-if="props.column.field == 'transactions_status'"
          class="status_ceil"
        >
          <span
            class="status_value minor-success-color minor-success-secondary-bg"
            :class="{
              deactive:
                props.row.transaction_status.name === 'Отклонено' ||
                props.row.transaction_status.id === 'C' ||
                props.row.transaction_status.id === 'D',
              waiting: props.row.transaction_status.name === 'Ожидает',
            }"
          >
            {{ statusName(props.row.transaction_status) }}
          </span>
        </div>
        <div
          v-if="props.column.field == 'created_at'"
          class="column_flex_center"
        >
          <span class="gray_text_ceil_value">{{
            getDisplayDate(props.row.created_at)
          }}</span>
        </div>
        <div
          v-if="props.column.field == 'updated_at'"
          class="column_flex_center"
        >
          <span class="gray_text_ceil_value">{{
            getDisplayDate(props.row.updated_at)
          }}</span>
        </div>
        <div v-if="props.column.field == 'is_anonymous'">
          <span>{{ getResponse(props.row.is_anonymous) }}</span>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import "vue-good-table-next/dist/vue-good-table-next.css";
import { SERVER_IP } from "@/constants/api";

export default {
  name: "ReportsByDetailing",
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  props: {
    rows: {
      default: [],
    },
    isChallengesForDetailing: {
      default: false,
    },
  },
  data() {
    return {
      windowHeight: window.innerHeight,
    };
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    setTimeout(() => {
      this.$emit("getDetailing");
    }, 300);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },

  computed: {
    computedWindowHeight() {
      return this.windowHeight - 100 + "px";
    },
    columns() {
      let columns = [
        {
          label: this.isChallengesForDetailing
            ? this.$t("analyticsPage.reports.gridByDetailing.challenge")
            : this.$t("analyticsPage.reports.gridByDetailing.sender"),
          field: "sender",
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          sortable: true,
        },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.recipient"),
          field: "recipient",
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          sortable: true,
        },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.amount"),
          field: "amount",
          width: "50px",
          tdClass: "text-center",
          thClass: "vgt-left-align",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
        },
        // {
        //   label: this.$t("analyticsPage.reports.gridByDetailing.rationale"),
        //   field: "reason",
        //   sortable: true,
        //   width: "160px",
        //   tdClass: "vgt-left-align",
        //   thClass: "vgt-left-align",
        //   firstSortType: "desc",
        //   sortFn: this.sortFn,
        // },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.value"),
          field: "tags",
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          sortable: true,
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
        },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.status"),
          field: "transactions_status",
          sortable: true,
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
        },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.created"),
          field: "created_at",
          sortable: true,
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
        },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.changed"),
          field: "updated_at",
          sortable: true,
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
        },
        {
          label: this.$t("analyticsPage.reports.gridByDetailing.isAnonym"),
          field: "is_anonymous",
          sortable: true,
          width: "160px",
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          firstSortType: "desc",
          sortFn: this.sortFn,
          type: "number",
        },
      ];
      if (this.isChallengesForDetailing) {
        columns.splice(3, 3);
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
    statusName(status) {
      if (status.name === "Выполнена") {
        return this.$t("analyticsPage.reports.gridByDetailing.statusCompleted");
      } else if (status.name == "Ожидает") {
        return this.$t("analyticsPage.reports.gridByDetailing.statusWaiting");
      } else if (
        status.name == "Отклонено" ||
        status.id === "C" ||
        status.id === "D"
      ) {
        return this.$t("analyticsPage.reports.gridByDetailing.statusCanceled");
      } else {
        return "";
      }
    },
    getResponse(resp) {
      if (resp) {
        return this.$t("analyticsPage.reports.gridByDetailing.yes");
      } else {
        return this.$t("analyticsPage.reports.gridByDetailing.no");
      }
    },
    alpbSortSender(x, y) {
      return x.sender_first_name < y.sender_first_name
        ? -1
        : x.sender_first_name > y.sender_first_name
        ? 1
        : 0;
    },
    alpbSortRecipient(x, y) {
      return x.recipient_first_name < y.recipient_first_name
        ? -1
        : x.recipient_first_name > y.recipient_first_name
        ? 1
        : 0;
    },
    sortFn(x, y, col, rowX, rowY) {
      return x < y ? -1 : x > y ? 1 : 0;
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getTags(tags) {
      if (tags) {
        let currentTags = tags.map((el) => el.name);
        return currentTags.join(", ");
      } else {
        return;
      }
    },
    getDisplayDate(date) {
      if (date) {
        let formattedDate = new Date(date).toLocaleDateString("ru-RU");
        return formattedDate;
      }
      return;
    },
  },
};
</script>

<style scoped>
thead {
  position: sticky !important;
  top: 0 !important;
}
.vgt-table thead {
  z-index: 100;
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
.analytics_reports_by_detailing {
  width: 100%;
  position: relative;
}

.analytics_reports_by_detailing::-webkit-scrollbar {
  width: 4px;
  background: var(--minorInfoSecondaryColor);
  border-radius: 50px;
}
.analytics_reports_by_detailing::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: var(--minorInfo);
  width: 4px;
  cursor: pointer !important;
}
.user_ceil {
  display: flex;
  align-items: center;
  gap: 15px;
  height: 52px !important;
}
.cursor_pointer {
  cursor: pointer;
}
.user_ceil_photo {
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 100%;
  object-fit: cover;
}
.user_ceil_name {
  color: var(--generalContrast);
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
  overflow: hidden;
  word-break: break-word;
  height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.user_tags {
  text-overflow: ellipsis !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
.gray_text_ceil_value {
  position: relative !important;
  color: var(--generalColorSecondary);
  font-family: "Golos" !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.value_ceil {
  overflow: hidden;
  height: 50px;
  width: 160px;
}
.value_ceil_text {
  text-overflow: ellipsis !important;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}
.column_flex_center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.reason_ceil {
  /* height: 80px !important; */
  width: 200px;
  overflow-y: scroll;
}
.reason_ceil::-webkit-scrollbar {
  width: 4px;
  /* background: var(--minorInfoSecondaryColor); */
  border-radius: 50px;
}
.reason_ceil::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: var(--minorInfo);
  width: 4px;
  cursor: pointer !important;
}
.reason_ceil_value {
  word-wrap: break-word !important;
  color: var(--generalContrast);
}
.status_value {
  font-family: "Golos" !important;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  border-radius: 4px;
  padding: 3px 6px;
  text-transform: uppercase;
  margin: 0;
  text-align: center;
}
.status_value.deactive {
  color: #b9b0a6;
  background-color: #f3f0ed;
}
.status_value.waiting {
  color: var(--minorInfo);
  background-color: var(--minorInfoSecondaryColor);
}
</style>
