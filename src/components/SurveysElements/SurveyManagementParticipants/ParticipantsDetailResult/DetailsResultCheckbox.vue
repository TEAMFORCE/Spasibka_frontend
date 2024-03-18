<template>
  <div class="_question_wrapper" v-if="question">
    <div class="_question_name">
      {{ `${$t("surveys.question")} ${question.ordering}` }}
    </div>
    <div class="_questions_block">
      <div class="_question_info">
        <h3 class="_question_title">
          {{ question.question }}
        </h3>
        <h4 class="_question_description">
          {{ question.description }}
        </h4>
      </div>
      <div class="_questions_list">
        <div class="_list_item" v-for="item in question.inner_object">
          <div class="_radio_wrapper">
            <input
              type="checkbox"
              :name="`question${question.ordering}`"
              class="checkbox"
              disabled
              :checked="item.my_answer"
            />
          </div>
          <h4 class="_list_item_title">
            {{ item.answer }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailsResultCheckbox",
  props: {
    question: {
      required: true,
    },
  },
};
</script>

<style scoped>
._question_wrapper {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
._question_name {
  padding: 10px 33px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--generalBrand);
}
._questions_block {
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 16px;
  gap: 32px;
  flex-grow: 1;
}
._question_title {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
._question_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
._questions_list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
._list_item {
  display: flex;
  align-items: center;
  gap: 10px;
}
._list_item_title {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
._radio_wrapper {
  height: 20px;
}
.checkbox {
  border: none !important;
  background-color: var(--secondaryColorBrand) !important;
}
.checkbox:checked {
  background-color: var(--generalBrand) !important;
}
</style>