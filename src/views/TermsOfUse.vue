<template>
    <div class="terms_of_use">
        <iframe class="doc" v-if="pdfUrl" :src="pdfUrl"></iframe>
    </div>
</template>

<script>
import axios from 'axios';
import { API_URIS } from '@/constants/api';

export default {
    name: "TermsOfUse",
    data(){
        return {
            pdfUrl: null,
        }
    },
    mounted(){
        this.getTermsOfUse();
    },
    methods: {
        async getTermsOfUse(){
            try {
                const response = await axios.get(API_URIS.termsOfUse, {
                    responseType: "arraybuffer",
                    "Content-Type": "application/pdf"
                });
                const blob = new Blob([response.data], { type: 'application/pdf' });
                this.pdfUrl = URL.createObjectURL(blob);
            } catch(err) {
                throw err;
            }
        }
    }
}
</script>

<style scoped>
.terms_of_use {
    overflow: hidden;
    height: 100%;
}
.doc {
    width: 100%;
    height: 100%;
}
</style>