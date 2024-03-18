import { defineStore } from "pinia";
import { Vue } from 'vue';

export const useStore = defineStore("chainCreationFromTemplate", {
    state: () => ({
        challengeList: []
    }),
    actions: {
        setChallengeListItem(item) {
            let currentItem = !!this.challengeList.find(el => el?.template_id === item.template_id)
            if (!currentItem) {
                this.challengeList.push(item)
            }
        },
        setValueForChallengeListItem(data, index) {
            this.challengeList.splice(index, 1, data)
        },
        resetChallengesList() {
            this.challengeList = []
        }
    }
})