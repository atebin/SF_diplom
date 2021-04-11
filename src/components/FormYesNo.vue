<template>
  <form class="form">
      <div class="main">
          {{ mainText }}
      </div>
      <div class="footer">
            <button class="button" @click.prevent="setCheckStatus('yes')">Да</button>
            <button class="button" @click.prevent="setCheckStatus('no')">Нет</button>
      </div>
  </form>
</template>

<script>
export default {
    name: 'FormYesNo',

    data: () => {
        return {
            mainText: '',
        }
    },

    props: {
        //mainText: String,                       mainText="Удалить этого сотрудника из списка?"
        modalMode: String,
        setCheckStatus: Function,
    },

    created() {
        switch (this.modalMode) {
            case 'deleteOfficer':
                this.mainText = 'Удалить этого сотрудника из списка?';
                break;
            case 'approveOfficer':
                this.mainText = 'Подтвердить полномочия этого сотрудника?';
                break;
            case 'deleteCase':
                this.mainText = 'Удалить эту запись из списка?';
                break;
        }
        
    },

}
</script>

<style>

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

    .button {
        min-width: 60px;
        text-align: center;
        margin: 0 10px;
    }

</style>