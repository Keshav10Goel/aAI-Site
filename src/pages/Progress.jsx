
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";

const Progress = () => {

  // Example dataset (later you can connect real stored data)
  const weeklyData = [
    { day: "Mon", stress: 85, screen: 380, blink: 15, breaks: 4 },
    { day: "Tue", stress: 78, screen: 410, blink: 13, breaks: 4 },
    { day: "Wed", stress: 65, screen: 450, blink: 10, breaks: 5 },
    { day: "Thu", stress: 72, screen: 390, blink: 12, breaks: 4 },
    { day: "Fri", stress: 80, screen: 360, blink: 14, breaks: 4 },
    { day: "Sat", stress: 90, screen: 240, blink: 18, breaks: 2 },
    { day: "Sun", stress: 92, screen: 180, blink: 19, breaks: 2 }
  ];

  const insights = [
    "Your eye strain score improves significantly on weekends when screen time is reduced.",
    "Sessions longer than 3 hours without breaks correlate with lower blink rates.",
    "Your most productive hours (based on eye metrics) are typically in the morning.",
    "Afternoon sessions (2-4pm) show higher eye strain indicators."
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <Link
          to="/"
          className="text-gray-600 font-medium"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-purple-600">
          Progress & Insights
        </h1>

        <div></div>

      </div>

      {/* Top charts */}

      <div className="grid grid-cols-2 gap-8">

        {/* Stress score trend */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-2">
            Eye Stress Score Trend
          </h2>

          <p className="text-gray-500 mb-4">
            Track how your eye health changes over time
          </p>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={weeklyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis domain={[0,100]} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="stress"
                stroke="#7c5cff"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Screen time chart */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-2">
            Screen Time
          </h2>

          <p className="text-gray-500 mb-4">
            Total time spent looking at screen
          </p>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={weeklyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="screen"
                fill="#b59ce8"
                radius={[6,6,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Second row */}

      <div className="grid grid-cols-2 gap-8 mt-8">

        {/* Blink rate */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-2">
            Blink Rate Analysis
          </h2>

          <p className="text-gray-500 mb-4">
            Average blinks per minute
          </p>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={weeklyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="blink"
                stroke="#7c5cff"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* AI Insights */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-lg font-semibold mb-4">
            AI Insights
          </h2>

          <ul className="space-y-3">

            {insights.map((text,index)=>(
              <li
                key={index}
                className="flex items-start gap-3"
              >

                <span className="bg-purple-200 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {index+1}
                </span>

                <p className="text-gray-600">
                  {text}
                </p>

              </li>
            ))}

          </ul>

        </div>

      </div>

      {/* Daily summary table */}

      <div className="bg-white rounded-xl shadow p-6 mt-8">

        <h2 className="text-lg font-semibold mb-2">
          Daily Usage Summary
        </h2>

        <p className="text-gray-500 mb-4">
          Detailed breakdown of your daily screen activities
        </p>

        <table className="w-full text-left">

          <thead>

            <tr className="border-b">

              <th className="py-3">Day</th>
              <th>Stress Score</th>
              <th>Screen Time</th>
              <th>Blink Rate</th>
              <th>Breaks Taken</th>

            </tr>

          </thead>

          <tbody>

            {weeklyData.map((row,index)=>(
              <tr
                key={index}
                className="border-b"
              >

                <td className="py-3">{row.day}</td>

                <td>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                    {row.stress}
                  </span>
                </td>

                <td>{Math.floor(row.screen/60)}h {row.screen%60}m</td>

                <td>{row.blink} bpm</td>

                <td>{row.breaks} breaks</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Progress;
