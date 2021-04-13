<template>
    <section v-if="globalSetting.isAuth">
        <h1 class="title">Редактирование информации о сотруднике</h1>

        <div class="nav-bar">
            <button 
                class="nav-item"
                @click="gotoAllOfficers"
            >Полный список сотрудников</button>
        </div>

        <form class="form">
            <div class="field-set">
                <label class="field-label" for="field-email">Email:</label>
                <input class="field-input" type="email" id="field-email" name="email" value="" placeholder="name@site.com" v-model="officerData.email">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-first_name">Имя:</label>
                <input class="field-input" type="text" id="field-first_name" name="firstName" value="" placeholder="Алексей" v-model="officerData.firstName">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-last_name">Фамилия:</label>
                <input class="field-input" type="text" id="field-last_name" name="lastName" value="" placeholder="Николаев" v-model="officerData.lastName">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-password">Пароль:</label>
                <input class="field-input" type="password" id="field-password" name="password" value="" placeholder="*********" v-model="officerData.password">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-repassword">Повтор пароля:</label>
                <input class="field-input" type="password" id="field-repassword" name="repassword" value="" placeholder="*********" v-model="repassword">
            </div>
        </form>

        <div class="nav-bar">
            <button 
                class="nav-item"
                @click="editOfficerData"
            >Обновить данные</button>

            <div class="error">{{errorText}}</div>
            <div class="success">{{successText}}</div>
        </div>
    </section>
</template>

<script>
//import FormSignUp2 from '../components/FormSignUp.vue'

export default {
    name: 'OfficerDetail',

    component: {
        //FormSignUp
    },

    data: () => {
        return {
            officerData: {},
            repassword: '',
            errorText: '',
            successText: '',
        }
    },

    props: {
        globalSetting: Object,
        setProcessInWork: Function,
        officerApproved: Function,
        inWork: Object,
    },

    methods: {
        gotoAllOfficers() {
            this.$router.push({ path: '/officers'});
        },

        editOfficerData() {

            this.errorText = '';
            this.successText = '';
            if (this.officerData.password !== this.repassword) {
                this.errorText = 'Пароль и его повтор не совпадают';
                return;
            }

            this.setProcessInWork('editOfficer');
            this.officerApproved(this.officerData, 'editOfficer');
        },
    },

    watch: {
        'globalSetting.isAuth': function(value) {
            if (!value) {
                this.$router.push({ path: '/home'});
            }
        },

        'inWork.editOfficer': function(value, preventValue) {
            if (value === false && preventValue === true) {
                this.successText = 'Данные успешно обновлены!';
            }
        },

        repassword: function() {
            this.errorText = '';
        },
        'officerData.password': function() {
            this.errorText = '';
        },
    },

    created() {
        if (!this.globalSetting.isAuth) {
            this.$router.push({ path: '/home'});
        }

        //this.officerData.id = this.$route.params.id;
        this.officerData = this.$route.params.officerData;
    },
}
</script>

<style scoped>
    .form {
        display: grid;
        grid-template-columns: auto;
        row-gap: 10px;
        margin: 0 auto 20px;
        width: 50%;
        min-width: 300px;
    }

    .nav-bar {
        margin: 40px 0;
    }

    .footer {
        display: flex;
        justify-content: center;
    }

    .field-set {
        display: flex;
        align-content: center;
    }

    .field-label {
        margin-right: 20px;
        display: inline-block;
        white-space: nowrap;
    }

    .field-input {
        display: block;
        flex-grow: 50;
        min-width: 10px;
    }

    .error {
        margin: 20px 0;
        color: red;
        text-align: center;
    }

    .success {
        margin: 20px 0;
        color: green;
        text-align: center;
    }
    
</style>