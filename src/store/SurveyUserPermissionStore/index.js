import { defineStore } from "pinia";

export const useStore = defineStore("surveyUserPermission", {
    state: () => ({
        userList: [],
        userListForSend: []
    }),
    actions: {
        setUserList(list) {
            this.userList = list
        },
        setUserListForSend(list) {
            this.userListForSend = list
        }
    }
})