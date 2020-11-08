<template>
    <div class="home">
        <h1>Сообщи о краже вилосипеда!</h1>
        <div class="home-wrapper">
            <img class="home-logo" src="../assets/img/main.jpg" alt="Лого сервиса">
            <FormCase 
                class="home-form"
                :globalSetting="globalSetting"
                mode="add"
            />
        </div>
    </div>
</template>

<script>
    import FormCase from '../components/FormCase.vue'

    export default {
        name: 'Home',

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

    .home h1{
        margin: 80px 0px;
        color: #555;
    }

    .home-wrapper{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .home-logo{
        width: calc((100% - 120px) / 2);
        opacity: 0.85;
    }

    .home-form{
        width: calc((100% - 120px) / 2);
    }

</style>