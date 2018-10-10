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
    return {
        price: nav.likvidstoim / nav.akciacount,
        count: nav.akciacount,
        money: nav.likvidstoim
    }
}

// module.exports.get_nav_all = async () => {
//     let nav = (await DB.tables.likvid_book.findAll({
//         where: {
//             fond_id: fond,
//         },
//         limit: 1,
//         order: [
//             ['time', 'desc']
//         ],
//     }))[0].dataValues
//     return {
//         price: nav.likvidstoim / nav.akciacount,
//         count: nav.akciacount,
//         money: nav.likvidstoim
//     }
// }

module.exports.investor_fonds_exsist = async (investor, fond) => {
    // let test = await DB.tables.fonds_map.findAll({
    //     where: {
    //         fond_id: fond,
    //         investor_id: investor,
    //     },
    //     limit:1,
    // })
    // console.log('INNER EXSIST',test);
    if ((await DB.tables.fonds_map.findAll({
            where: {
                fond_id: fond,
                investor_id: investor,
            },
            limit: 1,
        })).length != 0) return true;
    else return false;
}

module.exports.get_curr_count = async fond => {
    (await DB.tables.history.findAll({
        attributes: [
            [DB.seq.fn('sum', DB.seq.col('akciacount')), 'count']
        ],
        where: {
            fond_id: fond,
        },
    }))[0].dataValues;
}

module.exports.get_comission = async (fond,investor) => {
    console.log((await DB.tables.fonds_map.findOne({
        where:{
            fond_id:fond,
            investor_id:investor,
        }
    })))
    return (await DB.tables.fonds_map.findOne({
        where:{
            fond_id:fond,
            investor_id:investor,
        }
    }))
}

module.exports.get_fonds_for_investor = async investor =>{
    (await DB.tables.fonds_map({
        attributes:['fond_id','investor_id'],
        where: {
            investor_id:investor,
        }
    }))}

module.exports.last_comission_payment = async (investor,fond)=>{
    return (await DB.tables.history.findOne({
        where:{
            fond_id:fond,
            investor_id:investor,
            voznagrupravl_bool:true,//1
        }
    }))
}



module.exports.get_count_pai = async (investor, fond) => {
    return (await DB.tables.history.findAll({
        attributes: [
            [DB.seq.fn('sum', DB.seq.col('akciacount')), 'count']
        ],
        where: {
            fond_id: fond,
            investor_id: investor,
        },
    }))[0]
}