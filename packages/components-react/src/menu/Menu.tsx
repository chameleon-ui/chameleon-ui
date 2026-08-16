import { PopoverPrimitive } from '@chameleon-ui/primitives'
import './styles.css'

export interface MenuItem {
  label: string
  onClick: () => void
}

export interface MenuProps {
  triggerLabel: string
  items: MenuItem[]
  className?: string
}

export function Menu({ triggerLabel, items, className }: MenuProps) {
  const classes = ['cu-menu', className].filter(Boolean).join(' ')
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger className="cu-menu__trigger">{triggerLabel}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Positioner>
        <PopoverPrimitive.Content className={classes} data-ai-role="menu" data-ai-state="open" data-ai-intent="choose-action" role="menu">
          <ul className="cu-menu__list">
            {items.map((item, index) => (
              <li className="cu-menu__item" key={index}>
                <button className="cu-menu__button" onClick={item.onClick} type="button" role="menuitem">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Root>
  )
}
