import { FullScreenError } from "@/components/FullScreenError"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { useAuth } from "@/hooks/useAuth"
import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { useQuery } from "@tanstack/react-query"
import { queryTransactions } from "@workspace/api/db/transactions"
import { Button } from "@workspace/ui/components/button"
import { TransactionItem } from "@/components/TransactionItem"
import { CirclePlus, Filter, FolderCode, Plus, Save, X } from "lucide-react"
import { useLocation } from "react-router"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { useForm } from "react-hook-form"
import type {
  TransactionQuery,
  TransactionType,
} from "@workspace/core/types/transactions"
import { useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { TRANSACTION_TYPES } from "@workspace/ui/constants/transactions"
import { queryGoals } from "@workspace/api/db/goals"
import type { Goal } from "@workspace/core/types/goals"

type Query = { type?: string; goalId?: string; categoryId?: string }

export function Transactions() {
  const { navigate } = useNavigator()
  const user = useAuth()
  const { state = {} } = useLocation()
  const defaultValues = { ...state, type: "ALL" }
  const { handleSubmit, setValue, watch } = useForm<Query>({
    defaultValues,
  })

  const [filters, setFilters] = useState(defaultValues)
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)

  const toQueryFilters = (filters: Query): TransactionQuery => {
    const query: TransactionQuery = { ...filters, orderBy: "date" }
    if (filters.type === "ALL") {
      query.type = undefined
    }
    return query
  }

  const queryTransactionsForUser = queryTransactions(user.uid)
  const queryGoalsForUser = queryGoals(user.uid)
  const { data: goals } = useQuery({
    queryKey: ["goals"],
    queryFn: queryGoalsForUser.bind(null, {
      status: "STARTED_SAVING,ACTIVE",
    }),
  })
  const {
    isPending,
    error,
    data: transactions,
  } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: queryTransactionsForUser.bind(null, toQueryFilters(filters)),
  })

  const showGoalTransactions = Boolean(state?.goalId)
  const type = watch("type")
  const goalId = watch("goalId")
  const categoryId = watch("categoryId")
  const goalsMap: Record<string, Goal> = goals
    ? goals.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})
    : {}

  const onSubmit = (filters: Query) => {
    setFilters(filters)
    setFiltersDialogOpen(false)
  }

  const NoTransactions = () => (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle className="capitalize">No Transactions Yet</EmptyTitle>
        <EmptyDescription>
          Start by clicking on <CirclePlus className="inline size-5" /> to add
          your first transaction
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )

  if (isPending) return <FullScreenLoader />

  if (error) return <FullScreenError msg="Failed to get transactions" />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">
            Transactions
            {Boolean(transactions.length) && ` (${transactions.length})`}
          </h1>
          <p className="text-sm">All your transactions, at a glance.</p>
        </div>
        <div className="flex items-center justify-between">
          <AlertDialog
            open={filtersDialogOpen}
            onOpenChange={setFiltersDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Filters
                <Filter />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader className="flex flex-col items-start">
                <AlertDialogTitle>Change Filters</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Apply filters to limit result
              </AlertDialogDescription>
              <Field>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select
                  defaultValue={type}
                  onValueChange={(v: TransactionType | "ALL") =>
                    setValue("type", v)
                  }
                >
                  <SelectTrigger id="type" className="!h-11 capitalize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    {TRANSACTION_TYPES.map((s) => (
                      <SelectItem value={s} key={s} className="capitalize">
                        {s.toLowerCase().replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex gap-2">
                <Field>
                  <FieldLabel htmlFor="goal">
                    Goal<span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    defaultValue={goalId}
                    disabled={showGoalTransactions}
                    required
                    onValueChange={(v) => setValue("goalId", v)}
                  >
                    <SelectTrigger id="goal" className="!h-12 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(goalsMap).map((g) => (
                        <SelectItem
                          value={g.id}
                          key={g.id}
                          className="capitalize"
                        >
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="goal">Category</FieldLabel>
                  <Select
                    defaultValue={categoryId}
                    onValueChange={(v) => setValue("categoryId", v)}
                  >
                    <SelectTrigger id="goal" className="!h-12 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalsMap[goalId || ""]?.breakdown?.map((c) => (
                        <SelectItem
                          value={c.id}
                          key={c.id}
                          className="capitalize"
                        >
                          {c.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <X />
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(onSubmit)}>
                  <Save /> Apply
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {transactions.length ? (
          transactions.map((t) => (
            <TransactionItem transaction={t} key={t.id} />
          ))
        ) : (
          <NoTransactions />
        )}
      </div>
      <Button
        className="fixed right-6 bottom-20 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_TRANSACTION)}
      >
        <Plus />
      </Button>
    </div>
  )
}
