<template>
    <section class="modal" @click.self="modalClose(modalName)">

        <div class="modal-window">
            <div class="modal-window-header">
                <button @click="modalClose(modalName)">X</button>
            </div>
            <div class="modal-window-main">
                <slot name="main"></slot>
            </div>
        </div>    
    </section>

</template>

<script>
export default {

    name: 'Modal',

    props: {
        modalName: String,
        modalClose: Function,
    },

    methods: {
    }
}
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal:before {
        position: absolute;
        content: '';
        z-index: 1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0.5;
        background-color: #333;
    }

    .modal-window {
        position: static;
        z-index: 2;

        width: 30%;
        min-width: 300px;
        background-color: #fff;
        opacity: 1;
        box-shadow: 0 0 10px 5px #55555555;
        padding: 20px;
    }

    .modal-window-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
    }

    .modal-window-main {
        width: 100%;
    }
</style>