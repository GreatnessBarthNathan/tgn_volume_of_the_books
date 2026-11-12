import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Books from "./pages/Books"
import CreateBook from "./pages/CreateBook"
import Chapters from "./pages/Chapters"
import CreateChapter from "./pages/CreateChapter"
import Verses from "./pages/Verses"
import CreateVerse from "./pages/CreateVerse"
import EditVerse from "./pages/EditVerse"
import EditChapter from "./pages/EditChapter"
import EditBook from "./pages/EditBook"
import Error from "./pages/Error"
import AdminLogin from "./pages/AdminLogin"
import AdminAccounts from "./pages/AdminAccounts"
import AdminAcceptInvitation from "./pages/AdminAcceptInvitation"
import AdminRecovery from "./pages/AdminRecovery"
import AdminRoute from "./components/AdminRoute"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Books />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      {
        path: "admin/accept-invite",
        element: <AdminAcceptInvitation />,
      },
      {
        path: "admin/recover",
        element: <AdminRecovery />,
      },
      {
        path: "create-book",
        element: (
          <AdminRoute>
            <CreateBook />
          </AdminRoute>
        ),
      },
      {
        path: "books/:year",
        element: <Chapters />,
      },
      {
        path: "create-chapter",
        element: (
          <AdminRoute>
            <CreateChapter />
          </AdminRoute>
        ),
      },
      {
        path: "edit-chapter/:id",
        element: (
          <AdminRoute>
            <EditChapter />
          </AdminRoute>
        ),
      },
      {
        path: "verses/:id",
        element: <Verses />,
      },
      {
        path: "create-verse",
        element: (
          <AdminRoute>
            <CreateVerse />
          </AdminRoute>
        ),
      },
      {
        path: "edit-verse/:id",
        element: (
          <AdminRoute>
            <EditVerse />
          </AdminRoute>
        ),
      },
      {
        path: "edit-book/:id",
        element: (
          <AdminRoute>
            <EditBook />
          </AdminRoute>
        ),
      },
      {
        path: "admin/accounts",
        element: (
          <AdminRoute>
            <AdminAccounts />
          </AdminRoute>
        ),
      },
    ],
  },
])
function App() {
  return <RouterProvider router={router} />
}

export default App
