import React from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  CloudLightning, 
  CloudDrizzle, 
  Droplets, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Info,
  Sparkles
} from 'lucide-react';
import { CURRENT_WEATHER } from '../data/mockData';

export default function WeatherAdvisory() {
  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain className="w-8 h-8 text-sky-400" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-8 h-8 text-amber-400" />;
      case 'cloud-drizzle':
        return <CloudDrizzle className="w-8 h-8 text-teal-400" />;
      case 'sun':
        return <Sun className="w-8 h-8 text-amber-400" />;
      case 'cloud-sun':
      default:
        return <CloudSun className="w-8 h-8 text-sky-300" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            <span>Hyperlocal Microclimate Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Weather Advisory & Field Spray Planner</h1>
          <p className="text-slate-400 text-sm mt-1">
            Hourly rain forecasts, soil moisture tracking, and chemical spray suitability windows.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl">
          <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Location: <strong>{CURRENT_WEATHER.location}</strong></span>
        </div>
      </div>

      {/* Main Grid: Current Conditions + Field Spray Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Weather Overview & Key Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Weather Card */}
          <div className="glass-panel-sky rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Right Now</div>
                <div className="text-5xl font-black text-white">{CURRENT_WEATHER.temp}°C</div>
                <div className="text-lg font-bold text-sky-300">{CURRENT_WEATHER.condition}</div>
                <div className="text-xs text-slate-400">{CURRENT_WEATHER.location}</div>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Rain Chance</div>
                  <div className="text-2xl font-black text-sky-400">{CURRENT_WEATHER.rainProbability}%</div>
                </div>
                <div className="h-10 w-px bg-slate-800"></div>
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Humidity</div>
                  <div className="text-2xl font-black text-teal-400">{CURRENT_WEATHER.humidity}%</div>
                </div>
              </div>
            </div>

            {/* Microclimate Environmental Sensors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span>Wind Velocity</span>
                </div>
                <div className="text-base font-bold text-white">{CURRENT_WEATHER.windSpeed}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <span>Soil Moisture</span>
                </div>
                <div className="text-base font-bold text-emerald-400">{CURRENT_WEATHER.soilMoisture}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <span>Soil Temp</span>
                </div>
                <div className="text-base font-bold text-white">{CURRENT_WEATHER.soilTemp}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>UV Index</span>
                </div>
                <div className="text-base font-bold text-white">{CURRENT_WEATHER.uvIndex}</div>
              </div>
            </div>
          </div>

          {/* Pest & Disease Alerts */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Agronomic Risk Warnings & Solutions
            </h2>

            <div className="space-y-4">
              {CURRENT_WEATHER.advisories.map((adv) => (
                <div key={adv.id} className="glass-panel-gold rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {adv.severity}
                    </span>
                    <span className="text-xs text-slate-400">High Humidity Vector</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{adv.title}</h3>
                  <p className="text-slate-300 text-sm">{adv.description}</p>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Recommended Preventive Action: {adv.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Field Spray & Irrigation Scheduler */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-5 border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Field Spray & Operations Schedule</h3>
            </div>
            <p className="text-xs text-slate-400">
              AI evaluates wind speed (&lt;15 km/h), rain probability (&lt;20%), and temperature to mark ideal application windows.
            </p>

            <div className="space-y-3">
              {CURRENT_WEATHER.forecast.slice(0, 4).map((f, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{f.day}</div>
                    <div className="text-slate-400">{f.condition} ({f.rainProb}% Rain)</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      f.sprayWindow.includes('EXCELLENT') || f.sprayWindow.includes('GOOD')
                        ? 'text-emerald-400'
                        : f.sprayWindow.includes('MODERATE')
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}>
                      {f.sprayWindow}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Extended Weather Forecast Strip */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          7-Day Microclimate Outlook
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {CURRENT_WEATHER.forecast.map((item, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl text-center space-y-3 transition-all ${
                idx === 0
                  ? 'bg-sky-500/15 border-2 border-sky-500/40 shadow-lg shadow-sky-500/10'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-300">{item.day}</div>
              <div className="flex justify-center my-1">{getWeatherIcon(item.icon)}</div>
              <div className="text-sm font-black text-white">{item.temp}</div>
              <div className="text-[11px] text-slate-400 truncate">{item.condition}</div>
              <div className="text-[10px] font-bold text-sky-400 bg-sky-500/10 py-0.5 rounded">
                💧 {item.rainProb}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
