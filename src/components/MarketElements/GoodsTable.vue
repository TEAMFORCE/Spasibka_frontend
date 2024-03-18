<template>
  <div class="goods_table_wrapper">
    <div class="goods_table">
      <div class="filter_buttons">
        <button
          v-for="(filter, index) in filters"
          class="filter_button transparent-bg"
          :class="{ last: index == filters.length - 1 }"
          @click="applyFilter(filter)"
        >
          <h1 class="filter_name general-contrast-color">{{ filter.name }}</h1>

          <img
            v-if="index < filters.length - 1"
            class="filter_icon"
            :src="filterIcon(filter)"
          />
        </button>
      </div>
      <div class="separator_line"></div>
      <div class="goods_list_and_separators">
        <div class="item_data_and_separator" v-for="(item, index) in goods">
          <div class="item_data">
            <div class="item_data_entry" v-for="entry in goods[index].entries">
              <h1
                v-if="entry.type == 'text'"
                class="entry_text general-dark-color"
              >
                {{ entry.value }}
              </h1>
              <img
                v-if="entry.type == 'photo'"
                class="item_photo"
                :src="getImgUrl(entry.value)"
              />
              <div
                v-if="entry.type == 'photo'"
                class="additional_photos_count second-overlay-bg"
              >
                <h1 class="additional_photos_count_text main-black-color">
                  +{{ entry.photoCount }}
                </h1>
              </div>
              <button
                class="options_button brand-secondary-bg"
                v-if="entry.type == 'button'"
                @click.stop="activateOptions(index)"
              >
                <img class="options_icon" :src="getImgUrl(entry.value)" />
                <div
                  class="options_list general-grey-bg"
                  v-if="activeOptionsIndex == index"
                  v-click-outside="hideOptions"
                >
                  <button
                    v-for="option in options"
                    class="option_button general-white-bg"
                    @click="option.click"
                  >
                    <h1 class="option_text main-black-color">
                      {{ option.text }}
                    </h1>
                  </button>
                </div>
              </button>
            </div>
          </div>
          <hr class="separator_line" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsTable",
  data() {
    return {
      activeOptionsIndex: null,

      options: [
        {
          text: "Редактировать",
          click: () => {},
        },
        {
          text: "Удалить",
          click: () => {},
        },
      ],

      filters: [
        {
          name: "Название предложения",
        },
        {
          name: "Фото",
        },
        {
          name: "Описание",
        },
        {
          name: "Срок действия",
        },
        {
          name: "Категория",
        },
        {
          name: "Статус",
        },
        {
          name: "Цена",
        },
        {
          name: "Остаток",
        },
        {
          name: "",
        },
      ],

      goods: [
        {
          entries: [
            {
              type: "text",
              value: "aKj27bhfsE",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "WZs8Qv1TmR",
            },
            {
              type: "text",
              value: "aZt9JlXpLW",
            },
            {
              type: "text",
              value: "yNh4PdGeKf",
            },
            {
              type: "text",
              value: "TjR6mMzVpW",
            },
            {
              type: "text",
              value: "DpL5hCzGqN",
            },
            {
              type: "text",
              value: "kLr9uVzWdN",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
        {
          entries: [
            {
              type: "text",
              value: "uQb6dWjGvP",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "FhD3vYjKmL",
            },
            {
              type: "text",
              value: "wTj4mRnZpL",
            },
            {
              type: "text",
              value: "tHb6vNkYjG",
            },
            {
              type: "text",
              value: "rVz5fPcXhL",
            },
            {
              type: "text",
              value: "aMg9uZpLwS",
            },
            {
              type: "text",
              value: "eRj6mWdNkP",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
        {
          entries: [
            {
              type: "text",
              value: "gQh3fJcNkR",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "zWx8uHbMqL",
            },
            {
              type: "text",
              value: "wTz6cRjNpL",
            },
            {
              type: "text",
              value: "aKj2b7hGfE",
            },
            {
              type: "text",
              value: "tNk5vLjGhR",
            },
            {
              type: "text",
              value: "mXn9hFbVcR",
            },
            {
              type: "text",
              value: "dQf8hJkMlR",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
        {
          entries: [
            {
              type: "text",
              value: "Курсы английского языка",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "Действующее законодательство...",
            },
            {
              type: "text",
              value: "До 01.01.2023",
            },
            {
              type: "text",
              value: "Путешествия",
            },
            {
              type: "text",
              value: "Активен",
            },
            {
              type: "text",
              value: "5000",
            },
            {
              type: "text",
              value: "23 шт.",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
        {
          entries: [
            {
              type: "text",
              value: "Дополнительные 3 дня отпуска",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "Действующее законодательство...",
            },
            {
              type: "text",
              value: "До 01.01.2023",
            },
            {
              type: "text",
              value: "Путешествия",
            },
            {
              type: "text",
              value: "Активен",
            },
            {
              type: "text",
              value: "5000",
            },
            {
              type: "text",
              value: "23 шт.",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
        {
          entries: [
            {
              type: "text",
              value: "Дополнительные 3 дня отпуска",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "Действующее законодательство...",
            },
            {
              type: "text",
              value: "До 01.01.2023",
            },
            {
              type: "text",
              value: "Путешествия",
            },
            {
              type: "text",
              value: "Активен",
            },
            {
              type: "text",
              value: "5000",
            },
            {
              type: "text",
              value: "23 шт.",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
        {
          entries: [
            {
              type: "text",
              value: "Дополнительные 3 дня отпуска",
            },
            {
              type: "photo",
              value: "ActiveFilterIcon",
              photoCount: 2,
            },
            {
              type: "text",
              value: "Действующее законодательство...",
            },
            {
              type: "text",
              value: "До 01.01.2023",
            },
            {
              type: "text",
              value: "Путешествия",
            },
            {
              type: "text",
              value: "Активен",
            },
            {
              type: "text",
              value: "5000",
            },
            {
              type: "text",
              value: "23 шт.",
            },
            {
              type: "button",
              value: "MoreButton",
            },
          ],
        },
      ],

      activeFilter: { name: "Название предложения" },
    };
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context("@/assets/MarketImages", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    applyFilter(filter) {
      this.activeFilter = filter;
      let sorterIndex = 0;
      for (let i = 0; i < this.filters.length; ++i) {
        if (this.filters[i].name == this.activeFilter.name) {
          sorterIndex = i;
          break;
        }
      }
      this.goods.sort((a, b) => {
        if (a.entries[sorterIndex].value > b.entries[sorterIndex].value) {
          return 1;
        } else if (
          a.entries[sorterIndex].value < b.entries[sorterIndex].value
        ) {
          return -1;
        } else {
          return 0;
        }
      });
    },
    filterIcon(filter) {
      if (filter.name == this.activeFilter?.name)
        return this.getImgUrl("ActiveFilterIcon");
      return this.getImgUrl("InactiveFilterIcon");
    },
    activateOptions(index) {
      if (index == this.activeOptionsIndex) {
        this.activeOptionsIndex = null;
      } else {
        this.activeOptionsIndex = index;
      }
    },
    hideOptions() {
      this.activeOptionsIndex = null;
    },
  },
};
</script>

<style scoped>
.goods_table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: auto;
}
.filter_buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.filter_button {
  width: 100px;
  min-width: 100px;
  display: flex;
  gap: 4px;
}
/*
.filter_button.last {
    width: 50px;
    min-width: 50px;
} */
.filter_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.filter_icon {
  width: 20px;
  height: 20px;
}
.separator_line {
  border: 1px solid var(--systemLineGray);
  width: 100%;
  position: absolute;
  transform: translateY(-10px);
}
.goods_list_and_separators {
  display: flex;
  flex-direction: column;
}
.item_data_and_separator {
  display: flex;
  flex-direction: column;
}
.item_data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.item_data_entry {
  width: 100px;
  min-width: 100px;
  display: flex;
  gap: 4px;
}
.entry_text {
  text-align: left;
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  word-break: break-word;
}
.item_photo {
  border: 1px solid var(--secondOverlay);
  border-radius: 12px;
  height: 40px;
  width: 40px;
  object-fit: cover;
}
.additional_photos_count {
  border: 1px solid var(--secondOverlay);
  padding: 11px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 18px;
  width: 18px;
}
.additional_photos_count_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.options_button {
  z-index: 3;
  right: 0px;
  transform: translateY(-20px);
  position: absolute;
  border-radius: 8px;
  padding: 8px;
  width: 40px;
  height: 40px;
}
.options_icon {
  height: 24px;
  width: 24px;
}

.options_list {
  position: absolute;
  right: 30px;
  top: -30px;
  filter: drop-shadow(0px 12px 24px rgba(138, 138, 138, 0.15));
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  gap: 1px;
  flex-direction: column;
}
.option_button {
  padding: 16px;
}
.option_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
</style>