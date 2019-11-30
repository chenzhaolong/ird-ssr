<template>
    <div>
        <span class="a1">demo</span>
    </div>
</template>

<script>
    import {config} from "./module";

    export default {
        name: "index",

        data() {
            return {}
        },

        dynamicStore: config,

        preFetch(store, params) {

        }
    }
</script>

<style scoped>
    @import './index.css';
</style>