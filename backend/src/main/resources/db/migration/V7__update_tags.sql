INSERT INTO tags (name, type) VALUES
                                  ('가족', 'TARGET'),
                                  ('기타', 'TARGET');

INSERT INTO tags (name, type) VALUES
    ('기타', 'GENDER');

DELETE FROM tags WHERE type = 'BUDGET';
INSERT INTO tags (name, type) VALUES
                                  ('1만원 이하',  'BUDGET'),
                                  ('1~3만원',    'BUDGET'),
                                  ('3~5만원',    'BUDGET'),
                                  ('5~10만원',   'BUDGET'),
                                  ('10만원 이상', 'BUDGET'),
                                  ('기타',       'BUDGET');

INSERT INTO tags (name, type) VALUES
    ('기타', 'SITUATION');

DELETE FROM tags WHERE name = '인테리어' AND type = 'GIFT_TYPE';
INSERT INTO tags (name, type) VALUES
                                  ('인테리어/소품', 'GIFT_TYPE'),
                                  ('기타',         'GIFT_TYPE');