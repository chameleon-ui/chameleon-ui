import { describe, expect, it } from 'vitest'
import * as VueBarrel from './index.js'

describe('Vue barrel', () => {
  it('exports the catalog slugs a skeptic would spot-check plus ThemeProvider', () => {
    expect(VueBarrel.Button).toBeTruthy()
    expect(VueBarrel.AppShell).toBeTruthy()
    expect(VueBarrel.Navigation).toBeTruthy()
    expect(VueBarrel.NavigationBar).toBeTruthy()
    expect(VueBarrel.useTabStacks).toBeTruthy()
    expect(VueBarrel.ThemeProvider).toBeTruthy()
    expect(VueBarrel.ToastProvider).toBeTruthy()
    expect(VueBarrel.useToast).toBeTruthy()
    expect(VueBarrel.createToaster).toBeTruthy()
    expect(VueBarrel.Toaster).toBeTruthy()
    expect(VueBarrel.Upload).toBeTruthy()
    expect(VueBarrel.Slider).toBeTruthy()
    expect(VueBarrel.DataGrid).toBeTruthy()
    expect(VueBarrel.Chart).toBeTruthy()
    expect(VueBarrel.Editor).toBeTruthy()
    expect(VueBarrel.CommandPalette).toBeTruthy()
    expect(VueBarrel.EmptyState).toBeTruthy()
    expect(VueBarrel.Input).toBeTruthy()
    expect(VueBarrel.Card).toBeTruthy()
  })
})
