const DB = require('./db');

module.exports.get_nav =async (fond) => {
    let nav = (await DB.tables.likvid_book.findAll({
        where: {
            fond_id: fond,
        },
        limit: 1,
        order: [['time', 'desc']],
    }))[0].dataValues
    console.log("UTILS NAV",nav);
    return {price:nav.likvidstoim/nav.akciacount,count:nav.akciacount,money:nav.likvidstoim} 
}

module.exports.get_curr_count = async (fond)=>{
    let count = (await DB.tables.history.findAll({
        attributes:[[DB.seq.fn('sum',DB.seq.col('akciacount')),'count']],
        where:{
            fond_id:fond,
        },
    }))[0].dataValues;
    console.log("UTILS COUNT",count);
    return count 

}