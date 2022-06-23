<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2021-09-06 11:46:36
 * @LastEditors: Lone
 * @LastEditTime: 2021-09-06 14:45:08
-->
<template>
  <div 
    v-show="isSelected"
    class="tab__pane"
    >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'tab',
  props: {
    title: String,
  },
  data() {
    return {
      parent: null,
    };
  },
  computed: {
    index() {
      return this.parent.tabs.indexOf(this);
    },
    isSelected() {
      return this.index === this.parent.curActive;
    },
  },
  watch: {
    title() {
      this.parent.setLine();
    }
  },
  methods: {
    findParent(name) {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name === name) {
          this.parent = parent;
          break;
        }
        parent = parent.$parent; // 多层嵌套
      }
    },
  },
  created() {
    this.findParent('tabs');
  },
  mounted() {
    const { tabs } = this.parent;
    const index = this.parent.$slots.default.indexOf(this.$vnode);
    tabs.splice(index === -1 ? tabs.length : index, 0, this);
  },
  beforeDestroy() {
    this.parent.tabs.splice(this.index, 1);
  },
};
</script>

<style>
.tab__pane {
  /* margin-top: 3px; */
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  text-shadow: 0 0 0.25px currentColor;
  min-height: 100px;
  -webkit-box-shadow: -2px 0 8px rgb(0 0 0 / 10%),2px 0 10px -5px rgb(0 0 0 / 10%);
  box-shadow: -2px 0 8px rgb(0 0 0 / 10%),2px 0 10px -5px rgb(0 0 0 / 10%);
  /* -webkit-box-shadow: -5px 5px 10px -4px rgb(0 0 0 / 10%),5px 5px 10px -4px rgb(0 0 0 / 10%);
  box-shadow: -5px 5px 10px -4px rgb(0 0 0 / 10%),5px 5px 10px -4px rgb(0 0 0 / 10%); */
  /* z-index: 2; */
  padding: 20px;
}
</style>