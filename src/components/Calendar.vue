<template>
    <div class="calendar">
        <div class="select_year">
            <button @click="decreaseYear">
                &lt;
            </button>
            <h4 class="year_text">{{ year }}</h4>
            <button @click="increaseYear">
                &gt;
            </button>
        </div>
        <div class="select_month">
            <button @click="decreaseMonth">
                &lt;
            </button>
            <h4 class="month_text">{{ month }}</h4>
            <button @click="increaseMonth">
                &gt;
            </button>
        </div>
        <div class="select_day">
            <button 
                class="calendar_day"
                @click="selectDay(i)"
                v-for="i in maxDays"
            >
                {{ i }}
            </button>
        </div>
    </div>
</template>


<script>

export default {
    name: 'Calendar',
    props: [],
    data(){
        return {
            year: 2022,
            month: 8,
            day: 16,

            maxDays: 0,
            bigMonths: [1, 3, 5, 7, 8, 10, 12]
        }
    },
    mounted(){
        this.countDays();
    },  
    methods: {
        selectDay(day){
            this.day = day;
            this.$emit('selectDate', this.year, this.month, this.day);
        },
        countDays(){
            if (this.month != 2){
                let isBigMonth = false;
                for (let i in this.bigMonths){
                    if (this.month == this.bigMonths[i]){
                        isBigMonth = true;
                        break;
                    }
                }
                if (isBigMonth){
                    this.maxDays = 31;
                }
                else {
                    this.maxDays = 30;
                }
            }
            else {
                let isLeapYear = false;
                if (this.year % 400 == 0 || (this.year % 4 == 0 && this.year % 100 != 0)){
                    isLeapYear = true;
                }
                if (isLeapYear) this.maxDays = 29;
                else this.maxDays = 28;
            }
        },  
        increaseYear (){
            this.year++;
            this.countDays();
        },
        decreaseYear (){
            this.year--;
            this.countDays();
        },
        increaseMonth(){
            if (this.month < 12) this.month++;
            this.countDays();
        },
        decreaseMonth(){
            if (this.month > 1) this.month--;
            this.countDays();
        }
    }
}
</script>


<style scoped>
.calendar {
    background-color: white;
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    gap: 5px;
    padding: 10px;
    border-radius: 12px;
}
.select_year {
    display: flex;
    margin: auto;
    gap: 10%;
}
.year_text {
    margin-top: 0px;
    margin-bottom: 0px;
}
.select_month {
    display: flex;
    margin: auto;
    gap: 10%;
}
.month_text {
    margin-top: 0px;
    margin-bottom: 0px;
}
.select_day {
    display: flex;
    flex-wrap: wrap;
}
.calendar_day {
    width: 14.2%;
}
</style>