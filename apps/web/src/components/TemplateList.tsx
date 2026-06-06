import { TemplateItem } from "./TemplateItem"
import type { Transaction } from "@workspace/core/types/transactions"

export const TemplateList = ({ templates }: { templates: Transaction[] }) => {
  const sortedTemplates = [...templates].sort(
    (a, b) =>
      (a.plannedDay || a.plannedDate?.getTime() || 0) -
      (b.plannedDay || b.plannedDate?.getTime() || 0)
  )

  return (
    <div className="flex flex-col gap-2">
      {sortedTemplates.map((t) => (
        <TemplateItem template={t} key={t.id} />
      ))}
    </div>
  )
}
