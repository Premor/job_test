const Sequelize = require('sequelize');
const sequelize = new Sequelize('nekrus_ecofin_lk', 'hello', '1a2b3c4d', {
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

const Test1 = sequelize.define('test1',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    names_id:{
        type: Sequelize.INTEGER,
    }
},{
    freezeTableName:true
})
const Test2 = sequelize.define('test2',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    names:{
        type: Sequelize.STRING,
        defaultValue:''
    }
},{
    freezeTableName:true
})
Test1.belongsTo(Test2,{foreignKey:'names_id'})
Test1.sync();
Test2.sync();


Test1.findAll({include:[{model:Test2,attributes:['names']}]}).then((val)=>{for(i of val) {console.log(i.dataValues)}})

// Test1.create({names_id:0});
// Test1.create({names_id:1});
// Test1.create({names_id:0});

// Test2.create({names:'qwe'});
// Test2.create({names:'ewq'});
