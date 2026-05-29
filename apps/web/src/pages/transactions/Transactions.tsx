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

type Query = { type?: string; goalId?: string }

export function Transactions() {
  const user = useAuth()
  const { state = {} } = useLocation()
  const defaultValues = { ...state, type: "ALL" }
  const { handleSubmit, setValue, watch } = useForm<Query>({
    defaultValues,
  })
  const [filters, setFilters] = useState(defaultValues)
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)

  const onSubmit = (filters: Query) => {
    setFilters(filters)
    setFiltersDialogOpen(false)
  }

  const type = watch("type")

  const toQueryFilters = (filters: Query): TransactionQuery => {
    const query: TransactionQuery = { ...filters }
    if (filters.type === "ALL") {
      query.type = undefined
    }
    return query
  }

  const queryTransactionsForUser = queryTransactions(user.uid)
  const {
    isPending,
    error,
    data: transactions,
  } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: queryTransactionsForUser.bind(null, toQueryFilters(filters)),
  })

  const { navigate } = useNavigator()

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
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-sm">
            Your transactions related to goals or adjustments
          </p>
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
