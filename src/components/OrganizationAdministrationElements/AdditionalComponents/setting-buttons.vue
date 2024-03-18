<template>
  <div class="organization_setting_buttons_wrapper">
    <button
      v-for="item in organizationNavigation"
      class="organization_navigation_button tooltip_container"
      :data-tooltip="item.tooltipHeader"
      @click="goTo(item)"
    >
      <component class="navigation_icon" :is="item.icon" />
    </button>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";
import { ORGANIZATION_NAVIGATION } from "@/infrastructure/data-sources/organization-navigation";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "OrganizationSettingsButtons",
  components: {
    BrandingIcon: defineAsyncComponent(() =>
      import("@/components/Icons/branding.vue")
    ),
    SettingsIcon: defineAsyncComponent(() =>
      import("@/components/Icons/settings.vue")
    ),
    CopyLinkIcon: defineAsyncComponent(() =>
      import(
        "@/components/Icons/OrganizationAdministrationIcons/CopyLinkIcon.vue"
      )
    ),
  },
  props: {
    organizationId: {
      required: true,
    },
  },
  computed: {
    organizationNavigation() {
      return ORGANIZATION_NAVIGATION(this);
    },
  },
  methods: {
    async copyInviteLink() {
      try {
        const response = await axios.get(API_URIS.inviteLink);
        const match = response.data.invite_link.match(/(?:[^\/]*\/)?(.*)/);
        const pathWithQuery = match ? match[1] : response.data.invite_link;
        const newLink = window.location.origin + "/" + pathWithQuery;
        const textArea = document.createElement("textarea");
        textArea.value = newLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        notify(this.$t("organization.settings.invite_link_copied"), "success");
      } catch (err) {
        notify(this.$t("organization.settings.link_copy_failed"));
        throw err;
      }
    },

    goTo(item) {
      if (item.name === "copyLink") {
        this.copyInviteLink();
      } else {
        this.$router.push({
          name: "OrganizationAdministrationSettings",
          params: { id: this.$route.params.id, name: item.name },
        });
      }
    },
  },
};
</script>

<style scoped>
.organization_setting_buttons_wrapper {
  display: flex;
  gap: 12px;
}
.organization_navigation_button {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--secondaryColorBrand);
  display: flex;
  justify-content: center;
  align-items: center;
}
.navigation_icon {
  width: 18px;
  height: 18px;
}
</style>
