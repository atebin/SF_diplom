<template>
    <form class="form">
        <div class="main">
            <div class="field-set">
                <label class="field-label" for="field-email">{{ textForMode[modalMode].fieldEmail }}:</label>
                <input class="field-input" type="email" id="field-email" name="email" value="" placeholder="name@site.com" v-model="formData.email">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-first_name">{{ textForMode[modalMode].fieldFirstName }}:</label>
                <input class="field-input" type="text" id="field-first_name" name="firstName" value="" placeholder="Алексей" v-model="formData.firstName">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-last_name">{{ textForMode[modalMode].fieldLastName }}:</label>
                <input class="field-input" type="text" id="field-last_name" name="lastName" value="" placeholder="Николаев" v-model="formData.lastName">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-password">{{ textForMode[modalMode].fieldPassword }}:</label>
                <input class="field-input" type="password" id="field-password" name="password" value="" placeholder="*********" v-model="formData.password">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-repassword">{{ textForMode[modalMode].fieldRepassword }}:</label>
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
            <button @click.prevent="officerSignUp(formData, repassword)">{{ textForMode[modalMode].button }}</button>
        </div>

        <div 
            v-if="formSuccessText !== ''"
            class="footer"
        >
            <button @click.prevent="modalClose('signUp')">Ок</button>
        </div>  
    </form>
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
        modalMode: String,
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
            textForMode: {
                self: {
                    fieldEmail: 'Ваш логин (email)',
                    fieldFirstName: 'Ваше имя',
                    fieldLastName: 'Ваша фамилия',
                    fieldPassword: 'Ваш пароль',
                    fieldRepassword: 'Повтор пароля',
                    button: 'Зарегистрироваться'
                },
                user: {
                    fieldEmail: 'Логин (email)',
                    fieldFirstName: 'Имя',
                    fieldLastName: 'Фамилия',
                    fieldPassword: 'Пароль',
                    fieldRepassword: 'Повтор пароля',
                    button: 'Зарегистрировать и подтвердить'
                },
            }
        }
    },

    methods: {
    },

    created() {
        switch (this.modalMode) {
            case 'self': 
                this.formData.approved = false;
                break;
            case 'user': 
                this.formData.approved = true;
                break;
        }
    }
}
</script>

<style scoped>

    .main {
        /*
        display: grid;
        grid-template-columns: auto;
        row-gap: 10px;
        margin-bottom: 20px;
        */
        padding: 0;
        margin: 0 0 20px;
    }

    .footer {
        display: flex;
        justify-content: center;
    }

    .field-set {
        display: flex;
        align-content: center;
    }

    .field-set:not(:last-child) {
        margin-bottom: 10px;
    }

    .field-label {
        margin-right: 20px;
        display: inline-block;
        white-space: nowrap;
        text-align: left;
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