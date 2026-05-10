import { createBrowserRouter } from "react-router"
import { Home } from "@/pages/home"
import { CashFlow } from "@/pages/cashFlow"
import { Goals } from "@/pages/goals"
import { AddGoal } from "@/pages/addGoal"
import { Settings } from "./pages/settings"
import { ManageCashFlowTemplate } from "./pages/manageCashFlowTemplate"
import { CashFlowProjection } from "./pages/cashFlowProjection"
import { AddCashFlowTemplate } from "./pages/addCashFlowTemplate"
import { Layout } from "./components/Layout"
import { SignIn } from "./pages/signIn"

export const ROUTE_NAMES = {
  ROOT: "/",
  CASH_FLOW_PROJECTION: "/cash-flow-projection",
  GOALS: "/goals",
  MANAGE_CASH_FLOW_TEMPLATE: "/manage-cash-flow-template",
  ADD_CASH_FLOW_TEMPLATE: "/add-cash-flow-template",
  ADD_GOAL: "/add-goal",
  SETTINGS: "/settings",
  SIGN_IN: "/sign-in",
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

const routes = [
  {
    path: ROUTE_NAMES.ROOT,
    Component: Layout,
    children: [
      {
        path: ROUTE_NAMES.ROOT,
        Component: Home,
        children: [
          {
            index: true,
            Component: CashFlow,
          },
          {
            path: ROUTE_NAMES.CASH_FLOW_PROJECTION,
            Component: CashFlowProjection,
          },
          {
            path: ROUTE_NAMES.GOALS,
            Component: Goals,
          },
        ],
      },
      {
        path: ROUTE_NAMES.MANAGE_CASH_FLOW_TEMPLATE,
        Component: ManageCashFlowTemplate,
      },
      {
        path: ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE,
        Component: AddCashFlowTemplate,
      },
      {
        path: ROUTE_NAMES.GOALS,
        Component: AddGoal,
      },
      {
        path: ROUTE_NAMES.SETTINGS,
        Component: Settings,
      },
      {
        path: ROUTE_NAMES.SIGN_IN,
        Component: SignIn,
      },
    ],
  },
]

export const router = () => createBrowserRouter(routes)
