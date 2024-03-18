<template>
  <div class="survey_filters_wrapper transparent-bg">
    <div class="survey_filters general-white-bg">
      <CloseFiltersIcon
        @click="$emit('closeFilters')"
        class="close_filters_icon"
      />
      <h1
        class="filters_header general-contrast-color"
      >
        {{ $t("surveys.filter") }}
      </h1>
      <!-- <div class="filter_type">
        <h1 class="filter_type_header general-contrast-color">
          {{ $t("surveys.type") }}
        </h1>
        <div class="options_list">
          <div class="option_wrapper general-contrast-color">
            <input v-model="isSurvey" type="checkbox" class="checkbox"/>
            {{ $t("surveys.survey") }}
          </div>
          <div class="option_wrapper general-contrast-color">
            <input v-model="isTest" type="checkbox" class="checkbox"/>
            {{ $t("surveys.test") }}
          </div>
          <div class="option_wrapper general-contrast-color">
            <input v-model="isVoting" type="checkbox" class="checkbox"/>
            {{ $t("surveys.voting") }}
          </div>
        </div>
      </div> -->
      <div class="filter_type">
        <h1 class="filter_type_header general-contrast-color">
          {{ $t("surveys.status") }}
        </h1>
        <div class="options_list">
          <div class="option_wrapper general-contrast-color">
            <input @input="toggleStatus('active')" v-model="isActive" type="checkbox" class="checkbox"/>
            {{ $t("surveys.active_singular") }}
          </div>
          <div class="option_wrapper general-contrast-color">
            <input @input="toggleStatus('closed')" v-model="isEnded" type="checkbox" class="checkbox"/>
            {{ $t("surveys.ended_singular") }}
          </div>
          <div class="option_wrapper general-contrast-color">
            <input @input="toggleStatus('planned')" v-model="isPlanned" type="checkbox" class="checkbox"/>
            {{ $t("surveys.planned") }}
          </div>
          <div class="option_wrapper general-contrast-color">
            <input @input="toggleStatus('sample')" v-model="isDraft" type="checkbox" class="checkbox"/>
            {{ $t("surveys.draft") }}
          </div>
        </div>
      </div>
      <div class="filter_type">
        <h1 class="filter_type_header general-contrast-color">
          {{ $t("surveys.participants_count") }}
        </h1>
        <div class="horizontal_input_fields">
          <div class="input_field_wrapper">
            <input 
              :placeholder="$t('general.from_capital')"
              v-model="participantsMin" 
              class="input_field general-contrast-color"
            />
            <div class="input_field_icons">
              <ClearInputIcon 
                v-if="participantsMin"
                @click="clearParticipantsMinInput" 
                class="clear_input_icon"
              />
            </div>
          </div>
          <div class="input_field_wrapper">
            <input 
              :placeholder="$t('general.to_capital')"
              v-model="participantsMax" 
              class="input_field general-contrast-color"
            />
            <div class="input_field_icons">
              <ClearInputIcon 
                v-if="participantsMax"
                @click="clearParticipantsMaxInput" 
                class="clear_input_icon"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="filter_type">
        <h1 class="filter_type_header general-contrast-color">
          {{ $t("surveys.creator") }}
        </h1>
        <div class="input_field_wrapper">
          <input  
            v-model="searchString"
            class="input_field general-contrast-color"
            :placeholder="$t('surveys.search')"
          />
          <div class="input_field_icons">
            <ClearInputIcon 
              v-if="searchString"
              @click="clearUserSearchInput" 
              class="clear_input_icon"
            />
            <div class="search_icon_wrapper">
              <SearchIcon class="search_icon"/>
            </div>
          </div>
        </div>
        <div class="dropdown-menu general-white-bg">
          <button
            v-for="item in usersList"
            class="dropdown-item transparent-bg"
            @click="changeState(item)"
          >
            <input
              @click.stop
              @input="changeState(item)"
              class="checkbox"
              type="checkbox"
              v-model="item.selected"
            />
            {{
              (item.surname ? item.surname + " " : "") +
                (item.first_name ? item.first_name.charAt(0) + "." : "") || item.nickname
            }}
          </button>
        </div>
        <button 
          v-if="limit === 4 && usersList?.length === 4"
          @click="showAllUsers" class="show_all transparent-bg general-contrast-color"
        >
          {{ $t("surveys.show_all") }}
        </button>
      </div>
      <div class="filter_type">
        <h1 class="filter_type_header general-contrast-color">
          {{ $t("surveys.date") }}
        </h1>
        <div class="horizontal_input_fields">
          <div class="datepicker_wrapper" ref="startPicker">
            <Datepicker
              @update:model-value="updateStartDate"
              v-model="dateRangeStart"
              text-input
              auto-apply
              format="dd.MM.yyyy"
              :clearable="true"
              :placeholder="$t('general.date_from_capital')"
              :enable-time-picker="false"
            />
            <CalendarIcon class="calendar_icon" @click="triggerStartPicker"/>
          </div>
          <div class="datepicker_wrapper" ref="endPicker">
            <Datepicker
              @update:model-value="updateEndDate"
              v-model="dateRangeEnd"
              text-input
              auto-apply
              format="dd.MM.yyyy"
              :clearable="true"
              :placeholder="$t('general.to_capital')"
              :enable-time-picker="false"
            />
            <CalendarIcon class="calendar_icon" @click="triggerEndPicker"/>
          </div>
        </div>
      </div>
    </div>
    <div class="action_buttons general-white-bg">
      <button
        class="apply_button general-brand-bg general-white-color"
        @click="$emit('applyFilters')"
      >
        {{ $t("surveys.apply") }}
      </button>
      <button
        class="reset_button transparent-bg general-contrast-color"
        @click="resetFilters"
      >
        {{ $t("surveys.reset") }}
      </button>
    </div>
  </div>
</template>

<script>
import { API_URIS } from '@/constants/api';
import CloseFiltersIcon from '../Icons/FeedIcons/CloseFiltersIcon.vue';
import CalendarIcon from '../Icons/SurveyIcons/CalendarIcon.vue';
import SearchIcon from '../Icons/SurveyIcons/SearchIcon.vue';
import Datepicker from "@vuepic/vue-datepicker";
import axios from 'axios';
import ClearInputIcon from '../Icons/SurveyIcons/ClearInputIcon.vue';

export default {
  name: "SurveyFilters",
  components: { CloseFiltersIcon, SearchIcon, Datepicker, CalendarIcon, ClearInputIcon },
  data() {
    return {
      searchString: "",
      limit: 4,
      usersList: [],
      selectedIDs: new Map(),
      searchUserTimeout: null,

      isSurvey: false,
      isTest: false,
      isVoting: false,
      
      isActive: false,
      isEnded: false,
      isPlanned: false,
      isDraft: false,

      participantsMin: null,
      participantsMax: null,

      dateRangeStart: null,
      dateRangeEnd: null,

      statuses: [],
    };
  },
  mounted() {
    this.getUsersList();
  },  
  watch: {
    searchString: {
      handler(newVal) {
        if (this.searchUserTimeout) {
          clearTimeout(this.searchUserTimeout);
        }
        this.searchUserTimeout = setTimeout(
          () => this.getUsersList(newVal),
          500
        );
      },
    },
    participantsMax: {
      handler(newVal) {
        this.$emit('filterByMaxParticipants', newVal);
      }
    },
    participantsMin: {
      handler(newVal) {
        this.$emit('filterByMinParticipants', newVal);
      }
    },
  },
  methods: {
    clearParticipantsMaxInput() {
      this.participantsMax = null;
    }, 
    clearParticipantsMinInput() {
      this.participantsMin = null;
    },
    clearUserSearchInput() {
      this.searchString = "";
    },
    showAllUsers() {
      this.limit = 9999;
      this.getUsersList();
    },
    changeState(item) {
      if (item.selected) {
        item.selected = false;
        this.selectedIDs.set(item.profile_id, false);
      } else {
        item.selected = true;
        this.selectedIDs.set(item.profile_id, true);
      }
      this.$emit("filterByAuthor", this.selectedIDs);
    },
    async getUsersList(search) {
      try {
        let params = {
          offset: 1,
          limit: this.limit,
        };
        if (search) {
          params.name = search;
        }
        const response = await axios.get(API_URIS.employees, {
          params,
        });
        this.usersList = response.data;
        for (let i = 0; i < this.usersList.length; ++i) {
          if (this.selectedIDs.get(this.usersList[i].profile_id)) {
            this.usersList[i].selected = true;
          } else {
            this.selectedIDs.set(this.usersList[i].profile_id, false);
          }
        }
      } catch (err) {
        throw err;
      }
    },
    updateStartDate(date) {
      if (!date) this.$emit("filterByStartDate", null);
      else this.$emit("filterByStartDate", date.toISOString());
    },
    updateEndDate(date) {
      if (!date) this.$emit("filterByEndDate", null);
      else this.$emit("filterByEndDate", date.toISOString());
    },
    toggleStatus(status) {
      if (this.statuses.includes(status)) {
        let index = this.statuses.indexOf(status);
        this.statuses.splice(index, 1);
      } else {
        this.statuses.push(status);
      }
      this.$emit("filterByStatus", this.statuses);
    },
    triggerStartPicker() {
      const datePickerInput = this.$refs.startPicker.querySelector(".dp__input");
      datePickerInput.click();
    },
    triggerEndPicker() {
      const datePickerInput = this.$refs.endPicker.querySelector(".dp__input");
      datePickerInput.click();
    },
    resetFilters() {
      this.isSurvey = false;
      this.isTest = false;
      this.isVoting = false;

      this.isActive = false;
      this.isEnded = false;
      this.isPlanned = false;
      this.isDraft = false;

      this.participantsMin = null;
      this.participantsMax = null;

      this.searchString = "";
      
      this.dateRangeStart = null;
      this.dateRangeEnd = null;

      this.selectedIDs = new Map();
      this.limit = 4;
      this.getUsersList();
      this.$emit("resetFilters");
    }
  }
}
</script>

<style scoped>
.survey_filters_wrapper {
  position: fixed;
  max-width: 403px;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  z-index: 1001;  
}
.survey_filters {
  position: absolute;
  z-index: 1001;
  top: 0;
  right: 0;
  max-width: 403px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 32px 32px 164px 32px;
  border-top-left-radius: 24px;
  box-shadow: 0px 4px 70px 0px rgba(119, 119, 119, 0.15);
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}
.survey_filters::-webkit-scrollbar {
  width: 8px;
}
.survey_filters::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.close_filters_icon {
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  height: 32px;
  width: 32px;
}
.filters_header {
  font-family: "Golos";
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
  margin-bottom: -7px;
}
.dropdown_menu_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}
.dropdown-menu {
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
  z-index: 1000;
  box-sizing: border-box; /* Ensures padding and border are included in the width */
}
.dropdown-menu::-webkit-scrollbar {
  width: 8px;
}
.dropdown-menu::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}

.dropdown-item {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  list-style-type: none; /* Removes the dots */
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.show_all {
  text-decoration: underline;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.filter_type {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter_type_header {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
}
.options_list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.option_wrapper {
  display: flex;
  gap: 8px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  align-items: center;
}
.horizontal_input_fields {
  display: flex;
  gap: 12px;
}
.input_field_wrapper {
  width: 100%;
  max-width: 713px;
  position: relative;
}
.input_field {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
}
.input_field::placeholder {
  color: var(--generalColorSecondary)
}
.input_field_icons {
  position: absolute;
  top: 17px;
  right: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.clear_input_icon {
  cursor: pointer;
  height: 18px;
  width: 18px;
}
.search_icon_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 15px;
  padding-bottom: 1px;
}
.search_icon {
  height: 14px;
  width: 14px;
}
.datepicker_wrapper {
  position: relative;
}

::v-deep(.dp__input) {
  z-index: 12;
  padding: 14px 16px !important;
  border-radius: 12px !important;
}
.calendar_icon {
  z-index: 1;
  height: 24px;
  width: 24px;
  position: absolute;
  right: 15px;
  top: 12px;
}
.action_buttons {
  border-radius: 20px 20px 0 0;
  padding: 24px 12px 14px 14px;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
  z-index: 1002;
  position: absolute;
  right: 18px;
  bottom: 0;
  width: calc(100% - 18px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.apply_button {
  border-radius: 12px;
  padding: 17px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  box-shadow: 0px 10px 20px 0px rgba(var(--generalBrandRGB), 0.3);
}
.reset_button {
  padding: 17px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}
</style>