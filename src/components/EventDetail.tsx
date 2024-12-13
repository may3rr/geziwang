import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './EventDetail.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  participants: {
    _id: string;
    username: string;
    email: string;
    pigeonRate: number;
  }[];
  organizer: {
    _id: string;
    username: string;
    email: string;
    pigeonRate: number;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.EVENT_DETAIL(id!), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('获取活动详情失败');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleJoin = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.JOIN_EVENT(id!), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '参加活动失败');
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.LEAVE_EVENT(id!), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '退出活动失败');
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('确定要删除此活动吗？')) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.EVENT_DETAIL(id!), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '删除活动失败');
      }

      navigate('/events');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getPigeonRateDisplay = (rate: number) => {
    if (rate >= 0.7) return '🕊️🕊️🕊️ 特级鸽王';
    if (rate >= 0.5) return '🕊️🕊️ 资深鸽子';
    if (rate >= 0.3) return '🕊️ 初级鸽子';
    return '👍 信用良好';
  };

  const getPigeonRateClass = (rate: number) => {
    if (rate >= 0.7) return 'pigeon-rate-high';
    if (rate >= 0.5) return 'pigeon-rate-medium';
    if (rate >= 0.3) return 'pigeon-rate-low';
    return 'pigeon-rate-good';
  };

  if (loading) {
    return <div className="loading-spinner">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!event) {
    return <div className="error-message">活动不存在</div>;
  }

  const isOrganizer = currentUser._id === event.organizer._id;
  const isParticipant = event.participants.some(p => p._id === currentUser._id);
  const canJoin = !isOrganizer && !isParticipant && event.participants.length < event.maxParticipants;
  const canLeave = !isOrganizer && isParticipant;

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <div className="header-main">
          <h1>{event.title}</h1>
          <div className="organizer-info">
            <span className="organizer-label">组织者: {event.organizer.username}</span>
            <span className={`pigeon-rate ${getPigeonRateClass(event.organizer.pigeonRate)}`}>
              {getPigeonRateDisplay(event.organizer.pigeonRate)}
            </span>
          </div>
        </div>
        <span className={`status ${event.status}`}>
          {event.status === 'upcoming' ? '即将开始' :
           event.status === 'ongoing' ? '进行中' :
           event.status === 'completed' ? '已结束' : '已取消'}
        </span>
      </div>

      <div className="event-detail-content">
        <div className="event-info">
          <div className="info-item">
            <i className="far fa-calendar"></i>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.location}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-users"></i>
            <span>{event.participants.length}/{event.maxParticipants} 人</span>
          </div>
        </div>

        <div className="event-description">
          <h2>活动详情</h2>
          <p>{event.description}</p>
        </div>

        <div className="participants-section">
          <h2>参与者 ({event.participants.length})</h2>
          <div className="participants-list">
            {event.participants.map(participant => (
              <div key={participant._id} className="participant-item">
                <div className="participant-info">
                  <i className="fas fa-user-circle"></i>
                  <span>{participant.username}</span>
                </div>
                <span className={`pigeon-rate ${getPigeonRateClass(participant.pigeonRate)}`}>
                  {getPigeonRateDisplay(participant.pigeonRate)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="event-actions">
          {isOrganizer && (
            <button
              onClick={handleDelete}
              className="delete-button"
            >
              <i className="fas fa-trash-alt"></i>
              删除活动
            </button>
          )}
          {canJoin && (
            <button
              onClick={handleJoin}
              className="join-button"
            >
              <i className="fas fa-plus"></i>
              参加活动
            </button>
          )}
          {canLeave && (
            <button
              onClick={handleLeave}
              className="leave-button"
            >
              <i className="fas fa-sign-out-alt"></i>
              退出活动
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 