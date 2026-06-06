import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Plus, FolderCode, CirclePlus } from "lucide-react"
import { useState } from "react"
import { TemplateList } from "@/components/TemplateList"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useForm } from "react-hook-form"
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Switch } from "@workspace/ui/components/switch"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { FullScreenError } from "@/components/FullScreenError"
import { AmountTypeSelector } from "@/components/AmountTypeSelector"
import { FrequencySelector } from "@/components/FrequencySelector"
import { FiltersDrawer } from "@/components/FiltersDrawer"
import { queryTransactions } from "@workspace/api/db/transactions"
import type { TransactionQuery } from "@workspace/core/types/transactions"

type Query = { type: string; showPastTemplates: boolean; frequency: string }

const DEFAULT_QUERY: Query = {
  type: "ALL",
  frequency: "ALL",
  showPastTemplates: false,
}

export function CashFlowTemplates() {
  const user = useAuth()
  const { navigate } = useNavigator()
  const { handleSubmit, setValue, watch } = useForm<Query>({
    defaultValues: DEFAULT_QUERY,
  })
  const [filters, setFilters] = useState<Query>(DEFAULT_QUERY)

  const showPastTemplates = watch("showPastTemplates")
  const type = watch("type")
  const frequency = watch("frequency")

  const toQueryFilters = (filters: Query): TransactionQuery => {
    const query: TransactionQuery = { ...filters, status: "PLANNED" }
    if (filters.type === "ALL") {
      query.type = undefined
    }
    if (filters.frequency === "ALL") {
      query.frequency = undefined
    }
    if (!filters.showPastTemplates) {
      query.plannedDate = { start: new Date() }
    }
    return query
  }

  const {
    isPending,
    data: templates = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["cashflow-templates", filters],
    queryFn: queryTransactions(user.uid).bind(null, toQueryFilters(filters)),
  })

  const onSubmit = (filters: Query) => {
    setFilters(filters)
    refetch()
  }

  const Templates = () => {
    if (isPending) return <FullScreenLoader />

    if (!!error) return <FullScreenError msg="Something went wrong!" />

    if (templates.length === 0)
      return (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle className="capitalize">No Templates Yet</EmptyTitle>
            <EmptyDescription>
              Start by by clicking on <CirclePlus /> to add template.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )

    return <TemplateList templates={templates} />
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-start justify-between bg-background">
        <div>
          <h1 className="text-xl font-bold">
            Cash Flow Templates
            {templates.length ? ` (${templates.length})` : ""}
          </h1>
          <p className="text-sm">
            Your recurring and one-time income and expenses.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <FiltersDrawer onApply={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <AmountTypeSelector
                  types={["INCOME", "EXPENSE", "ALL"]}
                  type={type}
                  setType={setValue.bind(null, "type")}
                />
                <FrequencySelector
                  frequencies={["ALL", "MONTHLY", "ONE_TIME"]}
                  frequency={frequency}
                  setFrequency={setValue.bind(null, "frequency")}
                />
              </div>
              <Field orientation="horizontal" className="w-full">
                <FieldLabel htmlFor="switch-focus-mode">
                  Show past templates
                </FieldLabel>
                <Switch
                  className="data-[state=unchecked]:bg-gray-300"
                  id="switch-focus-mode"
                  checked={showPastTemplates}
                  onCheckedChange={(showPastTemplates) =>
                    setValue("showPastTemplates", showPastTemplates)
                  }
                />
              </Field>
            </div>
          </FiltersDrawer>
        </div>
      </div>
      <Templates />
      <Button
        className="fixed right-6 bottom-20 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE)}
      >
        <Plus />
      </Button>
    </div>
  )
}
