<template>
    <div class="active-tab">
        <span v-for="(item, index) in list" @click="iconSelect(item, index)" :key="index">
            <span class="material-icons mgnLeft icon-event" :style="{ color: index === iconActive ? '#F86F54' : '' }">
                {{ item.icon }}
            </span>
        </span>
    </div>
</template>
<script>
import Services from '@/services/common.js'

export default {
    data() {
        return {
            iconActive: 0,
            list: [],
        }
    },
    props: {
        active: {
            type: [Number, String],
            default: () => 0,
        },
    },
    watch: {
        active: {
            handler(val) {
                this.iconActive = val
            },
            immediate: true,
        },
    },
    created() {
        this.searchActiveType()
    },
    methods: {
        searchActiveType() {
            Services.searchActiveType({ param: {} }).then((res) => {
                this.list = res.data || []
            })
        },
        iconSelect(item, index) {
            this.iconActive = index
            this.$emit('change', item)
            this.$emit('input', index)
        },
    },
}
</script>
<style scoped lang="less">
.mgnLeft {
    margin-left: 1em;
}
</style>
