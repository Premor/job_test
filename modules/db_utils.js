const DB = require('./db');
const Big = require('big.js');

module.exports.get_nav = async (fond) => {
    let nav = (await DB.tables.likvid_book.findAll({
        where: {
            fond_id: fond,
        },
        limit: 1,
        order: [
            ['time', 'desc']
        ],
    }))[0].dataValues
    console.log("UTILS NAV", nav);
    return {
        price: nav.likvidstoim / nav.akciacount,
        count: nav.akciacount,
        money: nav.likvidstoim
    }
}

module.exports.investor_fonds_exsist = async (investor, fond) => {
    let test = await DB.tables.fonds_map.findAll({
        where: {
            fond_id: fond,
            investor_id: investor,
        },
        limit:1,
    })
    console.log('INNER EXSIST',test);
    if (test.length != 0) return true;
    else return false;
}

module.exports.get_curr_count = async (fond) => {
    return (await DB.tables.history.findAll({
        attributes: [
            [DB.seq.fn('sum', DB.seq.col('akciacount')), 'count']
        ],
        where: {
            fond_id: fond,
        },
    }))[0].dataValues;


}