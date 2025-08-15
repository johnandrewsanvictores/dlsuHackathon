import React, { useMemo, useState } from "react";
import Navbar from "../components/navigation/nav";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getMonthMatrix(viewDate) {
  const firstDay = startOfMonth(viewDate);
  const firstWeekday = firstDay.getDay();
  const totalDays = daysInMonth(viewDate);

  const days = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    days.push(null);
  }

  for (let d = 1; d <= totalDays; d += 1) {
    days.push(d);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
}

const Badge = ({ children, color }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    gray: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        colorMap[color] || colorMap.gray
      }`}
    >
      {children}
    </span>
  );
};

const CalendarPage = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthLabel = useMemo(() => {
    return viewDate.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [viewDate]);

  const monthDays = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  const goPrev = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goNext = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const upcoming = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      when: "25/01/2024 at 10:00",
      where: "123 Tech Street, SF",
      type: "in-person",
      color: "blue",
    },
    {
      id: 2,
      role: "Product Manager",
      company: "InnovateLabs",
      when: "27/01/2024 at 14:30",
      where: "Zoom Meeting",
      type: "video",
      color: "green",
    },
    {
      id: 3,
      role: "UX Designer",
      company: "DesignStudio Pro",
      when: "02/02/2024 at 11:00",
      where: "Phone Interview",
      type: "phone",
      color: "purple",
    },
  ];

  const stats = [
    { label: "Total Interviews", value: 3 },
    { label: "In-Person", value: 1 },
    { label: "Video Calls", value: 1 },
    { label: "Phone Calls", value: 1 },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-brand-soft">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="font-poppins text-3xl font-bold text-brand-bee">
            Interview Calendar
          </h1>
          <p className="font-roboto mt-1 text-sm text-slate-600">
            Keep track of all your upcoming interviews and important dates
          </p>

          <div className="mt-4 gap-8 lg:grid lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-poppins text-lg font-semibold text-brand-bee">
                    {monthLabel}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goPrev}
                      className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
                      aria-label="Previous Month"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={goNext}
                      className="rounded-md border border-slate-200 p-2 hover:bg-slate-50"
                      aria-label="Next Month"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 px-1 pb-2">
                  {WEEKDAYS.map((w) => (
                    <div
                      key={w}
                      className="font-roboto text-center text-xs font-medium text-slate-500"
                    >
                      {w}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map((d, idx) => {
                    const isToday =
                      d &&
                      (() => {
                        const now = new Date();
                        return (
                          d === now.getDate() &&
                          viewDate.getMonth() === now.getMonth() &&
                          viewDate.getFullYear() === now.getFullYear()
                        );
                      })();
                    const isSelected = d && selectedDay === d;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => d && setSelectedDay(d)}
                        className={`relative h-24 rounded-lg border text-left ${
                          d
                            ? `border-slate-200 hover:bg-slate-50 ${
                                isSelected ? "ring-1 ring-brand-honey/60" : ""
                              }`
                            : "border-transparent bg-transparent"
                        }`}
                      >
                        {d && (
                          <span
                            className={`absolute left-2 top-2 text-sm ${
                              isSelected
                                ? "rounded-md bg-brand-honey px-2 py-0.5 text-brand-bee"
                                : isToday
                                ? "text-brand-bee font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            {d}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 lg:col-span-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-poppins text-lg font-semibold text-brand-bee">
                  Upcoming Interviews
                </h3>
                <div className="mt-4 space-y-3">
                  {upcoming.map((u) => (
                    <div
                      key={u.id}
                      className="rounded-lg border border-slate-100 p-4 hover:bg-slate-50"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <div className="font-poppins text-sm font-semibold text-brand-bee">
                          {u.role}
                        </div>
                        <Badge color={u.color}>{u.type}</Badge>
                      </div>
                      <div className="font-roboto text-xs text-slate-600">
                        {u.company}
                      </div>
                      <div className="mt-1 font-roboto text-xs text-slate-600">
                        {u.when}
                      </div>
                      <div className="font-roboto text-xs text-slate-600">
                        {u.where}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-poppins text-lg font-semibold text-brand-bee">
                  This Month
                </h3>
                <div className="mt-2 space-y-2">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between"
                    >
                      <span className="font-roboto text-sm text-slate-600">
                        {s.label}
                      </span>
                      <span className="font-poppins text-base font-semibold text-brand-bee">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
