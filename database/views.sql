CREATE OR REPLACE VIEW lifap5.v_quiz_detailed AS(
  SELECT quiz.*,
        count(question_id)::integer as questions_number,
        COALESCE(SUM(weight)::integer,0) as total_weight,
        COALESCE(NULLIF(array_agg(question_id::integer), '{NULL}'), '{}') as questions_ids
  FROM quiz LEFT OUTER JOIN question
    USING (quiz_id)
  GROUP BY quiz.quiz_id
  ORDER BY quiz.quiz_id
);

CREATE OR REPLACE VIEW lifap5.v_question_detailed AS(
  SELECT  question.*,
          COALESCE(NULLIF(array_agg(ROW(p.proposition_id::integer, p.content::text, p.correct::boolean)::proposition_item), '{NULL}'), '{}') as propositions
  FROM  question LEFT OUTER JOIN proposition p USING (quiz_id, question_id)
  GROUP BY quiz_id, question_id
);