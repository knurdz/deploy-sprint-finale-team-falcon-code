import {
  Activity,
  Bell,
  BookOpen,
  CalendarCheck,
  CloudSun,
  Droplets,
  GitBranch,
  GraduationCap,
  Search,
  ShieldCheck,
  Wind,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CourseCard } from './components/CourseCard';
import { DeadlineBoard } from './components/DeadlineBoard';
import { LearningVelocity } from './components/LearningVelocity';
import { StatCard } from './components/StatCard';
import { courses } from './data/courses';
import { deadlineCards } from './data/deadlines';
import { sprintStats } from './data/stats';
import { getAverageProgress } from './utils/metrics';

type WeatherResponse = {
  ok: boolean;
  provider: 'openweather';
  city: string;
  weather?: {
    summary: string;
    temperatureC: number;
    feelsLikeC: number;
    humidityPercent: number;
    windSpeedMps: number;
    observedAt: string;
  };
  error?: string;
};

export function App() {
  const averageProgress = getAverageProgress(courses);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    let active = true;

    fetch('/api/weather/', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Weather endpoint returned ${response.status}.`);
        }

        return (await response.json()) as WeatherResponse;
      })
      .then((payload) => {
        if (!active) return;

        if (!payload.ok || !payload.weather) {
          setWeatherError(payload.error || 'Weather data is unavailable.');
          return;
        }

        setWeather(payload);
      })
      .catch(() => {
        if (active) setWeatherError('Weather data is unavailable.');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary">
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            <GraduationCap size={24} />
          </div>
          <div>
            <strong>Deploy Sprint</strong>
            <span>Virtual LMS</span>
          </div>
        </div>

        <nav className="navLinks">
          <a className="active" href="#overview">
            <Activity size={18} />
            Overview
          </a>
          <a href="#courses">
            <BookOpen size={18} />
            Courses
          </a>
          <a href="#deadlines">
            <CalendarCheck size={18} />
            Deadlines
          </a>
          <a href="#weather">
            <CloudSun size={18} />
            Weather
          </a>
          <a href="#teams">
            <Users size={18} />
            Teams
          </a>
        </nav>

        <div className="sidebarPanel">
          <ShieldCheck size={18} />
          <p>Repository changes are reviewed before every release.</p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Qualifier Dashboard</p>
            <h1>Learning operations at a glance</h1>
          </div>

          <label className="searchBox">
            <Search size={18} />
            <input aria-label="Search courses" placeholder="Search courses" />
          </label>

          <button className="iconButton" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </header>

        <section className="heroBand" id="overview">
          <div>
            <p className="eyebrow">Sprint health</p>
            <h2>{averageProgress}% average course progress</h2>
            <p>
              Track cohorts, deadlines, and review readiness from one dashboard
              before publishing a release.
            </p>
          </div>
          <div className="heroSignal">
            <GitBranch size={32} />
            <span>4 active learning tracks</span>
          </div>
        </section>

        <section className="statGrid" aria-label="Sprint statistics">
          {sprintStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <LearningVelocity courses={courses} />
        <section className="weatherPanel" id="weather" aria-live="polite">
          <div className="weatherHeading">
            <div className="weatherIcon" aria-hidden="true">
              <CloudSun size={28} />
            </div>
            <div>
              <p className="eyebrow">OpenWeather</p>
              <h2>Current weather in {weather?.city || 'Colombo'}</h2>
            </div>
          </div>

          {!weather && !weatherError && <p>Loading current conditions...</p>}
          {weatherError && <p className="weatherError">{weatherError}</p>}
          {weather?.weather && (
            <div className="weatherMetrics">
              <div>
                <strong>{Math.round(weather.weather.temperatureC)}°C</strong>
                <span>{weather.weather.summary}</span>
              </div>
              <div>
                <Droplets size={18} />
                <span>{weather.weather.humidityPercent}% humidity</span>
              </div>
              <div>
                <Wind size={18} />
                <span>{weather.weather.windSpeedMps} m/s wind</span>
              </div>
            </div>
          )}
        </section>

        <section className="contentGrid">
          <div className="panel" id="courses">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Courses</p>
                <h2>Current modules</h2>
              </div>
              <span>{courses.length} modules</span>
            </div>

            <div className="courseList">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          <DeadlineBoard deadlines={deadlineCards} />
        </section>
      </section>
    </main>
  );
}
