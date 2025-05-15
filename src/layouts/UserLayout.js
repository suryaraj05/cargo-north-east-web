import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js"; // Replace with UserNavbar if created
import AdminFooter from "components/Footers/AdminFooter.js"; // Replace with UserFooter if created
import Sidebar from "components/Sidebar/Sidebar.js";
import userRoutes from "userRoute.js"; // Adjust path if needed

const UserLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/user") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < userRoutes.length; i++) {
      if (
        props?.location?.pathname.indexOf(userRoutes[i].layout + userRoutes[i].path) !== -1
      ) {
        return userRoutes[i].name;
      }
    }
    return "User Dashboard";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={userRoutes}
        logo={{
          innerLink: "/user/home",
          imgSrc: process.env.PUBLIC_URL + "/img/logo.png",
          imgAlt: "CNE Logo",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(userRoutes)}
          <Route path="*" element={<Navigate to="/user/home" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default UserLayout;