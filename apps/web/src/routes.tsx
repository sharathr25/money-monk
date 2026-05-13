import { createBrowserRouter } from "react-router"
import { Home } from "@/pages/home"
import { Layout } from "./components/Layout"
import { lazy } from "react"

export const ROUTE_NAMES = {
  ROOT: "/",
  CASH_FLOW_PROJECTION: "/cash-flow-projection",
  GOALS: "/goals",
  CASH_FLOW_TEMPLATES: "/cash-flow-templates",
  CASH_FLOW_TEMPLATE: "/cash-flow-template/:templateId",
  ADD_CASH_FLOW_TEMPLATE: "/cash-flow-templates/add",
  EDIT_CASH_FLOW_TEMPLATE: "/cash-flow-templates/:templateId/edit",
  ADD_GOAL: "/add-goal",
  SETTINGS: "/settings",
  SIGN_IN: "/sign-in",
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

const CashFlow = lazy(() => import("@/pages/cashFlow"))
const CashFlowProjection = lazy(() => import("@/pages/cashFlowProjection"))
const Goals = lazy(() => import("@/pages/goals"))
const CashFlowTemplates = lazy(() => import("@/pages/cashFlowTemplates"))
const CashFlowTemplate = lazy(() => import("@/pages/cashFlowTemplate"))
const AddCashFlowTemplate = lazy(() => import("@/pages/addCashFlowTemplate"))
const EditCashFlowTemplate = lazy(() => import("@/pages/editCashFlowTemplate"))
const AddGoal = lazy(() => import("@/pages/addGoal"))
const Settings = lazy(() => import("@/pages/settings"))
const SignIn = lazy(() => import("@/pages/signIn"))

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
        path: ROUTE_NAMES.CASH_FLOW_TEMPLATES,
        Component: CashFlowTemplates,
      },
      {
        path: ROUTE_NAMES.CASH_FLOW_TEMPLATE,
        Component: CashFlowTemplate,
      },
      {
        path: ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE,
        Component: AddCashFlowTemplate,
      },
      {
        path: ROUTE_NAMES.EDIT_CASH_FLOW_TEMPLATE,
        Component: EditCashFlowTemplate,
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
