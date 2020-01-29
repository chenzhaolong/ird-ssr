<template>
    <div>
        <span class="a1" @click="handle">
            demo
        </span>
        <span class="a2" style="font-size: 12px">
            demo
        </span>
    </div>
</template>

<script>

    export default {
        name: "index",

        data() {
            return {}
        },

        methods: {
            handle() {
                console.log('this.$store', this.$store);
                this.$router.push('/demo/app1');
            }
        },

        preFetch(store, params) {
            store.commit('change', 10);
            console.log('here');
            return Promise.resolve()
        },
    }
</script>

<style scoped>
    @import './index.css';
    .a2{
        color: bisque;
    }
</style>