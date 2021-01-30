<template>
    <div id="app">
        <nav class="common-header_footer header">
            <div class="header-nav_main">
                <router-link 
                    to="/home" 
                    class="header-nav_main-item"
                >Главная</router-link>
                <router-link 
                    to="/notice" 
                    class="header-nav_main-item"
                >Сообщить о краже</router-link>
                <router-link 
                    to="/cases" 
                    class="header-nav_main-item"
                    v-if="globalSetting.isAuth"
                >Украденные велосипеды</router-link>
                <router-link 
                    to="/officers" 
                    class="header-nav_main-item"
                    v-if="globalSetting.isAuth"
                >Ответственные сотрудники</router-link>
            </div>
            <div class="header-nav_user">
                <button
                    v-if="!globalSetting.isAuth"
                    @click="openModal('signIn')"
                    class="header-nav_user-item"
                >Вход</button>
                <button
                    v-if="!globalSetting.isAuth"
                    @click="openModal('signUp', 'self')"
                    class="header-nav_user-item"
                >Регистрация</button>
                <button
                    v-if="globalSetting.isAuth"
                    @click="exitAuth"
                    class="header-nav_user-item"
                >Выход</button>
            </div>
        </nav>

        <div class="inner">
            <router-view 
                :globalSetting="globalSetting"
                :axiosSetting="axiosSetting"
                :officerDelete="officerDelete"

                :openModal="openModal"
                :inWork="inWork"
                :setProcessInWork="setProcessInWork"
                :officerApproved="officerApproved"

                :checkStatus="checkStatus"
                :approveCheckStatus="approveCheckStatus"
            ></router-view>
        </div>

        <div class="common-header_footer footer">
            <!--div class="informer">Информер 1</div-->
        </div>

        <Modal
            v-if="modal.signIn.visible"
            modalName='signIn'
            :modalClose="modalClose"
        >
            
            <template v-slot:main>
                <FormSignIn 
                    :modalClose="modalClose"
                    :userSignIn="userSignIn"
                    :formErrorText="modal['signIn'].error"
                    :formSuccessText="modal['signIn'].success"
                />
            </template>
        </Modal>

        <Modal
            v-if="modal.signUp.visible"
            modalName='signUp'
            :modalClose="modalClose"
        >
            
            <template v-slot:main>
                <FormSignUp 
                    :modalClose="modalClose"
                    :officerSignUp="officerSignUp"
                    :clientId="globalSetting.clientId"
                    :formErrorText="modal['signUp'].error"
                    :formSuccessText="modal['signUp'].success"
                    :modalMode="modal['signUp'].mode"
                />
            </template>
        </Modal>

        <Modal
            v-if="modal.yesNo.visible"
            modalName='yesNo'
            :modalClose="setCheckStatus"
        >
            
            <template v-slot:main>
                <FormYesNo 
                    :modalMode="modal['yesNo'].mode"
                    :setCheckStatus="setCheckStatus"
                />
            </template>
        </Modal>

  </div>
</template>

<script>
const HOST_AND_PORT_FOR_API = 'http://84.201.129.203:8888/';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHByb3ZlZCI6dHJ1ZSwiX2lkIjoiNWZhNmYxNDYwYmQ3NTkwMDExZjNhODc4IiwiZW1haWwiOiJ0ZXN0MUBhdGViaW4ucnUiLCJmaXJzdE5hbWUiOiJmbl90ZXN0MSIsImxhc3ROYW1lIjoibG5fdGVzdDEiLCJjbGllbnRJZCI6InExdzIiLCJfX3YiOjAsImlhdCI6MTYwNDc3ODQ5OH0.Fw5rzKIYLluxF-knlq928Qal8kfyZYt2_XTdhcSsOQY';
const CLIENT_ID = 'q1w2';

import axios from 'axios'
import Modal from './components/Modal.vue'
import FormSignIn from './components/FormSignIn.vue'
import FormSignUp from './components/FormSignUp.vue'
import FormYesNo from './components/FormYesNo.vue'
//import OfficerDetail from './views/OfficerDetail.vue'

export default {
    name: 'App',
  
    components: {
        Modal,
        FormSignIn,
        FormSignUp,
        FormYesNo,
        //OfficerDetail,
    },

    data: () => {
        return {
            globalSetting: {
                clientId: CLIENT_ID,
                token: TOKEN,
                isAuth: false,
                //isConnectedServer: false,
            },
            inWork: {
                add: false,
                delete: false,
                approve: false,
                edit: false,
            },
            checkStatus: '',
            axiosSetting: {
                hostAndPortForApi: HOST_AND_PORT_FOR_API,
                connectionApiNoAuth: null,
                connectionApiAuth: null,
            },
            modal: {
                signIn: {
                    visible: false,
                    mode: '',
                    error: '',
                    success: '',
                },
                signUp: {
                    visible: false,
                    mode: '',
                    error: '',
                    success: '',
                },
                yesNo: {
                    visible: false,
                    mode: '',
                    error: '',
                    success: '',
                }
            }           
        }
    },

    methods: {

        // application
        openModal(modalName, mode = 'std') {
            this.modal[modalName].visible = true;
            this.modal[modalName].mode = mode;
        },

        modalClose(modalName) {
            this.modal[modalName].visible = false;
            this.modal[modalName].mode = '';
            this.modal[modalName].error = '';
            this.modal[modalName].success = '';
        },

        exitAuth() {
            this.globalSetting.isAuth = false;
        },

        setProcessInWork(processName) {
            this.inWork[processName] = true;
        },

        // ***** system
        systemSignUp() {
            /*
            let dataSystemSignUp = {
                email: 'test1@atebin.ru',
                firstName: 'Александр',
                lastName: 'Тебин',
                password: '123_atebin',
                repassword: '123_atebin',
                clientId: 'q1w2',
            }      

            const connectionApiNoAuth = axios.create({
                baseURL: HOST_AND_PORT_FOR_API,
                timeout: 0,
                headers: {
                    'Content-type': 'application/json',
                }
            });

            connectionApiNoAuth.post('api/auth/sign_up', dataSystemSignUp)
            .then(response => {
                console.log('Получены регистрационные данныет для первого пользователя: ' + response);
            })
            .catch(() => {
                console.log('Ошибка создания первого пользователя! Проверьте регистрационные данные.');
            });
            */
        },

        systemSignIn() {
            /*
            let dataSystemSignIn = {
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

            connectionApiNoAuth.post('api/auth/sign_in', dataSystemSignIn)
            .then(response => {

                console.log(response);

                let errorTokenOrClienId = false;
                if (response.data.token === '') {
                    errorTokenOrClienId = true;
                    console.log('Получен пустой токен!');
                }

                if (this.globalSetting.clientId !== response.data.clientId) {
                    errorTokenOrClienId = true;
                    console.log('Получен некорректный clientId: ' + response.data.clientId);
                }

                if (!errorTokenOrClienId) {
                    this.globalSetting.isConnectedServer = true;
                    this.globalSetting.token = response.data.token;
                }
            })
            .catch(() => {
                console.log('Ошибка входа в систему! Проверьте регистрационные данные.');
            });
            */
        },

        // ***** user
        userSignIn(dataSignIn) {

            console.log('modalSignIn');
            console.log(dataSignIn);

            this.axiosSetting.connectionApiNoAuth.post('api/auth/sign_in', dataSignIn)
            .then(response => {

                let errorTokenOrClienId = false;
                if (response.data.token === '') {
                    errorTokenOrClienId = true;
                    this.modal['signIn'].error = 'Ошибка! Пустой токен.';
                    console.log('Получен токен: ' + response.data.token);
                }

                if (this.globalSetting.clientId !== response.data.clientId) {
                    errorTokenOrClienId = true;
                    this.modal['signIn'].error = 'Ошибка! Получен неверный clientId.';
                    console.log('Получен токен: ' + response.data.clientId);
                }

                if (!errorTokenOrClienId) {
                    this.globalSetting.token = response.data.token
                    this.globalSetting.isAuth = true;
                    this.modal['signIn'].error = '';
                    this.modal['signIn'].visible = false;
                }
            })
            .catch(() => {
                this.modal['signIn'].error = 'Ошибка при входе в систему! Проверьте введенные данные';
            });

        },

        // ***** officers
        officerSignUp(dataSignUp, repassword) {
            if (dataSignUp.password !== repassword) {
                this.modal['signUp'].error = 'Пароль и его повтор не совпадают!';
                return;
            }

            this.axiosSetting.connectionApiAuth.post('api/officers', dataSignUp)
            .then(() => {
                this.modal['signUp'].error = '';
                switch (this.modal['signUp'].mode) {
                    case 'self':
                        this.modal['signUp'].success = 'Поздравляем! Вы успешно зарегистрировались в сервисе поиска велосипедов.\r\n';
                        this.modal['signUp'].success += 'Работать в системе вы сможете после подтверждения вашей учетной записи.';
                        break;
                    case 'user':
                        this.modal['signUp'].success = 'Вы успешно зарегистрировали подтвердили сервисе поиска велосипедов ';
                        this.modal['signUp'].success += 'нового ответственного сотрудника. С текущего момента он может ';
                        this.modal['signUp'].success += 'полноценно работать в сисистеме.';
                        break;
                }

                this.inWork.add = false;
            })
            .catch(() => {
                this.modal['signUp'].error = 'Ошибка! Проверьте введенные данные';
            });
        },

        checkOfficerDelete() {

        },

        officerDelete(id) {            

            this.axiosSetting.connectionApiAuth.delete('api/officers/' + id)
            .then(() => {
                this.inWork.delete = false;
            })
            .catch(() => {
                console.log('Ошибка удаления пользователя!');
            });
        },

        officerApproved(dataApproved, mode = 'approve') {

            this.axiosSetting.connectionApiAuth.put('api/officers/' + dataApproved._id, dataApproved)
            .then(() => {
                switch (mode) {
                    case 'approve':
                        this.inWork.approve = false;
                        break;
                    case 'edit':
                        this.inWork.edit = false;
                        break;
                }
            })
            .catch(() => {
                 switch (mode) {
                    case 'approve':
                        this.inWork.approve = false;
                        console.log('Ошибка подтверждения пользователя!');
                        break;
                    case 'edit':
                        this.inWork.edit = false;
                        console.log('Ошибка обновления данных пользователя!');
                        break;
                }
            });
        },

        approveCheckStatus(mode) {
            this.openModal('yesNo', mode);
        },

        setCheckStatus(status) {
            //console.log('----------');
            //console.log('checkStatus: ' + this.checkStatus);
            this.checkStatus = '';
            //console.log('checkStatus: ' + this.checkStatus);

            this.$nextTick(() => {

                //console.log('status: ' + status);
                this.checkStatus = (status === 'yes' ? status : 'no');
                //console.log('checkStatus: ' + this.checkStatus);
                //console.log('----------');
                this.modal['yesNo'].visible = false;
            })
        },
    },

    created() {

        this.axiosSetting.connectionApiNoAuth = axios.create({
            baseURL: this.axiosSetting.hostAndPortForApi,
            timeout: 0,
            headers: {
                'Content-type': 'application/json',
            }
        });

        this.axiosSetting.connectionApiAuth = axios.create({
            baseURL: this.axiosSetting.hostAndPortForApi,
            timeout: 0,
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${this.globalSetting.token}`,
            }
        });
        
        //this.systemSignIn();
        //this.systemSignIn();
    },
}
</script>

<style scoped>
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

    /* HEADER - FOOTER */
    .common-header_footer{
        box-sizing: border-box;
        margin: 0;
        padding: 12px 20px;
        font-size: 16px;
        line-height: 1;
        height: calc(10px + 20px + 10px);
        background-color: #fcfcfc;
    }

    /* HEADER */
    .header{
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-nav_main-item{
        color: #555;
        font-weight: 600;
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: all 0.15s linear 0s;
    }

    .header-nav_main-item:hover{
        color: #333;
        border-bottom-color: #333;
    }

    .header-nav_main-item:not(:last-child){
        margin-right: 20px;
    }

    .router-link-active {
        color: #333;
        border-bottom-color: #333;
    }

    /* ----- */

    .header-nav_user {
        display: flex;
        align-items: center;
    }

    .header-nav_user-item {
        cursor: pointer;
    }

    .header-nav_user-item:not(:last-child){
        margin-right: 10px;
    }

    /* INNER */
    .inner{
        box-sizing: border-box;
        background-color: #fff;
        padding: 20px;
        margin: 0;
        min-height: calc(100vh - 2 * 40px);
    }

    /* FOOTER */
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
