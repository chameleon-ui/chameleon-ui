import { ark } from '@ark-ui/vue/factory'

/** Thin unstyled input primitive for Vue. Styling belongs in `@chameleon-ui/components-vue`. */
export const InputPrimitive = ark.input

export type InputPrimitiveProps = InstanceType<typeof InputPrimitive>['$props']
