-- inspired by https://tapoueh.org/blog/2018/07/postgresql-listen/notify/

CREATE OR REPLACE function lifap5.tg_notify_updates()
  RETURNS trigger AS $$
DECLARE
  channel text := TG_ARGV[0];
  opname text := TG_OP;
  tname text := TG_TABLE_NAME;
  sname text := TG_TABLE_SCHEMA;
  rec RECORD;
BEGIN
  CASE TG_OP
  WHEN 'INSERT', 'UPDATE' THEN
     rec := NEW;
  WHEN 'DELETE' THEN
     rec := OLD;
  ELSE
     RAISE EXCEPTION 'Unknown TG_OP: "%". Should not occur!', TG_OP;
  END CASE;

  PERFORM (
     WITH payload("schema", "type", "operation", "quiz_id") as(
       SELECT 
        sname,
        tname,
        opname,
        rec.quiz_id
     )
    SELECT pg_notify(channel, row_to_json(payload)::text)
    FROM payload
  );
  RETURN NULL;
end;
$$
LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS tg_notify_answers ON lifap5.answer;
CREATE TRIGGER tg_notify_answers
AFTER INSERT OR UPDATE OR DELETE
  ON lifap5.answer
FOR EACH ROW
EXECUTE PROCEDURE lifap5.tg_notify_updates('lifap5');

DROP TRIGGER IF EXISTS tg_notify_quizzes ON lifap5.quiz;
CREATE TRIGGER tg_notify_quizzes
AFTER INSERT OR UPDATE OR DELETE
  ON lifap5.quiz
FOR EACH ROW
EXECUTE PROCEDURE lifap5.tg_notify_updates('lifap5');

DROP TRIGGER IF EXISTS tg_notify_questions ON lifap5.question;
CREATE TRIGGER tg_notify_questions
AFTER INSERT OR UPDATE OR DELETE
  ON lifap5.question
FOR EACH ROW
EXECUTE PROCEDURE lifap5.tg_notify_updates('lifap5');

DROP TRIGGER IF EXISTS tg_notify_propositions ON lifap5.proposition;
CREATE TRIGGER tg_notify_propositions
AFTER INSERT OR UPDATE OR DELETE
  ON lifap5.proposition
FOR EACH ROW
EXECUTE PROCEDURE lifap5.tg_notify_updates('lifap5');