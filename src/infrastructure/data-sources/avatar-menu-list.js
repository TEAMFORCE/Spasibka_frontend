import OpenPhotoIcon from "@/components/Icons/openPhoto.vue"
import ChangePhotoIcon from "@/components/Icons/changePhoto.vue"
import BrandingIcon from "@/components/Icons/branding.vue"
import DeleteIcon from "@/components/Icons/delete.vue"

export const AVATAR_MENU_LIST = (context, isCurrentUser, isChanging) => {
    let items = [
        { title: context.$t('profile.menu_list.openPhoto'), image: OpenPhotoIcon, eventName: "openPhoto" },
    ]

    if (isCurrentUser) {
        items.push(...[
            { title: context.$t('profile.menu_list.updatePhoto'), image: ChangePhotoIcon, eventName: "updatePhoto" },
            { title: context.$t('profile.menu_list.changeThumbnail'), image: BrandingIcon, eventName: "changeThumbnail" },
            { title: context.$t('profile.menu_list.deletePhoto'), image: DeleteIcon, eventName: "deletePhoto" }
        ])
    }
    if (isChanging) {
        items = [
            { title: context.$t('profile.menu_list.updatePhoto'), image: ChangePhotoIcon, eventName: "updatePhoto" },
            { title: context.$t('profile.menu_list.changeThumbnail'), image: BrandingIcon, eventName: "changeThumbnail" },
            { title: context.$t('profile.menu_list.deletePhoto'), image: DeleteIcon, eventName: "deletePhoto" }
        ]
    }


    return items
}