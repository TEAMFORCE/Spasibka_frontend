<template>
  <div class="sub_organizations">
    <CreateChildOrganization
      v-if="childOrganizationCreationEnabled"
      @cancelChildOrganizationCreation="cancelChildOrganizationCreation"
      @createChildOrganization="createChildOrganization"
    />
    <button
      class="create_new_suborg brand-secondary-bg"
      @click="openOrCloseChildOrganizationCreation"
    >
      <PlusIcon class="plus_icon" />
    </button>
    <ChildOrganization
      v-for="item in childOrganizationsList"
      :childOrganization="item"
    />
  </div>
</template>

<script>
import ChildOrganization from "./ChildOrganization.vue";
import CreateChildOrganization from "./CreateChildOrganization.vue";
import axios from "axios";
import { API_URIS } from "@/constants/api";

import PlusIcon from "@/components/Icons/plus.vue";

export default {
  name: "ChildOrganizations",
  props: {
    departments: {
      required: true,
    },
    orgDetails: {
      required: true,
    },
  },
  components: {
    ChildOrganization,
    CreateChildOrganization,
    PlusIcon,
  },
  data() {
    return {
      childOrganizationCreationEnabled: false,
    };
  },
  computed: {
    childOrganizationsList() {
      return this.departments.filter((d) => {
        return d.organization_type == "C";
      });
    },
  },
  methods: {
    openOrCloseChildOrganizationCreation() {
      this.childOrganizationCreationEnabled ^= true;
    },
    cancelChildOrganizationCreation() {
      this.childOrganizationCreationEnabled = false;
    },
    async createChildOrganization(childOrganizationName) {
      try {
        await axios.post(API_URIS.createOrganization, {
          top_id: this.orgDetails.top_id,
          parent_id: this.$route.params.id,
          organization_type: "C",
          name: childOrganizationName,
        });
        this.childOrganizationCreationEnabled = false;
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
  padding: 27px 147px;
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
  max-height: 32px;
  width: 32px;
}
</style>