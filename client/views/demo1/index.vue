<template>
    <div>
        <div @click="handle">
            点击到demo
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {};
        },
        methods: {
            handle() {
                this.$router.push('/demo/app');
            }
        },
        preFetch(store, params) {
            return Promise.resolve()
        }
    }
</script>

<style scoped>

</style>