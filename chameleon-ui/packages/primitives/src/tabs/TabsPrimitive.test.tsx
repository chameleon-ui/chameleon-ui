import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TabsPrimitive } from './TabsPrimitive.js'

const tabs = [
  { value: 'account', label: 'Account' },
  { value: 'security', label: 'Security' },
]

describe('TabsPrimitive', () => {
  it('shows the selected tab panel and switches on click', async () => {
    const user = userEvent.setup()

    render(
      <TabsPrimitive.Root defaultValue="account">
        <TabsPrimitive.List>
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        <TabsPrimitive.Content value="account">Account settings</TabsPrimitive.Content>
        <TabsPrimitive.Content value="security">Security settings</TabsPrimitive.Content>
      </TabsPrimitive.Root>,
    )

    expect(screen.getByRole('tabpanel', { name: 'Account' })).toHaveTextContent('Account settings')

    await user.click(screen.getByRole('tab', { name: 'Security' }))
    expect(screen.getByRole('tabpanel', { name: 'Security' })).toHaveTextContent('Security settings')
  })
})
