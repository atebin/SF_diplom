<template>
  <section v-if="globalSetting.isAuth">
    <h1 class="title">Ответственные сотрудники</h1>

    <div class="nav-bar">
      <button 
        class="nav-item"
        :disabled="isBlockAction"
        @click="allActionOfficer('0000', 'addOfficer')"
      >Добавить сотрудника</button>
    </div>

    <ul class="officers" v-if="isDataLoad">
      <li
        class="officer officer--desktop"
      >
        <div class="officer-header officer--a1">Подтвержден</div>
        <div class="officer-header officer--b1">Имя</div>
        <div class="officer-header officer--c1">Фамилия</div>
        <div class="officer-header officer-header--desktop officer--d1">Email</div>
        <div class="officer-header officer--e1"></div>
      </li>
      <li
        v-for="(officer, key) in allOfficers"
        :key="key"
        class="officer"
        @dblclick="editOfficer(officer._id, key)"
      >
        <div class="officer-lastName officer--a1">
            <img 
              v-if="officer.approved"
              class="officer-approved_img"
              src="../assets/img/check_yes.jpg">
            <img 
              v-if="!officer.approved"
              class="officer-approved_img"
              src="../assets/img/check_no.jpg">
            </div>
        <div class="officer-firstName officer--b1">{{ officer.firstName }}</div>
        <div class="officer-lastName officer--c1">{{ officer.lastName }}</div>
        <div class="officer-email officer--d1">{{ officer.email }}</div>
        <button 
          :disabled="isBlockAction || officer.approved"
          class="button_action officer--a2"
          @click="getCheckStatus(key, 'approveOfficer')"
        >Подтвердить</button>
        <button 
          :disabled="isBlockAction"
          class="button_action officer--e1"
          @click="editOfficer(officer._id, key)"
        >Редактировать</button>
        <button 
          :disabled="isBlockAction"
          class="button_action officer--e2"
          @click="getCheckStatus(officer._id, 'deleteOfficer')"
        >Удалить</button>
      </li>
    </ul>

  </section>
</template>

<script>

export default {
  name: 'Officers',

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
  },

  methods: {

    editOfficer(id, key) {
      this.$router.push({ name: 'officerDetail', params: {id: id, officerData: this.allOfficers[key]}});
    },

    
    //убрал 15.02.2021 - похоже, не нужно в этом компоненте
    /*
    officerSignUpProxi(formData, repassword) {
      this.officerSignUp(formData, repassword);
    },
    */
    

    getCheckStatus(id, action) {
      if (this.preCheckStatus.id !== '' && this.preCheckStatus.action !== '') {
        console.log('Ошибка! Старт действия при незавершенном процессе, запущенном ранее!');
        return;
      }

      this.preCheckStatus.id = id;
      this.preCheckStatus.action = action;
      //console.log('action: ' + action);
      this.approveCheckStatus(action);
    },

    allActionOfficer(id, action) {

      // блокируем кнопки для исключения нажатия
      this.setProcessInWork(action);

      let editDataOfficer = {};

      switch (action) {
        case 'addOfficer':
          this.openModal('signUp', 'user');
          break;
        case 'deleteOfficer':
          this.officerDelete(id);
          break;
        case 'approveOfficer':
          //console.log(id);
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

    'inWork.addOfficer': function (value) {
      this.updateDataOfficers(value);
    },

    'inWork.deleteOfficer': function (value) {
      this.updateDataOfficers(value);
    },

    'inWork.approveOfficer': function (value) {
      this.updateDataOfficers(value);
    },

    'checkStatus': function (value) {
      //console.log('checkStatus = IN');
      switch (value) {
        case 'yes':
          //console.log('checkStatus = YES');
          this.allActionOfficer(this.preCheckStatus.id, this.preCheckStatus.action);
          this.$nextTick(() => {            
            this.preCheckStatus.id ='';
            this.preCheckStatus.action = '';
          })
          break;
        case 'no':
          //console.log('checkStatus = NO');
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
    grid-template-columns: 1fr 2fr 2fr 2fr 1fr;/*  1fr 1fr  */
    grid-template-areas: 
        "a1 b1 c1 d1 e1"
        "a2 b1 c1 d1 e2";
    column-gap: 20px;
    row-gap: 10px;
    padding: 15px 10px;
  }

  .officer--a1 {grid-area: a1;}
  .officer--a2 {grid-area: a2;}
  .officer--b1 {grid-area: b1;}
  .officer--c1 {grid-area: c1;}
  .officer--d1 {grid-area: d1;}
  .officer--e1 {grid-area: e1;}
  .officer--e2 {grid-area: e2;}

  .officer:not(:last-child) {
    border-bottom: 1px solid #bbb;
  }

  .officer-header {
    font-weight: 600;
    font-size: 80%;
  }

  .officer-approved_img {
    display: block;
    width: 30px;
    margin: 0 auto;
  }

  .button_action {
    font-size: 13px;
  }

@media screen and (max-width: 1000px) {

  .officers {
    font-size: 14px;
  }

  .officer {
    column-gap: 10px;
  }

  .officer-header {
    font-size: 100%;
  }
}

@media screen and (max-width: 800px) {

  .officers {
    font-size: 13px;
  }

  .officer {
    grid-template-columns: 1fr 2fr 2fr 1fr;
    grid-template-areas: 
        "a1 b1 c1 e1"
        "a2 d1 d1 e2";
  }

  .officer-header--desktop {
    display: none;
  }

  .button_action {
    font-size: 12px;
  }
}

@media screen and (max-width: 600px) {

  .title {
    font-size: 18px;
  }

  .officer--desktop {
    display: none;
  }

  .officer {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: 
        "a1 . a2 a2"
        "b1 b1 b1 b1"
        "c1 c1 c1 c1"
        "d1 d1 d1 d1"
        "e1 e1 e2 e2";
  }

  .officer-approved_img {
    margin: 0;
  }
}

@media screen and (max-width: 375px) {

  .officer {
    grid-template-columns: 1fr 2fr;
    grid-template-areas: 
        "a1 a2"
        "b1 b1"
        "c1 c1"
        "d1 d1"
        "e1 e1"
        "e2 e2";
  }
}

</style>