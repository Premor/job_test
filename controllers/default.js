exports.install = function () {
	ROUTE('/*', view_cms);

	ROUTE('#posts', view_posts, ['*Post']);
	ROUTE('#post', view_posts_detail, ['*Post']);
	ROUTE('#notices', view_notices, ['*Notice']);

	ROUTE('/design/', '=design/index');

	//new api
	ROUTE('GET /',db_select)
	//ROUTE('POST /db/', db_select);
	ROUTE('GET /db/', db_select_view);
	
	ROUTE('GET /db/add/{table}/', db_add_view);
	ROUTE('POST /db/add/{table}/', db_add);
	ROUTE('GET /db/delete/', db_remove);
	ROUTE('GET /db/change/', db_add_view);
	ROUTE('POST /db/change/', db_change);

	ROUTE('GET /db/view/{table}/', db_view)



	ROUTE('GET /db/currencys/', db_currency)
	ROUTE('GET /db/add_curr/', change_curr);
	ROUTE('POST /db/add_curr/', db_add_curr);
	ROUTE('GET /db/delete_curr/', db_remove_curr);
	ROUTE('GET /db/change_curr/', change_curr);
	ROUTE('POST /db/change_curr/', db_change_curr);

	
};

const DB = require('../modules/db');




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

	self.$workflow('render', options, function (err, response) {

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


// new func
///
///
///



function db_add(table) {
	switch (table) {
		case 'countries':
			DB.create(table,this.body)
			.then((val) => {
				this.json({
					ok: val
				});
			})
			.catch((err) => {
				this.json({
					err: err
				});
			});
			break;
		case 'currencys':
			DB.create(table,this.body)
			.then((val) => {
				this.json({
					ok: val
				});
			})
			.catch((err) => {
				this.json({
					err: err
				});
			});
			break;
		default:
			this.json({err:'Not found'});
	}
}

function db_add_curr() {
	Currencys.create(this.body)
		.then((val) => {
			this.json({
				ok: val
			})
		})
		.catch((err) => {
			this.json({
				err: err
			})
		})
}

function db_remove() {
	if (this.query.id) {
		Countries.destroy({
				where: {
					id: this.query.id
				}
			})
			.then(() => {
				this.redirect('/db/');
			})
			.catch(err => {
				this.view('db', {
					err: `Unable to connect to the database:${err}`
				});
			});
	} else {
		this.redirect('/');
	}
}

function db_add_view(table) {
	this.view(`add_${table}`);
}

function db_select_view(){
	this.view('select-table');
}

function db_view(table){
	console.log('VIEW',table)
	DB.findAll(table)
				.then(val => {
					this.view('db', {
						ok: 'Connection has been established successfully.',
						data: val
					});
				})
				.catch(err => {
									this.view('db', {
										err: `Unable to connect to the database:${err}`
									});
								});
	// switch (table) {
	// 	case 'countries':
	// 		DB.findAll(table)
	// 			.then(val => {
	// 				this.view('db', {
	// 					ok: 'Connection has been established successfully.',
	// 					data: val
	// 				});
	// 			})
	// 			.catch(err => {
	// 				this.view('db', {
	// 					err: `Unable to connect to the database:${err}`
	// 				});
	// 			});
	// 		break;
	// 	case 'currencys':
	// 		DB.findAll(table)
	// 			.then(val => {
	// 				this.view('db', {
	// 					ok: 'Connection has been established successfully.',
	// 					data: val
	// 				});
	// 			})
	// 			.catch(err => {
	// 				this.view('db', {
	// 					err: `Unable to connect to the database:${err}`
	// 				});
	// 			});
	// 		break;
	// 	default:
			
	// }
}

function db_select() {
	console.log('SELECT',this.body.table);
	this.redirect(`/db/view/${this.body.table}`);
}



////////////////////////////////////////


function db_currency() {
	DB.findAll('currencys')
		.then(val => {
			this.view('db_currency', {
				ok: 'Connection has been established successfully.',
				data: val
			});
		})
		.catch(err => {
			this.view('db_currency', {
				err: `Unable to connect to the database:${err}`
			});
		})
}

function db_change() {
	for (i in this.body) {
		if (this.body[i] == '') {
			delete this.body[i];
		}
	}
	if (this.query.id) {
		Countries.update(this.body, {
				where: {
					id: this.query.id
				}
			})
			.then(() => {
				this.redirect('/db/');
			})
			.catch(err => {
				this.view('db', {
					err: `Unable to connect to the database:${err}`
				});
			});
	} else {
		this.redirect('/db/');
	}
}

function change_curr() {
	this.view('change_curr');
}

function db_remove_curr() {
	if (this.query.id) {
		Currencys.destroy({
				where: {
					id: this.query.id
				}
			})
			.then(() => {
				this.redirect('/db/currencys/');
			})
			.catch(err => {
				this.view('db_currency', {
					err: `Unable to connect to the database:${err}`
				});
			});
	} else {
		this.redirect('/');
	}
}

function db_change_curr() {
	for (i in this.body) {
		if (this.body[i] == '') {
			delete this.body[i];
		}
	}
	if (this.query.id) {
		Currencys.update(this.body, {
				where: {
					id: this.query.id
				}
			})
			.then(() => {
				this.redirect('/db/change_curr/');
			})
			.catch(err => {
				this.view('change_curr', {
					err: `Unable to connect to the database:${err}`
				});
			});
	} else {
		this.redirect('/db/change_curr/');
	}
}