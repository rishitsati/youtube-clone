import axios from "axios";

const api = axios.create({
  baseURL: "https://youtube-clone-backend-co6r.onrender.com/api",
});

// ============================================
// AUTH ENDPOINTS
// ============================================

export const register = (userData) => {
  return api.post("/auth/register", userData);
};

export const login = (credentials) => {
  return api.post("/auth/login", credentials);
};

export const getMe = (token) => {
  return api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateProfile = (profileData, token) => {
  return api.put("/auth/profile", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const changePassword = (passwordData, token) => {
  return api.put("/auth/password", passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAccount = (token) => {
  return api.delete("/auth/account", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================================
// VIDEO ENDPOINTS
// ============================================

export const getAllVideos = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  return api.get(`/videos?${params.toString()}`);
};

export const getVideo = (videoId) => {
  return api.get(`/videos/${videoId}`);
};

export const createVideo = (videoData, token) => {
  return api.post("/videos", videoData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateVideo = (videoId, videoData, token) => {
  return api.put(`/videos/${videoId}`, videoData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteVideo = (videoId, token) => {
  return api.delete(`/videos/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const likeVideo = (videoId, token) => {
  return api.put(
    `/videos/${videoId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unlikeVideo = (videoId, token) => {
  return api.put(
    `/videos/${videoId}/unlike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const dislikeVideo = (videoId, token) => {
  return api.put(
    `/videos/${videoId}/dislike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const undislikeVideo = (videoId, token) => {
  return api.put(
    `/videos/${videoId}/undislike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const addVideoView = (videoId) => {
  return api.put(`/videos/${videoId}/view`, {});
};

export const trackVideoWatch = (videoId, watchData, token) => {
  return api.post(`/videos/${videoId}/watch`, watchData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getWatchHistory = (token) => {
  return api.get("/videos/watch-history", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearWatchHistory = (token) => {
  return api.delete("/videos/watch-history/clear", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getVideoSuggestions = (query) => {
  return api.get(`/videos/suggest/${query}`);
};

// ============================================
// CHANNEL ENDPOINTS
// ============================================

export const createChannel = (channelData, token) => {
  return api.post("/channels", channelData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getChannel = (channelId) => {
  return api.get(`/channels/${channelId}`);
};

export const getChannelVideos = (channelId) => {
  return api.get(`/channels/${channelId}/videos`);
};

export const updateChannel = (channelId, channelData, token) => {
  return api.put(`/channels/${channelId}`, channelData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const subscribeChannel = (channelId, token) => {
  return api.post(
    `/channels/${channelId}/subscribe`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unsubscribeChannel = (channelId, token) => {
  return api.delete(`/channels/${channelId}/subscribe`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getChannelSubscribers = (channelId) => {
  return api.get(`/channels/${channelId}/subscribers`);
};

export const checkChannelSubscription = (channelId, token) => {
  return api.get(`/channels/${channelId}/is-subscribed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserChannels = (token) => {
  return api.get("/channels/user/my-channels", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================================
// COMMENT ENDPOINTS
// ============================================

export const getVideoComments = (videoId) => {
  return api.get(`/comments/${videoId}`);
};

export const getComment = (commentId) => {
  return api.get(`/comments/${commentId}`);
};

export const addComment = (commentData, token) => {
  return api.post("/comments", commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateComment = (commentId, commentData, token) => {
  return api.put(`/comments/${commentId}`, commentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteComment = (commentId, token) => {
  return api.delete(`/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const likeComment = (commentId, token) => {
  return api.put(
    `/comments/${commentId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unlikeComment = (commentId, token) => {
  return api.put(
    `/comments/${commentId}/unlike`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ============================================
// PLAYLIST ENDPOINTS
// ============================================

export const createPlaylist = (playlistData, token) => {
  return api.post("/playlists", playlistData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserPlaylists = (token) => {
  return api.get("/playlists/user/my-playlists", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getPlaylist = (playlistId, token) => {
  return api.get(`/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updatePlaylist = (playlistId, playlistData, token) => {
  return api.put(`/playlists/${playlistId}`, playlistData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deletePlaylist = (playlistId, token) => {
  return api.delete(`/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addVideoToPlaylist = (playlistId, videoId, token) => {
  return api.post(
    `/playlists/${playlistId}/videos`,
    { videoId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const removeVideoFromPlaylist = (playlistId, videoId, token) => {
  return api.delete(`/playlists/${playlistId}/videos/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================================
// UTILITY EXPORTS
// ============================================

export default api;
