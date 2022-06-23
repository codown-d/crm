<template>
    <div class="note-form">
        <tinymce ref="tinymce" v-model="content" :height="height" />
    </div>
</template>
<script>
import Tinymce from '@/components/Common/Tinymce/index.vue'
export default {
    components: {
        Tinymce,
    },
    data() {
        return {
            content: '',
        }
    },
    props: {
        height: {
            type: Number,
            default: () => 350,
        },
        setContent: {
            type: String,
            default: '',
        },
    },

    watch: {
        setContent: {
            immediate: true,
            handler(val, oldVal) {
                console.log(this.$refs, 'this.$refs.tinymce')
                this.content = val
            },
        },
    },
    methods: {
        getFormVal() {
            return this.content
        },
        resetForm() {
            this.content = ''
            this.$refs.tinymce.setContent('')
        },
    },
}
</script>
<style scoped lang="less">
.note-form {
    // width: 100%;
    // height: 600px;
}
</style>
