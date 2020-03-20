TRUNCATE lifap5.answer RESTART IDENTITY CASCADE;
TRUNCATE lifap5.proposition RESTART IDENTITY CASCADE;
TRUNCATE lifap5.question RESTART IDENTITY  CASCADE;
TRUNCATE lifap5.quiz RESTART IDENTITY  CASCADE;

-- OVERRIDING SYSTEM VALUE permet d'assurer qu'on contrôle l'ID (pour les tests)
INSERT INTO lifap5.quiz(quiz_id, title, description, owner_id)
OVERRIDING SYSTEM VALUE
VALUES  (0, 'QCM LIFAP5 #1', 'Des questions de JS et lambda calcul', 'romuald.thion'),
        (1, 'QCM LIFAP5 #2', 'Des questions de JS et lambda calcul', 'romuald.thion'),
        (2, 'QCM LIFAP5 #3', 'Des questions de JS et lambda calcul', 'test.user');

SELECT setval('lifap5.quiz_quiz_id_seq', 2);

INSERT INTO lifap5.question(quiz_id, question_id, sentence)
VALUES  (0, 0, 'Qui a inventé le lambda calcul ?'),
        (0, 1, 'Qui a inventé le JavaScript ?'),
        (1, 0, 'En quel année le standard ES2015 a-t''il été proposé ?'),
        (1, 1, 'Cette question a t''elle une réponse ?');


INSERT INTO lifap5.proposition(quiz_id, question_id, proposition_id, content, correct)
VALUES  (0, 0, 0, 'Alan Turing', false),
        (0, 0, 1, 'Alonzo Church', true),
        (0, 1, 0, 'Brendan Eich', true),
        (0, 1, 1, 'Obi Wan Kenobi', false),
        (0, 1, 2, 'Bjarne Stroustrup', false),
        (1, 0, 0, '2015', true),
        (1, 0, 1, '2016', false);


INSERT INTO lifap5.answer(user_id, quiz_id, question_id, proposition_id)
VALUES  ('test.user', 0, 0, 1),
        ('test.user', 0, 1, 0),
        ('test.user', 1, 0, 0),
        ('other.user', 0, 0, 0),
        ('other.user', 1, 0, 1);
