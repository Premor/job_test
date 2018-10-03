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

	ROUTE('GET /test/add_money_fond/', test_add_money);

	//func admin
	ROUTE('GET /functions/add-money/', add_money_view);
	ROUTE('POST /functions/add-money/', add_money);

	ROUTE('GET /client/add/', client_add_view);
	ROUTE('POST /client/add/', client_add, ['upload'], 50000);
	//func for table
	ROUTE('GET /db/add/{table}/', db_add_view);
	ROUTE('POST /db/add/{table}/', db_add);
	ROUTE('GET /db/delete/{table}/', db_remove);
	ROUTE('GET /db/change/{table}/', db_add_view);
	ROUTE('POST /db/change/{table}/', db_change);
	ROUTE('GET /db/view/{table}/', db_view);

	ROUTE('GET /request/add/', add_request);
	ROUTE('GET /request/accept/', accept_request);

	ROUTE('GET /test/', test);
};

const DB = require('../modules/db');
const SQL = require('../modules/sql_scripts');


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


function add_request() {
	DB.create('requests', {
			fond_id: this.query.fond,
			investor_id: this.query.investor,
			request_action_id: this.query.request_id,
			status_id: 3,
			time: new Date(),
			money: this.query.money,
		})
		.then((val) => {
			this.json({
				data: val
			})
		})
		.catch((err) => {
			this.json({
				err: err
			})
		})

}


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

async function accept_request() {
	await DB.seq.transaction(async (t) => {
		try {
			const id_parse = parseInt(this.query.id);
			const buf = (await DB.update('requests', {
				status_id: 1
			}, {
				where: {
					id: id_parse,
				},
				transaction: t
			}))[0]
			console.log(buf);
			if(!buf){throw new Error('update error')}
			const req = (await DB.findAll('requests',{where:{
				id: id_parse,
			},
			transaction:t,
		}))[0]
			console.log(req);
			await test_add_money(t,this,this.query);
		} catch (err) {
			await t.rollback()
			this.json({err:err})
		}
	})
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

function get_options(table) {
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
				attributes: ['balance', ['balance', 'Инвестировано средств'], 'first_name', 'middle_name', 'last_name', ],
				group: ['id']
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
}

function db_view(table) {
	console.log('VIEW', table);
	let options;

	options = get_options(table);

	specific_view(this, table, options);

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


function client_add_view() {
	this.view('client/add');
}

function client_add() {
	console.log(this.body)
	DB.create('investors', this.body)
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

function add_money_view() {
	DB.findAll('fonds', {
			attributes: ['id', 'name']
		})
		.then((val) => {
			let data = [];
			for (i of val) {
				data.push(i.dataValues)
			};
			this.view('functions/add_money', data);
		})

}

async function add_money() {
	let money = parseInt(this.body.money);
	if (money) {
		try {
			let count = (await DB.query_func.get_curr_count(this.body.id)).count;
			console.log('MONEY COUNT', count);
			let nav = (await DB.query_func.get_nav(this.body.id)).price;
			let new_nav_history = {};
			new_nav_history.fond_id = this.body.id;
			new_nav_history.likvidstoim = count * nav + money;
			new_nav_history.akciacount = count;
			new_nav_history.time = Date.now();
			const res = await DB.create('likvid_book', new_nav_history)
			this.json({
				ok: res
			})
		} catch (err) {
			this.json({
				err: err
			})
		}
	}

	//this.json({ok:'KAEF'});}
	else {
		this.json({
			err: 'Parasha',
			val: typeof money
		})
	};
}

async function specific_view(self, table, options) {

	let res;
	switch (table) {
		case 'investors':
			try {
				//let buf = await DB.

				let buf = await DB.seq.query(SQL.get_money, {
					type: DB.seq.QueryTypes.SELECT
				})
				//self.json({data:buf})
				self.view('db_raw', {
					ok: 'Connection has been established successfully.',
					data: buf
				});
			} catch (err) {
				self.json({
					err: err
				})
			};
			break;
		default:
			try {
				let val = await DB.findAll(table, options)
				let data = [];
				switch (table) {
					case 'fonds':
						for (i of val) {

							i.dataValues['Управляющий'].dataValues.full_name = i.dataValues['Управляющий'].fullName;
							delete i.dataValues['Управляющий'].dataValues.first_name;
							delete i.dataValues['Управляющий'].dataValues.middle_name;
							delete i.dataValues['Управляющий'].dataValues.last_name;
							//позор мне за этот говнокод, надо исправить(наверное)
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
						for (i of val) {
							i.dataValues['Цена пая'] = i.pay_price
							//console.log(val[0])
							//i.dataValues.pray
						};
						break;
					case 'investors':
						for (i of val) {
							//i.dataValues['Инвестировано средств'] =
						}
				}
				self.view('db', {
					ok: 'Connection has been established successfully.',
					data: val
				});
			} catch (err) {
				self.view('db', {
					err: `Unable to connect to the database:${err}`
				});
			}
	}
}

function test() {
	DB.update('investors', )
}

async function test_add_money(t, self, args) {
		if (args.type == 'raw') {
			//let time = Date.now();
			let res = await DB.seq.query(SQL.update_history)
			//let rese = Date.now() - time
			self.json({
				data: res,
				time: rese
			})
		}
		const arg = {};
		arg.money = parseInt(args.money);
		arg.fond = parseInt(args.fond);
		arg.investor = parseInt(args.investor);
		//let time = Date.now()
		const cur_investor = (await DB.findAll('investors', {
			where: {
				id: arg.investor
			},
			transaction: t,
		}))[0]
		if (args.money && arg.money > 0 && cur_investor.balance >= arg.money) {
			await DB.update('investors', {
				balance: cur_investor.balance - arg.money
			}, {
				where: {
					id: arg.investor
				},
				transaction: t
			})
			if (!args.fond) {
				throw Error('havnt fond id')
			}
			if (!await DB.query_func.investor_fonds_exsist(cur_investor.id, arg.fond)) {
				await DB.create('fonds_map', {
					investor_id: cur_investor.id,
					fond_id: arg.fond
				}, {
					transaction: t
				})
			}
			const nav = await DB.query_func.get_nav(arg.fond);
			console.log('TEST', test);
			const res = await DB.create('akciahistory', {
				fond_id: arg.fond,
				investor_id: arg.investor,
				akciacena: nav.price,
				akciacount: arg.money / nav.price,
				time: new Date(),
			}, {
				transaction: t
			})
			//let rese = Date.now() - time
			self.json({
				data: res,
				time_test: test
			})



		} else {
			throw Error('incorrect monney or not enough balance')
		}
	 
	

}