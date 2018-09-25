exports.install = function () {
	ROUTE('/*', view_cms);

	ROUTE('#posts', view_posts, ['*Post']);
	ROUTE('#post', view_posts_detail, ['*Post']);
	ROUTE('#notices', view_notices, ['*Notice']);

	ROUTE('/design/', '=design/index');

	//new api
	ROUTE('GET /', db_select)
	//select table
	ROUTE('GET /db/', db_select_view);

	//func for table
	ROUTE('GET /db/add/{table}/', db_add_view);
	ROUTE('POST /db/add/{table}/', db_add);
	ROUTE('GET /db/delete/{table}/', db_remove);
	ROUTE('GET /db/change/{table}/', db_add_view);
	ROUTE('POST /db/change/{table}/', db_change);
	ROUTE('GET /db/view/{table}/', db_view);
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
	DB.create(table, this.body)
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

}


function db_remove(table) {
	if (this.query.id) {
		DB.destroy(table, {
				where: {
					id: this.query.id
				}
			})
			.then(() => {
				this.redirect(`/db/view/${table}/`);
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

function db_select_view() {
	this.view('select-table');
}

function db_view(table) {
	console.log('VIEW', table);
	let options;
	switch (table) {
		case 'countries':
			options = {
				attributes:[['title_ru','Наименование на русском'],['title_en','Наименование на английском'],['citizenship_blocked','Запрет гражданства']]
			}
			break;
		case 'fonds': options = {
				include:[{
					//as:'Управляющий',
					model:DB.tables.investors,
					required:true,
					attributes:['first_name']
				}],
				attributes:[['name','Идентификатор'],['title','Наименование'],['invest_idea','Идея'],['invest_idea_date_end','Дата окончания идеи'],['published','Публиковать'],['ordering','Порядок']],
				
		};break;

		case 'likvid_book':
			options = {
				include: [{
					model: DB.tables.fond,
					required: true,
					attributes: ['name']
				}]
			};
			break;
		case 'fonds_map': options = {
				attributes:[['voznagrupravl','Вознаграждения управляющего, %'],['dolariska','Доля риска, %'],['dolariska_information','Информировать при риске, %'],['protection','Защита капитала, USD']],
				include: [{
					model: DB.tables.fond,
					required: true,
					attributes: ['name']
				},
				{
					model: DB.tables.investors,
					required: true,
					attributes: ['first_name']
				}]
		};break;
		case 'investors': options = {
			attributes:['balance','first_name','middle_name','last_name']
		};break;


			// case 'likvid_book':DB.seq.query('SELECT nekrus_ecofin_lk.likvid_book.fond_id,nekrus_ecofin_lk.likvid_book.akciacount,nekrus_ecofin_lk.likvid_book.likvidstoim,nekrus_ecofin_lk.fonds.name FROM nekrus_ecofin_lk.likvid_book left outer join nekrus_ecofin_lk.fonds on nekrus_ecofin_lk.fonds.id = nekrus_ecofin_lk.likvid_book.fond_id',{model:DB.tables[DB.tables.length-2]}).then(val => {
			// 	if (!val){throw Error('haven\'t value')}
			// 	this.view('db', {
			// 		ok: 'Connection has been established successfully.',
			// 		data: val
			// 	});
			// }) ; break;




		default:
			options = {};
	}
	DB.findAll(table, options)
		.then(val => {
			if (!val) {
				throw Error('haven\'t value')
			}
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

}

function db_select() {
	console.log('SELECT', this.body.table);
	this.redirect(`/db/view/${this.body.table}`);
}



////////////////////////////////////////

function db_change(table) {
	for (i in this.body) {
		if (this.body[i] == '') {
			delete this.body[i];
		}
	}
	if (this.query.id) {
		DB.update(table, this.body, {
				where: {
					id: this.query.id
				}
			})
			.then(() => {
				this.redirect(`/db/view/${table}/`);
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