import { createToast } from "mosha-vue-toastify"

export function notify(message, type = 'danger') {
    createToast(message, {
        type: type,
        position: 'bottom-left',
        duration: 3000,
    });
}