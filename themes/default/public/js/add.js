$(document).ready(function () {
    const vm = new Vue({
        el: '#app',
        data: {
            fonds: {
                type: Array,
            },
            load: false,
            content:{type:Object},
            error:[],
            answer:{type:Object},

        },
        methods: {
            get_content: function () {
                axios.get(`/api/functions/add-money/`)
                    .then((val) => {
                        this.fonds = val.data;
                        this.load = true;
                    })
                    .catch((val) => {
                        this.fonds = val
                    });
            },
            send_money:function(){
                this.error=[];
                if (!(this.content.fond&&this.content.money&&this.content.price_in&&this.content.price_out&&this.content.allocation&&this.content.company)){return this.error.push('Введите все поля');}
                if (this.content.allocation<0||this.content.allocation>100) {return this.error.push('Некоррекная аллокация');}
                axios.post('/api/functions/add-money/',this.content)
                .then((val)=>{console.log(val);this.answer = val.data;})
                .catch((error)=>{this.error.push(error)});
            }
        },
    });
    vm.get_content();
});