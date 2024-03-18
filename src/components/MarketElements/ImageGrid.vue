<template>
    <div>
        <div class="image-grid">
            <div v-for="picture in pictures" :key="picture.id" :class="{ 'selected': isSelected(picture) }"
                class="image-container" @click="expandPicture(picture)">
                <img :src="photoAddress(picture.link)" alt="" class="image" />
                <button class="select-button brand-secondary-bg" @click.stop="toggleSelection(picture)">
                    <h1 class="select-button-text general-brand-color">{{ isSelected(picture) ? 'Отменить' : 'Удалить' }}</h1>
                </button>
            </div>
        </div>
        <div v-if="isExpanded" class="expanded-view" @click="this.isExpanded = false">
            <button v-if="pictures.length > 1" class="nav-button transparent-bg left" @click.stop="showPreviousPicture">
                <img :src="getImgUrl('LeftArrow')" class="nav_button_image"/>
            </button>
            <div class="picture-container">
                <img :src="photoAddress(expandedPicture.link)" alt="" class="picture" />
            </div>
            <button v-if="pictures.length > 1" class="nav-button transparent-bg right" @click.stop="showNextPicture">
                <img :src="getImgUrl('RightArrow')" class="nav_button_image"/>
            </button>
        </div>
    </div>
</template>
  
<script>
import { SERVER_IP } from '@/constants/api';

export default {
    name: "ImageGrid",
    props: {
        pictures: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selectedPictures: new Set(),
            expandedPicture: null,
            isExpanded: false,
            currentIndex: 0,
        };
    },
    methods: {
        getImgUrl(imageName) {
            var images = require.context("@/assets/MarketImages", false, /\.png$/);
            return images("./" + imageName + ".png");
        },
        photoAddress(photo) {
            if (photo == null) {
                let images = require.context("@/assets/", false, /\.png$/);
                return images("./Logo.png");
            } else {
                if (photo.slice(0, 7) == "http://") {
                    return photo;
                }
                return SERVER_IP + photo;
            }
        },
        toggleSelection(picture) {
            if (this.isSelected(picture)) {
                this.selectedPictures.delete(picture);
            } else {
                this.selectedPictures.add(picture);
            }
            this.$emit('getPicturesToDelete', this.selectedIds);
        },
        isSelected(picture) {
            return this.selectedPictures.has(picture);
        },
        expandPicture(picture) {
            this.expandedPicture = picture;
            this.isExpanded = true;
            document.body.classList.add('blurred');
            this.currentIndex = this.pictures.indexOf(picture);
        },
        showNextPicture() {
            this.currentIndex++;
            if (this.currentIndex >= this.pictures.length) {
                this.currentIndex = 0;
            }
            this.expandedPicture = this.pictures[this.currentIndex];
        },
        showPreviousPicture() {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.pictures.length - 1;
            }
            this.expandedPicture = this.pictures[this.currentIndex];
        },
    },
    computed: {
        selectedIds() {
            return Array.from(this.selectedPictures, (picture) => picture.id).join(
                ', '
            );
        },
    },
};
</script>
  
<style scoped>
.image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-container {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
}

.image {
    display: block;
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.select-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border: none;
    padding: 5px;
    text-align: center;
    cursor: pointer;
    border-radius: 6px;
}
.select-button-text {
    font-family: 'Golos';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
}

.selected {
    border: 2px solid var(--generalBrand);
}

.expanded-view {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(12px);
    z-index: 999;
}

.picture-container {
    position: relative;
}

.picture {
    max-width: 80%;
    max-height: 80%;
    width: auto;
    height: auto;
    margin: 0 auto;
    display: block;
    border-radius: 12px;
}

.nav-button {
    z-index: 99;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    padding: 5px;
    font-size: 24px;
    color: #333;
    cursor: pointer;
}

.nav-button.left {
    left: 0;
}

.nav-button.right {
    right: 0;
}
.nav_button_image {
    height: 30px;
    width: 30px;
}

.blurred {
    filter: blur(5px);
}
</style>  