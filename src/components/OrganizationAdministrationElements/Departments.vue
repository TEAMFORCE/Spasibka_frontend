<template>
  <div class="sub_organizations">
    <CreateDepartment
      v-if="departmentCreationEnabled"
      @cancelDepartmentCreation="cancelDepartmentCreation"
      @createDepartment="createDepartment"
    />
    <button
      class="create_new_suborg brand-secondary-bg"
      @click="openOrCloseDepartmentCreation"
    >
      <PlusIcon class="plus_icon"/>
    </button>
    <Department
      v-for="item in departmentsList"
      :department="item"
      @departmentChanged="departmentChanged"
      @departmentEdited="departmentEdited"
    />
  </div>
</template>

<script>
import Department from "./Department.vue";
import CreateDepartment from "./CreateDepartment.vue";
import axios from "axios";
import { API_URIS } from "@/constants/api";

import PlusIcon from "@/components/Icons/plus.vue";

export default {
  name: "Departments",
  props: {
    departments: {
      required: true,
    },
    orgDetails: {
      required: true,
    },
  },
  components: {
    Department,
    CreateDepartment,
    PlusIcon,
  },
  data() {
    return {
      departmentCreationEnabled: false,
    };
  },
  computed: {
    departmentsList() {
      return this.departments.filter((d) => {
        return d.organization_type == "D";
      });
    },
  },
  methods: {
    departmentEdited() {
      this.$emit("departmentEdited");
    },
    departmentChanged(departmentId) {
      this.$emit("departmentChanged", departmentId);
    },
    openOrCloseDepartmentCreation() {
      this.departmentCreationEnabled ^= true;
    },
    cancelDepartmentCreation() {
      this.departmentCreationEnabled = false;
    },
    async createDepartment(departmentName) {
      try {
        await axios.post(API_URIS.createOrganization, {
          top_id: this.orgDetails.top_id,
          parent_id: this.$route.params.id,
          organization_type: "D",
          name: departmentName,
        });
        this.departmentCreationEnabled = false;
        this.$emit("departmentCreated");
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.sub_organizations {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.create_new_suborg {
  max-width: 326px;
  width: 100%;
  padding: 76px 147px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  justify-content: center;
}
@media (max-width: 770px) {
  .create_new_suborg {
    padding: 20px;
  }
}
.plus_icon {
  height: 32px;
  width: 32px;
}
</style>