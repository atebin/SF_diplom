<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Страница для тестирования работы API
    </p>
    <h3>Блок 1</h3>
    <ul>
      <li><button>button 1.1</button></li>
      <li><button>button 1.2</button></li>
      <li><button>button 1.3</button></li>
    </ul>
  </div>
</template>

<script>
//import axios_ from 'axios'
import axios from 'axios'

//const HASH_ADD_JSON_FILE = (~~(Math.random()*1e8)).toString(16);

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  data: () => {
    return {
      state: {
        dataUserSignIn_TEST: {
          email: 'student@skillfactory.ru',
          password: '123456',
        },
        dataUserSignIn: {
          email: 'test1@atebin.ru',
          password: '123_atebin',
        },        
        dataUserSignUp: {
          email: 'test1@atebin.ru',
          firstName: 'fn_test1',
          lastName: 'ln_test1',
          password: '123_atebin',
          repassword: '123_atebin',
          clientId: 'q1w2',
        },      
      }
    }
  },

  mounted() {
    /*
    axios.get('https://unikma.ru/avt_test/json/comp/all_SettingCard.json' + '?' + HASH_ADD_JSON_FILE).then(response => {
      let test = response.data;
      console.log(test);
    });
    */

    //POST /api/auth/sign_in { "email": "student@skillfactory.ru", "password": "123456" }

    const hostAndPortForApi = 'http://84.201.129.203:8888/';
    const connectionApiNoAuth = axios.create({
      baseURL: hostAndPortForApi,
      timeout: 0,
      headers: {
        'Content-type': 'application/json',
      }
    });

    const connectionApiAuth = axios.create({
      baseURL: hostAndPortForApi,
      timeout: 0,
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHByb3ZlZCI6dHJ1ZSwiX2lkIjoiNWZhNmYxNDYwYmQ3NTkwMDExZjNhODc4IiwiZW1haWwiOiJ0ZXN0MUBhdGViaW4ucnUiLCJmaXJzdE5hbWUiOiJmbl90ZXN0MSIsImxhc3ROYW1lIjoibG5fdGVzdDEiLCJjbGllbnRJZCI6InExdzIiLCJfX3YiOjAsImlhdCI6MTYwNDc3ODQ5OH0.Fw5rzKIYLluxF-knlq928Qal8kfyZYt2_XTdhcSsOQY',
      }
    });    
    
    /*axios_.post(hostAndPortForApi + 'api/auth/sign_in', { "email": "student@skillfactory.ru", "password": "123456" }).then(response => {
      let test = response.data;
      console.log(test);
    }); 
    */   

   /*
    connectionApi.post('api/auth/sign_in', { "email": "student@skillfactory.ru", "password": "123456" })
      .then(response => {
        let test = response.data;
        console.log(test);
      })
      .catch(err => {
        console.log(err);

      });   
    */ 

    /*
    connectionApi.post('api/auth/sign_up', this.state.dataUserSignUp)
      .then(response => {
        let test = response.data;
        console.log(test);
      })
      .catch(err => {
        console.log(err);
      });
      */

    connectionApiNoAuth.post('api/auth/sign_in', this.state.dataUserSignIn)
      .then(response => {
        let test = response.data;
        console.log('post: api/auth/sign_in');
        console.log(test);
        console.log(test.token);
        console.log('---------------------------');
      })
      .catch(err => {
        console.log('post: api/auth/sign_in');
        console.log(err);
        console.log('===========================');      
      });
      
    connectionApiAuth.get('api/officers')
      .then(response => {
        let test = response.data;
        console.log('get: api/officers');
        console.log(test);
        console.log('---------------------------');      
      })
      .catch(err => {
        console.log('get: api/officers');
        console.log(err);
        console.log('===========================');      
      });      
      
    connectionApiAuth.get('api/officers/5fa6f1460bd7590011f3a878')
      .then(response => {
        let test = response.data;
        console.log('get: api/officers/:id');
        console.log(test);
        console.log('---------------------------');      
      })
      .catch(err => {
        console.log('get: api/officers/:id');
        console.log(err);
        console.log('===========================');      
      });  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
