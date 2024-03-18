<template>
    <div class="candidates_list">
        <h1
            class="candidates_missing_text"
            v-if="candidates.length == 0"
        >
            {{ $t("challenges.candidates.no_candidates") }}
        </h1>
        <div 
            class="candidate general-white-bg"
            v-for="item in candidates"
        >
            <ChallengeCandidatesItem
                :challengeCandidate="item"
                :challengeData="challengeData"
                :selfUserID="selfUserID"
                @refreshCandidates="getCandidates"
            />
        </div>
    </div>
</template>

<script>
import { API_URIS } from '@/constants/api';
import axios from 'axios';
import ChallengeCandidatesItem from './ChallengeCandidatesItem.vue';

export default {
    name: "ChallengeCandidates",
    props: {
        selfUserID: {
            required: true
        },
        challengeData: {
            required: true
        }
    },
    components: {
        ChallengeCandidatesItem
    },
    data(){
        return {
            candidates: [],
        }
    },
    mounted(){
        this.getCandidates();
    },
    methods: {
        async getCandidates(){
            try {
                const response = await axios.get(API_URIS.challengeContenders + this.$route.params.id + "/");
                this.candidates = response.data;
                for (let i = 0; i < this.candidates.length; ++i){
                    this.candidates[i].id = this.candidates[i].report_id;
                }
            } catch(err) {
                throw err;
            }
        },
        
    }
}
</script>

<style scoped>
.candidates_list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.candidate {
    box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

</style>
