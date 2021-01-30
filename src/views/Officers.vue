<template>
  <section v-if="globalSetting.isAuth">
    <h1 class="title">Ответственные сотрудники</h1>

    <div class="nav-bar">
      <button 
        class="nav-item"
        :disabled="isBlockAction"
        @click="allActionOfficer('0000', 'add')"
      >Добавить сотрудника</button>
    </div>

    <ul class="officers" v-if="isDataLoad">
      <li
        class="officer"
      >
        <div class="officer-header">Имя</div>
        <div class="officer-header">Фамилия</div>
        <div class="officer-header">Email</div>
        <div class="officer-header">Подтвержден</div>
        <div class="officer-header"></div>
        <div class="officer-header"></div>
        <div class="officer-header"></div>
      </li>
      <li
        v-for="(officer, key) in allOfficers"
        :key="key"
        class="officer"
        @dblclick="editOfficer(officer._id, key)"
      >
        <div class="officer-firstName">{{ officer.firstName }}</div>
        <div class="officer-lastName">{{ officer.lastName }}</div>
        <div class="officer-email">{{ officer.email }}</div>
        <div class="officer-lastName">{{ officer.approved }}</div>
        <button 
          :disabled="isBlockAction || officer.approved"
          @click="getCheckStatus(key, 'approve')"
        >Подтвердить</button>
        <button 
          :disabled="isBlockAction"
          @click="editOfficer(officer._id, key)"
        >Редактировать</button>
        <button 
          :disabled="isBlockAction"
          @click="getCheckStatus(officer._id, 'delete')"
        >Удалить</button>
      </li>
    </ul>


    <!--Modal
        v-if="isFormVisibleSignUp"
        modalName='signUp'
        :modalClose="modalClose"
    >
        
        <template v-slot:main>
            <FormSignUp 
                :modalClose="modalClose"
                :officerSignUp="officerSignUpProxi"
                :clientId="clientId"
                :formErrorText="formErrorText"
                :formSuccessText="formSuccessText"
            />
        </template>
    </Modal-->


  </section>
</template>

<script>
//import Modal from '../components/Modal.vue'
//import FormSignUp from '../components/FormSignUp.vue'


export default {
  name: 'Officers',

  /*components: {
    Modal,
    FormSignUp,
  },*/

  data: () => {
    return {
      allOfficers: {},
      isDataLoad: false,
      isBlockAction: false,
      preCheckStatus: {
        id: '',
        action: '',
      }
    }
  },

  props: {
    axiosSetting: Object,
    globalSetting: Object,
    officerDelete: Function,
    officerApproved: Function,

    openModal: Function,
    inWork: Object,
    setProcessInWork: Function,

    checkStatus: String,
    approveCheckStatus: Function,

    //isFormVisibleSignUp: Boolean,
    //modalClose: Function,
    //officerSignUp: Function,
    //clientId: String,
    //formErrorText: String,
    //formSuccessText: String,
  },

  methods: {
    editOfficer(id, key) {
      console.log('edit: ' + id);
      //this.$router.push({ path: `/officer/${id}`, params: {officerData: this.allOfficers[key]}});
      this.$router.push({ name: 'officerDetail', params: {id: id, officerData: this.allOfficers[key]}});
    },

    officerSignUpProxi(formData, repassword) {
      this.officerSignUp(formData, repassword);
      //this.getDataFromServer();
    },

    getCheckStatus(id, action) {
      if (this.preCheckStatus.id !== '' && this.preCheckStatus.action !== '') {
        console.log('Ошибка! Старт действия при незавершенном процессе, запущенном ранее!');
        return;
      }

      this.preCheckStatus.id = id;
      this.preCheckStatus.action = action;
      console.log('action: ' + action);
      this.approveCheckStatus(action);
    },

    allActionOfficer(id, action) {

      // блокируем кнопки для исключения нажатия
      this.setProcessInWork(action);

      let editDataOfficer = {};

      switch (action) {
        case 'add':
          this.openModal('signUp', 'user');
          break;
        case 'delete':
          this.officerDelete(id);
          break;
        case 'approve':
          console.log(id);
          editDataOfficer._id = this.allOfficers[id]._id;
          editDataOfficer.clientId = this.allOfficers[id].clientId;
          editDataOfficer.approved = true;
          editDataOfficer.email = this.allOfficers[id].email;
          editDataOfficer.firstName = this.allOfficers[id].firstName;
          editDataOfficer.lastName = this.allOfficers[id].lastName;
          editDataOfficer.password = this.allOfficers[id].password;
          this.officerApproved(editDataOfficer);
          break;
      }
    },

    updateDataOfficers(value) {
      if (value) {
        this.isBlockAction = true;
      } else {
        this.isBlockAction = false;
        this.$nextTick(() => {
          this.getDataFromServer();
        })
      }
    },

    getDataFromServer() {

      this.$nextTick(() => {
        this.isDataLoad = false;
      })
      this.$nextTick(() => {
        this.requestDataFromServer();
      })
      this.$nextTick(() => {
        this.isDataLoad = true;
      })
    },

    requestDataFromServer() {
      if (!this.globalSetting.isAuth) {
        this.$router.push({ path: '/home'});
        return;
      }

      this.axiosSetting.connectionApiAuth.get('api/officers')
        .then(response => {

          this.allOfficers = response.data;

          this.$nextTick(() => {
            this.isDataLoad = true;
          })
        })
        .catch(err => {
          console.log('===========================');      
          console.log('get: api/officers');
          console.log(err);
          console.log('===========================');      
        });      
    },

  },

  watch: {
    'globalSetting.isAuth': function(value) {
        if (!value) {
            this.$router.push({ path: '/home'});
        }
    },

    'inWork.add': function (value) {
      this.updateDataOfficers(value);
    },

    'inWork.delete': function (value) {
      this.updateDataOfficers(value);
    },

    'inWork.approve': function (value) {
      this.updateDataOfficers(value);
    },

    'checkStatus': function (value) {
      switch (value) {
        case 'yes':
          this.allActionOfficer(this.preCheckStatus.id, this.preCheckStatus.action);
          this.preCheckStatus.id ='';
          this.preCheckStatus.action = '';
          break;
        case 'no':
          this.preCheckStatus.id ='';
          this.preCheckStatus.action = '';
          break;
      }
    },
  },

  mounted() {
    this.requestDataFromServer();
  }

}
</script>

<style>
  .officers {
    border: 1px solid #bbb;
    margin: 40px 0;
    font-size: 15px;
    text-align: left;
    padding: 0;
  }

  .officer {
    list-style: none;
    display: grid;
    grid-template-columns: 2fr 2fr 2fr 1fr 1fr 1fr 1fr;
    column-gap: 10px;
    padding: 5px 10px;
  }

  .officer:not(:last-child) {
    border-bottom: 1px solid #bbb;
  }

  .officer-header {
    font-weight: 600;
  }
</style>