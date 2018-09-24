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
	timestamps: false
});
Countries.sync();
Currencys.sync();

module.exports.findAll = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.findAll(options); break;
        case 'countries': ret = Countries.findAll(options); break;
    }
    return ret;
}

module.exports.create = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.create(options); break;
        case 'countries': ret = Countries.create(options); break;
    }
    return ret;
}
module.exports.destroy = (table,options={})=>{
    let ret;
    switch(table){
        case 'currencys':  ret = Currencys.destroy(options); break;
        case 'countries': ret = Countries.destroy(options); break;
    }
    return ret;
}