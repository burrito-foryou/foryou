-- =========================
-- 1. members
-- =========================
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    nickname VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT 'USER',
    profile_image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_members_role
        CHECK (role IN ('USER', 'ADMIN'))
);

-- =========================
-- 2. questions
-- =========================
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    view_count BIGINT NOT NULL DEFAULT 0,
    like_count BIGINT NOT NULL DEFAULT 0,
    accepted_answer_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_questions_member
        FOREIGN KEY (member_id)
        REFERENCES members (id)
        ON DELETE CASCADE
);

-- =========================
-- 3. tags
-- =========================
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL,

    CONSTRAINT chk_tags_type
        CHECK (type IN (
            'TARGET',
            'BUDGET',
            'GENDER',
            'AGE_GROUP',
            'SITUATION',
            'GIFT_TYPE'
        )),

    CONSTRAINT uk_tags_name_type
        UNIQUE (name, type)
);

-- =========================
-- 4. question_tags
-- =========================
CREATE TABLE question_tags (
    question_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    PRIMARY KEY (question_id, tag_id),

    CONSTRAINT fk_question_tags_question
        FOREIGN KEY (question_id)
        REFERENCES questions (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_question_tags_tag
        FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
);

-- =========================
-- 5. answers
-- =========================
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    gift_name VARCHAR(255) NOT NULL,
    price_range VARCHAR(100),
    content TEXT NOT NULL,
    like_count BIGINT NOT NULL DEFAULT 0,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id)
        REFERENCES questions (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_answers_member
        FOREIGN KEY (member_id)
        REFERENCES members (id)
        ON DELETE CASCADE
);

-- questions.accepted_answer_id는 answers 생성 이후 FK 추가
ALTER TABLE questions
    ADD CONSTRAINT fk_questions_accepted_answer
    FOREIGN KEY (accepted_answer_id)
    REFERENCES answers (id)
    ON DELETE SET NULL;

-- =========================
-- 6. comments
-- =========================
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    answer_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    like_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_answer
        FOREIGN KEY (answer_id)
        REFERENCES answers (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_member
        FOREIGN KEY (member_id)
        REFERENCES members (id)
        ON DELETE CASCADE
);

-- =========================
-- 7. likes
-- =========================
CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_likes_member
        FOREIGN KEY (member_id)
        REFERENCES members (id)
        ON DELETE CASCADE,

    CONSTRAINT chk_likes_target_type
        CHECK (target_type IN ('QUESTION', 'ANSWER', 'COMMENT')),

    CONSTRAINT uk_likes_member_target
        UNIQUE (member_id, target_type, target_id)
);

-- =========================
-- 8. bookmarks
-- =========================
CREATE TABLE bookmarks (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookmarks_member
        FOREIGN KEY (member_id)
        REFERENCES members (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bookmarks_question
        FOREIGN KEY (question_id)
        REFERENCES questions (id)
        ON DELETE CASCADE,

    CONSTRAINT uk_bookmarks_member_question
        UNIQUE (member_id, question_id)
);

-- =========================
-- 9. images
-- =========================
CREATE TABLE images (
    id BIGSERIAL PRIMARY KEY,
    target_type VARCHAR(30) NOT NULL,
    target_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    original_name VARCHAR(255),
    stored_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_images_target_type
        CHECK (target_type IN ('QUESTION', 'ANSWER', 'MEMBER'))
);

-- =========================
-- 10. notifications
-- =========================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    receiver_id BIGINT NOT NULL,
    sender_id BIGINT,
    type VARCHAR(50) NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES members (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_notifications_sender
        FOREIGN KEY (sender_id)
        REFERENCES members (id)
        ON DELETE SET NULL,

    CONSTRAINT chk_notifications_type
        CHECK (type IN (
            'ANSWER_CREATED',
            'ANSWER_ACCEPTED',
            'QUESTION_LIKED',
            'ANSWER_LIKED',
            'COMMENT_LIKED'
        )),

    CONSTRAINT chk_notifications_target_type
        CHECK (target_type IN ('QUESTION', 'ANSWER', 'COMMENT'))
);