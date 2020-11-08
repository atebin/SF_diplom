<template>
    <div class="case">
        <h2>сообщить о краже</h2>
        <div class="case-data-item">
            <span class="case-data-item-part1">Дата происшествия</span>
            <input type="date" name="date" class="case-data-item-part2">
        </div>
        <select 
            class="case-data-item" 
            v-model="dataCase.status"
            v-if="!this.isStatusActive"
        >
            <option
                v-for="(status, num) in settings.statuses"
                :key="num"
            >{{status}}</option>
        </select>      
        <input type="text" class="case-data-item" placeholder="Номер велосипеда" v-model.lazy="dataCase.date">        
        <input type="text" class="case-data-item" placeholder="Цвет велосипеда" v-model.lazy="dataCase.color"> 
        <input type="text" class="case-data-item" placeholder="ФИО заявителя" v-model.lazy="dataCase.ownerFullName">  
        <select class="case-data-item" placeholder="Тип велосипеда" v-model="dataCase.type">
            <option
                v-for="(type, num) in settings.types"
                :key="num"
            >{{type}}</option>
        </select>      
        <textarea class="case-data-item" rows="7" placeholder="Описание велосипеда и ситуации" v-model.lazy="dataCase.description"></textarea>
        <textarea 
            class="case-data-item" 
            rows="7" 
            placeholder="Резюме" 
            v-model.lazy="dataCase.resolution"
            v-if="dataCase.status==='done'"
        ></textarea>
        <button 
            class="case-data-send"
            @click="eventClickButtonSend"
        >Отправить информацию</button>       
    </div>
</template>

<script>


export default {

    props: {
        globalSetting: Object,
        mode: String,
    },

    data: () => {
        return {
            settings: {
                statuses: ['new', 'in_progress', 'done'],
                types: ['sport', 'general'],
                modes: ['add', 'edit'],
            },
            dataCase: {
                status: 'new',
                date: null,
                color: '',
                ownerFullName: '',
                type: '',
                description: '',
                resolution: '',
                createdAt: '',
                updateAt: '',
                clientId: '',
            }
        }
    },

    computed: {
        isStatusActive: function() {
            let noActive = true;
            switch (this.mode) {
                case 'add': 
                    noActive = true;
                    break;
                case 'edit': 
                    noActive = false;
                    break;
            }
            return noActive
        },

        isAuth: function() {
            return this.globalSetting.isAuth
        }
    },

    watch: {
        isAuth: function(value) {
            console.log(`value.isAuth": ${value}`);
            if (value) {
                this.dataCase.clientId = this.globalSetting.clientId;
            } else {
                this.dataCase.clientId = '';
            }
        }
    },

    methods: {

        setDefaultValueInCase(editedCase) {
            let now = new Date();
            console.log(`now: ${now}`);

            this.dataCase.date = '11';
            this.dataCase.createdAt = '22';
            this.dataCase.updateAt = '33';

            if (editedCase) {return}

            this.dataCase.status = 'new';
            this.dataCase.color = '';
            this.dataCase.ownerFullName = '';
            this.dataCase.type = '';
            this.dataCase.description = '';
            this.dataCase.resolution = '';
            this.dataCase.clientId = this.globalSetting.clientId;

        },

        eventClickButtonSend() {
            this.setDefaultValueInCase(false);
        },
    },

    mounted() {
        this.setDefaultValueInCase(false);
    },

}
</script>

<style scope>

    .case{
        width: calc((100% - 120px) / 2);
        border: 20px solid red;
        border-radius: 20px;
        border-right-color: blue;
        border-bottom-color: blue;
        padding: 20px;
    }

    .case h2{
        color: #c33;
        margin: 40px 0px;
    }

    .case-data-item{
        display: block;
        width: 320px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 0;
    }

    .case-data-item:not(:last-child){
        margin-bottom: 10px;
    }
    

    .case-data-item-part1{
        width: calc((100% - 20px) * 0.55);
        text-align: left;
    }

    .case-data-item-part2{
        width: calc((100% - 20px) * 0.45);
        text-align: right;
    }

    .case-data-send{
        background-color: blue;
        color: #fff;
        padding: 10px 20px;
        margin: 40px 0px;
    }

</style>