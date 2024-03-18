import { defineStore } from "pinia";

export const useStore = defineStore("test", {
    state: () => ({
        changesSaved: true,

        image: "string",
        title: "string",
        description: "string",
        is_active: false,
        type: 1,
        started_at: "",
        finished_at: "",
        timelimit: 0,

        timelimitpickerMinutes: 0,
        timelimitpickerHours: 0,
        timelimitpickerDays: 0,

        participantsList: [],

        questionDragStarted: false,
        draggedQuestionIndex: -1,
    }),
    actions: {
        setStartDate(date) {
            this.started_at = date
        },
        setEndDate(date) {
            this.finished_at = date
        },
        setTimelimit(time) {
            this.timelimit = time
        },
        timeLimitPickerSetMinutes(minutes) {
            this.timelimitpickerMinutes = minutes
        },
        timeLimitPickerSetHours(hours) {
            this.timelimitpickerHours = hours
        },
        timeLimitPickerSetDays(days) {
            this.timelimitpickerDays = days
        },
        setParticipantsList(list) {
            this.participantsList = list
        },
        setMinutesHoursDays(receivedTime) {
            let days = Math.floor(receivedTime / (60 * 24))
            let remainingHours = receivedTime % (60 * 24)
            let hours = Math.floor(remainingHours / 60)
            let minutes = remainingHours % 60

            this.timelimitpickerDays = days
            this.timelimitpickerHours = hours
            this.timelimitpickerMinutes = minutes
        }
    }
})