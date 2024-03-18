<template>
  <div class="settings_period_managment_wrapper">
    <DeletePeriod
      v-if="deletePeriodEnabled"
      :selectedRow="selectedRow"
      @disablePeriodDeletion="disableDeletePeriod"
    />
    <EditPeriod
      v-if="editPeriodEnabled"
      :selectedRow="selectedRow"
      @disablePeriodEdition="disableEditPeriod"
    />
    <button 
      @click="openCreatePeriodPopup" 
      class="add_period_button tooltip_container"
      :data-tooltip="$t('organization.create_period')"
    >
      <PlusIcon />
    </button>
    <div class="period_table_wrapper">
      <vue-good-table :columns="columns" :rows="rows" styleClass="vgt-table">
        <template #table-row="props">
          <div v-if="props.column.field == 'state'" class="state_ceil">
            <span
              v-if="props.row.state == periodStatus.notActive"
              class="state_not_active"
            >
              {{ getPeriodStatus(props.row.state) }}
            </span>
            <span
              v-if="props.row.state == periodStatus.active"
              class="state_active"
            >
              {{ getPeriodStatus(props.row.state) }}
            </span>
            <span
              v-if="props.row.state == periodStatus.ended"
              class="state_ended"
            >
              {{ getPeriodStatus(props.row.state) }}
            </span>
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
                @click="enableEditPeriod(props.row)"
              >
                {{ $t("market.edit_offer") }}
              </button>
              <button
                class="option_button general-white-bg"
                @click="enableDeletePeriod(props.row)"
              >
                {{ $t("market.delete_offer") }}
              </button>
            </div>
          </div>
        </template>
      </vue-good-table>
    </div>
    <BasePopup ref="createPeriodPopup">
      <CreatePeriodForm @startPeriod="startPeriod" />
    </BasePopup>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { PERIOD_STATUS } from "@/infrastructure/constants/period-status";
import { PERIOD_STATUSES } from "@/infrastructure/data-sources/period-statuses";
import { organizationSettingsStore } from "@/store/organization-settings";

import PlusIcon from "@/components/Icons/plus.vue";
import OfferOptionsIcon from "@/components/Icons/MarketIcons/OfferOptionsIcon.vue";
import BasePopup from "@/components/app/Popup.vue";
import CreatePeriodForm from "@/components/OrganizationAdministrationElements/SettingsComponents/create-period-form.vue";
import DeletePeriod from "@/components/OrganizationAdministrationElements/SettingsComponents/PeriodManagementComponents/DeletePeriod.vue";
import EditPeriod from "@/components/OrganizationAdministrationElements/SettingsComponents/PeriodManagementComponents/EditPeriod.vue";

import "vue-good-table-next/dist/vue-good-table-next.css";

export default {
  name: "OrganizationSettingsPeriodManagment",
  components: {
    PlusIcon,
    OfferOptionsIcon,
    BasePopup,
    CreatePeriodForm,
    DeletePeriod,
    EditPeriod,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      deletePeriodEnabled: false,
      editPeriodEnabled: false,
      selectedRow: null,
      windowHeight: window.innerHeight,
      rows: [],
    };
  },
  mounted() {
    this.checkIfOpenPopup();
    this.getPeriods();
  },
  watch: {
    "$route.query.openPeriodCreation": {
      handler() {
        this.checkIfOpenPopup();
      },
      immediate: true,
    },
  },
  computed: {
    periodStatus() {
      return PERIOD_STATUS;
    },
    periodStatuses() {
      return PERIOD_STATUSES(this);
    },
    columns() {
      let columns = [
        {
          label: this.$t("organization.settings.createPeriod.table.startDate"),
          field: "start_date",
          width: "140px",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("organization.settings.createPeriod.table.endDate"),
          field: "end_date",
          width: "140px",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t("organization.settings.createPeriod.table.status"),
          field: "state",
          width: "140px",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
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
    checkIfOpenPopup() {
      if (
        this.$route.query.openPeriodCreation &&
        this.$refs.createPeriodPopup
      ) {
        this.openCreatePeriodPopup();
      }
      this.$router.replace({ query: null });
    },
    enableDeletePeriod(row) {
      this.deletePeriodEnabled = true;
      this.selectedRow = row;
    },
    enableEditPeriod(row) {
      this.editPeriodEnabled = true;
      this.selectedRow = row;
    },
    disableDeletePeriod(update = false) {
      this.deletePeriodEnabled = false;
      if (update) {
        this.getPeriods();
      }
    },
    disableEditPeriod(update = false) {
      this.editPeriodEnabled = false;
      if (update) {
        this.getPeriods();
      }
    },
    alpbSort(x, y) {
      return x.name < y.name ? -1 : x.name > y.name ? 1 : 0;
    },
    sortFn(x, y, col, rowX, rowY) {
      return x < y ? -1 : x > y ? 1 : 0;
    },
    openCreatePeriodPopup() {
      this.$refs.createPeriodPopup.open();
    },
    closeCreatePeriodPopup() {
      this.$refs.createPeriodPopup.close();
    },
    getPeriodStatus(status) {
      for (let i = 0; i < this.periodStatuses.length; i++) {
        if (status == this.periodStatuses[i].status) {
          return this.periodStatuses[i].title;
        }
      }
    },
    closeOptions(row) {
      return function (event, el) {
        if (row.optionsEnabled) {
          row.optionsEnabled = false;
        }
      };
    },
    toggleOptions(row) {
      this.$emit("changeActiveItemIndex", row.id);
      row.optionsEnabled ^= true;
    },
    async getPeriods() {
      try {
        let response = await axios.get(API_URIS.getPeriodsURL, {
          params: {
            all: 1,
          },
        });
        this.rows = response.data;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Ignore time, only compare dates

        let currentInterval = this.rows.find((item) => {
          let startDate = new Date(item.start_date);
          let endDate = new Date(item.end_date);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          // If current date is between start and end date
          return startDate <= currentDate && currentDate <= endDate;
        });

        if (currentInterval) {
          this.organizationSettings.setIsActivePeriod(true);
        }
      } catch (error) {
        throw error;
      }
    },
    async startPeriod(dateValues) {
      try {
        const startDate = dateValues.startDate;
        const startDateString = `${startDate.getFullYear()}-${String(
          startDate.getMonth() + 1
        ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
        const endDate = dateValues.endDate;
        const endDateString = `${endDate.getFullYear()}-${String(
          endDate.getMonth() + 1
        ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

        let response = await axios.post(API_URIS.communityPeriod, {
          start_date: startDateString,
          end_date: endDateString,
        });
        this.$moshaToast(
          {
            title: this.$t("onboarding.communities.periodCreated"),
          },
          {
            position: "bottom-right",
            timeout: 3000,
            transition: "slide",
            type: "success",
          }
        );
        this.getPeriods();
        this.closeCreatePeriodPopup();
        window.location.reload();
      } catch (error) {
        this.$moshaToast(
          {
            title: this.$t("onboarding.communities.creationError"),
          },
          {
            position: "bottom-right",
            timeout: 3000,
            transition: "slide",
            type: "danger",
          }
        );
        this.closeCreatePeriodPopup();
        throw error;
      }
    },
  },
};
</script>

<style scoped>
::v-deep(.vgt-table thead) {
  z-index: 99;
  font-weight: 700 !important;
}

.settings_period_managment_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.add_period_button {
  position: relative;
  width: 146px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--secondaryColorBrand);
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
}
.plus_icon {
  width: 24px;
  height: 24px;
}
.period_table_wrapper {
  width: 70%;
  height: 500px;
  margin: 24px 0 0 0;
}
.state_not_active {
  color: var(--minorInfo) !important;
}
.state_active {
  color: var(--minorSuccess) !important;
}
.state_ended {
  color: var(--minorError) !important;
}
.sticky_button_wrapper {
  z-index: 999;
  position: absolute !important;
  transform: translateY(-5px);
  right: 25px;
}
::v-deep(.vgt-responsive) {
  position: static;
}
::v-deep(.sticky_button) {
  position: static;
}

::v-deep(.vgt-left-align span) {
  font-family: "Golos";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: var(--generalBrand);
}
::v-deep(.vgt-inner-wrap) {
  box-shadow: none !important;
}
::v-deep(table.vgt-table) {
  border: none !important;
}
::v-deep(.vgt-table thead th) {
  background: var(--generalColorWhite);
  vertical-align: inherit;

  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 18px !important;
}
::v-deep(.vgt-table thead th span) {
  color: var(--generalContrast) !important;
}
::v-deep(thead .vgt-left-align) {
  position: relative;
}
.enable_options_button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 30px;
  height: 30px;
}
.offer_options_icon {
  height: 20px;
  width: 20px;
}
.offer_options_icon > ::v-deep(svg) {
  height: 20px;
  width: 20px;
}
.option_buttons {
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 1px;
  transform: translate(50px, -30px);
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.option_button {
  position: relative;
  z-index: 999;
  padding: 16px;
}
</style>
