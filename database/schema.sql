CREATE SCHEMA IF NOT EXISTS lifap5;

-- drop everything
DROP TABLE IF EXISTS lifap5.answer CASCADE;
DROP TABLE IF EXISTS lifap5.proposition CASCADE;
DROP TABLE IF EXISTS lifap5.question CASCADE;
DROP TABLE IF EXISTS lifap5.quiz CASCADE;
DROP TABLE IF EXISTS lifap5.quiz_user CASCADE;

CREATE TABLE IF NOT EXISTS lifap5.quiz_user (
  user_id TEXT PRIMARY KEY CHECK (char_length(user_id) > 4),
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  api_key UUID UNIQUE NULL
);

CREATE TABLE IF NOT EXISTS lifap5.quiz (
  quiz_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  owner_id TEXT REFERENCES lifap5.quiz_user(user_id) NOT NULL,
  open BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS lifap5.question (
  PRIMARY KEY (quiz_id, question_id),
  quiz_id INTEGER REFERENCES lifap5.quiz
    ON DELETE CASCADE ON UPDATE CASCADE,
  question_id INTEGER, --  GENERATED ALWAYS AS IDENTITY
  content TEXT NOT NULL
  -- weight INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lifap5.proposition (
  PRIMARY KEY (quiz_id, question_id, proposition_id),
  FOREIGN KEY (quiz_id, question_id) REFERENCES lifap5.question
    ON DELETE CASCADE ON UPDATE CASCADE,
  quiz_id INTEGER,
  question_id INTEGER,
  proposition_id INTEGER, --  GENERATED ALWAYS AS IDENTITY
  content TEXT NOT NULL,
  correct BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS lifap5.answer (
  PRIMARY KEY (quiz_id, question_id, user_id),
  FOREIGN KEY (quiz_id, question_id, proposition_id) REFERENCES lifap5.proposition
    ON DELETE CASCADE ON UPDATE CASCADE,
  quiz_id INTEGER,
  question_id INTEGER,
  user_id TEXT REFERENCES lifap5.quiz_user,
  proposition_id INTEGER NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
