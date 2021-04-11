<template>
  <section>
    <h1 class="title">Украденные велосипеды</h1>

    <div class="nav-bar">
      <!--button 
        class="nav-item"
        :disabled="isBlockAction"
        @click="newNotice()"
      >Сообщить о краже</button-->
      <button 
        class="nav-item"
        :disabled="isBlockAction"
        @click="allActionCase('0000', 'addCase')"
      >Сообщить о краже</button>

      <CasesList
        :allCases="allCases"
        :allOfficers="allOfficers"
        :globalSetting="globalSetting"
        :editCaseOnServer="editCaseOnServer"
        :deleteCaseOnServer="deleteCaseOnServer"
        :requestDataFromServer="requestDataFromServer"

        :isBlockAction="isBlockAction"
        :checkStatus="checkStatus"
        :approveCheckStatus="approveCheckStatus"
        :preCheckStatus="preCheckStatus"
        :setPreCheckStatus="setPreCheckStatus"
        :openModal="openModal"
        :textCustomerComment="textCustomerComment"

        :restoreValueStatus="restoreValueStatus"
      />
    </div>

  </section>
</template>

<script>
import CasesList from './CasesList.vue'

export default {
  name: 'Cases',

  components: {
    CasesList,
  },

  props: {
    axiosSetting: Object,
    globalSetting: Object,
    openModal: Function,

    inWork: Object,
    setProcessInWork: Function,
    setProcessInWorkEnd: Function,

    checkStatus: String,
    approveCheckStatus: Function,

    textCustomerComment: String,
  },

  data: () => {
    return {
      allCases: [],
      allOfficers: [],
      isDataLoad: false,
      isBlockAction: false,

      preControlStatus: {},
      
      preCheckStatus: {
        id: '',
        action: '',
      }
      
    }
  },

  methods: {
    /*
    newNotice() {
      this.$router.push({ path: '/notice'});
    },
    */

    requestDataFromServer() {
      if (!this.globalSetting.isAuth) {
        this.$router.push({ path: '/home'});
        return;
      }

      this.axiosSetting.connectionApiAuth.get('api/cases')
        .then(response => {

          this.allCases = response.data;
          this.preControlStatus = {};

          this.$nextTick(() => {
            this.isDataLoad = true;

            for (let currentCase in response.data) {
              this.preControlStatus[currentCase] = response.data[currentCase].status;
            }
          })
        })
        .catch(err => {
          console.log('===========================');      
          console.log('get: api/cases');
          console.log(err);
          console.log('===========================');      
        });      

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

    editCaseOnServer(newData) {
      console.log('step 3/1');
      if (!this.globalSetting.isAuth) {
        this.$router.push({ path: '/home'});
        return;
      }

      console.log(newData);
      this.axiosSetting.connectionApiAuth.put('api/cases/' + newData._id, newData)
        .then(() => {
          this.setProcessInWorkEnd('updateCase');
          this.requestDataFromServer();
        })
        .catch(err => {
          console.log('===========================');      
          console.log('put: api/cases/');
          console.log(err);
          console.log('===========================');      
        });      
    },

    restoreValueStatus(numCase) {
      console.log('numCase: ' + numCase);
      this.allCases[numCase].status = this.preControlStatus[numCase];
    },

    deleteCaseOnServer(caseId) {//newData
      if (!this.globalSetting.isAuth) {
        this.$router.push({ path: '/home'});
        return;
      }

      this.axiosSetting.connectionApiAuth.delete('api/cases/' + caseId)//newData._id
        .then(() => {
            this.$nextTick(() => {
                this.setProcessInWorkEnd('deleteCase');
                this.requestDataFromServer();
            })            
        })
        .catch(err => {
          console.log('===========================');      
          console.log('delete: api/cases/');
          console.log(err);
          console.log('===========================');      
        });  
        
        
    },

    setPreCheckStatus(id, action) {
      this.preCheckStatus.id = id;
      this.preCheckStatus.action = action;
    },


    allActionCase(id, action) {

      // блокируем кнопки для исключения нажатия
      this.setProcessInWork(action);

      //let editDataOfficer = {};

      switch (action) {
        case 'addCase':
          this.$router.push({ path: '/notice'});
          break;
        case 'deleteCase':
          this.deleteCaseOnServer(id);
          break;
          /*
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
          */
      }
    },


    updateDataCases(value) {
      if (value) {
        this.isBlockAction = true;
      } else {
        this.isBlockAction = false;
        this.$nextTick(() => {
          this.requestDataFromServer();     // было это -  getDataFromServer()    - !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        })
      }
    },

  },

  watch: {
    'globalSetting.isAuth': function(value) {
        if (!value) {
            this.$router.push({ path: '/home'});
        }
    },

    'inWork.addCase': function (value) {
      this.updateDataCases(value);
    },

    'inWork.deleteCase': function (value) {
      this.updateDataCases(value);
    },

    'checkStatus': function (value) {
      switch (value) {
        case 'yes':
          this.allActionCase(this.preCheckStatus.id, this.preCheckStatus.action);
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

<style scoped>

</style>