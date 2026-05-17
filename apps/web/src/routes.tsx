import { createBrowserRouter, redirect, type RouteObject } from "react-router"
import { Home } from "@/pages/home"
import { Layout } from "./components/Layout"
import { lazy } from "react"
import { AuthProvider } from "./components/AuthProvider"
import Goal from "./pages/goal/index.ts"
import EditGoal from "./pages/editGoal.tsx"

export const ROUTE_PATHS = {
  ROOT: "/",
  AUTH: "auth",
  HOME: "home",
  CASH_FLOW_PROJECTION: "cash-flow-projection",
  CASH_FLOW_TEMPLATES: "cash-flow-templates",
  CASH_FLOW_TEMPLATE: "cash-flow-templates/:templateId",
  ADD_CASH_FLOW_TEMPLATE: "cash-flow-templates/add",
  EDIT_CASH_FLOW_TEMPLATE: "cash-flow-templates/:templateId/edit",
  GOALS: "goals",
  GOAL: "goals/:goalId",
  ADD_GOAL: "goals/add",
  EDIT_GOAL: "goals/:goalId/edit",
  SETTINGS: "settings",
  SIGN_IN: "sign-in",
  PROFILE: "profile",
} as const

const {
  ROOT,
  AUTH,
  HOME,
  CASH_FLOW_PROJECTION,
  GOALS,
  CASH_FLOW_TEMPLATES,
  CASH_FLOW_TEMPLATE,
  ADD_CASH_FLOW_TEMPLATE,
  EDIT_CASH_FLOW_TEMPLATE,
  GOAL,
  ADD_GOAL,
  EDIT_GOAL,
  SETTINGS,
  SIGN_IN,
  PROFILE,
} = ROUTE_PATHS

const rootPath = (...pathParts: string[]) => ROOT + pathParts.join("/")
const authPath = (...pathParts: string[]) => rootPath(AUTH, ...pathParts)
const homePath = (...pathParts: string[]) => authPath(HOME, ...pathParts)

export const ROUTE_NAMES = {
  ROOT: ROOT,

  // Authenticated routes
  AUTH: authPath(),
  HOME: authPath(HOME),
  CASH_FLOW_TEMPLATE: authPath(CASH_FLOW_TEMPLATE),
  ADD_CASH_FLOW_TEMPLATE: authPath(ADD_CASH_FLOW_TEMPLATE),
  EDIT_CASH_FLOW_TEMPLATE: authPath(EDIT_CASH_FLOW_TEMPLATE),
  GOAL: authPath(GOAL),
  ADD_GOAL: authPath(ADD_GOAL),
  EDIT_GOAL: authPath(EDIT_GOAL),
  SETTINGS: authPath(SETTINGS),
  PROFILE: authPath(PROFILE),

  // Home
  CASH_FLOW_TEMPLATES: homePath(CASH_FLOW_TEMPLATES),
  CASH_FLOW_PROJECTION: homePath(CASH_FLOW_PROJECTION),
  GOALS: homePath(GOALS),

  // Public routes
  SIGN_IN: rootPath(SIGN_IN),
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]

export type MetaData = {
  canGoBack: boolean
}

const CashFlow = lazy(() => import("@/pages/cashFlow"))
const CashFlowProjection = lazy(() => import("@/pages/cashFlowProjection"))
const Goals = lazy(() => import("@/pages/goals"))
const CashFlowTemplates = lazy(() => import("@/pages/cashFlowTemplates"))
const CashFlowTemplate = lazy(() => import("@/pages/cashFlowTemplate"))
const AddCashFlowTemplate = lazy(() => import("@/pages/addCashFlowTemplate"))
const EditCashFlowTemplate = lazy(() => import("@/pages/editCashFlowTemplate"))
const AddGoal = lazy(() => import("@/pages/addGoal"))
const Profile = lazy(() => import("@/pages/profile"))
const SignIn = lazy(() => import("@/pages/signIn"))

const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.ROOT,
    Component: Layout,
    children: [
      {
        index: true,
        loader: () => {
          throw redirect(ROUTE_PATHS.AUTH)
        },
      },
      {
        path: ROUTE_PATHS.AUTH,
        Component: () => <AuthProvider />,
        children: [
          {
            index: true,
            loader: () => {
              throw redirect(ROUTE_PATHS.HOME)
            },
          },
          {
            path: ROUTE_PATHS.HOME,
            Component: Home,
            children: [
              {
                index: true,
                Component: CashFlow,
              },
              {
                path: ROUTE_PATHS.CASH_FLOW_PROJECTION,
                Component: CashFlowProjection,
              },
              {
                path: ROUTE_PATHS.GOALS,
                Component: Goals,
              },
            ],
          },
          {
            path: ROUTE_PATHS.CASH_FLOW_TEMPLATES,
            Component: CashFlowTemplates,
          },
          {
            path: ROUTE_PATHS.CASH_FLOW_TEMPLATE,
            Component: CashFlowTemplate,
          },
          {
            path: ROUTE_PATHS.ADD_CASH_FLOW_TEMPLATE,
            Component: AddCashFlowTemplate,
          },
          {
            path: ROUTE_PATHS.EDIT_CASH_FLOW_TEMPLATE,
            Component: EditCashFlowTemplate,
          },
          {
            path: ROUTE_PATHS.GOALS,
            Component: Goals,
          },
          {
            path: ROUTE_PATHS.GOAL,
            Component: Goal,
          },
          {
            path: ROUTE_PATHS.EDIT_GOAL,
            Component: EditGoal,
          },
          {
            path: ROUTE_PATHS.ADD_GOAL,
            Component: AddGoal,
          },
          {
            path: ROUTE_PATHS.PROFILE,
            Component: Profile,
          },
        ],
      },
      {
        path: ROUTE_PATHS.SIGN_IN,
        Component: SignIn,
      },
    ],
  },
]

export const router = () => createBrowserRouter(routes)
