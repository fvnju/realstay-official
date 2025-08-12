# Chat Component Architecture

This chat component has been refactored into smaller, focused components and custom hooks to improve maintainability, testability, and reusability.

## Structure

```
chat/
├── [id].tsx                 # Main chat page component
├── hooks/
│   ├── index.ts            # Hook exports
│   ├── useChatData.ts      # Data fetching (messages & user)
│   ├── useChatSocket.ts    # Socket messaging logic
│   └── useImageAttachment.ts # Image picker & upload logic
├── components/
│   ├── index.ts            # Component exports
│   ├── ChatHeader.tsx      # Header with user info & navigation
│   ├── MessageList.tsx     # Optimized message list
│   ├── AttachmentOptions.tsx # Camera & photo library options
│   ├── TypingIndicator.tsx # Shows when user is typing
│   ├── ImagePreview.tsx    # Preview selected images
│   ├── MessageInput.tsx    # Text input with send button
│   └── ChatStates.tsx      # Loading & error states
└── README.md               # This file
```

## Custom Hooks

### `useChatData(token, id)`

- Fetches chat messages and user details
- Returns loading states and error handling
- Uses React Query for caching and background updates

### `useChatSocket(token, receiverId)`

- Manages WebSocket connection for real-time messaging
- Handles sending messages and typing indicators
- Manages message state synchronization

### `useImageAttachment()`

- Handles camera and photo library permissions
- Manages image selection and upload progress
- Provides functions for taking photos and picking images

## Components

### `ChatHeader`

- Displays user name and type
- Navigation back button
- Menu options (placeholder)

### `MessageList`

- Optimized FlatList for message rendering
- Uses existing ChatBubble component
- Handles scrolling and performance optimization

### `AttachmentOptions`

- Shows camera and photo library options
- Handles haptic feedback
- Conditional rendering based on visibility

### `TypingIndicator`

- Shows when the other user is typing
- Simple conditional rendering

### `ImagePreview`

- Previews selected images before sending
- Shows upload progress
- Remove image functionality

### `MessageInput`

- Text input with send functionality
- Attachment toggle button
- Keyboard handling

### `ChatStates`

- Loading state component
- Error state with retry functionality
- Consistent styling with theme

## Benefits of This Architecture

1. **Single Responsibility**: Each component/hook has one clear purpose
2. **Reusability**: Components can be reused in other chat contexts
3. **Testability**: Smaller components are easier to unit test
4. **Maintainability**: Changes are isolated to specific areas
5. **Performance**: Optimized rendering with proper memoization
6. **Type Safety**: Strong TypeScript interfaces throughout
7. **Separation of Concerns**: UI, data, and business logic are separated

## Usage

The main chat component now focuses on orchestration rather than implementation details:

```tsx
export default function ChatPage() {
  // Hooks for data and functionality
  const { messages, user, isLoading, error } = useChatData(token, id);
  const { sendMessage, isTyping } = useChatSocket(token, id);
  const { image, takePhoto, pickImage } = useImageAttachment();

  // Simple orchestration logic
  // Render focused components
}
```

This architecture eliminates the "rendered more hooks during previous render" error by ensuring all hooks are called at the top level and in a consistent order.
