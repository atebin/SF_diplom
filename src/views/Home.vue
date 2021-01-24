<template>
    <div class="home">
        <h1 class="home-title">Сервис для поиска велосипедов</h1>
        <p class="home-message">
            Если у вас украли велосипед, сообщите об этом!
        </p>
        <button class="home-new-case" @click="eventClickNewNotice">Сообщить о краже</button>
        <img class="home-image" src="../assets/img/main.jpg" alt="Лого сервиса">
        <p class="home-for-officer">
            Для доступа сотрудников к сервису необходимо авторизоваться.
        </p>
    </div>
</template>

<script>
export default {

    methods: {
        eventClickNewNotice() {
            this.$router.push({ path: 'notice' });
        }
    }

}
</script>

<style>

    .home {
        margin: 80px auto;
        width: 80%;
    }

    .home-title{
        margin: 80px 0 40px;
        color: #555;
    }

    .home-image{
        width: 40%;
        opacity: 0.85;
        margin: 40px auto;
    }

    .home-message {
        font-size: 20px;
        color: #333;
    }

    .home-for-officer {
        font-size: 16px;
        color: #555;
    }

    .home-new-case {
        display: block;
        background-color: red;
        color: #fff;
        padding: 10px 40px;
        margin: 20px auto 40px;
        outline-color: red;
    }
</style>