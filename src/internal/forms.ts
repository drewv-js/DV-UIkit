export function submitForm(host: HTMLElement): void {
  const formId = host.getAttribute('form');

  if (formId) {
    const target = host.ownerDocument?.getElementById(formId);
    if (target instanceof HTMLFormElement) {
      target.requestSubmit();
    }
    return;
  }

  const nearest = host.closest('form');
  if (nearest instanceof HTMLFormElement) {
    nearest.requestSubmit();
  }
}
