TRUNCATE quiz CASCADE;

WITH
  base_quizzes(titre, description, open) AS (
    SELECT *
    FROM (VALUES
      ('Premier QCM de ', 'Des questions de JS et de λ calcul', true),
      ('Second QCM de ', 'Un questionnaire en cours de réalisation', false)
    ) AS R
  ),

  new_quizzes AS (
    INSERT INTO lifap5.quiz(title, description, owner_id, open) (
      SELECT q.titre || user_id, q.description, user_id, q.open
      FROM quiz_user CROSS JOIN base_quizzes q)
      RETURNING quiz_id, owner_id, open
  ),

  base_questions(open, question_id, sentence) AS (
    SELECT *
    FROM (VALUES
      (true, 0, 'Qui a inventé le lambda calcul ?'),
      (true, 1, 'Qui a inventé le JavaScript ?'),
      (true, 2, 'En quel année le standard ES2015 a-t''il été proposé ?'),
      (false, 0, 'Cette question a t''elle une réponse ?')
    )  AS R
  ),

  new_questions AS (
    INSERT INTO lifap5.question(quiz_id, question_id, sentence) (
      SELECT n.quiz_id, b.question_id, b.sentence
      FROM new_quizzes n JOIN base_questions b ON n.open = b.open
    )
    RETURNING *
  ),

  base_propositions(open, question_id, proposition_id, content, correct) AS (
    SELECT *
    FROM (VALUES
        (true, 0, 0, 'Alan Turing', false),
        (true, 0, 1, 'Alonzo Church', true),
        (true, 1, 0, 'Brendan Eich', true),
        (true, 1, 1, 'Obi Wan Kenobi', false),
        (true, 1, 2, 'Bjarne Stroustrup', false),
        (true, 2, 0, '2015', true),
        (true, 2, 1, '2016', false),
        (false, 0, 0, 'oui', true),
        (false, 0, 1, 'non', false)
    )  AS R
  ),

  
  new_propositions AS (
    INSERT INTO lifap5.proposition(quiz_id, question_id, proposition_id, content, correct) (
      SELECT n.quiz_id, b.question_id, b.proposition_id, b.content, b.correct
      FROM new_quizzes n
        JOIN new_questions q USING (quiz_id)
        JOIN base_propositions b USING (open, question_id)
    )
    RETURNING *
  )

SELECT COUNT(*)
FROM new_propositions;

-- on doit avoir nb_user * (2 + 3 + 2 + 2 = 9) propositions