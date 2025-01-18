<template>
    <div class="flex flex-col bg-dark-background w-[clamp(0px,84vw,420px)] items-center rounded-xl">
      <div v-if="firstItem" class="flex flex-row text-white font-semibold items-center bg-blue-background w-min p-[clamp(0px,1vw,5px)] m-[clamp(0px,2vw,10px)] rounded-xl">
        {{ firstItem }}
      </div>
      <div class="flex flex-row justify-between w-full">
        <div class="justify-items-start">
          <div v-for="(item, index) in leftColumn" :key="index" class="text-white bg-blue-background w-min p-[clamp(0px,1vw,5px)] m-[clamp(0px,2vw,10px)] rounded-xl">
            {{ item }}
          </div>
        </div>
        <div class="justify-items-end">
          <div v-for="(item, index) in rightColumn" :key="index" class="text-white bg-blue-background w-min p-[clamp(0px,1vw,5px)] m-[clamp(0px,2vw,10px)] rounded-xl">
            {{ item }}
          </div>
        </div>
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
  