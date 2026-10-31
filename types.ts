export type TabType = 'home' | 'games' | 'chats' | 'profile';

export type GameId = 'tictactoe' | 'reflex';

export type GameMode = 'ai' | 'pvp';

export type AIDifficulty = 'easy' | 'tactical';

export type CellValue = 'X' | 'O' | null;

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'in-game' | 'offline';
  gameRank: string;
  level: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or friend.id
  text: string;
  timestamp: string;
  isGameInvite?: boolean;
  gameId?: GameId;
  inviteStatus?: 'pending' | 'accepted' | 'declined';
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  winRate: number;
  totalGames: number;
  wins: number;
  draws: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
}

export type CallType = 'voice' | 'video' | null;

export interface ActiveCall {
  friend: Friend;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startedAt?: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoOff: boolean;
}
