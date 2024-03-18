<template>
  <div class="organization_payment">
    <h1 class="payment_unit_text general-contrast-color">Единица платежа</h1>
    <div class="payment_unit_icon_actions">
      <img class="payment_unit_icon" :src="getImgUrl('PaymentUnitIcon')" />
    </div>
    <div class="unit_amount_writings_wrapper">
      <h1 class="unit_amount_writings_header general-secondary-color">
        Название
      </h1>
      <div class="unit_amount_writings" v-for="item in unitCountWritings">
        <div class="unit_amount brand-secondary-bg">
          <h1 class="unit_amount_text general-brand-color">
            {{
              item.isRange
                ? item.countStart + " - " + item.countEnd
                : item.count
            }}
          </h1>
        </div>
        <h1 class="unit_amount_writing general-contrast-color">
          {{ item.writing }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrganizationPayment",
  data() {
    return {
      unitCountWritings: [
        {
          isRange: false,
          count: 1,
          writing: "спасибка",
        },
        {
          isRange: true,
          countStart: 2,
          countEnd: 4,
          writing: "спасибки",
        },
        {
          isRange: true,
          countStart: 5,
          countEnd: 19,
          writing: "спасибок",
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
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.organization_payment {
  width: 311px;
  border-radius: 24px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
}

.payment_unit_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 18px;
  text-align: left;
}
.payment_unit_icon_actions {
  display: flex;
  justify-content: space-between;
}
.payment_unit_icon {
  width: 24px;
  height: 24px;
}
.change_payment_unit_icon_button {
  padding: 4px;
  border-radius: 5px;
  width: 24px;
  height: 24px;
}
.change_payment_unit_icon {
  width: 16px;
  height: 16px;
}
.unit_amount_writings_wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.unit_amount_writings_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}
.unit_amount_writings {
  display: flex;
  gap: 8px;
}
.unit_amount {
  border-radius: 4.5px;
  padding: 4.5px;
}
.unit_amount_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
}
.unit_amount_writing {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>