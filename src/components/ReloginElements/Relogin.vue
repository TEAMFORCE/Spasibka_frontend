<template>
  <div class="relogin_screen_wrapper" :class="{ absolute: initialLogin }">
    <div class="relogin_wrapper" :class="{ absolute: initialLogin }">
      <div class="relogin general-white-bg">
        <h1 class="relogin_header general-contrast-color">{{ status }}</h1>
        <!-- <OrganizationSelectList
                    v-if="status == 'Выберите организацию'"
                    :initialLogin="initialLogin"
                    :organizations="organizations"
                    @selectOrganization="selectOrganization"
                /> -->
        <vSelect
          class="organization_select_list"
          v-if="status === 'Выберите организацию'"
          :options="organizations"
          :placeholder="$t('login.select_org')"
          label="organization_name"
          @option:selected="selectOrganization"
        />
        <input
          v-else
          class="code_input general-contrast-color"
          :placeholder="'Введите код подтверждения'"
          v-model="code"
        />
        <div class="relogin_or_cancel_buttons">
          <!-- <button
            class="relogin_or_cancel_button general-brand-bg"
            @click="tryRelogin"
          >
            <h1 class="relogin_or_cancel_button_text general-white-color">
              {{ status == "Выберите организацию" ? "Выбрать" : "Подтвердить" }}
            </h1>
          </button> -->
          <button
            class="relogin_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelRelogin')"
          >
            <h1 class="relogin_or_cancel_button_text general-brand-color">
              Отменить
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

import { API_URIS } from "@/constants/api";
import OrganizationSelectList from "./OrganizationSelectList.vue";
import axios from "axios";

export default {
  name: "Relogin",
  components: {
    OrganizationSelectList,
    vSelect,
  },
  props: {
    organizations: {
      required: true,
    },
    initialLogin: {
      required: true,
    },
  },
  data() {
    return {
      selectedOrganization: null,
      status: "Выберите организацию",
      code: "",
    };
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    selectOrganization(organization) {
      this.selectedOrganization = organization;
      this.tryRelogin();
    },
    tryRelogin() {
      if (this.initialLogin) {
        this.$emit("relogin", this.selectedOrganization);
      } else {
        if (this.status == "Выберите организацию") {
          if (this.selectedOrganization.is_current) {
            this.$emit("cancelRelogin", this.selectedOrganization.id);
          } else {
            this.changeOrganization();
          }
        } else {
          this.enterTheCode();
        }
      }
    },
    async changeOrganization() {
      try {
        const response = await axios.post(API_URIS.userChangeOrganization, {
          organization_id: this.selectedOrganization.id,
        });
        this.status = response.data.status;
      } catch (err) {
        throw err;
      }
    },
    async enterTheCode() {
      try {
        await axios.post(API_URIS.userChangeOrganizationVerify, {
          code: this.code,
        });
        this.$emit("cancelRelogin", this.selectedOrganization.id);
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.relogin_screen_wrapper {
  position: fixed;
  z-index: 10000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.relogin_screen_wrapper.absolute {
  position: absolute;
}
.relogin_wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  max-width: 500px;
  width: 90%;
  transform: translate(-50%, -50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  /* overflow: hidden; */
}
.relogin_wrapper.absolute {
  position: absolute;
}
.relogin {
  width: calc(100% - 64px);
  max-width: 477px;
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.relogin_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.organization_select_list {
  position: relative;
}
.code_input {
  border-radius: 12px;
  padding: 13px 16px;
  border: 1px solid var(--generalColorGrey);
}
.code_input:focus {
  outline: none;
}
.code_input::placeholder {
  color: var(--generalColorSecondary);
}
.relogin_or_cancel_buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.relogin_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.relogin_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
