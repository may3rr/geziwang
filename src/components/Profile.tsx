import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './Profile.css';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  status: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'created' | 'participating'>('created');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_PROFILE, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('获取个人信息失败');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchEvents = async () => {
      try {
        const [myEventsResponse, participatingEventsResponse] = await Promise.all([
          fetch(API_ENDPOINTS.GET_MY_EVENTS, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          fetch(API_ENDPOINTS.GET_PARTICIPATING_EVENTS, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        if (!myEventsResponse.ok || !participatingEventsResponse.ok) {
          throw new Error('获取活动列表失败');
        }

        const [myEventsData, participatingEventsData] = await Promise.all([
          myEventsResponse.json(),
          participatingEventsResponse.json(),
        ]);

        setMyEvents(myEventsData);
        setParticipatingEvents(participatingEventsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading-spinner">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profile) {
    return <div className="error-message">无法加载个人信息</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt="用户头像" />
          ) : (
            <div className="avatar-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p className="email">{profile.email}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>创建的活动</h3>
          <p>{myEvents.length}</p>
        </div>
        <div className="stat-card">
          <h3>参与的活动</h3>
          <p>{participatingEvents.length}</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          我创建的活动
        </button>
        <button
          className={`tab ${activeTab === 'participating' ? 'active' : ''}`}
          onClick={() => setActiveTab('participating')}
        >
          我参与的活动
        </button>
      </div>

      <div className="event-history-list">
        {activeTab === 'created' ? (
          myEvents.length > 0 ? (
            myEvents.map(event => (
              <div key={event._id} className="event-history-item">
                <div className="event-history-info">
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleString()} | {event.location}</p>
                </div>
                <span className={`status ${event.status}`}>
                  {event.status === 'upcoming' ? '即将开始' :
                   event.status === 'ongoing' ? '进行中' :
                   event.status === 'completed' ? '已结束' : '已取消'}
                </span>
              </div>
            ))
          ) : (
            <div className="no-events">
              <p>您还没有创建过活动</p>
            </div>
          )
        ) : (
          participatingEvents.length > 0 ? (
            participatingEvents.map(event => (
              <div key={event._id} className="event-history-item">
                <div className="event-history-info">
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleString()} | {event.location}</p>
                </div>
                <span className={`status ${event.status}`}>
                  {event.status === 'upcoming' ? '即将开始' :
                   event.status === 'ongoing' ? '进行中' :
                   event.status === 'completed' ? '已结束' : '已取消'}
                </span>
              </div>
            ))
          ) : (
            <div className="no-events">
              <p>您还没有参加过活动</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;