exports.install = function() {
	ROUTE('/*', view_cms);

	ROUTE('#posts',   view_posts,        ['*Post']);
	ROUTE('#post',    view_posts_detail, ['*Post']);
	ROUTE('#notices', view_notices,      ['*Notice']);

	ROUTE('/design/', '=design/index');

	//new api
	ROUTE('GET /db/', db_view);
	ROUTE('GET /db/add/',db_add_view);
	ROUTE('POST /db/add/',db_add);
	ROUTE('GET /db/delete/',db_remove);
};

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

const Countries = sequelize.define('countries', {
	// id:{
	// 	type:Sequelize.INTEGER,
	// 	primaryKey:true
	// },
	title_ru: {
	  type: Sequelize.STRING,
	  defaultValue:''
	},
	title_ua: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_be: {
	  	type: Sequelize.STRING,
		  defaultValue:''
	},
	title_en: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_es: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_pt: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_de: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_fr: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_it: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_pl: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_ja: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_lt: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_lv: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	title_cz: {
		type: Sequelize.STRING,
		defaultValue:''
	},
	citizenship_blocked:{
		type: Sequelize.INTEGER,
		defaultValue:0
	}
  },
  {
	timestamps:false
  });
Countries.sync();


function view_cms() {
	this.CMSpage();
}

function view_posts() {
	var self = this;
	var options = {};

	options.page = self.query.page;
	options.published = true;
	options.limit = 10;
	// options.category = 'category_linker';

	self.sitemap();
	self.$query(options, self.callback('posts'));
}

function view_posts_detail(linker) {

	var self = this;
	var options = {};

	options.linker = linker;
	// options.category = 'category_linker';

	self.$workflow('render', options, function(err, response) {

		if (err) {
			self.throw404();
			return;
		}

		self.sitemap();
		self.sitemap_replace(self.sitemapid, response.name);
		self.view('cms/' + response.template, response);
	});
}

function view_notices() {
	var self = this;
	var options = {};

	options.published = true;

	self.sitemap();
	self.$query(options, self.callback('notices'));
}

function db_add(){
	Countries.create(this.body)
	.then((val)=>{this.json({ok:val})})
	.catch((err)=>{this.json({err:err})})
}
function db_remove(){
	if(this.query.id){
	Countries.destroy({where:{id:this.query.id}})
	.then(() => 
		{this.redirect('/db/');
	})
	.catch(err => 
		{this.view('db',{err:`Unable to connect to the database:${err}`});
	});
	}
	else{
		this.redirect('/');
	}
}

function db_add_view(){
	this.view('add');
}

function db_view(){
	Countries.findAll()
	.then(val => 
		{this.view('db',{ok:'Connection has been established successfully.',data:val});
	})
	.catch(err => 
		{this.view('db',{err:`Unable to connect to the database:${err}`});
	});
	// sequelize
	// .authenticate()
	// .then(() => {
	// 	this.json({ok:'Connection has been established successfully.'});
	// })
	// .catch(err => {
	// 	this.json({err:`Unable to connect to the database:${err}`});
	// });
}