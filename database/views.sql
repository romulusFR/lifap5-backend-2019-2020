
-- tool : transforms [NULL] into []
CREATE OR REPLACE FUNCTION lifap5.jsonb_array_of_nulls(jsonb)
RETURNS jsonb AS 
$$
  SELECT COALESCE(NULLIF($1, '[null]'), '[]');
$$
LANGUAGE SQL IMMUTABLE;

-- detailed quizzes, with aggregate on questions
DROP VIEW lifap5.v_quiz_detailed;
CREATE OR REPLACE VIEW lifap5.v_quiz_detailed AS(
  SELECT quiz.*,
        count(question_id)::integer as questions_number,
        COALESCE(SUM(weight)::integer, 0) as total_weight,
        jsonb_array_of_nulls(jsonb_agg(to_jsonb(question_id))) as questions_ids
  FROM quiz LEFT OUTER JOIN question
    USING (quiz_id)
  GROUP BY quiz.quiz_id
  ORDER BY quiz.quiz_id
);

-- select * from v_quiz_detailed;
--  quiz_id |          created_at           |     title     |             description              |     owner_id     | open | questions_number | total_weight | questions_ids 
-- ---------+-------------------------------+---------------+--------------------------------------+------------------+------+------------------+--------------+---------------
--        0 | 2020-03-14 21:56:57.124856+01 | QCM LIFAP5 #1 | Des questions de JS et lambda calcul | romuald.thion    | f    |                2 |            4 | [0, 1]
--        1 | 2020-03-14 21:56:57.124856+01 | QCM LIFAP5 #2 | Des questions de JS et lambda calcul | romuald.thion    | f    |                1 |            1 | [2]
--        2 | 2020-03-14 21:56:57.124856+01 | QCM LIFAP5 #3 | Des questions de JS et lambda calcul | emmanuel.coquery | f    |                0 |            0 | []


-- tool : transforms [NULL] into []
CREATE OR REPLACE FUNCTION lifap5.jsonb_array_with_null_keys(jsonb)
RETURNS jsonb AS 
$$
  SELECT COALESCE(NULLIF(jsonb_strip_nulls($1), '[{}]'), '[]');
$$
LANGUAGE SQL IMMUTABLE;

-- detailed questions, with aggregate into json array on propositions
CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
  WITH detailed_answer AS(
    SELECT quiz_id, question_id, proposition_id,
          jsonb_array_with_null_keys(jsonb_agg(jsonb_build_object('user_id', a.user_id, 'answered_at', a.answered_at))) as answers
    FROM answer a
    GROUP BY quiz_id, question_id, proposition_id)

  SELECT  question.*,
          jsonb_array_with_null_keys(jsonb_agg(
            jsonb_build_object(
            'proposition_id', p.proposition_id,
            'content', p.content,
            'correct', p.correct,
            'answers', a.answers
             ))) as propositions
  FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
                 LEFT OUTER JOIN detailed_answer a USING (quiz_id, question_id, proposition_id)
  GROUP BY quiz_id, question_id
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


-- -------------------------------- BACKUP ----------------------------------------------------


-- detailed questions, with aggregate into json array on propositions
-- CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
--   SELECT  question.*,
--           (jsonb_agg(jsonb_build_object('proposition_id', p.proposition_id, 'content', p.content, 'correct', p.correct))) as propositions
--   FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
--   GROUP BY quiz_id, question_id
-- );


-- CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
--   SELECT  question.*,
--           jsonb_array_with_null_keys(jsonb_agg(jsonb_build_object('proposition_id', p.proposition_id, 'content', p.content, 'correct', p.correct))) as propositions,
--           jsonb_array_with_null_keys(jsonb_agg(jsonb_build_object('proposition_id', a.proposition_id, 'user_id', a.user_id, 'answered_at', a.answered_at))) as answers
--   FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
--                  LEFT OUTER JOIN answer a USING (quiz_id, question_id)
--   GROUP BY quiz_id, question_id
-- );
