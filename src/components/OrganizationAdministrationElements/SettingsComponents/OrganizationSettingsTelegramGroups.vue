<template>
  <div class="settings_telegram_groups">
    <GroupAdditionForm
      v-if="groupAdditionEnabled"
      @cancelGroupAddition="disableGroupAddition"
      @addGroup="addGroup"
    />
    <GroupDeletionForm
      v-if="groupDeletionEnabled"
      @cancelGroupDeletion="disableGroupDeletion"
      @deleteGroup="deleteGroup"
    />
    <GroupEditionForm
      v-if="groupEditionEnabled"
      @cancelGroupEdition="disableGroupEdition"
      @editGroup="editGroup"
      :groupInfo="selectedGroup"
    />
    <button class="add_group brand-secondary-bg" @click="enableGroupAddition">
      <AddTelegramGroupIcon />
    </button>
    <TelegramGroupItem
      v-for="item in groups"
      :groupInfo="item"
      @openGroupEdition="enableGroupEdition(item)"
      @openGroupDeletion="enableGroupDeletion(item)"
    />
  </div>
</template>

<script>
import TelegramGroupItem from "./TelegramGroupsComponents/TelegramGroupItem.vue";
import AddTelegramGroupIcon from "@/components/Icons/OrganizationAdministrationIcons/AddTelegramGroupIcon.vue";
import GroupAdditionForm from "./TelegramGroupsComponents/GroupAdditionForm.vue";
import GroupDeletionForm from "./TelegramGroupsComponents/GroupDeletionForm.vue";
import GroupEditionForm from "./TelegramGroupsComponents/GroupEditionForm.vue";
import { API_URIS } from "@/constants/api";
import axios from "axios";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "OrganizationSettingsTelegramGroups",
  components: {
    AddTelegramGroupIcon,
    GroupAdditionForm,
    TelegramGroupItem,
    GroupDeletionForm,
    GroupEditionForm,
  },
  data() {
    return {
      groupAdditionEnabled: false,
      groupDeletionEnabled: false,
      groupEditionEnabled: false,
      groups: [
        // {
        //   name: "Group1",
        //   info_type: "id",
        //   info: "-333333"
        // },
        // {
        //   name: "Group2",
        //   info_type: "link",
        //   info: "-333333"
        // }
      ],
      selectedGroup: null,
    };
  },
  mounted() {
    this.getGroups();
  },
  methods: {
    enableGroupEdition(item) {
      this.selectedGroup = item;
      this.groupEditionEnabled = true;
    },
    disableGroupEdition() {
      this.groupEditionEnabled = false;
    },
    enableGroupDeletion(item) {
      this.selectedGroup = item;
      this.groupDeletionEnabled = true;
    },
    disableGroupDeletion() {
      this.groupDeletionEnabled = false;
    },
    enableGroupAddition() {
      this.groupAdditionEnabled = true;
    },
    disableGroupAddition() {
      this.groupAdditionEnabled = false;
    },
    async deleteGroup() {
      try {
        await axios.delete(API_URIS.apiOrganizationsTelegramGroups, {
          data: {
            id: this.selectedGroup.id,
          },
        });
        notify(this.$t("organization.settings.tg_group_deleted"), "success");
        this.disableGroupDeletion();
        this.getGroups();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async editGroup(groupName, chatID) {
      try {
        await axios.patch(API_URIS.apiOrganizationsTelegramGroups, {
          id: this.selectedGroup.id,
          group: chatID,
          group_name: groupName,
        });
        this.disableGroupEdition();
        notify(this.$t("organization.settings.tg_group_edited"), "success");
        this.getGroups();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async addGroup(groupName, chatID) {
      try {
        await axios.post(API_URIS.apiOrganizationsTelegramGroups, {
          group: chatID,
          organization_id: this.$route.params.id,
          group_name: groupName,
        });
        this.disableGroupAddition();
        notify(this.$t("organization.settings.tg_group_added"), "success");
        this.getGroups();
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async getGroups() {
      try {
        const response = await axios.get(
          API_URIS.apiOrganizationsTelegramGroups,
          {
            params: {
              organization_id: this.$route.params.id,
            },
          }
        );
        this.groups = response.data.data;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.settings_telegram_groups {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.add_group {
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  width: 100%;
  max-width: 360px;
  /* height: 166px; */
}
</style>