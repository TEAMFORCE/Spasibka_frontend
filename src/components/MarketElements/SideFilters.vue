<template>
  <div class="side_filters general-white-bg">
    <button class="close_filters transparent-bg" @click="closeFilters">
      <img class="close_filters_icon" :src="closeFiltersIcon" />
    </button>
    <div class="filters_wrapper">
      <h1 class="header_text general-dark-color">
        {{ $t("market.filter.title") }}
      </h1>
      <div class="filters">
        <div class="category_filters">
          <h1 class="category_header general-contrast-color">
            {{ $t("market.filter.categories") }}
          </h1>
          <div class="categories" v-for="category in categories">
            <div class="category">
              <button
                @click="changeActiveCategory(category)"
                class="category_selector transparent-bg"
                :class="{ active: category.id == activeCategoryID }"
              >
                <div
                  class="category_selector_inner"
                  :class="{ active: category.id == activeCategoryID }"
                ></div>
              </button>
              <h1 class="category_name general-contrast-color">
                {{ category.name }}
              </h1>
            </div>
          </div>
        </div>
        <div class="price_filters">
          <h1 class="price_header general-contrast-color">
            {{ $t("market.filter.prise") }}
          </h1>
          <div class="input_filters">
            <input
              min="0"
              type="number"
              class="input_filter general-contrast-color"
              :placeholder="$t('market.filter.from')"
              v-model="minPrice"
            />
            <input
              type="number"
              min="0"
              class="input_filter general-contrast-color"
              :placeholder="$t('market.filter.to')"
              v-model="maxPrice"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="action_buttons">
      <button
        class="action_button apply_button general-brand-bg"
        @click="applyFilters"
      >
        <h1 class="action_name general-white-color">
          {{ $t("market.filter.apply") }}
        </h1>
      </button>
      <button class="action_button transparent-bg" @click="resetFilters">
        <h1 class="action_name general-contrast-color">
          {{ $t("market.filter.cancel") }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideFilters",
  props: {
    categories: {
      required: true,
    },
    setActiveCategoryID: {
      required: true,
    },
    setMinPrice: {
      required: true,
    },
    setMaxPrice: {
      required: true,
    },
  },
  data() {
    return {
      activeCategoryID: this.setActiveCategoryID,
      minPrice: this.setMinPrice,
      maxPrice: this.setMaxPrice,
    };
  },
  computed: {
    closeFiltersIcon() {
      return this.getImgUrl("CloseFiltersIcon");
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/MarketImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    changeActiveCategory(category) {
      this.activeCategoryID = category.id;
    },
    closeFilters() {
      this.$emit("closeFilters");
    },
    applyFilters() {
      this.$emit(
        "applyFilters",
        this.activeCategoryID,
        this.minPrice,
        this.maxPrice
      );
    },
    resetFilters() {
      this.activeCategoryID = 0;
      this.minPrice = null;
      this.maxPrice = null;
    },
  },
};
</script>


<style scoped>
.side_filters {
  position: fixed;
  z-index: 10;
  top: 0px;
  right: 0px;
  width: 100%;
  max-width: 407px;
  bottom: 0px;
  padding: 32px 32px 49px 32px;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  overflow-y: auto;
}
@media (max-width: 1000px) {
  .side_filters {
    padding-bottom: 108px;
  }
}
@media (max-width: 550px) {
  .side_filters {
    padding-bottom: 94px;
  }
}
@media (max-width: 750px) {
  .side_filters {
    max-width: 300px;
  }
}
.close_filters {
  position: absolute;
  top: 18.67px;
  right: 18.67px;
  width: 26.67px;
  height: 26.67px;
}
.close_filters_icon {
  width: 26.67px;
  height: 26.67px;
}
.filters_wrapper {
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.header_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
}
.filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.category_filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.category_header {
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-align: left;
}
.categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.category {
  display: flex;
  align-items: center;
  gap: 8px;
}
.category_selector {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--generalColorGrey);
  border-radius: 50%;
  height: 20px;
  width: 20px;
}
.category_selector.active {
  border: 2px solid var(--generalBrand);
}
.category_selector_inner {
  height: 10px;
  width: 10px;
  border-radius: 50%;
}
.category_selector_inner.active {
  background-color: var(--generalBrand);
}
.category_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.price_filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.price_header {
  text-align: left;
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
}
.input_filters {
  display: flex;
  gap: 12px;
}
.input_filter {
  width: 100%;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 14px 16px;

  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.input_filter::placeholder {
  color: var(--generalColorGrey);
}
.action_buttons {
  display: flex;
  flex-direction: column;
}
.action_button {
  border-radius: 12px;
  padding: 17px;
}
.apply_button {
  box-shadow: 0px 10px 20px rgba(237, 125, 43, 0.3);
}
.action_name {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
</style>