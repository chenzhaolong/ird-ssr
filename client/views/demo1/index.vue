<template>
    <div>
        <p @click="handle">
            点击到demo1-{{a}}
        </p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "index",
        data() {
            return {};
        },
        computed: mapState({
            a(st) {
                return st.a + 'ok';
            }
        }),
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