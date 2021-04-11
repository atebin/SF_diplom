<template>
    <form class="form">
        <div class="main">
            <div class="field-set">
                <label class="field-label" for="field-email">Ваш логин (email):</label>
                <input class="field-input" type="email" id="field-email" name="email" value="" placeholder="name@site.com" v-model="formData.email">
            </div>

            <div class="field-set">
                <label class="field-label" for="field-password">Ваш пароль:</label>
                <input class="field-input" type="password" id="field-password" name="password" value="" placeholder="*********" v-model="formData.password">
            </div>
        </div>

        <div class="footer">
            <button @click.prevent="userSignIn(formData)">Войти в систему</button>
        </div>

        <div 
            v-if="formErrorText !== ''"
            class="error"
        >{{ formErrorText }}</div>

        <div 
            v-if="formSuccessText !== ''"
            class="success"
        >{{ formSuccessText }}</div>
    </form>
</template>

<script>
export default {
    name: 'FormSignIn',

    props: {
        modalClose: Function,
        userSignIn: Function,
        formErrorText: String,
        formSuccessText: String,
    },

    data: () => {
        return {
            formData: {
                email: '',
                password: '',
            }
        }
    },
}
</script>

<style scoped>

    .main {
        /*
        display: grid;
        grid-template-columns: 1fr;
        row-gap: 10px;
        */
        padding: 0;
        margin: 0 0 20px;
    }

    .footer {
        display: flex;
        justify-content: center;
        /*margin: 20px 0 0;*/
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
        display: block;
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
</style>