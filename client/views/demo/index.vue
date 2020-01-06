<template>
    <div>
        <span class="a1" @click="handle">demo1</span>
        <span class="a2" style="font-size: 12px">demo2</span>
    </div>
</template>

<script>
    import {config} from "./module";

    export default {
        name: "index",

        data() {
            return {}
        },

        methods: {
            handle() {
                console.log('here');
                console.log('this.$store', this.$store);
                this.$router.push('/demo/app1');
            }
        },

        dynamicStore: config,

        preFetch(store, params) {
            return Promise.resolve()
        }
    }
</script>

<style scoped>
    @import './index.css';
    .a2{
        color: bisque;
    }
</style>