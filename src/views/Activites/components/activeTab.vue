<template>
 <div class="active-tab">
    <span v-for="(item, index) in list" @click='iconSelect(item,index)' :key="index">
      <span class="material-icons mgnLeft icon-event" :style="{color: item.typeId === iconActive ? '#F86F54' : ''}">
        {{ item.icon }}
      </span>
    </span>
 </div>
</template>
<script>
export default {
  data() {
    return {
      iconActive: 0,
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    active: {
      type: Number,
      default: () => 0
    }
  },
  watch: {
    active: {
      handler(val){
        console.log(val,'watch')
        this.iconActive = val
      },
      immediate: true
    }
  },
  methods: {
    iconSelect(item, index) {
      this.iconActive = index
      this.$emit('change', item)
    },
  }
}
</script>
<style scoped lang="less">
.mgnLeft {
  margin-left: 1em;
}
</style>
