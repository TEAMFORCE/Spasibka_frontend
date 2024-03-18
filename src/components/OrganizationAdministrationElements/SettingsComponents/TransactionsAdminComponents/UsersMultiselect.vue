<template>
  <div class="dropdown">
    <div class="checkbox_wrapper general-contrast-color">
      <input class="checkbox" type="checkbox" v-model="selectAll" />
      {{ $t("organization.select_all") }}
    </div>
    <div class="dropdown_menu_wrapper" v-click-outside="closeDropdown">
      <input
        type="text"
        v-model="search"
        placeholder="Search..."
        @focus="isDropdownVisible = true"
      />
      <div v-show="isDropdownVisible" class="dropdown-menu general-white-bg">
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
              (item.first_name ? item.first_name : "") || item.nickname
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";

export default {
  name: "UsersMultiselect",
  props: {
    createTransactions: {
      required: true,
    },
  },
  data() {
    return {
      search: "",
      selectAll: false,
      isDropdownVisible: false,
      usersList: [],
      selectedIDs: new Map(),
      searchUserTimeout: null,
    };
  },
  mounted() {
    this.getUsersList();
  },
  watch: {
    createTransactions: {
      handler() {
        this.$emit("emitSelectedUsers", this.selectedIDs);
      },
    },
    selectAll: {
      handler(newVal) {
        if (newVal) {
          for (let i = 0; i < this.usersList.length; ++i) {
            this.usersList[i].selected = true;
          }
          this.selectedIDs.forEach((value, key) => {
            this.selectedIDs.set(key, true);
          });
        } else {
          for (let i = 0; i < this.usersList.length; ++i) {
            this.usersList[i].selected = false;
          }
          this.selectedIDs.forEach((value, key) => {
            this.selectedIDs.set(key, false);
          });
        }
        this.isDropdownVisible = true;
      },
    },
    search: {
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
  },
  methods: {
    changeState(item) {
      if (item.selected) {
        item.selected = false;
        this.selectedIDs.set(item.id, false);
      } else {
        item.selected = true;
        this.selectedIDs.set(item.id, true);
      }
    },
    closeDropdown() {
      this.isDropdownVisible = false;
    },
    async getUsersList(search) {
      try {
        let params = {
          offset: 1,
          limit: 9999,
        };
        if (search) {
          params.name = search;
        }
        const response = await axios.get(API_URIS.employees, {
          params,
        });
        this.usersList = response.data;
        for (let i = 0; i < this.usersList.length; ++i) {
          if (this.selectedIDs.get(this.usersList[i].id)) {
            this.usersList[i].selected = true;
          } else {
            this.selectedIDs.set(this.usersList[i].id, false);
          }
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
  position: relative;
  width: 100%; /* Ensures the dropdown does
   not overflow */
}

.checkbox_wrapper {
  display: flex;
  align-items: center;
  /* gap: 8px; */
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  text-align: left;
}

.dropdown_menu_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}
.dropdown-menu {
  top: 37px;
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  border: 1px solid var(--generalColorSecondary);
  max-height: 200px;
  overflow-y: auto;
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
  z-index: 1000;
  box-sizing: border-box; /* Ensures padding and border are included in the width */
}

.dropdown-item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 7px 7px;
  cursor: pointer;
  list-style-type: none; /* Removes the dots */
}

.dropdown-item:hover {
  background-color: #f2f2f2;
}

.item-label {
  display: flex;
  align-items: center;
}

input[type="text"] {
  padding: 10px;
  width: 100%;
  box-sizing: border-box; /* Ensures padding does not add to the width */
  border: 1px solid #ccc; /* Style the input border */
}

input[type="checkbox"] {
  margin-right: 10px;
}
</style>
