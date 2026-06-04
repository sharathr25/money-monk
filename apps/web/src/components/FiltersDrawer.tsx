import { Button } from "@workspace/ui/components/button"
import { Filter, X, Check } from "lucide-react"
import { useState } from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"

export function FiltersDrawer({
  children,
  onApply,
}: {
  children: React.ReactElement
  onApply: () => void
}) {
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false)

  const _onApply = () => {
    onApply()
    setFiltersDialogOpen(false)
  }

  return (
    <Drawer open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Filters
          <Filter />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-start">
          <DrawerTitle className="text-xl">Filters</DrawerTitle>
          <DrawerDescription>Apply filters to limit result.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">{children}</div>
        <DrawerFooter className="mb-20 w-full flex-row">
          <DrawerClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel <X />
            </Button>
          </DrawerClose>
          <Button onClick={_onApply} className="flex-1">
            Apply <Check />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
