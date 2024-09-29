import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CreatedSlides from "./pages/CreatedSlides";
import NewSlide from "./pages/NewSlide";
import OngoingSlides from "./pages/OngoingSlides";
import { UserProvider } from "./context/UserContext";
import Dashboard from "./components/Dashboard";
import './App.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Dashboard>
          <CreatedSlides />
        </Dashboard>
      ),
    },
    {
      path: "/new-slide",
      element: (
        <Dashboard>
          <NewSlide />
        </Dashboard>
      ),
    },
    {
      path: "/created-slides/:name",
      element: (
        <Dashboard>
          <OngoingSlides />
        </Dashboard>
      ),
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/register',
      element:<Register/>
    }
    
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;
