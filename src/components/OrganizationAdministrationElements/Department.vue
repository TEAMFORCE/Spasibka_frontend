<template>
  <div class="sub_organization general-white-bg" @click.self="goToDepartment">
    <div class="top_info" @click.self="goToDepartment">
      <h1
        class="suborg_name general-contrast-color"
        @click.self="goToDepartment"
      >
        {{ department?.name }}
      </h1>
      <button
        class="department_options"
        @click.prevent="openOrCloseDepartmentOptions"
      >
        <RoundMenyBtnIcon />
        <Transition name="fade" mode="out-in">
          <div
            class="department_options_menu"
            v-if="departmentMenuVisible"
            v-click-outside="openOrCloseDepartmentOptions"
          >
            <button
              class="department_options_menu_item"
              v-for="item in departmentActions"
              @click="item.event"
            >
              <component
                :is="{ ...item.icon }"
                :currentColor="getIconColor()"
              />
              <h1 class="department_options_menu_item_text">
                {{ item.action }}
              </h1>
            </button>
          </div>
        </Transition>
      </button>
    </div>
    <BaseSmallPopup ref="editDepartmentPopup">
      <EditDepartmentForm
        :department="department"
        @cancelEditing="cancelEditing"
        @departmentEdited="departmentEdited"
      />
    </BaseSmallPopup>
    <BaseSmallPopup ref="deleteDepartmentPopup">
      <DeleteDepartmentForm
        :department="department"
        @cancelDeleting="cancelDeleting"
        @departmentEdited="departmentEdited"
      />
    </BaseSmallPopup>
  </div>
</template>

<script>
import RoundMenyBtnIcon from "@/components/Icons/roundMenuBtn.vue";
import BrandingIcon from "@/components/Icons/branding.vue";
import DeleteIcon from "@/components/Icons/delete.vue";
import BaseSmallPopup from "@/components/app/SmallPopup.vue";
import EditDepartmentForm from "@/components/OrganizationAdministrationElements/EditDepartment.vue";
import DeleteDepartmentForm from "@/components/OrganizationAdministrationElements/DeleteDepartment.vue";

export default {
  name: "Department",
  components: {
    RoundMenyBtnIcon,
    BrandingIcon,
    DeleteIcon,
    BaseSmallPopup,
    EditDepartmentForm,
    DeleteDepartmentForm,
  },
  props: {
    department: {
      required: true,
    },
  },
  data() {
    return {
      departmentMenuVisible: false,
      departmentActions: [
        {
          action: this.$t("common_components.employee_edit_menu.edit"),
          event: this.openDepartmentEditOption,
          icon: BrandingIcon,
        },
        {
          action: this.$t("common_components.employee_edit_menu.delete"),
          event: this.openDepartmentDeleteOption,
          icon: DeleteIcon,
        },
      ],
    };
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/OrganizationAdministrationImages",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    goToDepartment() {
      this.$emit("departmentChanged", this.department.id);
    },
    getIconColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalContrast;
    },
    openOrCloseDepartmentOptions() {
      setTimeout(() => {
        this.departmentMenuVisible ^= true;
      }, 50);
    },
    openDepartmentEditOption() {
      this.$refs.editDepartmentPopup.open();
    },
    cancelEditing() {
      this.$refs.editDepartmentPopup.close();
    },
    departmentEdited() {
      this.cancelEditing();
      this.cancelDeleting();
      this.$emit("departmentEdited");
    },
    openDepartmentDeleteOption() {
      this.$refs.deleteDepartmentPopup.open();
    },
    cancelDeleting() {
      this.$refs.deleteDepartmentPopup.close();
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.sub_organization {
  max-width: 294px;
  width: 100%;
  padding: 16px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sub_organization:hover {
  cursor: pointer;
}
.top_info {
  display: flex;
  justify-content: space-between;
}
.suborg_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.edit_suborg {
  position: relative;
  padding: 4px;
  border-radius: 5.3px;
  display: flex;
  justify-content: center;
}
.edit_suborg_icon {
  height: 16px;
  width: 16px;
}
.suborg_detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.suborg_detail_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}
.suborg_detail_value {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}

.department_options {
  width: 18px;
  height: 18px;
  background-color: transparent;
  outline: none;
  position: relative;
}
.department_options_menu {
  margin-top: 8px;
  transform: translateX(calc(-50% + 12px));
  filter: drop-shadow(0px 3px 40px rgba(0, 0, 0, 0.24));
  border-radius: 12px;
  position: absolute;
  overflow: hidden;
  top: 24px;
  display: flex;
  flex-direction: column;
  z-index: 3;
  background-color: var(--generalColorWhite);
}
.department_options_menu_item {
  width: 168px;
  padding: 16px;
  display: flex;
  gap: 12px;
  transition: 0.3s;
  background-color: var(--generalColorWhite);
}
.department_options_menu_item:hover {
  transform: translate(4px) scale(1.02);
}
.bottom_bordered {
  border-bottom: 1px solid var(--secondOverlay);
}
.department_options_menu_item_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--generalContrast);
  margin: 0;
}

.branding_icon {
  width: 20px;
  height: 20px;
}
.delete_icon {
  width: 20px;
  height: 20px;
}
</style>