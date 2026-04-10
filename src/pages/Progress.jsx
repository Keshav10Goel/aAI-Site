
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabase";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, ResponsiveContainer
} from "recharts";

/* ---------------- UTILITIES ---------------- */

const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const safeParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

const formatScreenTime = (seconds) => {
  if (!seconds) return "0 min";

  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hrs > 0) return `${hrs} hr ${remainingMins} min`;
  return `${remainingMins} min`;
};

const formatTimeIST = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

const formatDateIST = (date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#111827] p-3 rounded-xl border border-white/10 shadow-xl">
      <p className="text-white font-medium">{label} IST</p>
      {payload.map((item, i) => (
        <p key={i} className="text-gray-400 text-sm">
          {item.name === "screen"
  ? formatScreenTime(item.value)
  : item.value}
        </p>
      ))}
    </div>
  );
};

/* ---------------- MAIN ---------------- */

export default function Progress() {
  const [sessions, setSessions] = useState([]);
  const [filterMode, setFilterMode] = useState("forever");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */

useEffect(() => {
  let channel;

  const setup = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      console.error("❌ No user found (auth issue)");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // FETCH DATA
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Fetch error:", error);
    } else {
      console.log("✅ Data:", data);
      setSessions(data || []);
    }

    // REALTIME
    channel = supabase
      .channel("sessions-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sessions",
        },
        (payload) => {
          const newRow = payload.new;

          if (newRow.user_id !== userId) return;

          setSessions((prev) => {
            if (prev.some(p => p.id === newRow.id)) return prev;
            return [...prev, newRow];
          });
        }
      )
      .subscribe();

    setLoading(false);
  };

  setup();

  return () => {
    if (channel) supabase.removeChannel(channel);
  };
}, []);

  /* ---------------- FILTER + GROUP ---------------- */

  const chartData = useMemo(() => {
    if (!sessions.length) return [];

    let filtered = [...sessions];
    const now = new Date();

    // DAILY
    if (filterMode === "daily") {
      const today = new Date().toDateString();

filtered = sessions.filter(
  (s) => new Date(s.created_at).toDateString() === today
);

      return filtered.map((s) => ({
        time: formatTimeIST(s.created_at),
        stress: s.stress_score ?? 0,
        blink: s.blink_rate ?? 0,
        screen: s.screen_time ?? 0,
      }));
    }

    // MONTHLY
    if (filterMode === "monthly") {
      filtered = sessions.filter((s) => {
        const d = new Date(s.created_at);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    // GROUPING (monthly + forever)
    const map = new Map();

    filtered.forEach((s) => {
      const key = formatDateIST(s.created_at);

      if (!map.has(key)) {
        map.set(key, { time: key, stress: [], blink: [], screen: [] });
      }

      const entry = map.get(key);
      entry.stress.push(s.stress_score ?? 0);
      entry.blink.push(s.blink_rate ?? 0);
      entry.screen.push(s.screen_time ?? 0);
    });

    return Array.from(map.values()).map((e) => ({
      time: e.time,
      stress: avg(e.stress),
      blink: avg(e.blink),
      screen: avg(e.screen)
    }));

  }, [sessions, filterMode]);

  /* ---------------- INSIGHTS ---------------- */

const insights = useMemo(() => {
  if (!sessions.length) return [];

  const avgStress = avg(sessions.map(s => s.stress_score ?? 0));
  const avgBlink = avg(sessions.map(s => s.blink_rate ?? 0));
  const maxScreen = Math.max(...sessions.map(s => s.screen_time ?? 0));

  const rednessDetected = sessions.some(s => s.redness > 0.5); // adjust threshold if needed

  const res = [];

  if (avgBlink < 10) {
    res.push("👁️ Low blink rate detected. Try consciously blinking more to prevent dry eyes.");
  }

  if (avgStress < 40) {
    res.push("⚠️ High eye strain detected. Take short breaks and reduce screen brightness.");
  }

  if (avgStress > 70) {
    res.push("🧘 Great! Your eye stress is low. Maintain proper posture and lighting.");
  }

  if (maxScreen > 3600) {
    res.push("💻 Long screen sessions detected. Follow 20-20-20 rule.");
  }

  if (rednessDetected) {
    res.push("🔴 Eye redness detected. Consider washing your eyes and reducing screen exposure.");
  }

  if (sessions.length > 5) {
    res.push("📊 Your data is improving. Insights will become more accurate over time.");
  }

  if (res.length === 0) {
    res.push("🪑 Maintain proper sitting posture and keep screen at eye level.");
  }

  return res;

}, [sessions]);

  const dailyLogs = useMemo(() => {
  const todayKey = new Date().toDateString();

  return sessions
    .filter((s) => 
      new Date(s.created_at).toDateString() === todayKey
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 15);

}, [sessions]);
  
  /* ---------------- UI ---------------- */
  
  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/monitor" className="text-gray-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Progress Dashboard
        </h1>

        <div />
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6 justify-end">
        {["daily", "monthly", "forever"].map(mode => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            className={`px-4 py-2 rounded-xl ${
              filterMode === mode
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Loading data...</p>}

      {!loading && chartData.length === 0 && (
        <p className="text-gray-400">No data yet 👀</p>
      )}

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <ChartCard title="Stress Trend">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="stress" stroke="#A855F7" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Screen Time">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" />
            <YAxis tickFormatter={(val) => `${Math.floor(val / 60)}m`} />
            
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="screen" fill="#EC4899" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Blink Rate">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#222" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line dataKey="blink" stroke="#22C55E" strokeWidth={3} />
          </LineChart>
        </ChartCard>

        {/* INSIGHTS */}
        <div className="bg-gray-900 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
          {insights.map((i, idx) => (
            <p key={idx} className="text-gray-400 mb-2">{i}</p>
          ))}
        </div>

      </div>

      {/* TABLE */}
      <div className="mt-10 bg-gray-900 p-6 rounded-2xl overflow-x-auto">
        <h2 className="mb-4 font-semibold">Session Logs</h2>

        <table className="w-full text-left text-sm">
          <thead className="text-gray-400">
            <tr>
              <th>Time</th>
              <th>Stress</th>
              <th>Screen</th>
              <th>Blink</th>
            </tr>
          </thead>

          <tbody>
           {filterMode === "daily" ? (
  dailyLogs.length > 0 ? (
    dailyLogs.map((s, i) => {
      
      return (
        <tr key={i} className="border-t border-gray-800">
          <td>{formatTimeIST(s.created_at)}</td>
          <td>{s.stress_score ?? "-"}</td>
          <td>{formatScreenTime(s.screen_time)}</td>
          <td>{s.blink_rate ?? "-"}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="5" className="text-center text-[#9CA3AF] py-6">
        No logs for today 📭
      </td>
    </tr>
  )
) : (
  <tr>
    <td colSpan="5" className="text-center text-[#9CA3AF] py-6">
      Logs available only in Daily view 📅
    </td>
  </tr>
)}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ---------------- REUSABLE CARD ---------------- */

function ChartCard({ title, children }) {
  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="mb-3 font-semibold">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}