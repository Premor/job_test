$(document).ready(function () {
  
  Vue.component('modal', {
    props: ['test2'],
    template: '#modal-template',
    
    
  });
  new Vue({
    el: '#app',
    data: {
      showModal: false,
      showModal2: false,
      

      content:{type:Object},
    },
    computed:{
      change_url:function(){return `/db/change/${path_split[path_split.length-2]}?id=${this.content}`},
      remove_url:function(){return `/db/delete/${path_split[path_split.length-2]}?id=${this.content}`},
    },
    methods: {
      test: function (e) {
        console.log(e);
        this.content = JSON.parse(e);
        this.showModal = true;
        return 0;
      },
      submit_change:function(){
        alert('YPA')
      }
  
    }
  });
  let path_split = window.location.pathname.split('/');
  
  
  
  // $('button[name=add]').click(function(){
  //     window.location.href = `/db/add/${path_split[path_split.length-2]}/`;
  // });
  // $('button[name=change]').click(function(){
  //     window.location.href = `/db/change/${path_split[path_split.length-2]}?id=${$(this).val()}`;
  // });
  // $('button[name=delete]').click(function(){
  //     window.location.href = `/db/delete/${path_split[path_split.length-2]}?id=${$(this).val()}`;
  // });
});
// register modal component



// start app
