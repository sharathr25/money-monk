import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { queryCashFlowTemplates } from "@workspace/api/db/cashFlowTemplates"
import type { CashFlowTemplate } from "@workspace/core/types"

export const useTemplates = () => {
  const user = useAuth()
  const queryTemplatesForUser = queryCashFlowTemplates(user.uid).bind(null, {
    frequency: "ONE_TIME",
    type: "EXPENSE",
  })

  const { data: templates = [] } = useQuery({
    queryKey: ["templates"],
    queryFn: queryTemplatesForUser,
  })

  const templatesMap: Record<string, CashFlowTemplate> = templates.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: cur }),
    {}
  )

  const getTemplate = (templateId?: string) => {
    if (!templateId) return undefined
    const template = templatesMap[templateId]

    if (!template) return undefined

    return { id: template.id, name: template.name }
  }

  return { templates, templatesMap, getTemplate }
}
