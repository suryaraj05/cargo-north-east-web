import React from "react";

const AdminFooter = () => {
  return (
    <>
      <footer className="footer pt-0">
        <div className="row align-items-center justify-content-lg-between">
          <div className="col-lg-6">
            <div className="copyright text-center text-lg-left text-muted">
              © {new Date().getFullYear()}{" "}
              <a
                className="font-weight-bold ml-1"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                CNE
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <ul className="nav nav-footer justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About Us
                </a>
              </li>
              {/* <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  License
                </a>
              </li> */}
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AdminFooter;
