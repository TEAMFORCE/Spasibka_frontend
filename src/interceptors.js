import axios from "axios";
import router from "./router";


function getCookie(name) {
    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
}

export function setup() {
    axios.interceptors.request.use(
        function (config) {
            if (config.method != "get") {
                config.headers["X-CSRFToken"] = getCookie("csrftoken");
            }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            const responseURL = error?.request?.responseURL;
            if (!responseURL.endsWith("/user/change-organization/verify/")) {
                const currentRoute = router.currentRoute.value;
                if ((error?.response?.status == 403 || error?.response?.status == 401)
                    && (currentRoute.name != "PublicMarket" && currentRoute.name != "Market" && currentRoute.name != "GlobalAdmin")) {
                    router.push({
                        path: "/login",
                        query: currentRoute.query
                    });
                }
            }
            return Promise.reject(error);
        }
    )
}

