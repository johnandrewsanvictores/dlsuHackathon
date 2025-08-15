import React, { useState, useEffect } from "react";
import Navbar from "../components/navigation/nav";
import api from "../../axios";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the backend route might not be ready
      const mockInterviews = [
        {
          id: 1,
          jobTitle: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          date: new Date(2024, 11, 15, 14, 0), // December 15, 2024, 2:00 PM
          type: "Technical Interview",
          status: "scheduled",
          meetingLink: "https://zoom.us/j/123456789",
          notes: "Technical round with the engineering team"
        },
        {
          id: 2,
          jobTitle: "React Developer",
          company: "StartupXYZ",
          date: new Date(2024, 11, 18, 10, 30), // December 18, 2024, 10:30 AM
          type: "Final Round",
          status: "scheduled",
          meetingLink: "https://meet.google.com/abc-defg-hij",
          notes: "Final interview with CEO and CTO"
        },
        {
          id: 3,
          jobTitle: "Full Stack Developer",
          company: "DataFlow Systems",
          date: new Date(2024, 11, 20, 15, 0), // December 20, 2024, 3:00 PM
          type: "HR Interview",
          status: "scheduled",
          notes: "Initial screening with HR"
        }
      ];

      setInterviews(mockInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getInterviewsForDate = (date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-slate-100"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayInterviews = getInterviewsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      days.push(
        <div
          key={day}
          className={`h-24 border border-slate-100 p-1 cursor-pointer hover:bg-slate-50 ${
            isToday ? 'bg-brand-honey-50' : ''
          } ${isPast ? 'opacity-60' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            if (dayInterviews.length > 0) {
              setShowModal(true);
            }
          }}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-brand-bee' : 'text-slate-900'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayInterviews.slice(0, 2).map((interview, index) => (
              <div
                key={index}
                className="text-xs bg-brand-honey-100 text-brand-bee px-1 py-0.5 rounded truncate"
              >
                {formatTime(interview.date)} {interview.company}
              </div>
            ))}
            {dayInterviews.length > 2 && (
              <div className="text-xs text-slate-500">
                +{dayInterviews.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateInterviews = selectedDate ? getInterviewsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-bold text-slate-900">
            Interview Calendar
          </h1>
          <p className="font-roboto mt-2 text-slate-600">
            Manage your upcoming interviews and schedule
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="font-poppins text-xl font-semibold text-slate-900">
                  {currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-600">{day}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-0 border border-slate-200 rounded-lg overflow-hidden">
                  {renderCalendarDays()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-4">
                Upcoming Interviews
              </h3>
              
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : interviews.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming interviews scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {interviews
                    .filter(interview => interview.date >= new Date())
                    .sort((a, b) => a.date - b.date)
                    .slice(0, 5)
                    .map(interview => (
                      <div key={interview.id} className="border border-slate-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 truncate">
                              {interview.jobTitle}
                            </h4>
                            <p className="text-xs text-slate-600">{interview.company}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {interview.date.toLocaleDateString()} at {formatTime(interview.date)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                            {interview.type}
                          </span>
                        </div>
                        {interview.meetingLink && (
                          <div className="mt-2">
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-brand-honey hover:text-brand-honey-600 font-medium"
                            >
                              Join Meeting →
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-poppins text-lg font-semibold text-slate-900 mb-4">
                This Month
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Interviews</span>
                  <span className="text-sm font-medium text-slate-900">
                    {interviews.filter(interview => 
                      interview.date.getMonth() === currentDate.getMonth() &&
                      interview.date.getFullYear() === currentDate.getFullYear()
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Completed</span>
                  <span className="text-sm font-medium text-slate-900">
                    {interviews.filter(interview => 
                      interview.status === 'completed' &&
                      interview.date.getMonth() === currentDate.getMonth()
                    ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Scheduled</span>
                  <span className="text-sm font-medium text-slate-900">
                    {interviews.filter(interview => 
                      interview.status === 'scheduled' &&
                      interview.date >= new Date()
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Details Modal */}
        {showModal && selectedDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-poppins text-lg font-semibold text-slate-900">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {selectedDateInterviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No interviews scheduled for this date.</p>
                ) : (
                  selectedDateInterviews.map(interview => (
                    <div key={interview.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-slate-900">{interview.jobTitle}</h4>
                          <p className="text-sm text-slate-600">{interview.company}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                          {interview.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-slate-700">{formatTime(interview.date)}</span>
                        </div>
                        
                        {interview.meetingLink && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <a
                              href={interview.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-honey hover:text-brand-honey-600 font-medium"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                        
                        {interview.notes && (
                          <div className="mt-3 p-3 bg-slate-50 rounded">
                            <p className="text-slate-700">{interview.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
