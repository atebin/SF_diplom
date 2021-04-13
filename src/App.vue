<template>
    <div id="app">
        <nav class="common-header_footer header">
            <div class="header-nav_main">
                <div 
                    class="header-nav_main-mobile"
                    @click="toggleStateNavMainExpand()"
                >
                    <img src="./assets/img/icon_menu.png" class="header-nav_main-icon_menu">
                    {{ globalSetting.currentPage }}
                </div>

                <div class="header-nav_main-desktop">
                    <div 
                        v-if="((globalSetting.isNavMainExpand) || (globalSetting.appWidth > 800))"
                        class="header-nav_main-menu" 
                        @click="eventClickLinkNav"
                    >
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
                </div>
            </div>
            <div class="header-nav_user">
                <button
                    v-if="!globalSetting.isAuth"
                    @click="openModal('signIn')"
                    class="header-nav_user-item"
                    title="Вход"
                >
                    <img src="./assets/img/icon_enter_v2_100.jpg" class="header-nav_user-item-icon">
                    <span class="header-nav_user-item-text">Вход</span>
                </button>
                <button
                    v-if="!globalSetting.isAuth"
                    @click="openModal('signUp', 'self')"
                    class="header-nav_user-item"
                    title="Регистрация"
                >
                    <img src="./assets/img/icon_registration_100.jpg" class="header-nav_user-item-icon">
                    <span class="header-nav_user-item-text">Регистрация</span>
                </button>
                <button
                    v-if="globalSetting.isAuth"
                    @click="exitAuth"
                    class="header-nav_user-item"
                    title="Выход"
                >
                    <img src="./assets/img/icon_exit_100.jpg" class="header-nav_user-item-icon">
                    <span class="header-nav_user-item-text">Выход</span>
                </button>

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
                :setProcessInWorkEnd="setProcessInWorkEnd"
                :officerApproved="officerApproved"

                :checkStatus="checkStatus"
                :approveCheckStatus="approveCheckStatus"

                :newCase="newCase"
                :textCustomerComment="modal.inputComment.success"
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

        <Modal
            v-if="modal.inputComment.visible"
            modalName='inputComment'
            :modalClose="setComment"
        >
            
            <template v-slot:main>
                <FormInputComment 
                    textLabel="Завершающий комментарий по этому велосипеду"
                    :setComment="setComment"
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
import FormInputComment from './components/FormInputComment.vue'

export default {
    name: 'App',
  
    components: {
        Modal,
        FormSignIn,
        FormSignUp,
        FormYesNo,
        FormInputComment,
    },

    data: () => {
        return {
            globalSetting: {
                clientId: CLIENT_ID,
                token: TOKEN,
                userId: '-',
                userFullName: '-',
                isAuth: false,
                //isConnectedServer: false,
                bikeSettings: {
                    statuses: ['new', 'in_progress', 'done'],
                    status_end: 'done',
                    types: ['sport', 'general'],
                },
                currentPage: 'test',
                isNavMainExpand: false,
                appWidth: 1200,
            },
            inWork: {
                addOfficer: false,
                deleteOfficer: false,
                approveOfficer: false,
                editOfficer: false,

                addCase: false,
                deleteCase: false,
                editCase: false,
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
                },
                inputComment: {
                    visible: false,
                    mode: '',
                    error: '',
                    success: '',
                },
            }           
        }
    },

    methods: {

        resizeAppWidth(event) { 
            this.setAppWidth(event.currentTarget.innerWidth);      
        },

        setAppWidth(newValue) {
            this.globalSetting.appWidth = newValue;
        },

        toggleStateNavMainExpand() {
            this.setStateNavMainExpand(!this.globalSetting.isNavMainExpand);
        },

        setStateNavMainExpand(newValue) {
            this.globalSetting.isNavMainExpand = newValue;
        },

        eventClickLinkNav() {

            let currentRouteCode = this.$router.history.current.fullPath;
            let allRoute = this.$router.options.routes;

            allRoute.forEach(elem => {
                if (elem.path === currentRouteCode) {
                    this.globalSetting.currentPage = elem.text;
                }
            })

            if (this.globalSetting.isNavMainExpand) {                
                this.toggleStateNavMainExpand();
            }            
        },

        // application
        openModal(modalName, mode = 'std') {
            this.modal[modalName].visible = true;
            this.modal[modalName].mode = mode;
            this.modal[modalName].success = "";
            this.modal[modalName].error = "";
       },

        modalClose(modalName) {
            console.log(modalName);
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

        setProcessInWorkEnd(processName) {
            this.inWork[processName] = false;
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
                console.log('*****************************');
                console.log('auth');
                console.log(response);
                console.log('*****************************');

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
                    this.globalSetting.token = response.data.token;
                    this.globalSetting.userId = response.data._id;
                    this.globalSetting.userFullName = `${response.data.firstName} ${response.data.lastName}`;
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

                this.inWork.addOfficer = false;
            })
            .catch(() => {
                this.modal['signUp'].error = 'Ошибка! Проверьте введенные данные';
            });
        },

        // ***** cases
        newCase(dataCase) {
            console.log('dataCase');
            console.log({ dataCase });

            if (this.globalSetting.isAuth) {
                let authDataCase = {
                    //clientId: dataCase.clientId,
                    color: dataCase.color,
                    createdAt: dataCase.createdAt,
                    date: dataCase.date,
                    description: dataCase.description,
                    licenseNumber: dataCase.licenseNumber,
                    ownerFullName: dataCase.ownerFullName,
                    resolution: dataCase.resolution,
                    status: dataCase.status,
                    type: dataCase.type,
                    updateAt: dataCase.updateAt,
                    officer: this.globalSetting.userId,
                }

                this.axiosSetting.connectionApiAuth.post('api/cases', authDataCase)
                .then(() => {
                    console.log('inWork.addCase: ' + this.inWork.addCase);
                    //this.inWork.addCase = false;
                    this.setProcessInWorkEnd('addCase');
                    console.log('inWork.addCase: ' + this.inWork.addCase);
                })
                .catch(() => {
                    console.log('Ошибка авторизованного добавления данных о краже! Проверьте введенные данные');
                });

                return;
            }

            this.axiosSetting.connectionApiNoAuth.post('api/public/report', dataCase)
            .then(() => {
                //this.inWork.addCase = false;
                this.setProcessInWorkEnd('addCase');
            })
            .catch(() => {
                console.log('Ошибка неавторизованного добавления данных о краже! Проверьте введенные данные');
            });
        },

        officerDelete(id) {            

            this.axiosSetting.connectionApiAuth.delete('api/officers/' + id)
            .then(() => {
                this.inWork.deleteOfficer = false;
            })
            .catch(() => {
                console.log('Ошибка удаления пользователя!');
            });
        },

        officerApproved(dataApproved, mode = 'approveOfficer') {

            this.axiosSetting.connectionApiAuth.put('api/officers/' + dataApproved._id, dataApproved)
            .then(() => {
                switch (mode) {
                    case 'approveOfficer':
                        this.inWork.approveOfficer = false;
                        break;
                    case 'editOfficer':
                        this.inWork.editOfficer = false;
                        break;
                }
            })
            .catch(() => {
                 switch (mode) {
                    case 'approveOfficer':
                        this.inWork.approveOfficer = false;
                        console.log('Ошибка подтверждения пользователя!');
                        break;
                    case 'editOfficer':
                        this.inWork.editOfficer = false;
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

        setComment(status = '', comment = '-') {
            this.checkStatus = '';

            this.$nextTick(() => {

                this.checkStatus = status;//(status === 'ok' ? status : 'no');
                this.modal['inputComment'].success = comment;
                this.modal['inputComment'].visible = false;
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

        window.addEventListener('popstate', this.eventClickLinkNav);
        this.eventClickLinkNav();
        
        //this.systemSignIn();
        //this.systemSignIn();
    },

    mounted() {

        //let www = window.innerWidth;
        //console.log(www);
        this.setAppWidth(window.innerWidth);
        window.addEventListener('resize', this.resizeAppWidth);
        this.globalSetting.isNavMainExpand = false;
    }


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
        padding: 12px 10px;
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

    .header-nav_main {
        position: relative;
    }

    .header-nav_main-mobile{
        display: none;
        width: 160px;
        padding: 5px 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 13px;
    }

    .header-nav_main-desktop {
        display: block;
    }

    .header-nav_main-icon_menu {
        height: 16px;
        margin-right: 15px;
    }

    .header-nav_main-menu {
        min-width: 174px;
    }

    .header-nav_main-item{
        color: #555;
        font-weight: 600;
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: all 0.15s linear 0s;
        padding: 5px 5px;
        /*border: 1px solid #ddd;*/
    }

    .header-nav_main-item:hover{
        color: #333;
        border-bottom-color: #333;
    }

    .header-nav_main-item:not(:last-child){
        margin-right: 20px;
    }

    .router-link-active {
        color: #393;/*  333  */
        border-bottom-color: #393;
    }

    /* ----- */

    .header-nav_user {
        display: flex;
        align-items: center;
    }

    .header-nav_user-item {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        /*border-style: solid;*/
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 2px 5px;
    }

    .header-nav_user-item:not(:last-child){
        margin-right: 10px;
    }

    .header-nav_user-item:hover {
        color: #555;
        border: 1px solid #999;
    }

    .header-nav_user-item-icon {
        width: 20px;
        margin-right: 10px;
    }

    .header-nav_user-item-text {
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

    @media screen and (max-width: 1100px) {

        .common-header_footer {
            font-size: 14px;
        }
    }

    @media screen and (max-width: 800px) {

        .header-nav_main-mobile{
            display: flex;
        }

        .header-nav_main-desktop{
            position: absolute;
            background-color: #fcfcfc;
            z-index: 2;
            left: 3px;

        }

        .header-nav_main-menu {
            display: flex;
            flex-direction: column;
        }

        .header-nav_main-item{
            border: 1px solid #ddd;
            height: 36px;
            padding: 2px 10px;

            display: flex;
            justify-content: center;
            align-items: center;
        }

        .header-nav_main-item:not(:last-child){
            margin-right: 0;
            border-bottom: none;
        }
    }

    @media screen and (max-width: 600px) {
        .header-nav_user-item-text {
            display: none;
        }

        .header-nav_user-item-icon {
            margin-right: 0;
        }
    }





</style>
