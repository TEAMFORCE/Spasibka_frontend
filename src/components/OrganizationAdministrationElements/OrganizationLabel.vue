<template>
  <div class="organization_label general-white-bg">
    <label class="organization_photo_wrapper">
      <img
        v-if="orgDetails?.photo"
        class="organization_logo"
        :src="photoAddress(orgDetails?.photo)"
      />
      <ChangeLogoIcon
        class="change_logo_icon"
        :class="{ absolute_position: orgDetails?.photo }"
      />
      <input
        class="organization_photo_file_select"
        type="file"
        :accept="allowedFileExtensions"
        @change="handleFileSelect"
      />
    </label>
    <h1 class="organization_name general-contrast-color">
      {{ orgDetails?.name ? orgDetails?.name : "Неизвестная организация" }}
    </h1>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { API_URIS, SERVER_IP } from "@/constants/api";
import axios from "axios";

export default {
  name: "OrganizationLabel",
  components: {
    ChangeLogoIcon: defineAsyncComponent(() =>
      import("@/components/Icons/changeLogo.vue")
    ),
  },
  props: {
    orgDetails: {
      required: true,
    },
  },
  data() {
    return {
      organizationPhoto: null,
      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],
    };
  },
  methods: {
    handleFileSelect(e) {
      this.organizationPhoto = e.target.files[0];
      this.submitPhoto();
    },
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/OrganizationAdministrationImages",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    photoAddress(photo) {
      if (photo.slice(0, 7) == "http://" || photo.slice(0, 8) == "https://") {
        return photo;
      }
      return SERVER_IP + photo;
    },
    async submitPhoto() {
      try {
        let formData = new FormData();
        formData.append("photo", this.organizationPhoto);
        await axios.put(
          API_URIS.organizations + this.$route.params.id + API_URIS.brand,
          formData
        );
        this.$emit("getOrganizationInfo");
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@700&display=swap");
.organization_label {
  position: relative;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  width: fit-content;
  padding: 16px 44px 16px 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.organization_photo_wrapper {
  position: relative;
  background-color: var(--secondaryColorBrand);
  border-radius: 100%;
}
.organization_photo_wrapper:hover {
  cursor: pointer;
}
.organization_photo_wrapper > .organization_photo_file_select {
  display: none;
}
.organization_logo {
  border-radius: 50%;
  height: 88px;
  width: 88px;
  object-fit: contain;
  padding: 6px;
}
.organization_logo_select {
  height: 24px;
  width: 24px;
  position: absolute;
  left: 38px;
  top: 38px;
  z-index: 3;
}
.organization_name {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  text-align: left;
}
.change_logo_icon {
  width: 18px;
  height: 16px;
}
.change_logo_icon.absolute_position {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>