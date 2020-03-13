CREATE OR REPLACE VIEW lifap5.v_quiz_detailed AS(
  SELECT quiz.*,
        count(question_id)::integer as questions_number,
        COALESCE(SUM(weight)::integer,0) as total_weight,
        COALESCE(NULLIF(array_agg(question_id), '{NULL}'), '{}')::integer[] as questions_ids
  FROM quiz LEFT OUTER JOIN question
    USING (quiz_id)
  GROUP BY quiz.quiz_id
  ORDER BY quiz.quiz_id
);