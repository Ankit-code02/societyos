import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bot,
  ChevronLeft,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react'

import {
  createAiConversation,
  getAiConversations,
  getAiMessages,
  sendAiMessage,
} from '../../services/api/aiApi'
import type { AiMessage } from '../../types/ai'
import { Link } from 'react-router-dom'
import { useSocietyId } from '../../hooks/useSocietyId'

function formatConversationDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

function MessageBubble({ message }: { message: AiMessage }) {
  const isUser = message.role === 'USER'

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? 'rounded-br-md bg-[var(--color-forest-900)] text-white'
            : 'rounded-bl-md border border-[var(--color-border)] bg-white text-[var(--color-ink-700)]'
        }`}
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-teal-600)]">
            <Bot className="h-3.5 w-3.5" />
            SocietyOS AI
          </div>
        )}

        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}

export default function AiHelpPage() {
  const queryClient = useQueryClient()
    const societyId = useSocietyId()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null)

  const [message, setMessage] = useState('')

  const conversationsQuery = useQuery({
    queryKey: ['ai-conversations', societyId],
    queryFn: () => {
      if (!societyId) {
        throw new Error('Society ID is required')
      }

      return getAiConversations(societyId)
    },
    enabled: Boolean(societyId),
  })

  const conversations = conversationsQuery.data ?? []

  useEffect(() => {
    if (
      !selectedConversationId &&
      conversations.length > 0
    ) {
      setSelectedConversationId(conversations[0].id)
    }
  }, [conversations, selectedConversationId])

  const messagesQuery = useQuery({
    queryKey: [
      'ai-messages',
      societyId,
      selectedConversationId,
    ],
    queryFn: () => {
      if (!societyId || !selectedConversationId) {
        throw new Error(
          'Society and conversation are required',
        )
      }

      return getAiMessages(
        societyId,
        selectedConversationId,
      )
    },
    enabled: Boolean(selectedConversationId),
  })

  const createConversationMutation = useMutation({
    mutationFn: () => {
      if (!societyId) {
        throw new Error('Society ID is required')
      }

      return createAiConversation(societyId, {
        title: 'New conversation',
      })
    },
    onSuccess: (conversation) => {
      queryClient.setQueryData(
        ['ai-conversations', societyId],
        (current: typeof conversations = []) => [
          conversation,
          ...current,
        ],
      )

      setSelectedConversationId(conversation.id)
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!societyId || !selectedConversationId) {
        throw new Error(
          'Society and conversation are required',
        )
      }

      return sendAiMessage(
        societyId,
        selectedConversationId,
        { content },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'ai-messages',
          societyId,
          selectedConversationId,
        ],
      })

      queryClient.invalidateQueries({
        queryKey: ['ai-conversations', societyId],
      })
    },
  })

  const messages = messagesQuery.data ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages.length])

  function handleSendMessage() {
    const trimmed = message.trim()

    if (
      !trimmed ||
      !selectedConversationId ||
      sendMessageMutation.isPending
    ) {
      return
    }

    setMessage('')
    sendMessageMutation.mutate(trimmed)
  }

  function handleComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }
    if (!societyId) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-800">
            Society not selected
          </h1>

          <p className="mt-2 text-sm text-red-700">
            Please return to your account and select a society.
          </p>

          <Link
            to="/account"
            className="mt-5 inline-flex rounded-lg bg-[var(--color-forest-900)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Go to My Account
          </Link>
        </div>
      )
    }
  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm lg:flex-row">
      {/* Conversation sidebar */}
      <aside
        className={`w-full shrink-0 border-b border-[var(--color-border)] bg-[var(--color-ivory-100)] lg:w-80 lg:border-b-0 lg:border-r ${
          selectedConversationId
            ? 'hidden lg:flex'
            : 'flex'
        } flex-col`}
      >
        <div className="border-b border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-teal-600)]">
                Assistant
              </p>

              <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--color-ink-950)]">
                AI Help
              </h1>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-forest-900)] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              createConversationMutation.mutate()
            }
            disabled={createConversationMutation.isPending}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-forest-900)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-forest-800)] disabled:opacity-50"
          >
            {createConversationMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {conversationsQuery.isLoading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-white"
                />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <MessageCircle className="mx-auto h-7 w-7 text-[var(--color-ink-300)]" />

              <p className="mt-3 text-sm font-medium text-[var(--color-ink-700)]">
                No conversations yet
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--color-ink-400)]">
                Start a conversation to ask SocietyOS AI for help.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => {
                const selected =
                  conversation.id === selectedConversationId

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      setSelectedConversationId(conversation.id)
                    }
                    className={`w-full rounded-xl p-3 text-left transition ${
                      selected
                        ? 'bg-white shadow-sm'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? 'bg-[var(--color-teal-50)] text-[var(--color-teal-600)]'
                            : 'bg-white text-[var(--color-ink-400)]'
                        }`}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-ink-800)]">
                          {conversation.title ||
                            'New conversation'}
                        </p>

                        <p className="mt-1 text-[11px] text-[var(--color-ink-400)]">
                          {formatConversationDate(
                            conversation.updatedAt,
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Chat */}
      <section
        className={`min-w-0 flex-1 flex-col ${
          selectedConversationId
            ? 'flex'
            : 'hidden lg:flex'
        }`}
      >
        {/* Chat header */}
        <header className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSelectedConversationId(null)}
            className="rounded-lg p-2 text-[var(--color-ink-500)] hover:bg-[var(--color-ivory-100)] lg:hidden"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)] text-[var(--color-teal-600)]">
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ink-950)]">
              SocietyOS AI
            </h2>

            <p className="text-xs text-[var(--color-ink-400)]">
              Your community assistant
            </p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-ivory-100)] px-4 py-6 sm:px-6">
          {!selectedConversationId ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-forest-900)] text-white">
                  <Sparkles className="h-7 w-7" />
                </div>

                <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-[var(--color-ink-950)]">
                  How can I help?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                  Ask about your society, meetings, complaints,
                  maintenance, or everyday community questions.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    createConversationMutation.mutate()
                  }
                  className="mt-6 rounded-xl bg-[var(--color-forest-900)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Start a conversation
                </button>
              </div>
            </div>
          ) : messagesQuery.isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[var(--color-teal-600)]" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-teal-600)] shadow-sm">
                  <Bot className="h-7 w-7" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink-950)]">
                  Start asking questions
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                  I'm here to help you navigate your society and
                  answer everyday community questions.
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((item) => (
                <MessageBubble
                  key={item.id}
                  message={item}
                />
              ))}

              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--color-teal-600)]" />
                      <span className="text-xs text-[var(--color-ink-400)]">
                        SocietyOS AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--color-border)] bg-white p-4 sm:p-5">
          <div className="mx-auto max-w-3xl">
            {sendMessageMutation.isError && (
              <p className="mb-3 text-xs font-medium text-red-600">
                We couldn't send that message. Please try again.
              </p>
            )}

            <div className="flex items-end gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-ivory-100)] p-2 focus-within:border-[var(--color-teal-500)]">
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={handleComposerKeyDown}
                disabled={
                  !selectedConversationId ||
                  sendMessageMutation.isPending
                }
                maxLength={5000}
                rows={1}
                placeholder={
                  selectedConversationId
                    ? 'Ask SocietyOS AI something...'
                    : 'Start a conversation first'
                }
                className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-[var(--color-ink-800)] outline-none placeholder:text-[var(--color-ink-400)] disabled:cursor-not-allowed"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  !message.trim() ||
                  !selectedConversationId ||
                  sendMessageMutation.isPending
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-forest-900)] text-white transition hover:bg-[var(--color-forest-800)] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-[var(--color-ink-400)]">
              Press Enter to send · Shift + Enter for a new line
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}