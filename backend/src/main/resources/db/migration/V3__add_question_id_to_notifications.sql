ALTER TABLE notifications
    ADD COLUMN question_id BIGINT,
    ADD CONSTRAINT fk_notifications_question
        FOREIGN KEY (question_id)
        REFERENCES questions (id)
        ON DELETE CASCADE;

ALTER TABLE notifications
    DROP CONSTRAINT chk_notifications_type;

ALTER TABLE notifications
    ADD CONSTRAINT chk_notifications_type
        CHECK (type IN (
                        'QUESTION_ANSWER_CREATED',
                        'QUESTION_COMMENT_CREATED',
                        'ANSWER_COMMENT_CREATED',
                        'ANSWER_ACCEPTED',
                        'QUESTION_LIKED',
                        'ANSWER_LIKED',
                        'COMMENT_LIKED'
            ));