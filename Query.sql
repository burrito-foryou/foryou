CREATE TABLE "members" (
                           "id"                BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                           "email"             VARCHAR(100)    NOT NULL,
                           "password"          VARCHAR(255)    NOT NULL,
                           "nickname"          VARCHAR(50)     NOT NULL,
                           "role"              VARCHAR(20)     DEFAULT 'USER' NOT NULL,
                           "profile_image_url" VARCHAR(500)    NULL,
                           "created_at"        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
                           "updated_at"        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "questions" (
                             "id"                 BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                             "member_id"          BIGINT          NOT NULL,
                             "title"              VARCHAR(255)    NOT NULL,
                             "content"            TEXT            NOT NULL,
                             "status"             VARCHAR(20)     DEFAULT 'PENDING' NOT NULL,
                             "view_count"         INT             DEFAULT 0 NOT NULL,
                             "like_count"         INT             DEFAULT 0 NOT NULL,
                             "accepted_answer_id" BIGINT          NULL,
                             "created_at"         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
                             "updated_at"         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "answers" (
                           "id"          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                           "question_id" BIGINT          NOT NULL,
                           "member_id"   BIGINT          NOT NULL,
                           "gift_name"   VARCHAR(100)    NOT NULL,
                           "price_range" VARCHAR(50)     NULL,
                           "content"     TEXT            NOT NULL,
                           "like_count"  INT             DEFAULT 0 NOT NULL,
                           "is_accepted" BOOLEAN         DEFAULT FALSE NOT NULL,
                           "created_at"  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL,
                           "updated_at"  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "comments" (
                            "id"         BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                            "answer_id"  BIGINT      NOT NULL,
                            "member_id"  BIGINT      NOT NULL,
                            "content"    TEXT        NOT NULL,
                            "like_count" INT         DEFAULT 0 NOT NULL,
                            "created_at" TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
                            "updated_at" TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "tags" (
                        "id"   BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                        "name" VARCHAR(50) NOT NULL,
                        "type" VARCHAR(20) NOT NULL
);

CREATE TABLE "question_tags" (
                                 "question_id" BIGINT NOT NULL,
                                 "tag_id"      BIGINT NOT NULL
);

CREATE TABLE "likes" (
                         "id"          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                         "member_id"   BIGINT      NOT NULL,
                         "target_type" VARCHAR(20) NOT NULL,
                         "target_id"   BIGINT      NOT NULL,
                         "created_at"  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "bookmarks" (
                             "id"          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                             "member_id"   BIGINT    NOT NULL,
                             "question_id" BIGINT    NOT NULL,
                             "created_at"  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "images" (
                          "id"            BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                          "target_type"   VARCHAR(20)     NOT NULL,
                          "target_id"     BIGINT          NOT NULL,
                          "image_url"     VARCHAR(500)    NOT NULL,
                          "original_name" VARCHAR(255)    NOT NULL,
                          "stored_name"   VARCHAR(255)    NOT NULL,
                          "file_size"     BIGINT          NOT NULL,
                          "created_at"    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "notifications" (
                                 "id"          BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
                                 "receiver_id" BIGINT          NOT NULL,
                                 "sender_id"   BIGINT          NOT NULL,
                                 "type"        VARCHAR(50)     NOT NULL,
                                 "target_type" VARCHAR(20)     NOT NULL,
                                 "target_id"   BIGINT          NOT NULL,
                                 "content"     VARCHAR(255)    NOT NULL,
                                 "is_read"     BOOLEAN         DEFAULT FALSE NOT NULL,
                                 "created_at"  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- PK
ALTER TABLE "members"       ADD CONSTRAINT "PK_MEMBERS"       PRIMARY KEY ("id");
ALTER TABLE "questions"     ADD CONSTRAINT "PK_QUESTIONS"     PRIMARY KEY ("id");
ALTER TABLE "answers"       ADD CONSTRAINT "PK_ANSWERS"       PRIMARY KEY ("id");
ALTER TABLE "comments"      ADD CONSTRAINT "PK_COMMENTS"      PRIMARY KEY ("id");
ALTER TABLE "tags"          ADD CONSTRAINT "PK_TAGS"          PRIMARY KEY ("id");
ALTER TABLE "question_tags" ADD CONSTRAINT "PK_QUESTION_TAGS" PRIMARY KEY ("question_id", "tag_id");
ALTER TABLE "likes"         ADD CONSTRAINT "PK_LIKES"         PRIMARY KEY ("id");
ALTER TABLE "bookmarks"     ADD CONSTRAINT "PK_BOOKMARKS"     PRIMARY KEY ("id");
ALTER TABLE "images"        ADD CONSTRAINT "PK_IMAGES"        PRIMARY KEY ("id");
ALTER TABLE "notifications" ADD CONSTRAINT "PK_NOTIFICATIONS" PRIMARY KEY ("id");

-- UNIQUE
ALTER TABLE "members"   ADD CONSTRAINT "UQ_MEMBERS_EMAIL"    UNIQUE ("email");
ALTER TABLE "members"   ADD CONSTRAINT "UQ_MEMBERS_NICKNAME" UNIQUE ("nickname");
ALTER TABLE "likes"     ADD CONSTRAINT "UQ_LIKES"            UNIQUE ("member_id", "target_type", "target_id");
ALTER TABLE "bookmarks" ADD CONSTRAINT "UQ_BOOKMARKS"        UNIQUE ("member_id", "question_id");

-- FK
ALTER TABLE "questions"     ADD CONSTRAINT "FK_QUESTIONS_MEMBER"           FOREIGN KEY ("member_id")          REFERENCES "members"   ("id");
ALTER TABLE "answers"       ADD CONSTRAINT "FK_ANSWERS_QUESTION"           FOREIGN KEY ("question_id")        REFERENCES "questions" ("id");
ALTER TABLE "answers"       ADD CONSTRAINT "FK_ANSWERS_MEMBER"             FOREIGN KEY ("member_id")          REFERENCES "members"   ("id");
ALTER TABLE "comments"      ADD CONSTRAINT "FK_COMMENTS_ANSWER"            FOREIGN KEY ("answer_id")          REFERENCES "answers"   ("id");
ALTER TABLE "comments"      ADD CONSTRAINT "FK_COMMENTS_MEMBER"            FOREIGN KEY ("member_id")          REFERENCES "members"   ("id");
ALTER TABLE "likes"         ADD CONSTRAINT "FK_LIKES_MEMBER"               FOREIGN KEY ("member_id")          REFERENCES "members"   ("id");
ALTER TABLE "bookmarks"     ADD CONSTRAINT "FK_BOOKMARKS_MEMBER"           FOREIGN KEY ("member_id")          REFERENCES "members"   ("id");
ALTER TABLE "bookmarks"     ADD CONSTRAINT "FK_BOOKMARKS_QUESTION"         FOREIGN KEY ("question_id")        REFERENCES "questions" ("id");
ALTER TABLE "notifications" ADD CONSTRAINT "FK_NOTIFICATIONS_RECEIVER"     FOREIGN KEY ("receiver_id")        REFERENCES "members"   ("id");
ALTER TABLE "notifications" ADD CONSTRAINT "FK_NOTIFICATIONS_SENDER"       FOREIGN KEY ("sender_id")          REFERENCES "members"   ("id");
ALTER TABLE "question_tags" ADD CONSTRAINT "FK_QUESTION_TAGS_QUESTION"     FOREIGN KEY ("question_id")        REFERENCES "questions" ("id");
ALTER TABLE "question_tags" ADD CONSTRAINT "FK_QUESTION_TAGS_TAG"          FOREIGN KEY ("tag_id")             REFERENCES "tags"      ("id");