export type AiMessageRole = 'USER' | 'ASSISTANT'

export interface AiConversation {
  id: string
  societyId: string
  userId: string
  title?: string
  createdAt: string
  updatedAt: string
}

export interface AiMessage {
  id: string
  conversationId: string
  role: AiMessageRole
  content: string
  createdAt: string
}

export interface CreateAiConversationRequest {
  title?: string
}

export interface SendAiMessageRequest {
  content: string
}