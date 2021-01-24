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
        @dblclick="eventEditOfficer"
      >
        <div class="officer-firstName">{{ officer.firstName }}</div>
        <div class="officer-lastName">{{ officer.lastName }}</div>
        <div class="officer-email">{{ officer.email }}</div>
        <div class="officer-lastName">{{ officer.approved }}</div>
        <button 
          :disabled="isBlockAction"
          @click="eventApprovedOfficer(officer._id)"
        >Подтвердить</button>
        <button 
          :disabled="isBlockAction"
          @click="eventEditOfficer(officer._id)"
        >Редактировать</button>
        <button 
          :disabled="isBlockAction"
          @click="allActionOfficer(officer._id, 'delete')"
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
    }
  },

  props: {
    axiosSetting: Object,
    globalSetting: Object,
    officerDelete: Function,

    openModal: Function,
    inWork: Object,
    setProcessInWork: Function,

    //isFormVisibleSignUp: Boolean,
    //modalClose: Function,
    //officerSignUp: Function,
    //clientId: String,
    //formErrorText: String,
    //formSuccessText: String,
  },

  methods: {
    eventEditOfficer(id) {
      console.log('edit: ' + id);
    },

    /*
    deleteOfficer(id) {
      this.officerDelete(id);
      this.getDataFromServer();
    },
    */

    /*
    addOfficer() {
      this.openModal('signUp');
    },
    */

    eventApprovedOfficer(id) {
      console.log('approved: ' + id);
    },

    officerSignUpProxi(formData, repassword) {
      this.officerSignUp(formData, repassword);
      //this.getDataFromServer();
    },

    allActionOfficer(id, action) {

      // блокируем кнопки для исключения нажатия
      this.setProcessInWork(action);

      switch (action) {
        case 'add':
          this.openModal('signUp');
          break;
        case 'delete':
          this.officerDelete(id);
          break;
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
    'inWork.add': function (value) {
      if (value) {
        this.isBlockAction = true;
      } else {
        this.isBlockAction = false;
        this.$nextTick(() => {
          this.getDataFromServer();
        })
      }
    },

    'inWork.delete': function (value) {
      if (value) {
        this.isBlockAction = true;
      } else {
        this.isBlockAction = false;
        this.$nextTick(() => {
          this.getDataFromServer();
        })
      }
    }
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