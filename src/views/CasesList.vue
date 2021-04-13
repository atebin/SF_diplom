<template>
    <ul class="cases_list">
        <li class="cases_list--row cases_list--row_header">
            <div class="cases_list--row_data">
                <div class="cases_list--header cases_list--row_a1">Статус</div>
                <div class="cases_list--header cases_list--row_a2">Дата кражи</div>
                <div class="cases_list--header cases_list--row_a3">Дата заявления</div>

                <div class="cases_list--header cases_list--row_b1">Номер велосипеда</div>
                <div class="cases_list--header cases_list--row_b2">Цвет</div>
                <div class="cases_list--header cases_list--row_b3">Тип велосипеда</div>

                <div class="cases_list--header cases_list--row_c1">ФИО заявителя</div>
                <div class="cases_list--header cases_list--row_c2">Ответственный сотрудник</div>
                <div class="cases_list--header cases_list--row_c3">Дата обновления информации</div>

                <div class="cases_list--header cases_list--row_d1">Описание велосипеда и ситуации</div>
                <div class="cases_list--header cases_list--row_d3">Заключение</div>

                <div class="cases_list--header cases_list--row_e1"></div>
                <div class="cases_list--header cases_list--row_e2"></div>
                <div class="cases_list--header cases_list--row_e3"></div>
            </div>
        </li>

        <li
            v-for="(item, key) in allCases"
            :key="key"
            class="cases_list--row"
        >
            <!--div class="cases_list--item cases_list--row_a1">{{ item.status }}</div  v-if="!this.isStatusActive" -->
            <div class="cases_list--row_data">
                <div class="cases_list--header_mobile cases_list--row_a01">Статус</div>
                <div class="cases_list--header_mobile cases_list--row_a02">Кража</div>
                <div class="cases_list--header_mobile cases_list--row_a03">Заявление</div>

                <div class="cases_list--header_mobile cases_list--row_b01">Номер</div>
                <div class="cases_list--header_mobile cases_list--row_b02">Цвет</div>
                <div class="cases_list--header_mobile cases_list--row_b03">Тип</div>

                <div class="cases_list--header_mobile cases_list--row_c01">Заявитель</div>
                <div class="cases_list--header_mobile cases_list--row_c02">Сотрудник</div>
                <div class="cases_list--header_mobile cases_list--row_c03">Обновление</div>

                <div class="cases_list--header_mobile cases_list--row_d01">Описание</div>
                <div class="cases_list--header_mobile cases_list--row_d03">Заключение</div>



                <select 
                    class="cases_list--item cases_list--row_a1" 
                    v-model="item.status"
                    :data-number="key"
                    @change="eventSelectStatusChange"
                >
                    <option
                        v-for="(status, num) in globalSetting.bikeSettings.statuses"
                        :key="num"
                    >{{status}}</option>
                </select>      

                <div class="cases_list--item cases_list--row_a2">{{ formatDate(item.date) }}</div>
                <div class="cases_list--item cases_list--row_a3">{{ formatDate(item.createdAt) }}</div>

                <div class="cases_list--item cases_list--row_b1">{{ item.licenseNumber }}</div>
                <div class="cases_list--item cases_list--row_b2">{{ item.color }}</div>
                <div class="cases_list--item cases_list--row_b3">{{ item.type }}</div>

                <div class="cases_list--item cases_list--row_c1">{{ item.ownerFullName }}</div>
                <div class="cases_list--item cases_list--row_c2">{{ getFullNameOfficer(item.officer)}}</div>
                <!--div class="cases_list--item cases_list--row_c2">{{ item.officer}}</div-->
                <div class="cases_list--item cases_list--row_c3">{{ formatDate(item.updateAt) }}</div>

                <div class="cases_list--item cases_list--row_d1">{{ item.description }}</div>
                <div class="cases_list--item cases_list--row_d3">{{ item.resolution }}</div>

                <!--  
                    :disabled="isBlockAction"
                    @click="editOfficer(officer._id, key)"
                    @click="getCheckStatus(officer._id, 'delete')"
                -->
                <button  
                    :disabled="isBlockAction"               
                    @click="eventClick"
                    :data-number="key"
                    class="common_button_primary button_action cases_list--row_e1"
                >Редактировать</button>
                <button 
                    :disabled="isBlockAction"
                    @click="getCheckStatus(allCases[key]._id, 'deleteCase')"
                    :data-number="key"
                    class="common_button_primary button_action cases_list--row_e2"
                >Удалить</button>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'CasesList',

    props: {
        allCases: Array,
        allOfficers: Array,
        globalSetting: Object,
        editCaseOnServer: Function,
        deleteCaseOnServer: Function,
        requestDataFromServer: Function,

        isBlockAction: Boolean,

        checkStatus: String,
        approveCheckStatus: Function,

        preCheckStatus: Object,
        setPreCheckStatus: Function,
        openModal: Function,
        textCustomerComment: String,

        restoreValueStatus: Function,
    },

    data: () => {
        return {
            /*
            isBlockAction: false,
            preCheckStatus: {
                id: '',
                action: '',
            }
            */
           isSelectStatusEnd: false,
           numberCases: null,
        }
    },

    watch: {
        
        'textCustomerComment': function(newValue, oldValue) {
            if (newValue === '' && oldValue === '-') {
                //this.requestDataFromServer();
                return
            }

            //console.log('step 2/1');
            if (this.isSelectStatusEnd && this.numberCases !== null) {
                //console.log('step 2/2');
                //console.log(`newValue: ${newValue}    oldValue: ${oldValue}`)
                if (newValue !== '-' && newValue !== '') {
                    //console.log('step 2/3');
                    this.allCases[this.numberCases].updateAt = new Date();
                    this.allCases[this.numberCases].resolution = newValue;
                    this.$nextTick(() => {
                        //console.log('!+');
                        //console.log(this.allCases[this.numberCases]);
                        this.editCaseOnServer(this.allCases[this.numberCases]);
                    })
                }

                this.$nextTick(() => {
                    this.restoreValueStatus(this.numberCases);
                    this.isSelectStatusEnd = false;
                    this.numberCases = null;
                })
            }
        },
    },

    methods: {
        eventClick() {
            console.log('click!');
        },

        eventSelectStatusChange(event) {
            /*
            let currentNumber = event.target.dataset.number;
            let copyObject = {
                _id:            this.allCases[currentNumber]._id,
                //clientId:       this.allCases[currentNumber].clientId,
                color:          this.allCases[currentNumber].color,
                createdAt:      this.allCases[currentNumber].createdAt,
                date:           this.allCases[currentNumber].date,
                description:    this.allCases[currentNumber].description,
                licenseNumber:  this.allCases[currentNumber].licenseNumber,
                ownerFullName:  this.allCases[currentNumber].ownerFullName,
                resolution: this.allCases[currentNumber].resolution,
                status: this.allCases[currentNumber].status,
                type: this.allCases[currentNumber].type,
                updateAt: this.allCases[currentNumber].updateAt,
            }
            */

           //console.log('step 1/1');
           //console.log(event);

            // если выбран  итоговый статус
            if (this.allCases[event.target.dataset.number].status === this.globalSetting.bikeSettings.status_end) {
                this.isSelectStatusEnd = true;
                //console.log('number: ' + event.target.dataset.number);
                this.numberCases = event.target.dataset.number;
                this.$nextTick(() => {
                    //console.log('step 1/2');
                    this.openModal('inputComment');
                })
            } else {
                //console.log('event.target.dataset.number: ' + event.target.dataset.number);
                //console.log(this.allCases[event.target.dataset.number]);
                // если введен комментарий и он не равен прочерку, мы его сохраним
                //if (!this.isSelectStatusEnd) {
                //}
                    this.allCases[event.target.dataset.number].updateAt = new Date();
                    //console.log('step 1/3');
                    //this.allCases[event.target.dataset.number].resolution = this.textCustomerComment;
                    this.editCaseOnServer(this.allCases[event.target.dataset.number]);
            }

            /*
            this.$nextTick(() => {
            })
            */
        },

        getFullNameOfficer(idOfficer) {
            if (idOfficer === undefined || idOfficer === '') {
                return '-';
            }

            let officer = this.allOfficers.filter((elem) => {
                //console.log('!!!');
                return elem._id === idOfficer;
            });
            
            if (officer.length === 1) {
                return `${officer[0].firstName} ${officer[0].lastName}`;
            } else {
                return '-';
            }            
        },

        formatDate(date) {
            let preDate = new Date(date);
            return `${preDate.toLocaleDateString()} ${preDate.toLocaleTimeString()}`;
        },

        getCheckStatus(id, action) {
            if (this.preCheckStatus.id !== '' && this.preCheckStatus.action !== '') {
                console.log('Ошибка! Старт действия при незавершенном процессе, запущенном ранее!');
                return;
            }

            //this.preCheckStatus.id = id;
            //this.preCheckStatus.action = action;
            //console.log('id: ' + id);
            //console.log('action: ' + action);
            this.setPreCheckStatus(id, action);
            this.approveCheckStatus(action);
        },
    },

}
</script>

<style scoped>

    .cases_list {
        border: 1px solid #bbb;
        margin: 40px 0;
        font-size: 15px;
        text-align: left;
        padding: 0;
    }

    .cases_list--header_mobile {
        display: none;
    }

    .cases_list--row {
        list-style: none;
    }

    .cases_list--row_data {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;/*1fr 1fr 1fr 1fr 1fr 2fr 2fr 1fr 1fr 2fr 2fr 1fr;*/
        grid-template-areas: 
            "a1 b1 c1 d1 e1"
            "a2 b2 c2 d1 e2"
            "a3 b3 c3 d3 e3";
        column-gap: 10px;
        row-gap: 7px;
        padding: 5px 10px;
    }

    .cases_list--row_a1 {grid-area: a1;}
    .cases_list--row_a2 {grid-area: a2;}    
    .cases_list--row_a3 {grid-area: a3;}   

    .cases_list--row_b1 {grid-area: b1;}
    .cases_list--row_b2 {grid-area: b2;}    
    .cases_list--row_b3 {grid-area: b3;}   
     
    .cases_list--row_c1 {grid-area: c1;}
    .cases_list--row_c2 {grid-area: c2;}    
    .cases_list--row_c3 {grid-area: c3;}   
     
    .cases_list--row_d1 {grid-area: d1;}
    .cases_list--row_d3 {grid-area: d3;}

    .cases_list--row_e1 {grid-area: e1;}
    .cases_list--row_e2 {grid-area: e2;}    
    .cases_list--row_e3 {grid-area: e3;}   

    .cases_list--row:not(:last-child) {
        border-bottom: 1px solid #bbb;
    }

    .cases_list--header {
        font-weight: 600;
        font-size: 80%;
    }

    .cases_list--item {
        font-size: 100%;
    }

    .common_button_primary {
        padding: 3px 10px;
        align-self: flex-start;
    }

    .button_action {
        font-size: 13px;
    }

@media screen and (max-width: 800px) {

    .cases_list--row {
        font-size: 14px;
    }
}

@media screen and (max-width: 700px) {

    .cases_list--row {
        font-size: 13px;
    }

    .button_action {
        font-size: 12px;
    }
}
    
@media screen and (max-width: 600px) {
    .cases_list--row_header {
        display: none;
    }

    .cases_list--header_mobile {
        display: block;
    }

    .cases_list--row_data {
        margin-top: 20px;
        margin-bottom: 10px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-areas: 
            "a01 a1 a1 a1"
            "a02 a2 a2 a2"
            "a03 a3 a3 a3"
            "b01 b1 b1 b1"
            "b02 b2 b2 b2"
            "b03 b3 b3 b3"
            "c01 c1 c1 c1"
            "c02 c2 c2 c2"
            "c03 c3 c3 c3"
            "d01 d1 d1 d1"
            "d03 d3 d3 d3"
            "e1 e1 e2 e2"
            "e3 e3 e3 e3";
    }
}

@media screen and (max-width: 375px) {
    .cases_list--row_header {
        display: none;
    }

    .cases_list--row_data {
        grid-template-columns: 1fr 1.5fr;
        grid-template-areas: 
            "a01 a1"
            "a02 a2"
            "a03 a3"
            "b01 b1"
            "b02 b2"
            "b03 b3"
            "c01 c1"
            "c02 c2"
            "c03 c3"
            "d01 d1"
            "d03 d3"
            "e01 e1"
            "e02 e2"
            "e03 e3";
    }
}

</style>