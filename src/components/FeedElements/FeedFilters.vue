<template>
  <div class="feed_filters general-white-bg">
    <button class="close_filters transparent-bg" @click="$emit('closeFilters')">
      <CloseFiltersIcon/>
    </button>
    <div class="filters_wrapper">
      <h1 class="header_text general-dark-color">{{ $t("feed.filter") }}</h1>
      <div class="category_filters">
        <h1 class="category_header general-contrast-color">{{ $t("feed.category") }}</h1>
        <div class="categories" v-for="(category, index) in categories">
          <div 
            class="category"
          >
            <input 
              class="checkbox" 
              type="checkbox"
              v-model="category.on"
              @input="checkIfEmpty(index)"
            />
            <h1 class="category_name general-contrast-color">
              {{ category.name }}
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div class="action_buttons">
      <button
        class="action_button apply_button general-brand-bg"
        @click="applyFilters"
      >
        <h1 class="action_name general-white-color">{{ $t("feed.apply")}} </h1>
      </button>
        <!-- <button class="action_button transparent-bg" @click="resetFilters">
          <h1 class="action_name general-contrast-color">{{ $t("feed.reset") }}</h1>
        </button> -->
    </div>
  </div>
</template>

<script>
import CloseFiltersIcon from "@/components/Icons/FeedIcons/CloseFiltersIcon.vue";
import { mapStores } from "pinia";
import { useStore as useFeedStore } from "@/store/feed";

export default {
  name: "FeedFilters",  
  components: {
    CloseFiltersIcon
  },  
  data(){
    return {
    }
  },
  mounted(){  
    
  },
  computed: {
    ...mapStores(useFeedStore),
    categories() {
      let eventtypes = this.feedStore?.feedFilters?.eventtypes;
      let categoriesToDisplay = [];
      for (let i = 0; i < eventtypes?.length; ++i) {
        if (eventtypes[i].name !== 'Покупки') {
          categoriesToDisplay.push(eventtypes[i]);
        }
      }
      return categoriesToDisplay;
    }
  },
  methods: {
    checkIfEmpty(index){
      let categories = this.feedStore?.feedFilters.eventtypes;
      if (categories[index].on){
        let othersEmpty = true;
        for (let i = 0; i < categories?.length; ++i) {
          if (i !== index && categories[i].on) {
            othersEmpty = false;
            break;
          }
        }
        if (othersEmpty) {
          setTimeout(() => {categories[index].on = true}, 100);
        }
      }
    },
    resetFilters(){
      let categories = this.feedStore?.feedFilters.eventtypes;
      for (let i = 0; i < categories?.length; ++i){
        categories[i].on = false;
      }
    },
    applyFilters(){
      this.$emit("applyFilters");
    }
  }
}
</script>

<style scoped>
.feed_filters {
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
  .feed_filters {
    padding-bottom: 108px;
  }
}
@media (max-width: 550px) {
  .feed_filters {
    padding-bottom: 94px;
  }
}
@media (max-width: 750px) {
  .feed_filters {
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