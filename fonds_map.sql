SELECT fond_id,investor_id,name as fond_name,concat(first_name,' ',middle_name,' ',last_name) as full_name FROM test.fonds_map fo_ma
join (select id,name from test.fonds) fo on fo.id = fo_ma.fond_id
join (select id,first_name,middle_name,last_name from test.investors) inv on inv.id = fo_ma.investor_id;