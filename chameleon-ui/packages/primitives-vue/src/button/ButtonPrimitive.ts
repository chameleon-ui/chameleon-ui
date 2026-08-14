import { ark } from '@ark-ui/vue/factory'

/** Thin unstyled button primitive for Vue. Styling belongs in `@chameleon-ui/components-vue`. */
export const ButtonPrimitive = ark.button

export type ButtonPrimitiveProps = InstanceType<typeof ButtonPrimitive>['$props']
