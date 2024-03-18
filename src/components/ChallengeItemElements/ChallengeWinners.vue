<template>
    <div class="challenge_winners_section">
        <h1
            class="winners_missing_text"
            v-if="challengeWinners.length == 0"
        >   
            {{ $t("challenges.winners.no_winners") }}
        </h1>
        <div
            class="challenge_winners transparent-bg"
        >
            <ChallengeWinnersItem
                v-for="item in challengeWinners"
                :challengeWinner = item
            />
        </div>
    </div>
</template>


<script>
import { API_URIS, SERVER_IP } from '@/constants/api';
import axios from 'axios';
import ChallengeWinnersItem from './ChallengeWinnersItem.vue';

export default {
    name: "ChallengeWinners",
    components: { ChallengeWinnersItem },
    data() {
        return {
            challengeWinners: [],
        };
    },
    mounted() {
        this.getChallengeWinners();
    },
    watch: {},
    computed: {},
    methods: {
        async getChallengeWinners() {
            try {
                let response = await axios.get(API_URIS.challengeWinnersReports + this.$route.params.id + "/");
                this.challengeWinners = response.data;
            }
            catch (err) {
                throw err;
            }
        }
    },
}
</script>

<style scoped>
.challenge_winners_section {
    margin-bottom: 20px;
}
.challenge_winners {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

</style>
