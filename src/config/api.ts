export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // 用户相关
  GET_PROFILE: `${API_BASE_URL}/users/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/me`,
  GET_MY_EVENTS: `${API_BASE_URL}/users/me/events`,
  GET_PARTICIPATING_EVENTS: `${API_BASE_URL}/users/me/participating`,
  
  // 活动相关
  EVENTS: `${API_BASE_URL}/events`,
  EVENT_DETAIL: (id: string) => `${API_BASE_URL}/events/${id}`,
  JOIN_EVENT: (id: string) => `${API_BASE_URL}/events/${id}/join`,
  LEAVE_EVENT: (id: string) => `${API_BASE_URL}/events/${id}/leave`,
}; 