CREATE TABLE ai_conversations (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                  society_id UUID NOT NULL,
                                  user_id UUID NOT NULL,

                                  title VARCHAR(200),

                                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_ai_conversations_society
                                      FOREIGN KEY (society_id)
                                          REFERENCES societies(id),

                                  CONSTRAINT fk_ai_conversations_user
                                      FOREIGN KEY (user_id)
                                          REFERENCES users(id)
);

CREATE TABLE ai_messages (
                             id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                             conversation_id UUID NOT NULL,

                             role VARCHAR(20) NOT NULL,
                             content TEXT NOT NULL,

                             created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_ai_messages_conversation
                                 FOREIGN KEY (conversation_id)
                                     REFERENCES ai_conversations(id)
                                     ON DELETE CASCADE
);

CREATE INDEX idx_ai_conversations_society
    ON ai_conversations(society_id);

CREATE INDEX idx_ai_conversations_user
    ON ai_conversations(user_id);

CREATE INDEX idx_ai_messages_conversation
    ON ai_messages(conversation_id);

CREATE INDEX idx_ai_messages_created_at
    ON ai_messages(created_at);