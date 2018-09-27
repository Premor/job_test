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

	//func admin
	ROUTE('GET /functions/add-money/',add_money_view);
	ROUTE('POST /functions/add-money/',add_money);

	ROUTE('GET /client/add/',client_add_view);
	ROUTE('POST /client/add/',client_add,['upload'],50000);
	//func for table
	ROUTE('GET /db/add/{table}/', db_add_view);
	ROUTE('POST /db/add/{table}/', db_add);
	ROUTE('GET /db/delete/{table}/', db_remove);
	ROUTE('GET /db/change/{table}/', db_add_view);
	ROUTE('POST /db/change/{table}/', db_change);
	ROUTE('GET /db/view/{table}/', db_view);


	ROUTE('GET /test/',test);
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
				attributes: [
					['title_ru', 'Наименование на русском'],
					['title_en', 'Наименование на английском'],
					['citizenship_blocked', 'Запрет гражданства']
				]
			}
			break;
		case 'fonds':
			options = {
				include: [{
					//as:'Управляющий',
					model: DB.tables.investors,
					as: 'Управляющий',
					required: true,
					//raw:true,
					attributes: ['first_name', 'middle_name', 'last_name', ['first_name', 'full_name']]
				}],
				attributes: [
					['name', 'Идентификатор'],
					['title', 'Наименование'],
					['invest_idea', 'Идея'],
					['invest_idea_date_end', 'Дата окончания идеи'],
					['published', 'Публиковать'],
					['ordering', 'Порядок']
				],
				order: [
					['name']
				]

			};
			break;

		case 'likvid_book':
			options = {
				attributes: [
					['akciacount', 'Кол-во паёв'],
					['likvidstoim', 'Средства'],
					['likvidstoim', 'Цена пая'],
					['voznagrupravl', 'Вознаграждение управляющему'],
					['time', 'Время']
				],
				include: [{
					model: DB.tables.fond,
					required: true,
					attributes: ['name']
				}]
			};
			break;
		case 'fonds_map':
			options = {
				attributes: [
					['voznagrupravl', 'Вознаграждения управляющего, %'],
					['dolariska', 'Доля риска, %'],
					['dolariska_information', 'Информировать при риске, %'],
					['protection', 'Защита капитала, USD']
				],
				include: [{
						model: DB.tables.fond,
						required: true,
						attributes: ['name']
					},
					{
						model: DB.tables.investors,
						as: 'Инвестор',
						required: true,
						attributes: ['first_name', 'middle_name', 'last_name', ['first_name', 'full_name']]
					}
				]
			};
			break;
		case 'investors':
			options = {
				attributes: ['balance',['balance','Инвестировано средств'], 'first_name', 'middle_name', 'last_name', ],
				group:['id']
			};
			break;


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
	specific_view(this,table,options);
	DB.findAll(table, options)
		.then(val => {
			let data = [];
			switch (table) {
				case 'fonds':
					for (i of val) {

						i.dataValues['Управляющий'].dataValues.full_name = i.dataValues['Управляющий'].fullName;
						delete i.dataValues['Управляющий'].dataValues.first_name;
						delete i.dataValues['Управляющий'].dataValues.middle_name;
						delete i.dataValues['Управляющий'].dataValues.last_name;
						// data.push(i.dataValues);
					};
					break;
				case 'fonds_map':
					for (i of val) {

						i.dataValues['Инвестор'].dataValues.full_name = i.dataValues['Инвестор'].fullName;
						delete i.dataValues['Инвестор'].dataValues.first_name;
						delete i.dataValues['Инвестор'].dataValues.middle_name;
						delete i.dataValues['Инвестор'].dataValues.last_name;
						// data.push(i.dataValues);
					};
					break;
				case 'likvid_book':
					for(i of val){
					i.dataValues['Цена пая'] = i.pay_price
					//console.log(val[0])
					//i.dataValues.pray
					};break;
				case 'investors':
					for (i of val){
						//i.dataValues['Инвестировано средств'] =
					}
			}
			this.view('db', {
				ok: 'Connection has been established successfully.',
				data: val
			});
		})
		.then()
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


function client_add_view(){
	this.view('client/add');
}

function client_add(){
	console.log(this.body)
	DB.create('investors',this.body)
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

function add_money_view(){
	DB.findAll('fonds',{attributes:['id','name']})
	.then((val)=>{let data=[];for (i of val){data.push(i.dataValues)}; this.view('functions/add_money',data);})
	
}

function add_money(){
	let money = parseInt(this.body.money);
	if (money){
		DB.findAll('likvid_book',{limit:1,order:[['time','DESC']]})
		.then((val)=>{let buf=val[0].dataValues; buf.likvidstoim+=money;buf.time = Date.now();delete buf.id;return DB.create('likvid_book',buf) })
		.then((val)=>{this.json({ok:val})})
		.catch((err)=>{this.json({err:err})})
	}

		//this.json({ok:'KAEF'});}
	else {this.json({err:'Parasha',val:typeof money})};
}

async function specific_view(self,table,options){
	// let res;
	// if (table == 'investors'){
	// 	let val = await DB.findAll(table,options)
	// 	let val2 = await DB.findAll('fonds_map',{
	// 		include: [{
	// 			model: DB.tables.fond,
	// 			required: true,
	// 			attributes: ['name']
	// 		}]
	// 	})
	// 	for (i in val)
	// }
}
function test(){
	DB.update('investors',)
}