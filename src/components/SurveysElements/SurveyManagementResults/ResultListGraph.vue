<template>
  <div class="result_list_graph">
    <h3 class="result_list_graph_title">
      {{ question.question }}
    </h3>
    <h4 class="result_list_graph_description">
      {{ question.description }}
    </h4>
    <h5 class="result_list_graph_all_votes">
      {{ getAnswerCount() }}
    </h5>
    <div class="_list_graph">
      <div
        class="_list_item"
        v-for="(answer, index) in answerOptions"
        :ref="`listItem_${answer.index}`"
      >
        <div class="_list_item_text_wrapper">
          <span class="_list_item_text" :ref="`listItemText_${answer.index}`">
            {{ answer.text }}
          </span>
          <button
            class="_show_full"
            v-if="answer.text.length > 47 && answer.opened == false"
            @click="showFull(answer.index)"
          >
            {{ $t("general.show_all") }}
          </button>
          <button
            class="_show_full"
            v-if="answer.text.length > 47 && answer.opened == true"
            @click="closeFull(answer.index)"
          >
            {{ $t("general.close_all") }}
          </button>
        </div>

        <div class="_list_item_value">
          {{ answer.count }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultListGraph",
  props: {
    question: {
      required: true,
    },
  },
  data() {
    return {
      series: [],
      answerOptions: [],
    };
  },
  computed: {
    allVotes() {
      return this.question.inner_object[0].answers.length;
    },
  },
  methods: {
    getAnswerCount() {
      if (this.allVotes % 10 === 1 && this.allVotes % 100 !== 11) {
        return `${this.allVotes} ${this.$t("surveys.results.answer")}`;
      } else if (
        this.allVotes % 10 >= 2 &&
        this.allVotes % 10 <= 4 &&
        (this.allVotes % 100 < 10 || this.allVotes % 100 >= 20)
      ) {
        return `${this.allVotes} ${this.$t("surveys.results.answerTwo")}`;
      } else {
        return `${this.allVotes} ${this.$t("surveys.results.answerFive")}`;
      }
    },
    getAnswers() {
      for (let i = 0; i < this.question.inner_object[0].answers.length; i++) {
        if (!this.question.inner_object[0].answers[i].text) {
          this.answerOptions.push({
            text: this.$t("surveys.results.noAnswer"),
            count: this.question.inner_object[0].answers[i].count,
          });
        } else {
          this.answerOptions.push({
            text: this.question.inner_object[0].answers[i].text,
            count: this.question.inner_object[0].answers[i].count,
            index: i,
            opened: false,
          });
        }
      }
    },
    showFull(index) {
      let currentItem = this.$refs[`listItem_${index}`];
      currentItem[0].style.height = "auto";
      let currentItemText = this.$refs[`listItemText_${index}`];
      currentItemText[0].style.overflow = "visible";
      currentItemText[0].style.wordBreak = "break-all";
      currentItemText[0].style.display = "block";
      let currentAnswerOption = this.answerOptions.find(
        (el) => el.index === index
      );
      currentAnswerOption.opened = true;
    },
    closeFull(index) {
      let currentItem = this.$refs[`listItem_${index}`];
      currentItem[0].style.height = "62px";
      let currentItemText = this.$refs[`listItemText_${index}`];
      currentItemText[0].style.overflow = "hidden";
      currentItemText[0].style.wordBreak = "normal";
      currentItemText[0].style.display = "-webkit-box";
      let currentAnswerOption = this.answerOptions.find(
        (el) => el.index === index
      );
      currentAnswerOption.opened = false;
    },
  },
  mounted() {
    this.getAnswers();
  },
};
</script>

<style scoped>
.result_list_graph {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
}
.result_list_graph_title {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.result_list_graph_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.result_list_graph_all_votes {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
._list_graph {
  /* display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px; */
  max-width: 1000px;
  column-count: 2;
  column-gap: 0px;
}
._list_item {
  max-width: 487px;
  width: 100%;
  height: 62px;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 8px 0;
}
._list_item_text_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 94%;
}
._list_item_text {
  max-width: 100%;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: var(--generalColorSecondary);
  overflow: hidden;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-height: 1.3em;
}
._show_full {
  background-color: transparent;
  color: var(--generalBrand);
  outline: none;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}
._list_item_value {
  width: 24px;
  height: 24px;
  background-color: var(--primary1);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: var(--generalContrast);
}
</style>