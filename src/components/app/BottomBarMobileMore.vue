<template>
  <div @click="closeSeeMore" class="bottom_bar_mobile_more">
    <div @click.stop class="navigation general-white-bg">
      <div class="header">
        <button
          @click="closeSeeMore"
          class="close_menu negative-secondary-bg"
        ></button>
        <h1 class="links_list_header general-dark-color">{{ $t('sidebar.other_sections') }}</h1>
      </div>
      <div class="links_list_wrapper">
        <div class="links_list" v-for="(link, index) in links">
          <hr class="separator" v-if="index > 0" />
          <button @click="goToLink(link)" class="link transparent-bg">
            <h1 class="link_name general-contrast-color">{{ link.name }}</h1>
            <img class="link_image" :src="getImgUrl(link)" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { organizationSettingsStore } from '@/store/organization-settings';

export default {
  name: "BottomBarMobileMore",
  props: {
    isAdmin: {
      required: true,
    },
    isSuperuser: {
      required: true
    }
  },
  computed: {
    links() {
      const store = organizationSettingsStore();

      let links = [
        { image: "Challenges", name: this.$t("sidebar.challenges"), url: "/challenges" },
      ];
      links.push(
        { image: "Surveys", name: this.$t("sidebar.surveys"), url: "/surveys" },
      )
      if (store.marketsExist){
        links.push(
          { image: "Market", name: this.$t("sidebar.benefitCafe"), url: "/market" },
        );
      }
      links.push(
        { image: "Employees", name: this.$t("sidebar.participants"), url: "/employees" },
      );
      links.push(
        { image: "Analytics", name: this.$t("sidebar.analytics"), url: "/analytics" },
      );
      links.push(
        {
          image: "Challenges", name: this.$t("sidebar.awards"), url: "/awards"
        }
      );
      // if (this.isAdmin){
      //   links.push(
      //     { image: "GlobalAdmin", name: "Админка", url: "/global_admin" },
      //   );
      // }
      if (this.isSuperuser){
        links.push(
          { image: "GlobalAdmin", name: this.$t("sidebar.superAdmin"), url: "/global_admin" },
        );
      }
      return links;
    },
  },

  methods: {
    getImgUrl(link) {
      let imageName = link.image;
      var images = require.context(
        "@/assets/Layouts/MainLayout/Sidebar",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    closeSeeMore() {
      this.$emit("closeSeeMore");
    },
    goToLink(link) {
      this.$emit("closeSeeMore");
      this.$router.push(link.url);
    },
  },
};
</script>

<style scoped>
.bottom_bar_mobile_more {
  z-index: 5050;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(29, 28, 28, 0.35);
  backdrop-filter: blur(3px);
}
.navigation {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  border-radius: 20px 20px 0px 0px;
  align-items: center;
  padding: 12px 16px 6px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.close_menu {
  width: 32px;
  height: 4px;
  border-radius: 4px;
}
.links_list_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.links_list_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.links_list {
  display: flex;
  flex-direction: column;
}
.separator {
  margin: 0px;
  border: 1px solid var(--generalColorGrey);
}
.link {
  padding: 12px 0px 12px 0px;
  display: flex;
  justify-content: space-between;
}
.link_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.link_image {
  height: 24px;
  width: 24px;
}
</style>