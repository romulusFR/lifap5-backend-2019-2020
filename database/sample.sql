TRUNCATE lifap5.answer CASCADE;
TRUNCATE lifap5.proposition CASCADE;
TRUNCATE lifap5.question CASCADE;
TRUNCATE lifap5.quiz CASCADE;
TRUNCATE lifap5.quiz_user CASCADE;


INSERT INTO lifap5.quiz_user(user_id, firstname, lastname, api_key)
VALUES  ('romuald.thion', 'Romuald', 'Thion', NULL),
        ('emmanuel.coquery', 'Emmanuel', 'Coquery', NULL),
        ('test.user', 'Test', 'User', NULL),
        ('other.user', 'Other', 'User', NULL);

-- OVERRIDING SYSTEM VALUE permet d'assurer qu'on contrôle l'ID (pour les tests)
INSERT INTO lifap5.quiz(quiz_id, title, description, owner_id)
OVERRIDING SYSTEM VALUE
VALUES  (0, 'QCM LIFAP5 #1', 'Des questions de JS et lambda calcul', 'romuald.thion'),
        (1, 'QCM LIFAP5 #2', 'Des questions de JS et lambda calcul', 'romuald.thion'),
        (2, 'QCM LIFAP5 #3', 'Des questions de JS et lambda calcul', 'emmanuel.coquery');

INSERT INTO lifap5.question(quiz_id, question_id, content, optional, weight)
OVERRIDING SYSTEM VALUE
VALUES  (0, 0, 'Qui a inventé le lambda calcul ?', false, 2),
        (0, 1, 'Qui a inventé le JavaScript ?', true, 2);

INSERT INTO lifap5.question(quiz_id, question_id, content)
OVERRIDING SYSTEM VALUE
VALUES  (1, 0, 'En quel année le standard ES2015 a-t''il été proposé ?');

INSERT INTO lifap5.proposition(quiz_id, question_id, proposition_id, content, correct)
OVERRIDING SYSTEM VALUE
VALUES  (0, 0, 0, 'Alan Turing', false),
        (0, 0, 1, 'Alonzo Church', true);


-- TEST
-- select quiz_id, title, owner_id,
--        question_id, question.content, optional, weight,
--        proposition_id, proposition.content, correct
-- from quiz left join question using (quiz_id)
--           left join proposition using(quiz_id, question_id)
-- order by quiz_id, question_id, proposition_id;


INSERT INTO lifap5.answer(user_id, quiz_id, question_id, proposition_id)
VALUES  ('test.user', 0, 0, 1);
