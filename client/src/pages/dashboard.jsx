import { useEffect, useState } from 'react';
import api from '../../axios';
import Navbar from "../components/navigation/nav";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalApplications: 0,
    interviewsScheduled: 0,
    pendingResponses: 0,
    statusBreakdown: {
      pending: 0,
      interviewReady: 0,
      rejected: 0
    },
    recentActivity: [],
    upcomingInterviews: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        // Fetch dashboard data from backend
        const res = await api.get('/dashboard');
        if (res?.data) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        // Set mock data for development
        setDashboardData({
          totalApplications: 24,
          interviewsScheduled: 3,
          pendingResponses: 8,
          statusBreakdown: {
            pending: 8,
            interviewReady: 3,
            rejected: 4
          },
          recentActivity: [
            {
              id: 1,
              type: 'applied',
              jobTitle: 'Senior Frontend Developer',
              company: 'TechCorp Inc.',
              timeAgo: '2 hours ago',
              icon: '💼'
            },
            {
              id: 2,
              type: 'interview_scheduled',
              jobTitle: 'DataFlow',
              company: 'DataFlow Systems',
              timeAgo: '1 day ago',
              icon: '📅'
            },
            {
              id: 3,
              type: 'status_updated',
              jobTitle: 'StartupXYZ',
              company: 'StartupXYZ',
              timeAgo: '2 days ago',
              icon: '📊'
            }
          ],
          upcomingInterviews: [
            {
              id: 1,
              jobTitle: 'Senior Frontend Developer',
              company: 'TechCorp Inc.',
              date: 'Tomorrow at 2:00 PM',
              badge: 'Technical Interview'
            },
            {
              id: 2,
              jobTitle: 'React Developer',
              company: 'DataFlow Systems',
              date: 'Friday at 10:00 AM',
              badge: 'Final Round'
            }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  function getStatusColor(status) {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'interviewReady':
        return 'bg-slate-400';
      case 'rejected':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  }

  function getActivityIcon(type) {
    switch (type) {
      case 'applied':
        return '💼';
      case 'interview_scheduled':
        return '📅';
      case 'status_updated':
        return '📊';
      default:
        return '📝';
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your job search progress and stay organized
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Applications */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Applications</p>
                <p className="font-poppins text-3xl font-bold text-slate-900">
                  {dashboardData.totalApplications}
                </p>
                <p className="text-sm text-slate-500">+3 from last week</p>
              </div>
              <div className="rounded-lg bg-brand-honey-50 p-3">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </div>

          {/* Interviews Scheduled */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Interviews Scheduled</p>
                <p className="font-poppins text-3xl font-bold text-slate-900">
                  {dashboardData.interviewsScheduled}
                </p>
                <p className="text-sm text-slate-500">+1 from last week</p>
              </div>
              <div className="rounded-lg bg-brand-honey-50 p-3">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          {/* Pending Responses - Horizontal Layout */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Responses</p>
                <p className="font-poppins text-3xl font-bold text-slate-900">
                  {dashboardData.pendingResponses}
                </p>
                <p className="text-sm text-slate-500">-2 from last week</p>
              </div>
              <div className="rounded-lg bg-brand-honey-50 p-3">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections - Horizontal Layout */}
        <div className="space-y-6">
          {/* Application Status - Horizontal */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-poppins text-lg font-semibold text-slate-900">
                Application Status
              </h3>
              <p className="text-sm text-slate-600">
                Current status of all your applications
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor('pending')}`}></div>
                  <span className="font-roboto text-sm text-slate-700">Pending</span>
                </div>
                <span className="font-poppins text-2xl font-bold text-slate-900 block mt-2">
                  {dashboardData.statusBreakdown.pending}
                </span>
              </div>
              <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor('interviewReady')}`}></div>
                  <span className="font-roboto text-sm text-slate-700">Interview Ready</span>
                </div>
                <span className="font-poppins text-2xl font-bold text-slate-900 block mt-2">
                  {dashboardData.statusBreakdown.interviewReady}
                </span>
              </div>
              <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor('rejected')}`}></div>
                  <span className="font-roboto text-sm text-slate-700">Rejected</span>
                </div>
                <span className="font-poppins text-2xl font-bold text-slate-900 block mt-2">
                  {dashboardData.statusBreakdown.rejected}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity - Horizontal */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-poppins text-lg font-semibold text-slate-900">
                Recent Activity
              </h3>
              <p className="text-sm text-slate-600">
                Your latest job search activities
              </p>
            </div>
            <div className="flex items-stretch gap-4">
              {dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-brand-honey-50 p-2">
                      <span className="text-sm">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-roboto text-sm text-slate-700">
                        {activity.type === 'applied' && `Applied to ${activity.jobTitle}`}
                        {activity.type === 'interview_scheduled' && `Interview scheduled with ${activity.jobTitle}`}
                        {activity.type === 'status_updated' && `Application status updated for ${activity.jobTitle}`}
                      </p>
                      <p className="text-xs text-slate-500">{activity.company}</p>
                      <p className="text-xs text-slate-400">{activity.timeAgo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews - Horizontal */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-poppins text-lg font-semibold text-slate-900">
                  Upcoming Interviews
                </h3>
                <p className="text-sm text-slate-600">
                  Your scheduled interviews this week
                </p>
              </div>
              <button className="rounded-lg bg-brand-honey px-4 py-2 text-sm font-medium text-brand-bee transition-colors hover:bg-brand-honey-600">
                View All Interviews
              </button>
            </div>
            <div className="flex items-stretch gap-4">
              {dashboardData.upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-brand-honey-50 p-2">
                      <span className="text-sm">📅</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-roboto text-sm font-medium text-slate-900">
                        {interview.jobTitle}
                      </p>
                      <p className="text-xs text-slate-500">{interview.company}</p>
                      <p className="text-xs text-slate-400">{interview.date}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-brand-honey-50 px-2 py-1 text-xs font-medium text-brand-bee">
                      {interview.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
