<template>
  <div class="participants_tab">
    <vue-good-table
      ref="vgt"
      mode="remote"
      styleClass="vgt-table"
      :columns="columns"
      :rows="rows"
      :row-style-class="rowStyleClassFn"
      @sort-change="onSortChange"
    >
      <template #table-row="props">
        <div class="order_ceil" v-if="props.column.field == 'id'">
          <component
            :is="getComponent(props.row.session)"
            class="status_icon"
          ></component>
          <div class="_tooltip">
            <div class="_tooltip_arrow"></div>
            <span class="_tooltip_text">
              {{ getTooltipText(props.row.session) }}
            </span>
          </div>
          <span class="order_value">
            {{ props.row.id }}
          </span>
        </div>
        <div
          class="user_ceil"
          :class="{ _pointer: isCompleteSurvey(props.row.session) }"
          v-if="props.column.field == 'user.profile.get_full_name_or_nickname'"
          @click="goToUserResult(props.row)"
        >
          <img
            v-if="props.row.user.profile?.photo"
            :src="getAvatar(props.row.user.profile.photo)"
            alt="user_photo"
            class="user_ceil_photo"
          />
          <NoAvatarRoundIcon v-else />
          <span class="user_ceil_name">
            {{ props.row?.user?.profile?.get_full_name_or_nickname }}
          </span>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";
import "vue-good-table-next/dist/vue-good-table-next.css";

import NoAvatarRoundIcon from "@/components/Icons/noAvatarRoun.vue";
import CompletedIcon from "@/components/Icons/completed.vue";
import TakingIcon from "@/components/Icons/taking.vue";
import NotCompletedIcon from "@/components/Icons/notCompleted.vue";

export default {
  name: "ParticipantsTab",
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
    NoAvatarRoundIcon,
    CompletedIcon,
    TakingIcon,
    NotCompletedIcon,
  },
  props: {
    userList: {
      required: true,
      default: [],
    },
    departmentsList: {
      required: true,
      default: [],
    },
  },
  data() {
    return {
      rows: [],
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          label: "#",
          field: "id",
          width: "50px",
          sortable: true,
          sortFn: this.sortFn,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("surveys.management_participants.survey_tab.user"),
          field: "user.profile.get_full_name_or_nickname",
          width: "140px",
          sortable: true,
          sortFn: this.alpbSort,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("surveys.management_participants.survey_tab.division"),
          field: "user.profile.department.name",
          width: "140px",
          sortable: true,
          sortFn: this.alpbSort,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("surveys.management_participants.survey_tab.jobTitle"),
          field: "user.profile.job_title",
          width: "140px",
          sortable: true,
          sortFn: this.alpbSort,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
      ];
      return columns;
    },
  },
  watch: {
    userList() {
      this.rows = this.userList;
    },
  },
  methods: {
    rowStyleClassFn(row) {
      if (!row.session) {
        return "_notCompleted";
      }
    },
    alpbSort(x, y) {
      return x.name < y.name ? -1 : x.name > y.name ? 1 : 0;
    },
    sortFn(x, y, col, rowX, rowY) {
      return x < y ? -1 : x > y ? 1 : 0;
    },
    getComponent(value) {
      if (value) {
        if (value.finished_at) {
          return CompletedIcon;
        } else {
          return TakingIcon;
        }
      } else {
        return NotCompletedIcon;
      }
    },
    getTooltipText(value) {
      if (value) {
        if (value.finished_at) {
          return this.$t("surveys.management_participants.tooltips.completed");
        } else {
          return this.$t("surveys.management_participants.tooltips.taking");
        }
      } else {
        return this.$t("surveys.management_participants.tooltips.notComplete");
      }
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    onSortChange(sortDetails) {
      let params = {
        desc: sortDetails[0].type == "desc" ? 1 : 0,
        order_by: "",
      };
      if (sortDetails[0].field === "user.profile.get_full_name_or_nickname") {
        params.order_by = "surname";
      } else if (sortDetails[0].field === "user.profile.department.name") {
        params.order_by = "department";
      } else if (sortDetails[0].field === "user.profile.job_title") {
        params.order_by = "job_title";
      } else if (sortDetails[0].field === "id") {
        params.order_by = "passing";
      }
      this.$emit("sortChanged", params);
    },
    isCompleteSurvey(session) {
      if (session?.finished_at) {
        return true;
      }
    },
    async goToUserResult(row) {
      if (this.$route.name == "TestManagement" && row.session) {
        this.$router.push({
          path: `/test_management/${row.questionnaire}/user_result/`,
          query: { session_id: row.session.id },
        });
      } else if (this.$route.name == "SurveyManagement" && row.session) {
        this.$router.push({
          path: `/survey_management/${row.questionnaire}/user_result/`,
          query: { session_id: row.session.id },
        });
      }
    },
  },
};
</script>

<style >
/* TABLE STYLES */
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
  position: relative !important;
}
.vgt-table thead th {
  background: var(--generalColorWhite);
  vertical-align: inherit;
  color: var(--generalContrast) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 18px !important;
}
.participants_tab .vgt-left-align span:not(.user_ceil_name) {
  color: var(--generalContrast);
  font-family: "Golos" !important;
  font-size: 14px !important;
  margin: 0 0 0 6px;
}

.vgt-responsive {
  width: 100% !important;
  overflow-x: visible;
  overflow-y: visible;
}
.vgt-table {
  border: none !important;
}
thead {
  position: sticky !important;
  top: 0 !important;
}
._notCompleted {
  background-color: #feefef;
}
/* TABLE STYLES */

.participants_tab {
  width: 100%;
  height: 500px;
  position: relative;
}
.order_ceil {
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 8px;
  position: relative;
}
.order_value {
  position: relative !important;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  color: var(--generalContrast);
}

._tooltip {
  width: 140px;
  height: 32px;
  border-radius: 4px;
  background-color: var(--generalColorSecondary);
  opacity: 0;
  transition: 0.3s !important;
  position: absolute;
  top: 40px;
  left: -16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
._tooltip_arrow {
  position: absolute;
  top: -10px;
  left: 31%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: var(--generalColorSecondary);
}
._tooltip_text {
  font-family: "Golos";
  font-size: 12px !important;
  font-weight: 400;
  line-height: 18px !important;
  text-align: center !important;
  color: var(--generalColorWhite) !important;
}

.order_ceil:hover ._tooltip {
  opacity: 1 !important;
  z-index: 1012312312313200 !important;
}

.user_ceil {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: default;
}
._pointer {
  cursor: pointer;
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

.status_icon {
  width: 20px;
  height: 20px;
}
.completed_icon {
  margin: 10px 0 0 0;
}
.taking_icon {
  margin: 10px 0 0 0;
}
.not_completed_icon {
  margin: 13px 0 0 0;
}
</style>