/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { GamesTab } from './components/GamesTab';
import { ChatsTab } from './components/ChatsTab';
import { ProfileTab } from './components/ProfileTab';
import { VoiceCallModal } from './components/VoiceCallModal';
import { VideoCallModal } from './components/VideoCallModal';
import { BackendArchitectureModal } from './components/BackendArchitectureModal';
import { AndroidExportModal } from './components/AndroidExportModal';

import { TabType, Friend, ChatMessage, UserProfile, ActiveCall } from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_FRIENDS,
  INITIAL_MESSAGES,
} from './services/backendArchitecture';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);

  // Modals & Calls
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [showAndroidExportModal, setShowAndroidExportModal] = useState(false);
  const [architectureDefaultTab, setArchitectureDefaultTab] = useState<'chat' | 'call'>('chat');

  // Total unread chats count
  const unreadChatsCount = friends.reduce((acc, f) => acc + (f.unreadCount || 0), 0);

  // Send Message Handler
  const handleSendMessage = (friendId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [friendId]: [...(prev[friendId] || []), newMsg],
    }));

    // Simulated friendly reply after 1.4s
    const friend = friends.find((f) => f.id === friendId);
    if (friend) {
      setTimeout(() => {
        const replies = [
          'Nice move! Want to jump into Tic-Tac-Toe right now?',
          'Got it! Playing on Move Game on mobile is so smooth.',
          'Haha let’s run a rematch soon!',
          'GG! Ready whenever you are.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: friendId,
          text: randomReply,
          timestamp: 'Just now',
        };

        setMessages((prev) => ({
          ...prev,
          [friendId]: [...(prev[friendId] || []), replyMsg],
        }));

        sound.playMessageSent();
      }, 1400);
    }
  };

  // Add Friend Handler
  const handleAddFriend = (name: string, username: string) => {
    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      name,
      username,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      status: 'online',
      gameRank: 'Challenger',
      level: 1,
      lastMessage: 'Added to friends list',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };

    setFriends((prev) => [newFriend, ...prev]);
  };

  // Call Handlers
  const handleStartVoiceCall = (friend: Friend) => {
    setActiveCall({
      friend,
      type: 'voice',
      status: 'ringing',
      isMuted: false,
      isSpeakerOn: true,
      isVideoOff: false,
    });
  };

  const handleStartVideoCall = (friend: Friend) => {
    setActiveCall({
      friend,
      type: 'video',
      status: 'ringing',
      isMuted: false,
      isSpeakerOn: true,
      isVideoOff: false,
    });
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  // Navigation shortcuts
  const handleOpenChatWith = (friendId: string) => {
    // Clear unread
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, unreadCount: 0 } : f))
    );
    setCurrentTab('chats');
  };

  const handlePlayGame = (gameId: 'tictactoe' | 'reflex') => {
    setCurrentTab('games');
  };

  return (
    <AndroidFrame>
      {/* Screen Views based on active tab */}
      {currentTab === 'home' && (
        <HomeTab
          user={user}
          friends={friends}
          onPlayGame={handlePlayGame}
          onOpenChatWith={handleOpenChatWith}
          onOpenAndroidExport={() => setShowAndroidExportModal(true)}
          onOpenArchitecture={() => {
            setArchitectureDefaultTab('chat');
            setShowArchitectureModal(true);
          }}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {currentTab === 'games' && <GamesTab />}

      {currentTab === 'chats' && (
        <ChatsTab
          friends={friends}
          messages={messages}
          onSendMessage={handleSendMessage}
          onStartVoiceCall={handleStartVoiceCall}
          onStartVideoCall={handleStartVideoCall}
          onOpenArchitecture={() => {
            setArchitectureDefaultTab('chat');
            setShowArchitectureModal(true);
          }}
          onOpenGame={(gameId) => handlePlayGame(gameId)}
        />
      )}

      {currentTab === 'profile' && (
        <ProfileTab
          user={user}
          friends={friends}
          onAddFriend={handleAddFriend}
          onOpenChatWith={handleOpenChatWith}
          onStartVoiceCall={handleStartVoiceCall}
          onStartVideoCall={handleStartVideoCall}
          onOpenAndroidExport={() => setShowAndroidExportModal(true)}
          onOpenArchitecture={() => {
            setArchitectureDefaultTab('call');
            setShowArchitectureModal(true);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unreadChatsCount={unreadChatsCount}
      />

      {/* Voice Call Screen Overlay */}
      {activeCall && activeCall.type === 'voice' && (
        <VoiceCallModal
          friend={activeCall.friend}
          onEndCall={handleEndCall}
          onOpenArchitecture={() => {
            setArchitectureDefaultTab('call');
            setShowArchitectureModal(true);
          }}
        />
      )}

      {/* Video Call Screen Overlay */}
      {activeCall && activeCall.type === 'video' && (
        <VideoCallModal
          friend={activeCall.friend}
          onEndCall={handleEndCall}
          onOpenArchitecture={() => {
            setArchitectureDefaultTab('call');
            setShowArchitectureModal(true);
          }}
        />
      )}

      {/* Backend Architecture Modal */}
      <BackendArchitectureModal
        isOpen={showArchitectureModal}
        onClose={() => setShowArchitectureModal(false)}
        defaultTab={architectureDefaultTab}
      />

      {/* Android Export & Testing Modal */}
      <AndroidExportModal
        isOpen={showAndroidExportModal}
        onClose={() => setShowAndroidExportModal(false)}
      />
    </AndroidFrame>
  );
}
