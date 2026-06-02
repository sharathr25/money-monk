import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { queryCashFlowTemplates } from "@workspace/api/db/index"
import type { CashFlowTemplateQuery } from "@workspace/core/types"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Plus, FolderCode, CirclePlus, Filter, X, Save } from "lucide-react"
import { useState } from "react"
import { TemplateList } from "@/components/TemplateList"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useForm } from "react-hook-form"
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
import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { Switch } from "@workspace/ui/components/switch"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { FullScreenError } from "@/components/FullScreenError"
import { AmountTypeSelector } from "@/components/AmountTypeSelector"
import { FrequencySelector } from "@/components/FrequencySelector"

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

  const toQueryFilters = (filters: Query): CashFlowTemplateQuery => {
    const query: CashFlowTemplateQuery = { ...filters }
    if (filters.type === "ALL") {
      query.type = undefined
    }
    if (filters.frequency === "ALL") {
      query.frequency = undefined
    }
    if (!filters.showPastTemplates) {
      query.startDate = new Date()
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
    queryFn: queryCashFlowTemplates(user.uid).bind(
      null,
      toQueryFilters(filters)
    ),
  })
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)

  const onSubmit = (filters: Query) => {
    setFilters(filters)
    setFiltersDialogOpen(false)
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
              Start by by clicking on <CirclePlus /> to add your first template.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )

    return <TemplateList templates={templates} />
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Cash Flow Templates</h1>
          <p className="text-sm">
            Your recurring and one-time income and expenses.
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
              <AlertDialogDescription></AlertDialogDescription>
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
              <Field orientation="horizontal" className="max-w-sm">
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
