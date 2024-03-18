<template>
  <div class="new_transfer_recipient general-white-bg">
    <h1 class="recipient_header general-contrast-color">
      {{ $t("new_transfer.recipient") }}
    </h1>
    <h1 class="input_field_description general-secondary-color">
      {{ $t("new_transfer.username_email_or_tg_tg_id") }}
    </h1>
    <vSelect
      class="employees"
      v-model="selectedEmployee"
      label="displayName"
      :options="correctEmployeesList"
      :placeholder="$t('new_transfer.select_recipient')"
      :filterable="false"
      @open="onOpen"
      @close="onClose"
      v-debounce:300="searchUsers"
    >
      <template #no-options="{ search, searching, loading }">
        {{ $t("v_select.no_matching_user") }}
      </template>
      <template #list-footer>
        <li v-show="hasNewData" ref="load">
          <div class="content_loading">
            <span class="loader"></span>
          </div>
        </li>
      </template>
    </vSelect>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";

import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";
import { vue3Debounce } from "vue-debounce";

import vSelect from "vue-select";

export default {
  name: "NewTransferRecipient",
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    vSelect,
  },
  data() {
    return {
      observer: null,
      hasNewData: true,
      paginationPage: 1,
      employees: [],
      selectedEmployee: null,
      initialEmployeesList: [],
    };
  },

  computed: {
    ...mapStores(useNewTransferStore),
    correctEmployeesList() {
      this.employees.map((employee) => {
        this.getDisplayName(employee);
      });
      return this.employees;
    },
  },
  watch: {
    selectedEmployee: {
      handler() {
        this.newTransferStore.selectedEmployee = this.selectedEmployee;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async onOpen() {
      if (this.hasNewData) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    async infiniteScroll([{ isIntersecting }]) {
      if (isIntersecting) {
        if (this.employees.length !== 0) {
          ++this.paginationPage;
        }
        this.getInitialUsers();
      }
    },

    getQueryData() {
      if (this.$route.query.employee) {
        this.selectedEmployee = JSON.parse(this.$route.query.employee);
        this.getDisplayName(this.selectedEmployee);
      }
    },
    getDisplayName(employee) {
      const { tg_name, surname, nickname } = employee;
      let name = employee.name;
      if (!name) name = employee.first_name;
      let displayName = "";
      if (surname || name) {
        displayName = `${surname || ""} ${name || ""}`.trim();
      } else if (tg_name) {
        displayName = "@" + tg_name;
      } else {
        displayName = "@" + nickname || "";
      }
      employee.displayName = displayName;
    },
    async getInitialUsers() {
      try {
        const limit = 12;
        const response = await axios.post(API_URIS.getInitialUsersURL, {
          get_users: true,
          offset: this.paginationPage,
          limit,
        });
        this.initialEmployeesList = response.data;
        for (let i = 0; i < response.data.length; i++) {
          this.employees.push(response.data[i]);
        }

        if (response.data.length < limit) {
          this.hasNewData = false;
        }
      } catch (err) {
        throw err;
      }
    },
    searchUsers(searchString) {
      this.hasNewData = false;
      if (searchString.trim() == "") {
        this.employees = [];
        this.paginationPage = 1;
        this.hasNewData = true;
      } else {
        this.getUsers(searchString);
      }
    },
    async getUsers(searchString) {
      try {
        const response = await axios.post(API_URIS.searchUserURL, {
          data: searchString,
          offset: 1,
          limit: 99999,
        });
        this.employees = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    this.getQueryData();
    this.getInitialUsers();
    this.observer = new IntersectionObserver(this.infiniteScroll);
  },
};
</script>

<style scoped>
.new_transfer_recipient {
  padding: 52px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
}
@media (max-width: 1280px) {
  .new_transfer_recipient {
    padding: 24px;
  }
}
.recipient_header {
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
}
.input_field_description {
  text-align: left;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.employees {
  max-width: 1130px;
}
.content_loading {
  margin: 10px 0 0 20px;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--generalColorWhite);
  border-bottom-color: var(--generalBrand);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
