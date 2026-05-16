import {
  createBrowserRouter,
  createContext,
  Outlet,
  redirect,
  type RouteObject,
} from "react-router"
import { Home } from "@/pages/home"
import { Layout } from "./components/Layout"
import { lazy } from "react"
import type { User } from "firebase/auth"
import { getLoggedInUser } from "@workspace/api/auth/index"

export const ROUTE_PATHS = {
  ROOT: "/",
  AUTH: "auth",
  HOME: "home",
  CASH_FLOW_PROJECTION: "cash-flow-projection",
  GOALS: "goals",
  CASH_FLOW_TEMPLATES: "cash-flow-templates",
  CASH_FLOW_TEMPLATE: "cash-flow-template/:templateId",
  ADD_CASH_FLOW_TEMPLATE: "cash-flow-templates/add",
  EDIT_CASH_FLOW_TEMPLATE: "cash-flow-templates/:templateId/edit",
  ADD_GOAL: "add-goal",
  SETTINGS: "settings",
  SIGN_IN: "sign-in",
  PROFILE: "profile",
} as const

export const ROUTE_NAMES = {
  ROOT: "/",

  AUTH: ROUTE_PATHS.ROOT + "auth",

  HOME: ROUTE_PATHS.ROOT + ROUTE_PATHS.AUTH + "/" + "home",
  CASH_FLOW_TEMPLATES:
    ROUTE_PATHS.ROOT + ROUTE_PATHS.AUTH + "/" + "cash-flow-templates",
  CASH_FLOW_TEMPLATE:
    ROUTE_PATHS.ROOT +
    ROUTE_PATHS.AUTH +
    "/" +
    "cash-flow-template/:templateId",
  ADD_CASH_FLOW_TEMPLATE:
    ROUTE_PATHS.ROOT + ROUTE_PATHS.AUTH + "/" + "cash-flow-templates/add",
  EDIT_CASH_FLOW_TEMPLATE:
    ROUTE_PATHS.ROOT +
    ROUTE_PATHS.AUTH +
    "/" +
    "cash-flow-templates/:templateId/edit",
  ADD_GOAL: ROUTE_PATHS.ROOT + ROUTE_PATHS.AUTH + "/" + "add-goal",
  SETTINGS: ROUTE_PATHS.ROOT + ROUTE_PATHS.AUTH + "/" + "settings",
  PROFILE: ROUTE_PATHS.ROOT + ROUTE_PATHS.AUTH + "/" + "profile",

  CASH_FLOW_PROJECTION:
    ROUTE_PATHS.ROOT +
    ROUTE_PATHS.AUTH +
    "/" +
    ROUTE_PATHS.HOME +
    "/" +
    "cash-flow-projection",
  GOALS:
    ROUTE_PATHS.ROOT +
    ROUTE_PATHS.AUTH +
    "/" +
    ROUTE_PATHS.HOME +
    "/" +
    "goals",

  SIGN_IN: ROUTE_PATHS.ROOT + "sign-in",
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
        Component: () => <Outlet />,
        middleware: [authMiddleware],
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

const userContext = createContext<User>()

function authMiddleware({ context }: { context: any }) {
  const user = getLoggedInUser()

  if (!user) {
    throw redirect(ROUTE_NAMES.SIGN_IN)
  }

  context.set(userContext, user)
}

export const router = () => createBrowserRouter(routes)
