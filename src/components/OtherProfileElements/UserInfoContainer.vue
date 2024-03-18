<template>
  <div class="user_info_container general-white-bg">
    <div class="header_and_buttons">
      <h1 class="header general-contrast-color">
        {{ header }}
      </h1>
      <div v-if="isOrganization" class="action_buttons">
        <button
          class="action_button tooltip_container brand-secondary-bg"
          @click="$emit('enableOrganizationCreation')"
          :data-tooltip="$t('profile.create_community')"
        >
          <CreateNewOrganizationIcon class="create_new_org_icon" />
        </button>
        <button
          v-if="organizations?.length"
          class="action_button tooltip_container brand-secondary-bg"
          @click="$emit('enableOrganizationChange')"
          :data-tooltip="$t('profile.change_community')"
        >
          <ChangeOrganizationIcon class="change_org_icon" />
        </button>
      </div>
    </div>
    <!-- <div 
            class="particular_info_wrapper"
            v-for="item in info"
        >
            <h1
                class="particular_info_header general-secondary-color"
            > 
                {{ item.header }}
            </h1>
            <h1
                class="particular_info_text general-contrast-color"
            >
                {{ item.isTime ? prettyPrintTimestamp(item.text) : item.text }}
            </h1>
        </div> -->
    <div class="info_grid">
      <div class="info_row" v-for="row in info">
        <div class="info_column" v-for="column in row">
          <h1 class="particular_info_header general-secondary-color">
            {{ column.header }}
          </h1>
          <h1 class="particular_info_text general-contrast-color">
            {{ column.text || "-" }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateNewOrganizationIcon from "../Icons/ProfileIcons/CreateNewOrganizationIcon.vue";
import ChangeOrganizationIcon from "../Icons/ProfileIcons/ChangeOrganizationIcon.vue";

export default {
  name: "UserInfoContainer",
  props: ["header", "info", "organizations", "isOrganization"],
  emits: ["enableOrganizationChange", "enableOrganizationCreation"],
  components: {
    CreateNewOrganizationIcon,
    ChangeOrganizationIcon,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    prettyPrintTimestamp(timestamp) {
      let hiredAt = new Date(Date.parse(timestamp));
      let months = [
        "Января",
        "Февраля",
        "Марта",
        "Апреля",
        "Мая",
        "Июня",
        "Июля",
        "Августа",
        "Сентября",
        "Октября",
        "Ноября",
        "Декабря",
      ];
      return (
        hiredAt.getDate() +
        " " +
        months[hiredAt.getMonth()] +
        " " +
        hiredAt.getFullYear() +
        " г."
      );
    },
  },
};
</script>

<style scoped>
.user_info_container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");

.header_and_buttons {
  display: flex;
  justify-content: space-between;
}
.header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
}

.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  position: relative;
  padding: 3px;
  border-radius: 8px;
}
.create_new_org_icon {
  height: 24px;
  width: 24px;
}
.change_org_icon {
  height: 24px;
  width: 24px;
}

.particular_info_wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.particular_info_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}
.particular_info_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}

.info_grid {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
}
.info_row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info_column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 164px;
}
</style>
