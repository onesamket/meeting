import { usePubSub } from '@videosdk.live/react-sdk';

/**
 * Type for a chat message in VideoSDK.
 * https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/collaboration-in-meeting/chat-using-pubsub
 * https://docs.videosdk.live/react/api/sdk-reference/use-participant/introduction
 */
export interface ChatMessage {
  id: string;
  message: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  topic: string;
  payload?: object;
}

/**
 * Options for configuring the useChat hook.
 */
export interface UseChatOptions {
  /**
   * Called when a new chat message is received.
   */
  onMessageReceived?: (msg: ChatMessage) => void;
  /**
   * Called when old messages are received (if supported).
   */
  onOldMessagesReceived?: (msgs: ChatMessage[]) => void;
}

/**
 * Options for sending a chat message.
 */
export interface SendMessageOptions {
  persist?: boolean;
  sendOnly?: string[]; // participantIds for private chat
}

/**
 * Result returned by the useChat hook.
 */
export interface UseChatResult {
  /**
   * Array of chat messages (chronological order).
   */
  messages: ChatMessage[];
  /**
   * Send a chat message (optionally with payload and options).
   */
  sendMessage: (
    message: string,
    options?: SendMessageOptions,
    payload?: object
  ) => void;
  /**
   * Filter messages by senderId.
   */
  getMessagesBySender: (senderId: string) => ChatMessage[];
  /**
   * Filter messages by topic.
   */
  getMessagesByTopic: (topic: string) => ChatMessage[];
  /**
   * The raw publish function from usePubSub (for advanced use).
   */
  publish: ReturnType<typeof usePubSub>['publish'];
}
