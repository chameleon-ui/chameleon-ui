import { Button, Card, EmptyState, List, Tag, Typography } from '@chameleon-ui/components'
import { useState, type DragEvent } from 'react'
import { createBlockCopy } from '../copy.js'
import { kanbanLocaleTrees } from './locale-map.js'
import './styles.css'

export type KanbanColumnId = 'todo' | 'doing' | 'done'
export type KanbanPriority = 'high' | 'medium' | 'low'

export interface KanbanCard {
  id: string
  title: string
  column: KanbanColumnId
  priority: KanbanPriority
  checklist: string[]
}

export interface KanbanProps {
  locale?: string
  cards?: KanbanCard[]
  onMove?: (card: KanbanCard, column: KanbanColumnId) => void
  className?: string
}

const COLUMNS: KanbanColumnId[] = ['todo', 'doing', 'done']
const DRAG_MIME = 'application/x-cu-kanban-card'

const DEFAULT_CARDS: KanbanCard[] = [
  {
    id: 'card-1',
    title: 'Design login',
    column: 'todo',
    priority: 'high',
    checklist: ['Sketch layout', 'Review copy'],
  },
  {
    id: 'card-2',
    title: 'Write tests',
    column: 'todo',
    priority: 'medium',
    checklist: ['Cover submit'],
  },
  {
    id: 'card-3',
    title: 'Build register',
    column: 'doing',
    priority: 'high',
    checklist: ['Match login conventions'],
  },
  {
    id: 'card-4',
    title: 'Scaffold package',
    column: 'done',
    priority: 'low',
    checklist: ['Add slugs'],
  },
]

function neighbor(column: KanbanColumnId, direction: -1 | 1): KanbanColumnId | null {
  const index = COLUMNS.indexOf(column)
  return COLUMNS[index + direction] ?? null
}

function columnLabelKey(column: KanbanColumnId) {
  if (column === 'todo') return 'kanban.colTodo'
  if (column === 'doing') return 'kanban.colDoing'
  return 'kanban.colDone'
}

function priorityLabelKey(priority: KanbanPriority) {
  if (priority === 'high') return 'kanban.priorityHigh'
  if (priority === 'medium') return 'kanban.priorityMedium'
  return 'kanban.priorityLow'
}

export function Kanban({ locale = 'en', cards: initialCards = DEFAULT_CARDS, onMove, className }: KanbanProps) {
  const { t } = createBlockCopy(kanbanLocaleTrees, locale)
  const [cards, setCards] = useState<KanbanCard[]>(initialCards)
  const [dropTarget, setDropTarget] = useState<KanbanColumnId | null>(null)
  const classes = ['cu-block-kanban', className].filter(Boolean).join(' ')

  const placeCard = (cardId: string, column: KanbanColumnId) => {
    setCards((current) => {
      const found = current.find((item) => item.id === cardId)
      if (!found || found.column === column) return current
      const updated = { ...found, column }
      onMove?.(updated, column)
      return current.map((item) => (item.id === cardId ? updated : item))
    })
  }

  const moveCard = (card: KanbanCard, direction: -1 | 1) => {
    const next = neighbor(card.column, direction)
    if (!next) return
    placeCard(card.id, next)
  }

  const onDragStart = (event: DragEvent<HTMLElement>, cardId: string) => {
    event.dataTransfer.setData(DRAG_MIME, cardId)
    event.dataTransfer.setData('text/plain', cardId)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDragOverColumn = (event: DragEvent<HTMLElement>, column: KanbanColumnId) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    if (dropTarget !== column) setDropTarget(column)
  }

  const onDropColumn = (event: DragEvent<HTMLElement>, column: KanbanColumnId) => {
    event.preventDefault()
    const cardId = event.dataTransfer.getData(DRAG_MIME) || event.dataTransfer.getData('text/plain')
    setDropTarget(null)
    if (cardId) placeCard(cardId, column)
  }

  return (
    <section
      aria-label={t('kanban.title')}
      className={classes}
      data-ai-role="kanban"
      data-ai-intent="organize-cards"
      data-ai-state={cards.length === 0 ? 'empty' : 'default'}
    >
      <div>
        <Typography variant="heading-1">{t('kanban.title')}</Typography>
        <Typography variant="body">{t('kanban.subtitle')}</Typography>
        <p className="cu-block-kanban__meta">{t('kanban.cardCount', { count: cards.length })}</p>
      </div>
      <div className="cu-block-kanban__board">
        {COLUMNS.map((column) => {
          const columnCards = cards.filter((card) => card.column === column)
          return (
            <div
              className={[
                'cu-block-kanban__column-shell',
                dropTarget === column ? 'cu-block-kanban__column-shell--drop' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={column}
              onDragOver={(event) => onDragOverColumn(event, column)}
              onDragLeave={() => {
                if (dropTarget === column) setDropTarget(null)
              }}
              onDrop={(event) => onDropColumn(event, column)}
            >
              <Card className="cu-block-kanban__column" padding="md" variant="outlined">
                <div className="cu-block-kanban__column-header">
                  <Typography as="h2" variant="heading-2">
                    {t(columnLabelKey(column))}
                  </Typography>
                  <Tag label={t('kanban.cardCount', { count: columnCards.length })} variant="outline" />
                </div>
                {columnCards.length === 0 ? (
                  <EmptyState description={t('kanban.emptyDescription')} title={t('kanban.emptyTitle')} />
                ) : (
                  columnCards.map((card) => (
                    <div
                      className="cu-block-kanban__card-shell"
                      draggable
                      key={card.id}
                      onDragStart={(event) => onDragStart(event, card.id)}
                      onDragEnd={() => setDropTarget(null)}
                    >
                      <Card className="cu-block-kanban__card" padding="sm" variant="outlined">
                        <Typography variant="heading-2">{card.title}</Typography>
                        <Tag
                          label={t(priorityLabelKey(card.priority))}
                          variant={card.priority === 'high' ? 'brand' : card.priority === 'low' ? 'outline' : 'default'}
                        />
                        {card.checklist.length > 0 ? <List items={card.checklist} variant="unordered" /> : null}
                        <div className="cu-block-kanban__actions">
                          <Button
                            disabled={!neighbor(card.column, -1)}
                            onClick={() => moveCard(card, -1)}
                            type="button"
                            variant="outline"
                          >
                            {t('kanban.moveBack', { name: card.title })}
                          </Button>
                          <Button
                            disabled={!neighbor(card.column, 1)}
                            onClick={() => moveCard(card, 1)}
                            type="button"
                            variant="outline"
                          >
                            {t('kanban.moveForward', { name: card.title })}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  ))
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </section>
  )
}
