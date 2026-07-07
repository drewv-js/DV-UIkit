const definitions = [
  ['dv-button', () => import('./components/button/dv-button')],
  ['dv-card', () => import('./components/card/dv-card')]
] as const;

export async function defineAllComponents(): Promise<void> {
  for (const [tagName, loader] of definitions) {
    if (!customElements.get(tagName)) {
      await loader();
    }
  }
}
