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
	ROUTE('GET /functions/add-money/', function(){this.view('functions/add_money')});
	
	ROUTE('GET /api/functions/add-money/', add_money_view);
	ROUTE('POST /api/functions/add-money/', add_money);

	ROUTE('GET /functions/comission/', comisson_view);
	ROUTE('GET /api/functions/comission/', comission_get);
	ROUTE('POST /api/functions/comission/', comission_eval);


	ROUTE('GET /client/add/', client_add_view);
	ROUTE('POST /client/add/', client_add, ['upload'], 50000);
	//func for table
	ROUTE('GET /db/add/{table}/', db_add_view);
	ROUTE('POST /db/add/{table}/', db_add);
	ROUTE('GET /db/delete/{table}/', db_remove);
	ROUTE('GET /db/change/{table}/', db_add_view);
	ROUTE('POST /db/change/{table}/', db_change);
	ROUTE('GET /api/db/view/{table}/', db_view);
	ROUTE('GET /db/view/{table}/', vt2);
	

	ROUTE('GET /request/add/', add_request);
	ROUTE('GET /request/accept/', accept_request);

	ROUTE('GET /test/',comission_eval);
	ROUTE('GET /test2/',vt2);

};

const DB = require('../modules/db');
const SQL = require('../modules/sql_scripts');
const Alias_sql = require('../modules/alias_sql');

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

function vt(){this.view('test')}

function vt2(){this.view('db_raw')}


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
	const t = await DB.seq.transaction({
		autocommit: false
	}) //async (t) => {
	try {
		const id_parse = parseInt(this.query.id);
		const req = (await DB.findAll('requests', {
			where: {
				id: id_parse,
			},
		}))[0]
		if (req.status_id != 3) {
			throw new Error('can not accept')
		}
		if (!((await DB.update('requests', {
				status_id: 1
			}, {
				where: {
					id: id_parse,
				},
				transaction: t
			}))[0])) {
			throw new Error('update error')
		}
		const self = this;
		if (!req.investor_id || !req.money || !req.fond_id) {
			throw Error('havnt fond id')
		}
		const cur_investor = (await DB.findAll('investors', {
			where: {
				id: req.investor_id
			},
			transaction: t,
		}))[0]
		switch (req.request_action_id) {
			case 1:
				await money_in_system(cur_investor, req, t);
				break;
			case 2:
				await money_out_system(cur_investor, req, t);
				break;
			case 3:
				await money_to_fond(cur_investor, req, t);
				break;
			case 4:
				await money_out_fond(cur_investor, req, t);
				break;
			default:
				throw new Error('unknow request action');
		}
		await t.commit()
		self.json({
			success: true,
			//time_test: test
		})
	} catch (err) {
		console.log(err);
		await t.rollback()
		this.json({
			err: err
		})
	}

}

async function money_in_system(cur_investor, req, t) {
	if (!(await DB.update('investors', {
			balance: cur_investor.balance + req.money
		}, {
			where: {
				id: cur_investor.id
			},
			transaction: t
		}))[0]) {
		throw new Error('can not update investor balance')
	}
}

async function money_out_system(cur_investor, req, t) {
	if (cur_investor.balance - req.money < 0) throw new Error('dont enough money');
	if (!(await DB.update('investors', {
			balance: cur_investor.balance - req.money
		}, {
			where: {
				id: cur_investor.id
			},
			transaction: t
		}))[0]) {
		throw new Error('can not update investor balance')
	}
}

async function money_to_fond(cur_investor, req, t) {
	if (!(req.money > 0 && cur_investor.balance >= req.money)) {
		throw Error('incorrect monney or not enough balance')
	}
	await DB.update('investors', {
		balance: cur_investor.balance - req.money
	}, {
		where: {
			id: req.investor_id
		},
		transaction: t
	})

	const check = await DB.query_func.investor_fonds_exsist(cur_investor.id, req.fond_id)
	if (!check) {
		await DB.create('fonds_map', {
			investor_id: cur_investor.id,
			fond_id: req.fond_id
		}, {
			transaction: t
		})
	}
	const nav = await DB.query_func.get_nav(req.fond_id);
	await DB.create('akciahistory', {
		fond_id: req.fond_id,
		investor_id: req.investor_id,
		akciacena: nav.price,
		akciacount: req.money / nav.price,
		time: new Date(),
	}, {
		transaction: t
	})
}

async function money_out_fond(cur_investor, req, t) {
	const pai = (await DB.query_func.get_count_pai(cur_investor.id, req.fond_id)).count;
	const nav = await DB.query_func.get_nav(req.fond_id);
	const curr_money = pai * nav.price;
	if (!(req.money > 0 && curr_money >= req.money)) {
		throw Error('incorrect monney or not enough balance')
	}
	await DB.update('investors', {
		balance: cur_investor.balance + req.money
	}, {
		where: {
			id: req.investor_id
		},
		transaction: t
	})

	const check = await DB.query_func.investor_fonds_exsist(cur_investor.id, req.fond_id)
	if (!check) {
		if (req.money == curr_money)
			await DB.destroy('fonds_map', {
				investor_id: cur_investor.id,
				fond_id: req.fond_id
			}, {
				transaction: t
			})
	}
	await DB.create('akciahistory', {
		fond_id: req.fond_id,
		investor_id: req.investor_id,
		akciacena: nav.price,
		akciacount: -(req.money / nav.price)(req.money / nav.price),
		time: new Date(),
	}, {
		transaction: t
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
					model: DB.tables.investors,
					as: 'Управляющий',
					required: true,
					//raw:true,
					attributes: ['first_name', 'middle_name', 'last_name']
				}],
				attributes: [
					'id',
					['name', Alias_sql.fonds.direct.name],
					['title', Alias_sql.fonds.direct.title],
					['invest_idea', Alias_sql.fonds.direct.invest_idea],
					['invest_idea_date_end', Alias_sql.fonds.direct.invest_idea_date_end],
					['published', Alias_sql.fonds.direct.published],
					['ordering', Alias_sql.fonds.direct.ordering],
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
		default:
			options = {};
	}
	return options;
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
	console.log(this.body);
	let buf={}

	for (i in this.body) {
		if (this.body[i] == '') {
			delete this.body[i];
			continue;
		};
		if (Alias_sql[table].reverse[i]){
			buf[Alias_sql[table].reverse[i]] = this.body[i];
		}
		else {
			buf[i]=this.body[i];
		}
		 
	}
	if (buf.id) {
		DB.update(table, buf, {
				where: {
					id: buf.id
				}
			})
			.then(() => {
				this.json({ok:'success'})
				//this.redirect(`/db/view/${table}/`);
			})
			.catch(err => {
				this.json({err:err})
				// this.view('db', {
				// 	err: `Unable to connect to the database:${err}`
				// });
			});
	} else {
		this.redirect('/db/');
	}
}


function client_add_view() {
	this.view('client/add');
}

function client_add() {
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
			
			this.json(data);
		})

}

async function comission_eval(){
	if(!(this.body.investor&&this.body.fond)){this.json({err:"Not enough args"})}
	const q = (await DB.query_func.get_comission(this.body.fond,this.body.investor)).voznagrupravl;
	const test = await DB.query_func.last_comission_payment(this.body.investor,this.body.fond)
	console.log(test);
}

async function add_money() {
	let money = parseInt(this.body.money);
	if (money) {
		try {
			let count = (await DB.query_func.get_curr_count(this.body.id)).count;
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
	} else {
		this.json({
			err: 'Parasha',
			val: typeof money
		})
	};
}

function comisson_view(){
	this.view('comission');
}

async function comission_get(){
	
	this.json(await DB.seq.query(SQL.fonds_map,{type:DB.seq.QueryTypes.SELECT}))
}

async function specific_view(self, table, options) {

	let res;
	let buf;
	switch (table) {
		// case 'investors':
		// 	try {



		// 		buf = await DB.seq.query(SQL.get_money, {
		// 			type: DB.seq.QueryTypes.SELECT
		// 		})
		// 		self.view('db_raw', {
		// 			ok: 'Connection has been established successfully.',
		// 			data: buf
		// 		});
		// 	} catch (err) {
		// 		self.json({
		// 			err: err
		// 		})
		// 	};
		// 	break;
		default:
			try {
				let val = await DB.findAll(table, options)
				let data = [];
				switch (table) {
					case 'fonds':
						for (i=0;i<val.length;i++ ) {
							val[i].dataValues['Управляющий'] = val[i]['Управляющий'].fullName 
						}
						console.log(val[0])
						
							buf = JSON.stringify(val);
							val = JSON.parse(buf)

							// i.dataValues['Управляющий'].dataValues.full_name = i.dataValues['Управляющий'].fullName;
							// delete i.dataValues['Управляющий'].dataValues.first_name;
							// delete i.dataValues['Управляющий'].dataValues.middle_name;
							// delete i.dataValues['Управляющий'].dataValues.last_name;
							// //позор мне за этот говнокод, надо исправить(наверное)
						//};
						break;
					case 'fonds_map':
					buf = JSON.stringify(val);
					val = JSON.parse(buf)
						// for (i of val) {

						// 	i.dataValues['Инвестор'].dataValues.full_name = i.dataValues['Инвестор'].fullName;
						// 	delete i.dataValues['Инвестор'].dataValues.first_name;
						// 	delete i.dataValues['Инвестор'].dataValues.middle_name;
						// 	delete i.dataValues['Инвестор'].dataValues.last_name;
						// 	// data.push(i.dataValues);
						// };
						break;
					case 'likvid_book':
						for (i of val) {
							i.dataValues['Цена пая'] = i.pay_price
							//console.log(val[0])
							//i.dataValues.pray
						};
						break;
					case 'investors':
						// let qwe;
						// for (i=0;i<val.length;i++){
						// 	qwe = await DB.query_func.get_nav(val[i].fond_id)
						// 	val[i].money = (await DB.query_func.get_count_pai(val[i].id,val[i].fond_id)) * qwe; 
						// }

						break;
						default:buf = JSON.stringify(val);
						val = JSON.parse(buf);
						// for(i = 0;i < val.length-1;i++){
						//  	val[i].stringify = JSON.stringify(val[i])
						// 	console.log(val[i].stringify);
						// }
				}
				console.log('JSON DATA');
				self.json(val);
				// self.view('db_raw', {
				// 	ok: 'Connection has been established successfully.',
				// 	data: val
				// });
			} catch (err) {
				self.json({
					err: `Unable to connect to the database:${err}`
				});
			}
	}
}