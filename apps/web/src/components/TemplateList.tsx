import type { CashFlowTemplate } from "@workspace/core/types"
import { TemplateItem } from "./TemplateItem"

export const TemplateList = ({
  templates,
}: {
  templates: CashFlowTemplate[]
}) => {
  const sortedTemplates = [...templates].sort(
    (a, b) =>
      (a.day || a.date?.getTime() || 0) - (b.day || b.date?.getTime() || 0)
  )

  return (
    <div className="flex flex-col gap-2">
      {sortedTemplates.map((t) => (
        <TemplateItem template={t} key={t.id} />
      ))}
    </div>
  )
}
