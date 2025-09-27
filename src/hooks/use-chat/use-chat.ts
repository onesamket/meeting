import { useCallback } from 'react';
import { usePubSub } from '@videosdk.live/react-sdk';
import type{
  ChatMessage,
  SendMessageOptions,
  UseChatOptions,
  UseChatResult
} from './use-chat.types';

/**
 * Utility to send a message to any topic (public, private, group, etc.)
 * Note: This must be used inside a React component or custom hook.
 */
export function useSendMessageToTopic(topic: string) {
  const { publish } = usePubSub(topic);
  return useCallback(
    (message: string, options?: SendMessageOptions, payload?: object) => {
      // Ensure persist is always a boolean
      const opts = {
        persist: options?.persist ?? true,
        ...(options?.sendOnly ? { sendOnly: options.sendOnly } : {})
      };
      publish(message, opts, payload);
    },
    [publish]
  );
}

/**
 * useChat hook for VideoSDK meetings (public chat via pub/sub).
 *
 * @param options - Optional event callbacks
 * @returns Chat state, send function, and utilities
 */
export function useChat(options: UseChatOptions = {}): UseChatResult {
  return useChatForTopic('CHAT', options);
}

/**
 * usePrivateChat hook for VideoSDK meetings (private chat with a specific user).
 *
 * @param userId - The user ID to chat with
 * @param options - Optional event callbacks
 * @returns Chat state, send function, and utilities
 */
export function usePrivateChat(
  userId: string,
  options: UseChatOptions = {}
): UseChatResult {
  return useChatForTopic(`CHAT_${userId}`, options);
}

/**
 * useGroupChat hook for VideoSDK meetings (group chat for a specific group).
 *
 * @param groupId - The group ID to chat with
 * @param options - Optional event callbacks
 * @returns Chat state, send function, and utilities
 */
export function useGroupChat(
  groupId: string,
  options: UseChatOptions = {}
): UseChatResult {
  return useChatForTopic(`CHAT_GROUP_${groupId}`, options);
}

/**
 * Internal: Generic chat hook for any topic.
 */
function useChatForTopic(
  topic: string,
  options: UseChatOptions = {}
): UseChatResult {
  console.log(`Initializing chat for topic: ${topic}`);
  
  const { messages, publish } = usePubSub(topic, {
    onMessageReceived: (msg) => {
      console.log(`Message received on topic ${topic}:`, msg);
      options.onMessageReceived?.(msg);
    },
    onOldMessagesReceived: (msgs) => {
      console.log(`Old messages received on topic ${topic}:`, msgs);
      options.onOldMessagesReceived?.(msgs);
    }
  });

  // Debug: Log messages when they change
  console.log(`Messages for topic ${topic}:`, messages);

  /**
   * Send a chat message (optionally with payload and options)
   */
  const sendMessage = useCallback(
    (message: string, opts?: SendMessageOptions, payload?: object) => {
      console.log(`Sending message to topic ${topic}:`, message, opts, payload);
      
      // Ensure persist is always a boolean
      const options = {
        persist: opts?.persist ?? true,
        ...(opts?.sendOnly ? { sendOnly: opts.sendOnly } : {})
      };
      
      try {
        publish(message, options, payload);
        console.log(`Message published successfully to topic ${topic}`);
      } catch (error) {
        console.error(`Failed to publish message to topic ${topic}:`, error);
      }
    },
    [publish, topic]
  );

  /**
   * Filter messages by senderId
   */
  const getMessagesBySender = useCallback(
    (senderId: string) => messages.filter((msg) => msg.senderId === senderId),
    [messages]
  );

  /**
   * Filter messages by topic
   */
  const getMessagesByTopic = useCallback(
    (filterTopic: string) =>
      messages.filter((msg) => msg.topic === filterTopic),
    [messages]
  );

  return {
    messages,
    sendMessage,
    getMessagesBySender,
    getMessagesByTopic,
    publish
  };
}

/**
 * Utility: Format a chat message timestamp as a local time string.
 */
export function formatChatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

/**
 * Utility: Get the display name for a chat message (with fallback).
 */
export function getChatSenderName(msg: ChatMessage): string {
  return msg.senderName || msg.senderId || 'Unknown';
}

/**
 * Utility: Show a notification for a new message (example usage for onMessageReceived)
 */
export function showChatNotification(msg: ChatMessage) {
  window.alert(`${getChatSenderName(msg)} says: ${msg.message}`);
}

/**
 * ----------------------
 * Usage Example (React):
 * ----------------------
 *
 * // Group chat (all users)
 * const { messages, sendMessage } = useChat();
 *
 * // Private chat (with a specific user)
 * const { messages: privateMessages, sendMessage: sendPrivate } = usePrivateChat('user123');
 *
 * // Group chat (with a specific group)
 * const { messages: groupMessages, sendMessage: sendGroup } = useGroupChat('group456');
 *
 * // Sending a message (public)
 * sendMessage('Hello everyone!');
 *
 * // Sending a private message (to userId 'user123')
 * sendMessage('Hello user123!', { sendOnly: ['user123'] });
 *
 * // Sending a group message
 * sendGroup('Hello group!');
 *
 * // Advanced: send with custom payload and persist
 * sendMessage('Important!', { persist: true }, { type: 'alert' });
 *
 * // Notification on new message
 * const { messages } = useChat({
 *   onMessageReceived: (msg) => showChatNotification(msg)
 * });
 *
 * // Rendering messages
 * messages.map(msg => (
 *   <div key={msg.id}>
 *     <b>{getChatSenderName(msg)}:</b> {msg.message} <i>({formatChatTimestamp(msg.timestamp)})</i>
 *   </div>
 * ));
 *
 * // You can also use getMessagesBySender or getMessagesByTopic utilities as needed.
 */
