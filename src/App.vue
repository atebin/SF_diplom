<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        

        <div class="header">
            <div class="header-nav">
                <router-link to="/home">Главная</router-link>
                <router-link to="/cases">Украденные велосипеды</router-link>
                <router-link to="/officers">Ответственные сотрудники</router-link>
                <router-link to="/testapi">Test API</router-link>
            </div>
            <div class="header-user">

            </div>
        </div>

        <router-view class="inner"></router-view>

  </div>
</template>

<script>

//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    //HelloWorld
  }
}
</script>

<style>
    #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    }

    .header{
        background-color: #eee;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .inner{
        background-color: #de3;
        padding: 20px;
        
    }

</style>
