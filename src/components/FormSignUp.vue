<template>
  <form class="form">
        <div class="main">
            <div class="field-set">
                <label class="field-label" for="field-email">Ваш логин (email):</label>
                <input class="field-input" type="email" id="field-email" name="email" value="" placeholder="name@site.com" v-model="formData.email">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-first_name">Ваше имя:</label>
                <input class="field-input" type="text" id="field-first_name" name="firstName" value="" placeholder="Алексей" v-model="formData.firstName">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-last_name">Ваша фамилия:</label>
                <input class="field-input" type="text" id="field-last_name" name="lastName" value="" placeholder="Николаев" v-model="formData.lastName">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-password">Ваш пароль:</label>
                <input class="field-input" type="password" id="field-password" name="password" value="" placeholder="*********" v-model="formData.password">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-repassword">Повтор пароля:</label>
                <input class="field-input" type="password" id="field-repassword" name="repassword" value="" placeholder="*********" v-model="repassword">
            </div>
        </div>

        <div 
            v-if="formErrorText !== ''"
            class="error"
        >{{ formErrorText }}</div>

        <div 
            v-if="formSuccessText !== ''"
            class="success"
        >{{ formSuccessText }}</div>

        <div 
            v-if="formSuccessText === ''"
            class="footer"
        >
            <button @click.prevent="officerSignUp(formData, repassword)">Зарегистрироваться</button>
        </div>

        <div 
            v-if="formSuccessText !== ''"
            class="footer"
        >
            <button @click.prevent="modalClose('signUp')">Ок</button>
        </div>  </form>
</template>

<script>
export default {
    name: 'FormSignUp',

    props: {
        modalClose: Function,
        officerSignUp: Function,
        formErrorText: String,
        formSuccessText: String,
        clientId: String,
    },

    data: () => {
        return {
            formData: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                //repassword: '',
                approved: false,
            },
            repassword: '',
        }
    },

    methods: {
    },
}
</script>

<style scoped>
    .main {
        display: grid;
        grid-template-columns: auto;
        row-gap: 10px;
        margin-bottom: 20px;
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