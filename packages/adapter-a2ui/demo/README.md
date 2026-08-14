# A2UI form-submit demo

This demo shows the smallest A2UI → Chameleon UI mapping: a form with one text field and a submit button.

- `form-submit.a2ui.json` is the protocol document.
- `FormSubmit.vue` renders it with `@chameleon-ui/components-vue`.
- The adapter maps `form` → `form`, `text-field` → `input`, and `button` → `button`.
