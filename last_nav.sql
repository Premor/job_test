SELECT li.fond_id,
        likvidstoim/akciacount AS last_nav,
        time
FROM test.likvid_book li
JOIN 
    (SELECT fond_id,
        max(time) AS timeM
    FROM test.likvid_book
    GROUP BY  fond_id) l
    ON li.fond_id = l.fond_id
        AND li.time=l.timeM 