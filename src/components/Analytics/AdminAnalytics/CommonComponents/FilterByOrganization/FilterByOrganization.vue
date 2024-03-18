<template>
  <div class="search_by_user_department" ref="departmentSelectorWrapper">
    <div
      class="user_department_input"
      @click.stop="openOrCloseDepartmentsList"
      ref="departmentSelector"
    >
      <div>
        <span class="user_department_input_value" v-if="currentDepartment">
          {{ currentDepartment }}
        </span>
        <span v-else class="user_department_input_placeholder">
          {{ $t("employeesPage.searchByDepartment") }}
        </span>
      </div>
      <div class="input_arrow">
        <SelectArrowIcon />
      </div>
    </div>
    <Transition name="slide-fade">
      <div
        class="user_department_list_wrapper"
        v-if="listIsOpened"
        v-click-outside="openOrCloseDepartmentsList"
      >
        <div class="user_department_list">
          <DepartmentList
            v-for="item in departmentsList"
            :itemData="item"
            :index="item.id"
            :checkedItems="departmentsData"
            @checkedItm="departmentChecked"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import DepartmentList from "@/components/Analytics/AdminAnalytics/CommonComponents/FilterByOrganization/DepartmentsList.vue";
import SelectArrowIcon from "@/components/Icons/select_arrow.vue";

export default {
  name: "FilterByOrganization",
  components: {
    DepartmentList,
    SelectArrowIcon,
  },
  props: {
    width: {
      default: null,
    },
  },
  data() {
    return {
      listIsOpened: false,
      currentDepartment: null,
      departmentsList: [],
      departmentsData: [],
    };
  },
  methods: {
    departmentChecked(itemData) {
      if (!this.departmentsData.includes(itemData.id)) {
        this.departmentsData.push(itemData.id);
        this.$emit("departmentChecked", this.departmentsData);
      } else if (this.departmentsData.includes(itemData.id)) {
        let indexOfItem = this.departmentsData.indexOf(itemData.id);
        this.departmentsData.splice(indexOfItem, 1);
        this.$emit("departmentChecked", this.departmentsData);
      }
    },
    checkChildren(data) {
      for (let i = 0; i < data.length; i++) {
        if (!this.departmentsData.includes(data[i].id)) {
          this.departmentsData.push(data[i].id);
          this.$emit("departmentChecked", this.departmentsData);
        }
      }
    },
    openOrCloseDepartmentsList() {
      setTimeout(() => {
        this.listIsOpened ^= true;
      }, 30);
    },
    setWidth() {
      if (this.width) {
        this.$refs.departmentSelectorWrapper.style.width = this.width;
      }
    },
    async getDepartments() {
      try {
        let response = await axios.get(API_URIS.departmentsTree);
        this.departmentsList = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    this.getDepartments();
    this.setWidth();
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.search_by_user_department {
  width: 500px;
  position: relative;
}
.user_department_input {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 17px 8px 12px;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  cursor: pointer;
  box-sizing: border-box;
}
.user_department_input_value {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--generalContrast);
  margin: 0 0 0 12px;
}
.user_department_input_placeholder {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: var(--generalColorSecondary);
  margin: 0 0 0 4px;
}
.input_arrow {
  margin: 0 18px 0 0;
  width: 13px;
}
.user_department_list_wrapper {
  width: 100%;
  height: 247px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 4px 15px rgba(176, 173, 173, 0.25);
  border-radius: 16px;
  position: absolute;
  top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
}
.user_department_list {
  width: 94%;
  height: 88%;
  overflow-y: scroll;
}
.user_department_list::-webkit-scrollbar {
  height: 4px;
  width: 4px;
  background: var(--minorInfoSecondaryColor);
  border-radius: 50px;
}
.user_department_list::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: var(--generalBrand);
  width: 4px;
  cursor: pointer !important;
}
@media (max-width: 1280px) {
  .search_by_user_department {
    width: 400px;
  }
}
@media (max-width: 1080px) {
  .search_by_user_department {
    width: 360px;
  }
}
@media (max-width: 680px) {
  .search_by_user_department {
    width: 99.5%;
  }
}
</style>