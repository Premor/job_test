SELECT 	inv.id,
        first_name,
        middle_name,
        last_name,
        title,
        money,
        money*last_nav AS last_money,
        countac*last_nav AS 'Средства',
        last_nav
FROM test.investors inv left outer
JOIN test.fonds fo
    ON fo.id IN 
    (SELECT fond_id
    FROM test.fonds_map
    WHERE investor_id = inv.id)
JOIN 
    (SELECT investor_id,
        fond_id,
        sum(akciacena*akciacount) AS money,
        sum(akciacount) AS countac
    FROM test.akciahistory #where voznagrupravl_bool!=1
    GROUP BY  investor_id,fond_id) AS hi
    ON fo.id is NOT null
        AND hi.investor_id = inv.id
        AND hi.fond_id = fo.id
JOIN 
    (SELECT li.fond_id,
        likvidstoim/akciacount AS last_nav,
        time
    FROM test.likvid_book li
    JOIN 
        (SELECT fond_id,
        max(time) AS timeM
        FROM test.likvid_book
        GROUP BY  fond_id) l
            ON li.fond_id = l.fond_id
                AND li.time=l.timeM) lil
        ON lil.fond_id = fo.id
ORDER BY  inv.id ; 