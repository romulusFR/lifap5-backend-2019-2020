CREATE SCHEMA IF NOT EXISTS lifap5;

DROP TABLE IF EXISTS lifap5.answer;
DROP TABLE IF EXISTS lifap5.proposition;
DROP TABLE IF EXISTS lifap5.question;
DROP TABLE IF EXISTS lifap5.quiz;
DROP TABLE IF EXISTS lifap5.quiz_user;

CREATE TABLE IF NOT EXISTS lifap5.quiz_user (
  user_id TEXT PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  api_key UUID UNIQUE NULL
);

CREATE TABLE IF NOT EXISTS lifap5.quiz (
  quiz_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  owner_id TEXT REFERENCES lifap5.quiz_user(user_id)
);

CREATE TABLE IF NOT EXISTS lifap5.question (
  PRIMARY KEY (quiz_id, question_id),
  quiz_id INTEGER REFERENCES lifap5.quiz,
  question_id INTEGER GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  optional BOOLEAN DEFAULT FALSE,
  weight INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lifap5.proposition (
  PRIMARY KEY (quiz_id, question_id, proposition_id),
  FOREIGN KEY (quiz_id, question_id) REFERENCES lifap5.question,
  quiz_id INTEGER,
  question_id INTEGER,
  proposition_id INTEGER GENERATED ALWAYS AS IDENTITY,
  content TEXT NOT NULL,
  correct BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS lifap5.answer (
  PRIMARY KEY (quiz_id, question_id, user_id),
  FOREIGN KEY (quiz_id, question_id, proposition_id) REFERENCES lifap5.proposition,
  user_id TEXT REFERENCES lifap5.quiz_user,
  quiz_id INTEGER,
  question_id INTEGER,
  proposition_id INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);