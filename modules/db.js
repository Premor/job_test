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
		type: Sequelize.INTEGER,
		defaultValue: 0
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
        type:Sequelize.DOUBLE
    },
    time:{
        type:Sequelize.DATE
        //defaultValue:Date.now()
    }
},{
    freezeTableName: true,
    timestamps:false,
    // classMethods: {
    //     associate: function(models) {
    //         Found.hasMany( models.likvid_book);
    //     }
    // }
});
const Found = sequelize.define('fonds',{
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
        type:Sequelize.INTEGER({length:1}),
        defaultValue:0
    },
    invest_idea:{
        type:Sequelize.INTEGER({length:1}),
        defaultValue:0
    },
    invest_idea_date_end:{
        type:Sequelize.DATE,
        
    },
    doc:{
        type:Sequelize.STRING,
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
    //         Found.hasMany( models.likvid_book);
    //     }
    // }
});
//Found.hasMany(Likvid_book,{foreignKey:'fond_id',sourceKey:'name',targetKey:'name'});
Likvid_book.belongsTo(Found,{foreignKey:'fond_id'});

Countries.sync();
Currencys.sync();
Likvid_book.sync();
Found.sync();


module.exports.seq = sequelize;
module.exports.tables = [Countries,Currencys,Likvid_book,Found];

module.exports.findAll = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.findAll(options); break;
        case 'countries': ret = Countries.findAll(options); break;
        case 'likvid_book': ret = Likvid_book.findAll(options);break;
        case 'fonds': ret = Found.findAll(options);break;
    }
    return ret;
}

module.exports.create = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.create(options); break;
        case 'countries': ret = Countries.create(options); break;
        case 'likvid_book': ret = Likvid_book.create(options);break;
        case 'fonds': ret = Found.create(options);break;
    }
    return ret;
}
module.exports.destroy = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.destroy(options); break;
        case 'countries': ret = Countries.destroy(options); break;
        case 'likvid_book': ret = Likvid_book.destroy(options);break;
        case 'fonds': ret = Found.destroy(options);break;
    }
    return ret;
}
module.exports.update = (table,val,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.update(val,options); break;
        case 'countries': ret = Countries.update(val,options); break;
        case 'likvid_book': ret = Likvid_book.update(val,options);break;
        case 'fonds': ret = Found.update(val,options);break;
    }
    return ret;
}