// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import React, { useEffect, useState } from "react";
// // import { supabase } from "./lib/supabase";

// // // Pages
// // import Landing from "./pages/Landing";
// // import Dashboard from "./pages/Dashboard";
// // import Progress from "./pages/Progress";
// // import Login from "./pages/Login";
// // import Signup from "./pages/Signup";

// // function App() {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // 🔐 Get current user
// //   useEffect(() => {
// //     const getUser = async () => {
// //       const { data } = await supabase.auth.getUser();
// //       setUser(data.user);
// //       setLoading(false);
// //     };

// //     getUser();

// //     // 🔄 Listen for login/logout
// //     const { data: listener } = supabase.auth.onAuthStateChange(
// //       (_, session) => {
// //         setUser(session?.user || null);
// //       }
// //     );

// //     return () => listener.subscription.unsubscribe();
// //   }, []);

// //   // 🔔 Notification permission
// //   useEffect(() => {
// //     if ("Notification" in window && Notification.permission !== "granted") {
// //       Notification.requestPermission();
// //     }
// //   }, []);

// //   // ⏳ Loading screen
// //   if (loading) {
// //     return (
// //       <div className="h-screen flex items-center justify-center text-xl">
// //         Loading...
// //       </div>
// //     );
// //   }

// //   return (
// //     <BrowserRouter>
// //       <Routes>

// //         {/* 🌍 Public */}
// //         <Route path="/" element={<Landing user={user} />} />
// //         <Route path="/Login" element={<Login />} />
// //         <Route path="/Signup" element={<Signup />} />

// //         {/* 🚀 Main App */}
// //         <Route path="/monitor" element={<Dashboard user={user} />} />
// //         <Route path="/Progress" element={<Progress user={user} />} />

// //         {/* ❌ Fallback */}
// //         <Route path="*" element={<Navigate to="/" />} />

// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;


// import { Routes, Route, Navigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";

// // Pages
// import Landing from "./pages/Landing";
// import Dashboard from "./pages/Dashboard";
// import Progress from "./pages/Progress";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔐 Get current user
//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();
//       setUser(data.user);
//       setLoading(false);
//     };

//     getUser();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   // 🔔 Notification permission
//   useEffect(() => {
//     if ("Notification" in window && Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }
//   }, []);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center text-xl">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Routes>

//       {/* 🌍 Public */}
//       <Route path="/" element={<Landing user={user} />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />

//       {/* 🚀 App */}
//       <Route path="/monitor" element={<Dashboard user={user} />} />
//       <Route path="/progress" element={<Progress user={user} />} />

//       {/* ❌ Fallback */}
//       <Route path="*" element={<Navigate to="/" />} />

//     </Routes>
//   );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

// Pages
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify"; // 🔥 NEW (IMPORTANT)

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔔 Notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* 🌍 Public */}
      <Route path="/" element={<Landing user={user} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 🔥 NEW VERIFY ROUTE */}
      <Route path="/verify" element={<Verify />} />

      {/* 🚀 App */}
      <Route
  path="/monitor"
  element={
    <ProtectedRoute user={user}>
      <Dashboard user={user} />
    </ProtectedRoute>
  }
/>

<Route
  path="/progress"
  element={
    <ProtectedRoute user={user}>
      <Progress user={user} />
    </ProtectedRoute>
  }
/>

      {/* ❌ Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;