<template>
  <div class="birthday_employee_card_wrapper">
    <div
      class="birthday_icon_wrapper brand-secondary-bg"
      @click="goToThanksGiving(employeeBirthday)"
    >
      <!-- <img
        class="birthday_icon"
        src="@/assets/MainPage/birthdayIcon.png"
        alt="birthday_icon"
      /> -->
      <GiftboxIcon/>
    </div>
    <div class="birthday_employee_wrapper">
      <div class="employee_photo_wrapper">
        <img
          v-if="employeeBirthday.photo"
          :src="getAvatar(employeeBirthday.photo)"
          alt="employee_photo"
          class="employee_photo"
        />
        <!-- <img
          v-else
          :src="getImgUrl('userNoAvatar')"
          alt="user_no_photo"
          class="employee_photo"
        /> -->
        <EmptyAvatarIcon
          v-else
        />
      </div>
      <div class="employee_info_wrapper">
        <p class="employee_name">
          {{ `${employeeBirthday.first_name} ${employeeBirthday.surname}` }}
        </p>
        <p class="employee_birthday_date">
          {{
            `${employeeBirthday.day_of_birth} ${getMonth(
              employeeBirthday.month_of_birth
            )}`
          }}
        </p>
      </div>
    </div>
    <button
      class="birthday_thanksgiving"
      @click="goToThanksGiving(employeeBirthday)"
    >
      {{ $t("mainPage.birthday.thanksGiving") }}
    </button>
  </div>
</template>

<script>
import GiftboxIcon from "@/components/Icons/MainPageIcons/GiftboxIcon.vue";
import EmptyAvatarIcon from "@/components/Icons/MainPageIcons/EmptyAvatarIcon.vue";
import { SERVER_IP } from "@/constants/api";
export default {
  name: "BirthdayEmployeeCard",
  props: {
    employeeBirthday: {
      required: true,
    },
  },
  components: {
    GiftboxIcon,
    EmptyAvatarIcon
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    getMonth(monthNumber) {
      switch (monthNumber) {
        case 1:
          return this.$t("mainPage.birthday.months.january");
        case 2:
          return this.$t("mainPage.birthday.months.february");
        case 3:
          return this.$t("mainPage.birthday.months.march");
        case 4:
          return this.$t("mainPage.birthday.months.april");
        case 5:
          return this.$t("mainPage.birthday.months.may");
        case 6:
          return this.$t("mainPage.birthday.months.june");
        case 7:
          return this.$t("mainPage.birthday.months.july");
        case 8:
          return this.$t("mainPage.birthday.months.august");
        case 9:
          return this.$t("mainPage.birthday.months.september");
        case 10:
          return this.$t("mainPage.birthday.months.october");
        case 11:
          return this.$t("mainPage.birthday.months.november");
        case 12:
          return this.$t("mainPage.birthday.months.december");
      }
    },
    goToThanksGiving(employee) {
      this.$router.push({ path: "/new_transfer/", query: {employee: JSON.stringify(employee)}});
    },
  },
};
</script>

<style scoped>
.birthday_employee_card_wrapper {
  width: 255px;
  height: 388px;
  border: 1px solid var(--negativeSecondary);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.birthday_icon_wrapper {
  /* width: 100%; */
  width: 61px;
  height: 61px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  /* display: flex; */
  align-self: flex-end;
  /* justify-content: flex-end; */
}
.birthday_icon {
  width: 60px;
  border-radius: 100%;
}
.birthday_employee_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.employee_photo_wrapper {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  overflow: hidden;
}
.employee_photo {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  object-fit: cover;
}
.employee_info_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.employee_name {
  font-family: "Golos";
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: var(--generalContrast);
  margin: 0;
}
.employee_birthday_date {
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalColorSecondary);
  margin: 0;
}
.birthday_thanksgiving {
  width: 70%;
  background-color: transparent;
  outline: none;
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalBrand);
}
.birthday_thanksgiving:hover {
  color: var(--generalBrandLight);
}
.birthday_thanksgiving:active {
  transform: scale(0.99);
}
</style>