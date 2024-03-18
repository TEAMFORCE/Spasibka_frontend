import { defineStore } from "pinia";

export const useStore = defineStore("testUserPermission", {
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