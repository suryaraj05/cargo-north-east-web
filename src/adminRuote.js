import Index from "views/Index.js";
import Requests from "components/Requests/Request";
import Quotes from "components/Quotes/Quotes";
import Messages from "components/Messages/Messages";
import Invoices from "components/Invoices/Invoices";
import Users from "components/Users/Users";
import Profile from "components/Profile/Profile";
import HelpSupport from "components/HelpSupport/HelpSupport";

const adminRoutes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "fas fa-tachometer-alt text-primary mr-3",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/requests",
    name: "Requests",
    icon: "fas fa-inbox text-primary mr-3",
    component: <Requests />,
    layout: "/admin",
  },
  {
    path: "/quotes",
    name: "Quotes",
    icon: "fas fa-comment-dollar text-primary mr-3",
    component: <Quotes />,
    layout: "/admin",
  },
  {
    path: "/messages",
    name: "Messages",
    icon: "fas fa-envelope text-primary mr-3",
    component: <Messages />,
    layout: "/admin",
  },
  {
    path: "/invoices",
    name: "Invoices",
    icon: "fas fa-file-invoice-dollar text-primary mr-3",
    component: <Invoices />,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: "fas fa-users-cog text-primary mr-3",
    component: <Users />,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "fas fa-user-circle text-primary mr-3",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/help&support",
    name: "Help & Support",
    icon: "fas fa-question-circle text-primary mr-3",
    component: <HelpSupport />,
    layout: "/admin",
  },
];

export default adminRoutes;