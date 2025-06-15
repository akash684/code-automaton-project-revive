
# Design System & Theme Tokens

## Tokens
Color & spacing tokens are defined in `src/index.css` via CSS variables in the `@layer base { :root {...} }` section.

- Use Tailwind utility classes like `bg-background`, `border`, `text-foreground`, etc.
- All shadcn/ui primitives are mapped in `tailwind.config.ts` via:  
  `background: "hsl(var(--background))"`  
  `border: "hsl(var(--border))"`  
  `primary: { DEFAULT: "hsl(var(--primary))", ... }`, etc.

## Usage Examples

```tsx
<div className="bg-background border rounded-2xl shadow-md p-6">
  <h2 className="text-primary font-heading text-2xl">Title</h2>
</div>
<Button variant="destructive" className="bg-accent text-accent-foreground">Call to action</Button>
```

## Guidelines

- Never use `@apply border-border`. Instead use `border` (uses themed border color).
- To customize, update the CSS variables in your `@layer base` block.
- For custom branding (e.g. `bg-secondary`), extend `tailwind.config.ts`.

## References
- [shadcn/ui Theming Guide](https://ui.shadcn.com/docs/theming/tokens)
- [Tailwind Customization](https://tailwindcss.com/docs/theme)
