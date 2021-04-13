<template>
  <form class="form">
        <div class="main">
            {{ textLabel }}
        </div>
        <textarea class="input_text" rows="5" v-model="textComment"></textarea>
        <div class="footer">
                <button class="button" @click.prevent="setComment('ok', textComment)">Сохранить</button>
                <button class="button" @click.prevent="setComment('esc', '-')">Отмена</button>
        </div>
  </form>
</template>

<script>
export default {
    name: 'FormInputComment',

    data: () => {
        return {
            textComment: '',
        }
    },

    props: {
        textLabel: String,
        setComment: Function,
    },

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

    .input_text {
        width: 100%;
        margin: 0 0 20px;
    }

    .button {
        min-width: 60px;
        text-align: center;
        margin: 0 10px;
    }
</style>