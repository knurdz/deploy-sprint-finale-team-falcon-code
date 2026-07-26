import {
  Activity,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CloudSun,
  Droplets,
  GitBranch,
  GraduationCap,
  Mail,
  MessageSquareText,
  Search,
  ShieldCheck,
  Wind,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
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

type ContactConfig = {
  task: 'T10';
  provider: 'web3forms';
  endpoint: string;
  configured: boolean;
  accessKey: string;
};

type ContactState = 'idle' | 'sending' | 'success' | 'error';

type FeatureFlags = {
  task: 'T15';
  showInsights: boolean;
  valueRedacted: true;
};

export function App() {
  const averageProgress = getAverageProgress(courses);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [weatherError, setWeatherError] = useState('');
  const [contactConfig, setContactConfig] = useState<ContactConfig | null>(null);
  const [contactState, setContactState] = useState<ContactState>('idle');
  const [contactMessage, setContactMessage] = useState('');
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);

  // AI-REVIEW-MARKER: remove this marker
  // AI-AGENT-MARKER: participant must manually remove this marker

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

  useEffect(() => {
    let active = true;

    fetch('/feature-flags.json', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Feature flags returned ${response.status}.`);
        }

        return (await response.json()) as FeatureFlags;
      })
      .then((payload) => {
        if (active) setFeatureFlags(payload);
      })
      .catch(() => {
        if (active) {
          setFeatureFlags({
            task: 'T15',
            showInsights: false,
            valueRedacted: true,
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetch('/contact-config.json', { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Contact configuration returned ${response.status}.`);
        }

        return (await response.json()) as ContactConfig;
      })
      .then((payload) => {
        if (active) setContactConfig(payload);
      })
      .catch(() => {
        if (!active) return;
        setContactState('error');
        setContactMessage('The contact service is currently unavailable.');
      });

    return () => {
      active = false;
    };
  }, []);

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!contactConfig?.configured || !contactConfig.accessKey) {
      setContactState('error');
      setContactMessage('The contact service is not configured yet.');
      return;
    }

    setContactState('sending');
    setContactMessage('Sending your message...');

    const fields = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(contactConfig.endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...fields,
          access_key: contactConfig.accessKey,
          subject: 'Falcon Code support request',
          from_name: 'Falcon Code team website',
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error('Web3Forms rejected the submission.');
      }

      form.reset();
      setContactState('success');
      setContactMessage('Message sent successfully. We will be in touch.');
    } catch {
      setContactState('error');
      setContactMessage('Unable to send your message. Please try again.');
    }
  };


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
          <a href="#contact">
            <Mail size={18} />
            Contact
          </a>
          {featureFlags?.showInsights && (
            <a href="#insights">
              <Activity size={18} />
              Insights
            </a>
          )}
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
        {featureFlags?.showInsights && (
          <section className="insightsPanel" id="insights">
            <div>
              <p className="eyebrow">Runtime feature</p>
              <h2>Learning insights enabled</h2>
              <p>
                The cohort is progressing at {averageProgress}% across{' '}
                {courses.length} active learning modules.
              </p>
            </div>
            <span>Feature flag active</span>
          </section>
        )}
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

        <section className="contactPanel" id="contact">
          <div className="contactIntro">
            <div className="contactIcon" aria-hidden="true">
              <MessageSquareText size={28} />
            </div>
            <div>
              <p className="eyebrow">Web3Forms contact service</p>
              <h2>Contact Team Falcon Code</h2>
              <p>
                Send a support request through our configured contact provider.
              </p>
            </div>
          </div>

          <form className="contactForm" onSubmit={submitContactForm}>
            <input
              className="botcheck"
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
            />
            <label>
              Name
              <input name="name" required maxLength={100} />
            </label>
            <label>
              Email
              <input type="email" name="email" required maxLength={160} />
            </label>
            <label className="contactMessageField">
              Message
              <textarea name="message" required maxLength={2000} rows={5} />
            </label>
            <button type="submit" disabled={contactState === 'sending'}>
              <Mail size={18} />
              {contactState === 'sending' ? 'Sending...' : 'Send message'}
            </button>
            {contactMessage && (
              <p
                className={`contactResult ${contactState}`}
                role="status"
                aria-live="polite"
              >
                {contactState === 'success' && <CheckCircle2 size={18} />}
                {contactMessage}
              </p>
            )}
          </form>
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
