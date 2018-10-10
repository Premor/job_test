$(document).ready(function () {

  Vue.component('modal', {
    props: ['test2'],
    template: '#modal-template',


  });

  Vue.component('editable-ell', {
    props: ['content', 'num'],
    template: `<div><span v-for="el in content" v-bind:class="'col-xs'">{{el}} </span></div>`,
  });
  const vm = new Vue({
    el: '#app',
    data: {
      showModal: false,
      showModal2: false,
      load: false,
      current_el: 0,
      update_el: {
        type: Object
      },

      content: {
        type: Object
      },
    },
    computed: {
      change_url: function () {
        return `/db/change/${table}`
      },
      remove_url: function () {
        return `/db/delete/${table}?id=${this.content.id}`
      },
    },
    methods: {
      modal: function (num) {
        this.current_el = num;
        this.showModal = true;
        this.update_el = this.content[num];
        console.log(this.update_el)
      },
      submit_change: function (e, val) {
        axios.post(this.change_url, this.update_el)
          .then((val) => {
            alert(`SUCCESS`);
            console.log(val)
          })
          .catch((err) => {
            alert(`fail ${err}`);
            console.log(err)
          });
      },
      get_content: function () {
        axios.get(`/api/db/view/${table}/`)
          .then((val) => {
            this.content = val.data;
            this.load = true;
          })
          .catch((val) => {
            this.content = val
          });
      },

    }
  });
  const path_split = window.location.pathname.split('/');
  const table = path_split[path_split.length - 2];
  vm.get_content();



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