<template>
    <div class="relative flex z-0 flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-center rounded-xl">
        <div class="absolute z-[-1] top-[clamp(0px,9vw,45px)] bottom-[clamp(0px,9vw,45px)] right-[clamp(0px,12vw,60px)] left-[clamp(0px,12vw,60px)] border-dashed border-disabled border-[clamp(0px,0.8vw,4px)] rounded-full"></div>
        <div v-if="firstItem"
            class="flex text-lg z-1 flex-row text-white font-semibold items-center bg-blue-background w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] mt-[clamp(0px,5vw,25px)] rounded-xl">
            {{ firstItem }}
        </div>
        <div v-else
            class="flex opacity-0 flex-row text-dark-background font-semibold items-center bg-dark-background w-min p-[clamp(0px,1vw,5px)] mt-[clamp(0px,5vw,25px)] rounded-xl">
            .
        </div>
        <div class="flex flex-row justify-between w-full px-[clamp(0px,5vw,25px)]">
            <div class="justify-items-start">
                <div v-for="(item, index) in leftColumn" :key="index"
                    class="text-white text-lg bg-blue-background font-semibold w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] m-[clamp(0px,2vw,10px)] rounded-xl my-[clamp(0px,8vw,40px)] ">
                    {{ item }}
                </div>
            </div>
            <div class="justify-items-end">
                <div v-for="(item, index) in rightColumn" :key="index"
                    class="text-white text-lg bg-blue-background font-semibold w-min p-[clamp(0px,1vw,5px)] px-[clamp(0px,3vw,15px)] m-[clamp(0px,2vw,10px)] rounded-xl my-[clamp(0px,8vw,40px)]">
                    {{ item }}
                </div>
            </div>
        </div>
        <div 
            class="flex opacity-0 flex-row text-dark-background font-semibold items-center bg-dark-background w-min p-[clamp(0px,1vw,5px)] mb-[clamp(0px,5vw,25px)] rounded-xl">
            '
        </div>
    </div>
</template>

<script>
export default {
    name: 'NonLinearList',
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        firstItem() {
            if (this.items.length % 2 === 1) {
                return this.items[0]
            }
            return null
        },
        remainingItems() {
            if (this.firstItem) {
                return this.items.slice(1)
            }
            return this.items
        },
        leftColumn() {
            const half = Math.ceil(this.remainingItems.length / 2)
            return this.remainingItems.slice(0, half)
        },
        rightColumn() {
            const half = Math.ceil(this.remainingItems.length / 2)
            return this.remainingItems.slice(half)
        }
    }
}
</script>