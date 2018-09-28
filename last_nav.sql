select li.fond_id,likvidstoim/akciacount as last_nav,time from test.likvid_book li    
join (select fond_id,max(time) as timeM from test.likvid_book group by fond_id) l on li.fond_id = l.fond_id and li.time=l.timeM  
                
                