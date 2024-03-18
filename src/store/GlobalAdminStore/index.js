import { API_URIS } from "@/constants/api";
import axios from "axios";
import { defineStore } from "pinia";

export const useStore = defineStore("globalAdmin", {
    state: () => ({
        organizationNameInput: "",
        organizationsList: [],
        
        selectedOrganizationIDForPeriods: null,
        periods: [],
    }),
    actions: {
        async getOrganizations(){
            try {
                const response = await axios.get(API_URIS.getRootOrganizations, {
                    params: {
                        offset: 1,
                        limit: 99999
                    }
                });
                this.organizationsList = response.data;
            } catch(err) {
                throw err;
            }
        },
        async getPeriods(){
            if (!this.selectedOrganizationIDForPeriods) return;
            try {
                const response = await axios.get(API_URIS.globalPeriods, {
                    params: {
                        organization_id: this.selectedOrganizationIDForPeriods,
                        offset: 1,
                        limit: 99999
                    }
                });
                this.periods = response.data;
            } catch(err) {
                throw err;
            }
        }
    }
})