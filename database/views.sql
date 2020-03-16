
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

-- detailed questions, with aggregate into json array on propositions
-- CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
--   SELECT  question.*,
--           (jsonb_agg(jsonb_build_object('proposition_id', p.proposition_id, 'content', p.content, 'correct', p.correct))) as propositions
--   FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
--   GROUP BY quiz_id, question_id
-- );

-- tool : transforms [NULL] into []
CREATE OR REPLACE FUNCTION lifap5.jsonb_array_with_null_keys(jsonb)
RETURNS jsonb AS 
$$
  SELECT COALESCE(NULLIF(jsonb_strip_nulls($1), '[{}]'), '[]');
$$
LANGUAGE SQL IMMUTABLE;


CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
  SELECT  question.*,
          jsonb_array_with_null_keys(jsonb_agg(jsonb_build_object('proposition_id', p.proposition_id, 'content', p.content, 'correct', p.correct))) as propositions,
          jsonb_array_with_null_keys(jsonb_agg(jsonb_build_object('proposition_id', a.proposition_id, 'user_id', a.user_id, 'answered_at', a.answered_at))) as answers
  FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
                 LEFT OUTER JOIN answer a USING (quiz_id, question_id)
  GROUP BY quiz_id, question_id
);


  SELECT  question.*,
          jsonb_array_with_null_keys(jsonb_agg(jsonb_build_object('proposition_id', proposition_id, 'user_id', user_id, 'answered_at', answered_at))) as answers
  FROM  question LEFT OUTER JOIN answer a USING (quiz_id, question_id)
  GROUP BY quiz_id, question_id