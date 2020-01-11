<template>
    <div>
        <p @click="handle">
            点击到de0mo
        </p>
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