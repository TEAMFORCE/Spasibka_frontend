import { createApp, onUnmounted, h } from "vue";
import { createPinia } from 'pinia';
import App from "./App.vue";
import router from "./router";

import VueCookies from "vue-cookies";

import "@vuepic/vue-datepicker/dist/main.css";
import "vue-select/dist/vue-select.css";
import "./assets/css/colors.css";
import "./assets/css/alignment.css";
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import { plugin as Slicksort } from 'vue-slicksort';

import { setup } from "./interceptors";

setup();

import moshaToast from 'mosha-vue-toastify'
import 'mosha-vue-toastify/dist/style.css'

import VueApexCharts from "vue3-apexcharts";

import i18n from './i18n';

import vSelect from 'vue-select';

import SelectArrowIcon from "@/components/Icons/select_arrow.vue";
import CloseIcon from "@/components/Icons/close_select.vue";

vSelect.props.components.default = () => ({
    Deselect: {
        render: () => h(CloseIcon),
    },
    OpenIndicator: {
        render: () => h(SelectArrowIcon),
    },
});


const pinia = createPinia();
const app = createApp(App);


//outside click directive for doing something after click outside of target
//usage example <div v-click-outside="doSomething">...</div>
app.directive("click-outside", {
    beforeMount(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event, el)
            }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    }
})
//outside click directive

app.use(VueApexCharts);

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(VueCookies);
app.use(moshaToast);
app.use(Slicksort);

app.component('vSelect', vSelect);
app.mount("#app");