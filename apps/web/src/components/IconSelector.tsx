import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { useState } from "react"

const ICONS_PAGE_SIZE = 10

export const IconSelector = ({
  icon,
  setIcon,
  className = "",
}: {
  icon: string
  setIcon: Function
  className?: string
}) => {
  const [iconName, setIconName] = useState("bank")

  const filteredIcons: IconName[] = iconName
    ? iconNames
        .filter((name) => name.includes(iconName.toLowerCase()))
        .slice(0, ICONS_PAGE_SIZE)
    : []

  return (
    <Field className={className}>
      <FieldLabel htmlFor="name">Icon</FieldLabel>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg--(--background) border-(--foreground) text-(--foreground)"
          >
            <DynamicIcon name={icon as IconName} className="size-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex items-start">
            <DialogTitle>Icon</DialogTitle>
            <DialogDescription>Select an icon.</DialogDescription>
            <Input
              id="icon"
              placeholder="Search icons..."
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
            />
          </DialogHeader>
          <DialogFooter>
            <div className="flex h-12 flex-wrap gap-8">
              {filteredIcons.map((name) => (
                <DialogClose asChild key={name}>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => setIcon(name)}
                  >
                    <DynamicIcon name={name} />
                  </Button>
                </DialogClose>
              ))}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Field>
  )
}
