import { useNavigator } from "@/hooks/useNavigator"
import { ROUTE_NAMES } from "@/routes"
import { queryCashFlowTemplates } from "@workspace/api/db/index"
import type { CashFlowTemplate, Type } from "@workspace/core/types"
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

const DEFAULT_QUERY: { type: Type } = { type: "INCOME" }

export function CashFlowTemplates() {
  const user = useAuth()
  const { navigate } = useNavigator()
  const { handleSubmit, setValue } = useForm<{ type: Type }>({
    defaultValues: DEFAULT_QUERY,
  })
  const [filters, setFilters] = useState(DEFAULT_QUERY)
  const { isPending, data: templates = [] } = useQuery({
    queryKey: ["cashflow-templates", filters],
    queryFn: queryCashFlowTemplates(user.uid).bind(null, filters),
  })
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)

  const onSubmit = (filters: { type: Type }) => {
    setFilters(filters)
    setFiltersDialogOpen(false)
  }

  const Templates = ({
    templates,
    type,
  }: {
    templates: CashFlowTemplate[]
    type: Type
  }) => {
    if (isPending) return <Spinner className="m-auto" />

    if (templates.length === 0)
      return (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderCode />
            </EmptyMedia>
            <EmptyTitle className="capitalize">
              No {type.toLowerCase()} Yet
            </EmptyTitle>
            <EmptyDescription>
              Start by by clicking on <CirclePlus /> to add your first{" "}
              {type.toLowerCase()}
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
            <Button variant="outline">
              <Filter />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader className="flex flex-col items-start">
              <AlertDialogTitle>Change Filters</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <Field>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select
                  defaultValue={DEFAULT_QUERY.type}
                  onValueChange={(v: Type) => setValue("type", v)}
                >
                  <SelectTrigger id="type" className="!h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
            </AlertDialogDescription>
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
      <Templates
        templates={templates.filter((t) => t.type === filters.type)}
        type={filters.type}
      />
      <Button
        className="fixed right-6 bottom-6 h-12 w-12 rounded-full"
        onClick={() => navigate(ROUTE_NAMES.ADD_CASH_FLOW_TEMPLATE)}
      >
        <Plus />
      </Button>
    </div>
  )
}
