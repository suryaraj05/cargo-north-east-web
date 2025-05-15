import UserBookNewRequest from "User/UserBookNew/UserBookNewRequest";
import UserInProgressRequest from "User/UserInProgress/UserInProgressRequest";
import UserCompletedRequest from "User/UserCompleted/UserCompletedRequest";
import UserQuotes from "User/UserQuotes/UserQuotes";
import UserMessages from "User/UserMessages/UserMessages";
import UserInvoices from "User/UserInvoices/UserInvoices";
import UserProfile from "User/UserProfile/UserProfile";
import UserHelpSupport from "User/UserHelpSupport/UserHelpSupport";
import UserDashboard from "User/UserDashboard/UserDashboard";
import ShipmentDetailsShipment from "User/UserShipmentRequest/ShipmentDetails";
import ShipmentDetailsCustom from "User/UserCustomRequest/ShipmentDetailsCustom";
import Logout from "User/UserLogout/UserLogout";
import UserOrderDetails from "User/UserOrderDetails/UserOrderDetails";

const userRoutes = [
  {
    path: "/home",
    name: "Home (Dashboard)",
    icon: "fas fa-tachometer-alt text-primary mr-3", // Kept: Dashboard typically uses a tachometer/speedometer
    component: <UserDashboard />,
    layout: "/user",
  },
  // {
  //   path: "/bookNew",
  //   name: "Book New",
  //   icon: "fas fa-plus-square text-primary mr-3", // Changed: Plus sign for creating/booking something new
  //   component: <UserBookNewRequest />,
  //   layout: "/user",
  // },
  {
    path: "/shippingform",
    name: "Shipping Form",
    icon: "fas fa-truck text-primary mr-3", // Changed: Truck for shipping-related form
    component: <ShipmentDetailsShipment />,
    layout: "/user",
  },
  {
    path: "/customform",
    name: "Custom Form",
    icon: "fas fa-tools text-primary mr-3", // Changed: Tools for customization
    component: <ShipmentDetailsCustom />,
    layout: "/user",
  },
  {
    path: "/progress",
    name: "In Progress",
    icon: "fas fa-hourglass-half text-primary mr-3", // Changed: Hourglass for ongoing/in-progress tasks
    component: <UserInProgressRequest />,
    layout: "/user",
  },
  {
    path: "/completed",
    name: "Completed",
    icon: "fas fa-check-circle text-primary mr-3", // Kept: Check circle is perfect for completed tasks
    component: <UserCompletedRequest />,
    layout: "/user",
  },
  {
    path: "/quotes",
    name: "Quotes",
    icon: "fas fa-file-invoice text-primary mr-3", // Kept: File invoice fits quotes well
    component: <UserQuotes />,
    layout: "/user",
  },
  {
    path: "/messages",
    name: "Messages",
    icon: "fas fa-envelope text-primary mr-3", // Changed: Envelope for messaging
    component: <UserMessages />,
    layout: "/user",
  },
  {
    path: "/invoices",
    name: "Invoices",
    icon: "fas fa-file-invoice-dollar text-primary mr-3", // Kept: Invoice with dollar sign is spot-on
    component: <UserInvoices />,
    layout: "/user",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "fas fa-user text-primary mr-3", // Changed: Simple user icon for profile (instead of user-circle)
    component: <UserProfile />,
    layout: "/user",
  },
  {
    path: "/help&support",
    name: "Help & Support",
    icon: "fas fa-life-ring text-primary mr-3", // Changed: Life ring for support/help
    component: <UserHelpSupport />,
    layout: "/user",
  },
  {
    path: "/logout",
    name: "Logout",
    icon: "fas fa-sign-out-alt text-primary mr-3", // Kept: Sign-out arrow is ideal for logout
    component: <Logout />, // Replace with proper logout component if needed
    layout: "/user",
  },
  {
    path: "/order/:orderId",
    name: "Order Details",
    component: <UserOrderDetails />,
    layout: "/user",
  },
];

export default userRoutes;