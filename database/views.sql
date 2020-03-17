-- extended quizzes, with aggregation on questions to provide a summary
DROP VIEW lifap5.v_quiz_ext;
CREATE OR REPLACE VIEW lifap5.v_quiz_ext AS(

  WITH questions_array AS(
    SELECT quiz_id,
           count(question_id)::integer  as questions_number,
           SUM(weight)::integer as total_weight,
           jsonb_agg(to_jsonb(question_id)) as questions_ids
    FROM question
    GROUP BY quiz_id
  )

  SELECT  quiz.*,
          COALESCE(q.questions_number, 0) as questions_number,
          COALESCE(q.total_weight, 0) as total_weight, 
          COALESCE(q.questions_ids,'[]') as questions_ids
  FROM quiz LEFT OUTER JOIN questions_array q
    USING (quiz_id)
  ORDER BY quiz.quiz_id
);

-- select * from v_quiz_ext;
--  quiz_id |          created_at           |     title     |    description    |     owner_id     | open | questions_number | total_weight | questions_ids 
-- ---------+-------------------------------+---------------+-------------------+------------------+------+------------------+--------------+---------------
--        0 | 2020-03-14 21:56:57.124856+01 | QCM LIFAP5 #1 | Des questions ... | romuald.thion    | f    |                2 |            4 | [0, 1]
--        1 | 2020-03-14 21:56:57.124856+01 | QCM LIFAP5 #2 | Des questions ... | romuald.thion    | f    |                1 |            1 | [2]
--        2 | 2020-03-14 21:56:57.124856+01 | QCM LIFAP5 #3 | Des questions ... | emmanuel.coquery | f    |                0 |            0 | []


-- extended questions, with aggregation on propositions to provide a summary
CREATE OR REPLACE VIEW lifap5.v_question_ext AS(
  SELECT  question.*,
          count(p.proposition_id) as propositions_number,
          count(p.proposition_id) FILTER (WHERE correct) as correct_propositions_number
  FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
  GROUP BY quiz_id, question_id
);


-- tool : transforms [NULL] into []
CREATE OR REPLACE FUNCTION lifap5.jsonb_array_with_null_keys(jsonb)
RETURNS jsonb AS 
$$
  SELECT COALESCE(NULLIF(jsonb_strip_nulls($1), '[{}]'), '[]');
$$
LANGUAGE SQL IMMUTABLE;



-- detailed questions, with fully detailed propositions in nested json objects
CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
  WITH answers_array AS(
    SELECT  quiz_id, question_id, proposition_id,
            jsonb_agg(jsonb_build_object(
              'user_id', a.user_id,
              'answered_at', a.answered_at
            )) as answers
    FROM answer a
    GROUP BY quiz_id, question_id, proposition_id
    )

  SELECT  question.*,
          jsonb_array_with_null_keys(jsonb_agg(
            jsonb_build_object(
            'proposition_id', p.proposition_id,
            'content', p.content,
            'correct', p.correct,
            'answers', a.answers
             ))) as propositions
  FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
                 LEFT OUTER JOIN answers_array a USING (quiz_id, question_id, proposition_id)
  GROUP BY quiz_id, question_id
  ORDER BY quiz_id, question_id
);

-- select quiz_id, question_id, jsonb_pretty(propositions) from v_question_detailed ;
--  quiz_id | question_id |                           jsonb_pretty                            
-- ---------+-------------+-------------------------------------------------------------------
--        0 |           0 | [                                                                +
--          |             |     {                                                            +
--          |             |         "content": "Alan Turing",                                +
--          |             |         "correct": false,                                        +
--          |             |         "proposition_id": 0                                      +
--          |             |     },                                                           +
--          |             |     {                                                            +
--          |             |         "answers": [                                             +
--          |             |             {                                                    +
--          |             |                 "user_id": "test.user",                          +
--          |             |                 "answered_at": "2020-03-14T21:56:57.178206+01:00"+
--          |             |             }                                                    +
--          |             |         ],                                                       +
--          |             |         "content": "Alonzo Church",                              +
--          |             |         "correct": true,                                         +
--          |             |         "proposition_id": 1                                      +
--          |             |     }                                                            +
--          |             | ]
--        0 |           1 | [                                                                +
--          |             | ]
--        1 |           2 | [                                                                +
--          |             | ]
-- (3 rows)
