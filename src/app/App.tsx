import { Routes, Route, Navigate } from "react-router";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CourseEditorPage from "./pages/CourseEditorPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AdminEvents from "./pages/AdminEvents";
import AdminTeachers from "./pages/AdminTeachers";
import AdminEventEditor from "./pages/AdminEventEditor";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/eventos" element={<EventsPage />} />
      <Route path="/cursos" element={<CoursesPage />} />
      <Route path="/cursos/:slug" element={<CourseDetailPage />} />

      <Route
        path="/alumno"
        element={
          <ProtectedRoute roles={["alumno"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profesor"
        element={
          <ProtectedRoute roles={["profesor"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profesor/cursos/nuevo"
        element={
          <ProtectedRoute roles={["profesor"]}>
            <CourseEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profesor/cursos/:id"
        element={
          <ProtectedRoute roles={["profesor"]}>
            <CourseEditorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cursos"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/eventos"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profesores"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cursos/nuevo"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CourseEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cursos/:id/editar"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CourseEditorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/eventos/nuevo"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminEventEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/eventos/:id/editar"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminEventEditor />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
