<template>
    <FormCase 
        class="home-form"
        :globalSetting="globalSetting"
        mode="add"
    />
</template>

<script>
    import FormCase from '../components/FormCase.vue'

    export default {
        name: 'Notice',

        components: {
            FormCase,
        },

        props: {
            newCaseMode: String,
            //isAuth: Boolean,
            globalSetting: Object,
        }
        
    }
</script>

<style scope>

    .home-form{
        width: 50%;
        margin: 80px auto;
    }

</style>