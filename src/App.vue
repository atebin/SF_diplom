<template>
    <div id="app">
        <div class="common-hf header">
            <div class="header-nav">
                <router-link 
                    to="/home" 
                    class="header-nav-item"
                >Сообщить</router-link>
                <router-link 
                    to="/cases" 
                    class="header-nav-item"
                    v-if="globalSetting.isAuth"
                >Украденные велосипеды</router-link>
                <router-link 
                    to="/officers" 
                    class="header-nav-item"
                    v-if="globalSetting.isAuth"
                >Ответственные сотрудники</router-link>
                <router-link 
                    to="/testapi" 
                    class="header-nav-item"
                >Test API</router-link>
            </div>
            <div class="header-user">
                <button
                    @click="eventClickButtonSignIn"
                >Авторизоваться</button>
            </div>
        </div>

        <div class="inner">
            <router-view 
                :globalSetting="globalSetting"
            ></router-view>
        </div>

        <div class="common-hf footer">
            <div class="informer">Информер 1</div>
            <div class="informer">Информер 2</div>
            <div class="informer">Информер 3</div>
        </div>

  </div>
</template>

<script>
    const HOST_AND_PORT_FOR_API = 'http://84.201.129.203:8888/';

    import axios from 'axios'
//import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
  
    components: {
        //HelloWorld
    },

    data: () => {
        return {
            globalSetting: {
                clientId: '',
                token: '',
                isAuth: false,
            },            
        }
    },

    methods: {
        eventClickButtonSignIn() {

            let dataUserSignIn = {
            email: 'test1@atebin.ru',
            password: '123_atebin',
            };     

            const connectionApiNoAuth = axios.create({
                baseURL: HOST_AND_PORT_FOR_API,
                timeout: 0,
                headers: {
                    'Content-type': 'application/json',
                }
            });

            connectionApiNoAuth.post('api/auth/sign_in', dataUserSignIn)
            .then(response => {
                let resp = response.data;
                console.log('post: api/auth/sign_in');
                console.log(resp);
                console.log(resp.token);
                console.log('---------------------------');

                this.globalSetting.token = response.data.token;
                this.globalSetting.clientId = response.data.clientId;
                this.globalSetting.isAuth = true;
            })
            .catch(err => {
                console.log('post: api/auth/sign_in');
                console.log(err);
                console.log('===========================');      
            });

        },
    },
}
</script>

<style>
    body {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .common-hf{
        box-sizing: border-box;
        margin: 0;
        padding: 12px 20px;
        font-size: 16px;
        line-height: 1;
        height: calc(10px + 20px + 10px);
        background-color: #fcfcfc;
    }

    .header{
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-nav-item{
        color: #555;
        font-weight: 600;
        text-decoration: none;
    }

    .header-nav-item:not(:last-child){
        margin-right: 20px;
    }

    .inner{
        box-sizing: border-box;
        background-color: #fff;
        padding: 20px;
        margin: 0;
        min-height: calc(100vh - 2 * 40px);
    }

    .footer{
        display: flex;
        justify-content: flex-start;
        /*
        padding: 20px;
        background-color: #fcfcfc;
        */
        border-top: 1px solid #eee;
    }

</style>
