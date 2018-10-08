$(document).ready(()=>{
    Vue.component('test',{
        props:['el'],
        template:'<h1>{{ el }}</h1>'
    });
    const app = new Vue({
    el: '#app',
     data: {
       ell: 'Привет, Vue!',
    //    methods:{
    //        ti:function(e){

    //        },
    //    }
     }
  });
//   $('.qwe').onclick(function(e){
//       app.ell = $(this).val()
//   })
});