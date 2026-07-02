CREATE TABLE bookmarks (
                           id          BIGSERIAL PRIMARY KEY,
                           member_id   BIGINT NOT NULL,
                           question_id BIGINT NOT NULL,
                           created_at  TIMESTAMP NOT NULL,
                           CONSTRAINT fk_bookmarks_member FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE CASCADE,
                           CONSTRAINT fk_bookmarks_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
                           CONSTRAINT uq_bookmarks_member_question UNIQUE (member_id, question_id)
);