<template>
    <div>
        <p @click="handle">
            点击到demo1-{{a}}-{{b}}
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
            },
            b(st) {
                return st.demo.b;
            }
        }),
        methods: {
            handle() {
                this.$router.push('/demo/app');
            }
        },
        preFetch(store, params) {
            return store.dispatch('changeDemoA', 'ok');
        }
    }
</script>

<style scoped>

</style>