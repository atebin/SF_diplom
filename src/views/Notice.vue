<template>
    <FormCase 
        class="home-form"
        :globalSetting="globalSetting"
        mode="add"
        :newCase="newCase"
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
            newCase: Function,
        }
        
    }
</script>

<style scope>

    .home-form{
        width: 50%;
        margin: 80px auto;
    }

@media screen and (max-width: 768px) {

    .home-form{
        width: 80%;
    }
}

</style>