ALTER TABLE members
        ADD COLUMN provider VARCHAR(30) NOT NULL DEFAULT 'FORYOU';

ALTER TABLE members
        ADD COLUMN provider_id VARCHAR(100);

ALTER TABLE members
    ADD CONSTRAINT chk_members_provider
        CHECK (provider IN ('FORYOU', 'KAKAO', 'GOOGLE'));

ALTER TABLE members
    ADD CONSTRAINT uk_members_provider_provider_id
        UNIQUE (provider, provider_id);
