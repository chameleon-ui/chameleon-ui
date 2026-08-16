import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createCatalog, directionForLocale, requireMessage } from '@chameleon-ui/i18n'
import { Upload } from './Upload.js'
import ar from './locales/ar.json'
import en from './locales/en.json'

function file(name: string, size = 2048): File {
  return new File(['x'.repeat(size)], name, { type: 'text/plain' })
}

describe('Upload', () => {
  it('renders the dropzone with cu-* classes and data-ai attributes', () => {
    render(<Upload label="Attachments" />)
    const zone = screen.getByRole('button', { name: 'Attachments' })
    const element = zone.closest('.cu-upload')
    expect(element).toHaveClass('cu-upload')
    expect(element).toHaveAttribute('data-ai-role', 'upload')
    expect(element).toHaveAttribute('data-ai-state', 'default')
  })

  it('accepts dropped files and reports them', () => {
    let received: File[] = []
    render(<Upload label="Attachments" onFiles={(files) => { received = files }} />)
    const zone = screen.getByRole('button', { name: 'Attachments' })
    fireEvent.drop(zone, { dataTransfer: { files: [file('a.txt'), file('b.txt')] } })
    expect(received.map((entry) => entry.name)).toEqual(['a.txt', 'b.txt'])
    expect(screen.getByText('a.txt')).toBeInTheDocument()
    expect(zone.closest('.cu-upload')).toHaveAttribute('data-ai-state', 'uploading')
  })

  it('marks dragover while files hover the zone', () => {
    render(<Upload label="Attachments" />)
    const zone = screen.getByRole('button', { name: 'Attachments' })
    fireEvent.dragOver(zone)
    expect(zone.closest('.cu-upload')).toHaveAttribute('data-ai-state', 'dragover')
    fireEvent.dragLeave(zone)
    expect(zone.closest('.cu-upload')).toHaveAttribute('data-ai-state', 'default')
  })

  it('accepts pasted files', () => {
    let received: File[] = []
    render(<Upload label="Attachments" onFiles={(files) => { received = files }} />)
    fireEvent.paste(screen.getByRole('button', { name: 'Attachments' }), {
      clipboardData: { files: [file('paste.txt')] },
    })
    expect(received.map((entry) => entry.name)).toEqual(['paste.txt'])
  })

  it('limits to one file when multiple is false', () => {
    let received: File[] = []
    render(<Upload label="Attachment" multiple={false} onFiles={(files) => { received = files }} />)
    fireEvent.drop(screen.getByRole('button', { name: 'Attachment' }), {
      dataTransfer: { files: [file('a.txt'), file('b.txt')] },
    })
    expect(received).toHaveLength(1)
  })

  it('rejects files that miss accept or exceed maxSize', () => {
    const accepted: File[] = []
    const rejected: Array<{ name: string; reason: string }> = []
    render(
      <Upload
        accept=".txt,text/plain"
        label="Attachments"
        maxSize={100}
        onFiles={(files) => {
          accepted.push(...files)
        }}
        onReject={(items) => {
          rejected.push(...items.map((item) => ({ name: item.file.name, reason: item.reason })))
        }}
      />,
    )
    const zone = screen.getByRole('button', { name: 'Attachments' })
    fireEvent.drop(zone, {
      dataTransfer: {
        files: [file('ok.txt', 40), file('big.txt', 400), new File(['x'], 'photo.png', { type: 'image/png' })],
      },
    })
    expect(accepted.map((entry) => entry.name)).toEqual(['ok.txt'])
    expect(rejected).toEqual([
      { name: 'big.txt', reason: 'size' },
      { name: 'photo.png', reason: 'type' },
    ])
  })

  it('renders caller-measured progress from the files prop', () => {
    render(
      <Upload
        files={[{ name: 'report.csv', size: 2048, progress: 40, status: 'uploading' }]}
        label="Attachments"
      />,
    )
    expect(screen.getByText('report.csv')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveValue(40)
  })

  it('reads bundled locale messages', () => {
    expect(requireMessage(createCatalog(en), 'upload.dropzone')).toBeDefined()
    expect(requireMessage(createCatalog(ar), 'upload.browse')).toBeDefined()
  })

  it('inherits RTL from document lang without hardcoding ltr', () => {
    document.documentElement.lang = 'ar'
    document.documentElement.dir = directionForLocale('ar')
    render(<Upload label="المرفقات" />)
    expect(document.documentElement.dir).toBe('rtl')
  })
})
