import PayrollListView from "./PayrollListView";
import PayrollDetailsView from "./PayrollDetailsView";

export default [
  {
    path: "/",
    element: PayrollListView,
    children: [],
  },
  {
    path: ":id",
    element: PayrollDetailsView,
    children: [],
  },
];
