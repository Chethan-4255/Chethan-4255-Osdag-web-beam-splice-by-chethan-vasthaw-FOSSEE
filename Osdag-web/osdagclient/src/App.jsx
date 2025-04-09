import React, { useState, useContext, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { Worker } from '@react-pdf-viewer/core';

import Sidebar from './components/Sidebar';
import Mainwindow from './components/Mainwindow';
import Window from './components/Window';
import FinePlate from './components/shearConnection/FinePlate';
import { GlobalProvider } from './context/GlobalState';
import { ModuleProvider } from './context/ModuleState';
import { UserContext, UserProvider } from './context/UserState';
import UserAccount from './components/userAccount/UserAccount';
import LoginPage from './components/userAuth/LoginPage';

// jwt imports 
import jwt_decode from 'jwt-decode';
import EndPlate from './components/shearConnection/EndPlate';
import CleatAngle from './components/shearConnection/CleatAngle';
import SeatedAngle from './components/shearConnection/SeatedAngle';
import BeamSplice from './components/BeamSplice';

let renderedOnce = false;

function App() {
  const { isLoggedIn, userLogin } = useContext(UserContext);
  let loggedIn = isLoggedIn;

  useEffect(() => {
    // console.log('isLogged in useEffect: ', isLoggedIn);
  }, [isLoggedIn]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root loggedIn={loggedIn} />}>
        <Route path="/home" element={<Mainwindow />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/design-type/:designType" element={<Window />} />
        <Route path="/design/:designType/fin_plate" element={<FinePlate />} />
        <Route path="/design/:designType/end_plate" element={<EndPlate />} />
        <Route path="/design/:designType/cleat_angle" element={<CleatAngle />} />
        <Route path="/design/:designType/seated_angle" element={<SeatedAngle />} />
        <Route path="/user" element={<UserAccount />} />
        <Route path="/beam-splice" element={<BeamSplice />} />
      </Route>
    )
  );

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <UserProvider>
        <GlobalProvider>
          <ModuleProvider>
            <div className="app">
              <RouterProvider router={router} />
            </div>
          </ModuleProvider>
        </GlobalProvider>
      </UserProvider>
    </Worker>
  );
}

const Root = ({ loggedIn }) => {
  const { userLogin } = useContext(UserContext);

  if (!renderedOnce) {
    if (localStorage.getItem('access')) {
      const decodedAccessToken = jwt_decode(localStorage.getItem('access'));
      console.log('decodedAccessToken: ', decodedAccessToken);
      console.log('Date.now() / 1000: ', Date.now() / 1000);

      if (decodedAccessToken.exp > Date.now() / 1000 && decodedAccessToken.username) {
        loggedIn = true;
        userLogin(decodedAccessToken.username, decodedAccessToken.password, false, true);
      } else {
        loggedIn = false;
      }
    } else {
      loggedIn = false;
    }

    renderedOnce = true;
  }

  const navigate = useNavigate();
  const isDesignPage = window.location.pathname.startsWith('/design/');
  const isUserProfilePage = window.location.pathname.startsWith('/user');
  const isLoginPage = window.location.pathname === '/';

  return (
    <>
      {/* Show Sidebar when authenticated and not on a design page */}
      {!isLoginPage && !isDesignPage && !isUserProfilePage && <Sidebar />}
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
