const Sequelize = require('sequelize');
const sequelize = new Sequelize(F.config['db-name'], F.config['db-user'], F.config['db-password'], {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

});

const Nav_detail = sequelize.define('nav_detail',{
    time:{type:Sequelize.DATE},
company:{type:Sequelize.STRING},
price_in:{type:Sequelize.DOUBLE},
price_out:{type:Sequelize.DOUBLE},
allocation:{type:Sequelize.DOUBLE},
fond_id:{type:Sequelize.INTEGER},
},{
    freezeTableName:true,
    timestamps:false,
})

const Currencys = sequelize.define('currencys', {
	name: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title: {
		type: Sequelize.STRING,
		defaultValue: ''
	}
}, {
    freezeTableName: true,
	timestamps: false
})

const Countries = sequelize.define('countries', {
	// id:{
	// 	type:Sequelize.INTEGER,
	// 	primaryKey:true
	// },
	title_ru: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_ua: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_be: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_en: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_es: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_pt: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_de: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_fr: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_it: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_pl: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_ja: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_lt: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_lv: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	title_cz: {
		type: Sequelize.STRING,
		defaultValue: ''
	},
	citizenship_blocked: {
		type:Sequelize.BOOLEAN,
        defaultValue:false
	}
}, {
    freezeTableName: true,
	timestamps: false
});
const Likvid_book = sequelize.define('likvid_book',{
    fond_id:{
        type:Sequelize.INTEGER
    },
    akciacount:{
        type:Sequelize.DOUBLE
    },
    likvidstoim:{
        type:Sequelize.DOUBLE
    },
    voznagrupravl:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    time:{
        type:Sequelize.DATE
        //defaultValue:Date.now()
    }
},{
    freezeTableName: true,
    timestamps:false,
    getterMethods: {
        payPrice(){
            return this.likvidstoim/this.akciacount
        },
        pay_price() {
            console.log("IN PRICE",this);
            
          return this.dataValues['Средства'] / this.dataValues['Кол-во паёв'];
        }
      },
});
const Fond = sequelize.define('fonds',{
    name:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    title:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    upravl_id:{
        type:Sequelize.INTEGER,
        
    },
    ordering:{
        type:Sequelize.INTEGER,
        
    },
    published:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
        // type:Sequelize.INTEGER({length:1}),
        // defaultValue:0
    },
    invest_idea:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    invest_idea_date_end:{
        type:Sequelize.DATE,
        
    },
    doc:{
        type:Sequelize.TEXT,
        defaultValue:''
    },
    information:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    strategy:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    investion_minimal:{
        type:Sequelize.DOUBLE,
    },
    rekom_period:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    dolariska:{
        type:Sequelize.FLOAT,
        
    },
    dolariska_information:{
        type:Sequelize.FLOAT,
        
    },
    voznagrupravl:{
        type:Sequelize.FLOAT,
        
    },
    plan_pribil:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    flex_request_id:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    flex_token:{
        type:Sequelize.STRING,
        defaultValue:''
    },
},{
    freezeTableName:true,
    timestamps:false,
    // classMethods: {
    //     associate: function(models) {
    //         Fond.hasMany( models.likvid_book);
    //     }
    // }
});
const Investors = sequelize.define('investors',{
    first_name:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    middle_name:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    last_name:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    brithday:{
        type:Sequelize.DATE,
        
    },
    pasport_number:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    pasport_company:{
        type:Sequelize.TEXT,
        defaultValue:''
    },
    pasport_company_code:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    pasport_date:{
        type:Sequelize.DATE,
        
    },
    company:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    personal_number:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    email:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    phone:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    password:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    pasport:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    pasport_params:{
        type:Sequelize.TEXT,
        defaultValue:''
    },
    country_id:{
        type:Sequelize.INTEGER,
        
    },
    citizenship_country_id:{
        type:Sequelize.INTEGER,
        
    },
    city:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    addres:{
        type:Sequelize.TEXT,
        defaultValue:''
    },
    balance:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    time_reg:{
        type:Sequelize.DATE,
        
    },
    save_me_code:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    activation_code:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    recovery_code:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    enable:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    accept_contrakt:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    personal_document:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    personal_document_number:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    personal_document_true:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    file_open_lc:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    personal_anketa_file:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    manager_id:{
        type:Sequelize.INTEGER,
        
    },
    blank_anketa_file:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    registration_date:{
        type:Sequelize.DATE,
        
    },
    
},{
    getterMethods: {
        fullName() {
          return `${this.first_name} ${this.middle_name} ${this.last_name}`
        }
      },
    freezeTableName:true,
    timestamps:false
});
const Fonds_map = sequelize.define('fonds_map',{
    fond_id:{
        type:Sequelize.INTEGER,
    },
    investor_id:{
        type:Sequelize.INTEGER,
    },
    voznagrupravl:{
        type:Sequelize.FLOAT,
        defaultValue:0.0
    },
    dolariska:{
        type:Sequelize.FLOAT,
        defaultValue:0.0
    },
    dolariska_information:{
        type:Sequelize.FLOAT,
        defaultValue:0.0
    },
    protection:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    
},{
    freezeTableName:true,
    timestamps:false
});

const History = sequelize.define('akciahistory',{
    investor_id:{
        type:Sequelize.INTEGER
    },
    fond_id:{
        type:Sequelize.INTEGER
    },
    akciacount:{
        type:Sequelize.DOUBLE
    },
    akciacena:{
        type:Sequelize.DOUBLE
    },
    time:{
        type:Sequelize.DATE
    },
    
    akciacenamiddle:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    akciacenamaxmiddle:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    voznagrupravl_bool:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    likvid_book_id:{
        type:Sequelize.INTEGER,
        defaultValue:0,
    }
},{
    freezeTableName:true,
    timestamps:false
});

const Request = sequelize.define('requests',{
    fond_id:{
        type:Sequelize.INTEGER,
    },
    investor_id:{
        type:Sequelize.INTEGER,
    },
    request_action_id:{
        type:Sequelize.INTEGER,
    },
    currency_id:{
        type:Sequelize.INTEGER,
        defaultValue:1,
    },
    status_id:{
        type:Sequelize.INTEGER,
    },
    text:{
        type:Sequelize.TEXT,
        defaultValue:''
    },
    status_comment:{
        type:Sequelize.TEXT,
        defaultValue:''
    },
    time:{
        type:Sequelize.DATE,  
    },
    money:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    commission:{
        type:Sequelize.DOUBLE,
        defaultValue:0.0
    },
    beneficiary_name:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    account_number:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    beneficiary_bank_name:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    swift:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    beneficiary_address:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    bank_address:{
        type:Sequelize.STRING,
        defaultValue:''
    },
    invoice_file:{
        type:Sequelize.STRING,
        defaultValue:''
    },
},{
    freezeTableName:true,
    timestamps:false    
})
const Status = sequelize.define('status',{
    title:{
        type: Sequelize.STRING
    },
    ordering:{
        type:Sequelize.INTEGER,
    }
},{
    freezeTableName:true,
    timestamps:false
})
//Fond.hasMany(Likvid_book,{foreignKey:'fond_id',sourceKey:'name',targetKey:'name'});
Likvid_book.belongsTo(Fond,{foreignKey:'fond_id'});
//Likvid_book.belongsToMany(History,{foreignKey:'fond_id',sourceKey:'fond_id'})
Fond.belongsTo(Investors,{foreignKey:'upravl_id',as:'Управляющий',});
Fonds_map.belongsTo(Fond,{foreignKey:'fond_id'});
Fonds_map.belongsTo(Investors,{foreignKey:'investor_id',as:'Инвестор'});

Nav_detail.sync();
Countries.sync();
Currencys.sync();
Likvid_book.sync();
Fond.sync();
Investors.sync();
Fonds_map.sync();
History.sync();
Request.sync();
Status.sync();


module.exports.seq = sequelize;
module.exports.tables = {countries:Countries,
    currencys:Currencys,
    likvid_book:Likvid_book,
    fond:Fond,
    investors:Investors,
    fonds_map:Fonds_map,
    history:History,
    request:Request,
    status:Status,
    nav_detail:Nav_detail,
};

module.exports.findAll = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.findAll(options); break;
        case 'countries': ret = Countries.findAll(options); break;
        case 'likvid_book': ret = Likvid_book.findAll(options);break;
        case 'fonds': ret = Fond.findAll(options);break;
        case 'investors': ret = Investors.findAll(options);break;
        case 'fonds_map': ret = Fonds_map.findAll(options);break;
        case 'akciahistory': ret = History.findAll(options);break;    
        case 'requests': ret = Request.findAll(options);break;
        case 'nav_detail': ret = Nav_detail.findAll(options);break;
    }
    return ret;
}

module.exports.create = (table,val,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.create(val,options); break;
        case 'countries': ret = Countries.create(val,options); break;
        case 'likvid_book': ret = Likvid_book.create(val,options);break;
        case 'fonds': ret = Fond.create(val,options);break;
        case 'investors': ret = Investors.create(val,options);break;
        case 'fonds_map': ret = Fonds_map.create(val,options);break;
        case 'akciahistory': ret = History.create(val,options);break;
        case 'requests': ret = Request.create(val,options);break;
        case 'nav_detail': ret = Nav_detail.create(val,options);break;
    }
    return ret;
}
module.exports.destroy = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.destroy(options); break;
        case 'countries': ret = Countries.destroy(options); break;
        case 'likvid_book': ret = Likvid_book.destroy(options);break;
        case 'fonds': ret = Fond.destroy(options);break;
        case 'investors': ret = Investors.destroy(options);break;
        case 'fonds_map': ret = Fonds_map.destroy(options);break;
        case 'akciahistory': ret = History.destroy(options);break;
        case 'requests': ret = Request.destroy(options);break;
        case 'nav_detail': ret = Nav_detail.destroy(options);break;
    }
    return ret;
}
module.exports.update = (table,val,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.update(val,options); break;
        case 'countries': ret = Countries.update(val,options); break;
        case 'likvid_book': ret = Likvid_book.update(val,options);break;
        case 'fonds': ret = Fond.update(val,options);break;
        case 'investors': ret = Investors.update(val,options);break;
        case 'fonds_map': ret = Fonds_map.update(val,options);break;
        case 'akciahistory': ret = History.update(val,options);break;
        case 'requests': ret = Request.update(val,options);break;
        case 'nav_detail': ret = Nav_detail.update(val,options);break;
    }
    return ret;
}


const Utils = require('./db_utils');
module.exports.query_func = Utils