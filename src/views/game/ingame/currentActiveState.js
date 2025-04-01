import { reactive } from 'vue'

export const currentActiveState = reactive({
    state: '',
    setState(newState) {
        this.state = newState
      },
    resetState(){
        this.state = ''
    }
})