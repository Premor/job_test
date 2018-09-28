insert into test.akciahistory set investor_id=1,
	fond_id=41, 
    akciacena=(select likvidstoim/akciacount as last_nav from test.likvid_book li    
join (select fond_id,max(time) as timeM from test.likvid_book where fond_id = 41 group by fond_id ) l on li.fond_id = l.fond_id and li.time=l.timeM ),
    akciacount=5000/akciacena+(select akciacount from test.likvid_book li    
join (select fond_id,max(time) as timeM from test.likvid_book where fond_id = 41 group by fond_id ) l on li.fond_id = l.fond_id and li.time=l.timeM ), 
    akciacenamiddle = 21 ,
    akciacenamaxmiddle = 321,
    voznagrupravl_bool = 0,
    likvid_book_id = 0,
    `time`=111,
    date__ = '2200-01-01 11:11:11'