import { apiClient } from './client'

import type {
  AiConversation,
  AiMessage,
  CreateAiConversationRequest,
  SendAiMessageRequest,
} from '../../types/ai'

export async function getAiConversations(
  societyId: string,
): Promise<AiConversation[]> {
  const response = await apiClient.get<AiConversation[]>(
    `/societies/${societyId}/ai/conversations`,
  )

  return response.data
}

export async function createAiConversation(
  societyId: string,
  data: CreateAiConversationRequest = {},
): Promise<AiConversation> {
  const response = await apiClient.post<AiConversation>(
    `/societies/${societyId}/ai/conversations`,
    data,
  )

  return response.data
}

export async function getAiMessages(
  societyId: string,
  conversationId: string,
): Promise<AiMessage[]> {
  const response = await apiClient.get<AiMessage[]>(
    `/societies/${societyId}/ai/conversations/${conversationId}/messages`,
  )

  return response.data
}

export async function sendAiMessage(
  societyId: string,
  conversationId: string,
  data: SendAiMessageRequest,
): Promise<AiMessage> {
  const response = await apiClient.post<AiMessage>(
    `/societies/${societyId}/ai/conversations/${conversationId}/messages`,
    data,
  )

  return response.data
}