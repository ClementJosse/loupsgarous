import { reactive } from 'vue'

export const currentActiveState = reactive({
    state: '',
    setState(newState) {
        this.state = newState
        console.log("newState"+newState)
      },
    resetState(){
        this.state = ''
        console.log("newState"+'')
    }
})