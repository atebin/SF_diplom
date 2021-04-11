<template>
    <div class="case">
        <h2>сообщить о краже</h2>
        <div class="case-data-item">
            <span class="case-data-item-part1">Дата происшествия</span>
            <!--input type="date" name="date" class="case-data-item-part2" v-model.lazy="dataCase.date" title="Дата отправки заявления о краже"-->


        </div>
        <select 
            class="case-data-item" 
            v-model="dataCase.status"
            v-if="!this.isStatusActive"
        >
            <option
                v-for="(status, num) in globalSetting.bikeSettings.statuses"
                :key="num"
            >{{status}}</option>
        </select>      
        <input type="text" class="case-data-item" placeholder="Номер велосипеда" v-model.lazy="dataCase.licenseNumber" title="Номер велосипеда">        
        <input type="text" class="case-data-item" placeholder="Цвет велосипеда" v-model.lazy="dataCase.color" title="Цвет велосипеда"> 
        <select class="case-data-item" placeholder="Тип велосипеда" v-model="dataCase.type" title="Тип велосипеда">
            <option
                v-for="(type, num) in globalSetting.bikeSettings.types"
                :key="num"
            >{{type}}</option>
        </select>      
        <input type="text" class="case-data-item" placeholder="ФИО заявителя" v-model.lazy="dataCase.ownerFullName" title="ФИО заявителя">  
        <!--input v-if="globalSetting.isAuth" type="text" class="case-data-item" placeholder="Ответственный сотрудник" v-model.lazy="dataCase.officer" title="Ответственный сотрудник"-->        
        <textarea class="case-data-item" rows="7" placeholder="Описание велосипеда и ситуации" v-model.lazy="dataCase.description"></textarea>

        <textarea 
            class="case-data-item" 
            rows="7" 
            placeholder="Резюме" 
            v-model.lazy="dataCase.resolution"
            v-if="(dataCase.status==='done' && globalSetting.isAuth)"
        ></textarea>
        <button 
            class="case-data-send"
            @click.stop="eventClickButtonSend"
        >Отправить информацию</button> 
        <div class="case-data-result">{{ textResult }}</div>
    </div>
</template>

<script>


export default {

    props: {
        globalSetting: Object,
        mode: String,
        newCase: Function,
    },

    data: () => {
        return {
            /*
            settings: {
                statuses: ['new', 'in_progress', 'done'],
                types: ['sport', 'general'],
                //modes: ['add', 'edit'],
            },
            */
            dataCase: {
                status: '',
                date: null,
                licenseNumber: '',
                color: '',
                type: '',
                ownerFullName: '',
                //officer: '',
                createdAt: null,
                updateAt: null,
                clientId: '',
                
                description: '',
                resolution: '',
            },

            textResult: '',
            idTimerTextResult: null,
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
        },

        'dataCase.date': function(value) {
            this.dataCase.createdAt = value;
            this.dataCase.updateAt = value;
        },

        textResult: function(newValue, oldValue) {
            if (oldValue === '' && newValue !== '') {
                console.log('IN textResult');
                this.idTimerTextResult = setTimeout(this.hideTextResult, 5000);
            }
        }
    },

    methods: {



        setDefaultValueInCase(editedCase) {
            let dateNow = new Date();
            console.log(`now: ${dateNow}`);

            let preDate = dateNow;//new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
            console.log(`now: ${preDate}`);

            this.dataCase.date = preDate;//.toLocaleDateString();
            this.dataCase.createdAt = preDate;//.toLocaleDateString();
            this.dataCase.updateAt = preDate;//.toLocaleDateString();

            if (editedCase) {return}

            this.dataCase.status = this.globalSetting.bikeSettings.statuses[0];
            this.dataCase.licenseNumber = '';
            this.dataCase.color = '';
            this.dataCase.ownerFullName = '';
            this.dataCase.type = '';
            this.dataCase.description = '';
            this.dataCase.resolution = '';
            this.dataCase.clientId = this.globalSetting.clientId;

        },

        eventClickButtonSend() {
            this.newCase(this.dataCase);
            this.textResult = 'Информация принята и внесена в систему!';
            this.$nextTick(() => {
                this.setDefaultValueInCase(false);
            })            
        },

        hideTextResult() {
            console.log('IN hideTextResult');
            this.textResult = '';
            this.idTimerTextResult = null;
        },
    },

    mounted() {
        this.setDefaultValueInCase(false);
    },

    beforeDestroy() {
        console.log('IN beforeDestroy');
        if (this.idTimerTextResult !== null) {
            clearTimeout(this.idTimerTextResult);
        }
    }

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
        width: 100%;
        /*max-width: 320px;*/
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
        padding: 10px 40px;
        margin: 40px 0 20px;
    }

    .case-data-result {
        height: 30px;
        color: #3b3;
        margin: 0 0 20px;
    }

</style>