import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { queryCashFlowTemplates } from "@workspace/api/db/index"
import type {
  CashFlowTemplate,
  CashFlowTemplateQuery,
  Type,
} from "@workspace/core/types"
import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import {
  Plus,
  FolderCode,
  CirclePlus,
  Filter,
  MoveDown,
  MoveUp,
  X,
  Save,
  ArrowDownUp,
} from "lucide-react"
import { useState } from "react"
import { Spinner } from "@workspace/ui/components/spinner"
import { TemplateList } from "@/components/TemplateList"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
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

type Query = { type: string; showPastTemplates: boolean }

const DEFAULT_QUERY: Query = {
  type: "ALL",
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

  const toQueryFilters = (filters: Query): CashFlowTemplateQuery => {
    const query: CashFlowTemplateQuery = { ...filters }
    if (filters.type === "ALL") {
      query.type = undefined
    }
    if (!filters.showPastTemplates) {
      query.startDate = new Date()
    }
    return query
  }

  const {
    isPending,
    data: templates = [],
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

  const Templates = ({ templates }: { templates: CashFlowTemplate[] }) => {
    if (isPending) return <Spinner className="m-auto" />

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
      <div>
        <h1 className="text-xl font-bold">Cash Flow Templates</h1>
        <p className="text-sm">Your recurring/one time income and expenses</p>
      </div>
      <div className="flex items-center justify-between">
        <h2>Filters</h2>
        <AlertDialog
          open={filtersDialogOpen}
          onOpenChange={setFiltersDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader className="flex flex-col items-start">
              <AlertDialogTitle>Change Filters</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription></AlertDialogDescription>
            <Field>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <Select
                defaultValue={DEFAULT_QUERY.type}
                value={type}
                onValueChange={(v: Type) => setValue("type", v)}
              >
                <SelectTrigger id="type" className="!h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    <ArrowDownUp />
                    All
                  </SelectItem>
                  <SelectItem value="INCOME">
                    <MoveDown />
                    Income
                  </SelectItem>
                  <SelectItem value="EXPENSE">
                    <MoveUp />
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
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
      <Templates templates={templates} />
      <Button
        className="fixed right-6 bottom-20 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE)}
      >
        <Plus />
      </Button>
    </div>
  )
}
