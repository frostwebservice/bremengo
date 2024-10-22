import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import Dashboard from "./pages/dashboard";
import OffersNews from "./pages/offersnews";
import InfoPage from "./pages/info";
import ContactPage from "./pages/info/contact";
import PrivacyPage from "./pages/info/privacy";
import ImprintPage from "./pages/info/imprint";
import FaqPage from "./pages/info/faq";
import PoiPage from "./pages/poi/index";
import NewPoiPage from "./pages/poi/new";
import EditPoiPage from "./pages/poi/edit";
import EditTourPage from "./pages/tour/edit";
import TourPage from "./pages/tour/index";
import NewTourPage from "./pages/tour/new";
import NewFaqPage from "./pages/info/newfaq";
import EditFaqPage from "./pages/info/editFaq";
import NewEvent from "./pages/offersnews/newevent";
import NewExperience from "./pages/offersnews/newexperience";
import EditEventPage from "./pages/offersnews/editevent";
import EditExperiencePage from "./pages/offersnews/editexperience";
import Login from "./pages/login";
import Loading from "./pages/loading";
import { useSelector, useDispatch } from "react-redux";
import { authenticate, deauthenticate } from "./features/firebase/authChecker";
import { auth } from "./config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
const PrivateRoute = ({ component: Component, authenticated }) => {
  return authenticated ? <Component /> : <Navigate to="/login" />;
};

const PublicRoute = ({ component: Component, authenticated }) => {
  return authenticated ? <Navigate to="/dashboard" /> : <Component />;
};
function App() {
  const [loading, setLoading] = useState(true); // To show loading state
  useEffect(() => {
    // Set an auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true); // Set the user if logged in
      } else {
        setIsAuthenticated(false); // Set to null if not logged in
      }
      setLoading(false); // Finished checking
    });

    return () => unsubscribe();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <Spinner size="3xl" color="white" />
      </div>
    ); // Show loading message while Firebase checks auth state
  }
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route
            path="/login"
            element={
              <PublicRoute component={Login} authenticated={isAuthenticated} />
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                component={Dashboard}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/offersnews"
            element={
              <PrivateRoute
                component={OffersNews}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/events/new"
            element={
              <PrivateRoute
                component={NewEvent}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/experiences/new"
            element={
              <PrivateRoute
                component={NewExperience}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/page"
            element={
              <PrivateRoute
                component={InfoPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/page/contact"
            element={
              <PrivateRoute
                component={ContactPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/page/privacy"
            element={
              <PrivateRoute
                component={PrivacyPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/page/imprint"
            element={
              <PrivateRoute
                component={ImprintPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/poi"
            element={
              <PrivateRoute
                component={PoiPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/poi/new"
            element={
              <PrivateRoute
                component={NewPoiPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/poi/:poi_id"
            element={
              <PrivateRoute
                component={EditPoiPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/tour"
            element={
              <PrivateRoute
                component={TourPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/tour/new"
            element={
              <PrivateRoute
                component={NewTourPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/tour/:tour_id"
            element={
              <PrivateRoute
                component={EditTourPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/faq"
            element={
              <PrivateRoute
                component={FaqPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/faq/new"
            element={
              <PrivateRoute
                component={NewFaqPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/faq/:faq_id"
            element={
              <PrivateRoute
                component={EditFaqPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/events/:event_id"
            element={
              <PrivateRoute
                component={EditEventPage}
                authenticated={isAuthenticated}
              />
            }
          />
          <Route
            path="/experiences/:experience_id"
            element={
              <PrivateRoute
                component={EditExperiencePage}
                authenticated={isAuthenticated}
              />
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
