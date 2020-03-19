-- SEE https://www.postgresql.org/docs/12/functions-json.html FOR DOC ABOUT JSONB FUNCTIONS



-- ---------------------------------------- DETAILED USERS ----------------------------------------
-- DROP VIEW IF EXISTS lifap5.v_quiz_user_ext;
-- CREATE OR REPLACE VIEW lifap5.v_quiz_user_ext AS(

--   WITH answers_json AS(
--     SELECT  user_id, quiz_id,
--             jsonb_agg(jsonb_build_object(
--               'question_id', a.question_id,
--               'proposition_id', a.proposition_id,
--               'answered_at', a.answered_at
--             )) AS answers
--     FROM answer a
--     GROUP BY user_id, quiz_id
--   ),

--   quizzes_json AS(
--     SELECT  user_id,
--             jsonb_agg(jsonb_build_object(
--               'quiz_id', d.quiz_id,
--               'answers', d.answers
--             )) AS answers
--     FROM    answer a JOIN answers_json d USING(user_id, quiz_id)
--     GROUP BY user_id, quiz_id
--   )

--   SELECT  user_id,
--           COALESCE(q.answers, '[]') AS answers
--   FROM    quiz_user a LEFT OUTER JOIN quizzes_json q  USING(user_id)
-- );

DROP VIEW IF EXISTS lifap5.v_quiz_user_ext;
CREATE OR REPLACE VIEW lifap5.v_quiz_user_ext AS(

  WITH answers_json AS(
    SELECT  user_id, quiz_id,
            jsonb_agg(jsonb_build_object(
              'question_id', a.question_id,
              'proposition_id', a.proposition_id,
              'answered_at', a.answered_at
            )) AS answers
    FROM answer a
    GROUP BY user_id, quiz_id
  ),

  quizzes_json AS(
    SELECT  user_id,
            jsonb_agg(jsonb_build_object(
              'quiz_id', d.quiz_id,
              'answers', d.answers
            )) AS answers
    FROM    answers_json d
    GROUP BY user_id
  )

  SELECT  user_id,
          COALESCE(q.answers, '[]') AS answers
  FROM    quiz_user a LEFT OUTER JOIN quizzes_json q  USING(user_id)
);

-- select user_id, jsonb_pretty(answers) from v_quiz_user_ext ;
--      user_id      |                            jsonb_pretty                            
-- ------------------+--------------------------------------------------------------------
--  other.user       | [                                                                 +
--                   |     {                                                             +
--                   |         "answers": [                                              +
--                   |             {                                                     +
--                   |                 "answered_at": "2020-03-18T17:11:32.263172+01:00",+
--                   |                 "question_id": 0,                                 +
--                   |                 "proposition_id": 0                               +
--                   |             }                                                     +
--                   |         ],                                                        +
--                   |         "quiz_id": 0                                              +
--                   |     },                                                            +
--                   |     {                                                             +
--                   |         "answers": [                                              +
--                   |             {                                                     +
--                   |                 "answered_at": "2020-03-18T17:11:32.263172+01:00",+
--                   |                 "question_id": 0,                                 +
--                   |                 "proposition_id": 1                               +
--                   |             }                                                     +
--                   |         ],                                                        +
--                   |         "quiz_id": 1                                              +
--                   |     }                                                             +
--                   | ]
--  test.user        | [                                                                 +
--                   |     {                                                             +
--                   |         "answers": [                                              +
--                   |             {                                                     +
--                   |                 "answered_at": "2020-03-18T17:11:32.263172+01:00",+
--                   |                 "question_id": 0,                                 +
--                   |                 "proposition_id": 1                               +
--                   |             },                                                    +
--                   |             {                                                     +
--                   |                 "answered_at": "2020-03-18T17:11:32.263172+01:00",+
--                   |                 "question_id": 1,                                 +
--                   |                 "proposition_id": 0                               +
--                   |             }                                                     +
--                   |         ],                                                        +
--                   |         "quiz_id": 0                                              +
--                   |     }                                                             +
--                   | ]
--  emmanuel.coquery | [                                                                 +
--                   | ]
--  romuald.thion    | [                                                                 +
--                   | ]




-- ---------------------------------------- EXTENDED QUIZZES ----------------------------------------
-- extended quizzes, with aggregation on questions to provide a summary
DROP VIEW IF EXISTS lifap5.v_quiz_ext;
CREATE OR REPLACE VIEW lifap5.v_quiz_ext AS(

  WITH questions_json AS(
    SELECT quiz_id,
           count(question_id)::integer  AS questions_number,
           jsonb_agg(to_jsonb(question_id)) AS questions_ids
    FROM question
    GROUP BY quiz_id
  )

  SELECT  quiz.*,
          COALESCE(q.questions_number, 0) AS questions_number,
          COALESCE(q.questions_ids,'[]') AS questions_ids
  FROM quiz LEFT OUTER JOIN questions_json q
    USING (quiz_id)
  ORDER BY quiz.quiz_id
);

-- select * from v_quiz_ext;
--  quiz_id |          created_at           |     title     |             description              |     owner_id     | open | questions_number | questions_ids 
-- ---------+-------------------------------+---------------+--------------------------------------+------------------+------+------------------+---------------
--        0 | 2020-03-17 11:05:58.851951+01 | QCM LIFAP5 #1 | Des questions de JS et lambda calcul | romuald.thion    | f    |                2 | [0, 1]
--        1 | 2020-03-17 11:05:58.851951+01 | QCM LIFAP5 #2 | Des questions de JS et lambda calcul | romuald.thion    | f    |                1 | [2]
--        2 | 2020-03-17 11:05:58.851951+01 | QCM LIFAP5 #3 | Des questions de JS et lambda calcul | emmanuel.coquery | f    |                0 | []


-- ---------------------------------------- EXTENDED QUESTIONS ----------------------------------------
-- extended questions, with aggregation on propositions to provide a summary
DROP VIEW IF EXISTS lifap5.v_question_ext;
CREATE OR REPLACE VIEW lifap5.v_question_ext AS(
  WITH propositions_json AS(
    SELECT quiz_id, question_id,
           count(proposition_id)::integer AS propositions_number,
           count(proposition_id) FILTER (WHERE correct)::integer AS correct_propositions_number,
           jsonb_agg(to_jsonb(proposition_id)) AS propositions_ids
    FROM proposition
    GROUP BY quiz_id, question_id
  )
  SELECT  q.*,
          COALESCE(p.propositions_number, 0) AS propositions_number,
          COALESCE(p.correct_propositions_number, 0) AS correct_propositions_number,
          COALESCE(p.propositions_ids,'[]') AS propositions_ids
  FROM  question q LEFT OUTER JOIN propositions_json p
        USING (quiz_id, question_id)
);

-- select * from v_question_ext;
--  quiz_id | question_id |                        sentence                       | propositions_number | correct_propositions_number | propositions_ids 
-- ---------+-------------+-------------------------------------------------------+---------------------+-----------------------------+------------------
--        0 |           0 | Qui a inventé le lambda calcul ?                      |                   2 |                           1 | [0, 1]
--        0 |           1 | Qui a inventé le JavaScript ?                         |                   0 |                           0 | []
--        1 |           2 | En quel année le standard ES2015 a-t'il été proposé ? |                   0 |                           0 | []


-- ---------------------------------------- DETAILED QUESTIONS ----------------------------------------

-- detailed questions, with fully detailed propositions in nested json objects
CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(

  WITH answers_json AS(
    SELECT  quiz_id, question_id, proposition_id,
            jsonb_agg(jsonb_build_object(
              'user_id', a.user_id,
              'answered_at', a.answered_at
            )) AS answers
    FROM answer a
    GROUP BY quiz_id, question_id, proposition_id
    ),

  propositions_json AS(
    SELECT  quiz_id, question_id,
            jsonb_agg(jsonb_build_object(
              'proposition_id', p.proposition_id,
              'content', p.content,
              'correct', p.correct,
              'answers', COALESCE(a.answers,'[]')
            )) as propositions
    FROM proposition p LEFT OUTER JOIN answers_json a USING (quiz_id, question_id, proposition_id)
    GROUP BY quiz_id, question_id
  )

  SELECT  q.*,
          COALESCE(p.propositions,'[]') AS propositions

  FROM  question q LEFT OUTER JOIN propositions_json p USING (quiz_id, question_id)
  ORDER BY quiz_id, question_id
);


-- select quiz_id, question_id, jsonb_pretty(propositions) from v_question_detailed ;
--  quiz_id | question_id |                           jsonb_pretty                            
-- ---------+-------------+-------------------------------------------------------------------
--        0 |           0 | [                                                                +
--          |             |     {                                                            +
--          |             |         "answers": [                                             +
--          |             |         ],                                                       +
--          |             |         "content": "Alan Turing",                                +
--          |             |         "correct": false,                                        +
--          |             |         "proposition_id": 0                                      +
--          |             |     },                                                           +
--          |             |     {                                                            +
--          |             |         "answers": [                                             +
--          |             |             {                                                    +
--          |             |                 "user_id": "test.user",                          +
--          |             |                 "answered_at": "2020-03-17T11:05:58.907769+01:00"+
--          |             |             }                                                    +
--          |             |         ],                                                       +
--          |             |         "content": "Alonzo Church",                              +
--          |             |         "correct": true,                                         +
--          |             |         "proposition_id": 0                                      +
--          |             |     },                                                           +
--          |             |     {                                                            +
--          |             |         "answers": [                                             +
--          |             |             {                                                    +
--          |             |                 "user_id": "test.user",                          +
--          |             |                 "answered_at": "2020-03-17T11:05:58.907769+01:00"+
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


-- ---------------------------------------- FULL-TEXT SEARCH ----------------------------------------

DROP VIEW IF EXISTS lifap5.v_fts;
CREATE OR REPLACE VIEW lifap5.v_fts AS(
  SELECT  'quiz' AS type,
          quiz_id AS quiz_id,
          NULL::integer AS question_id,
          NULL::integer AS proposition_id,
          setweight(to_tsvector('french', coalesce(title,'')), 'A')    ||
          setweight(to_tsvector('french', coalesce(description,'')), 'A') ||
           setweight(to_tsvector('french', coalesce(owner_id,'')), 'B')
            AS searchable_text
  FROM quiz

  UNION ALL

  SELECT  'question' AS type,
          quiz_id,
          question_id,
          NULL::integer,
          setweight(to_tsvector('french', coalesce(sentence,'')), 'A')
            AS searchable_text
  FROM question

  UNION  ALL

  SELECT  'proposition' AS type,
          quiz_id,
          question_id,
          proposition_id,
          setweight(to_tsvector('french', coalesce(content,'')), 'A')
            AS searchable_text
  FROM proposition
);