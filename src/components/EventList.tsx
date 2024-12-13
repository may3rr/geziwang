import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './EventList.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  participants: string[];
  organizer: {
    _id: string;
    username: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.EVENTS, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('获取活动列表失败');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  if (loading) {
    return <div className="loading-spinner">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h1>活动列表</h1>
        <Link to="/events/create" className="create-event-button">
          <span>+</span>
          发起新活动
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>暂无活动，快来创建第一个活动吧！</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <Link to={`/events/${event._id}`} key={event._id} className="event-card">
              <div className="event-card-content">
                <h2>{event.title}</h2>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <p>
                    <i className="far fa-calendar"></i>
                    {formatDate(event.date)}
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    {event.location}
                  </p>
                  <p>
                    <i className="fas fa-users"></i>
                    {event.participants.length}/{event.maxParticipants} 人
                  </p>
                </div>
                <div className="event-footer">
                  <span className="organizer">
                    组织者: {event.organizer.username}
                  </span>
                  <span className={`status ${event.status}`}>
                    {event.status === 'upcoming' ? '即将开始' :
                     event.status === 'ongoing' ? '进行中' :
                     event.status === 'completed' ? '已结束' : '已取消'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 