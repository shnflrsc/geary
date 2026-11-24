/**
 * Binds `/` and `Ctrl/Cmd+K` global shortcuts to activate a page's primary search input,
 * ignoring keystrokes when focus is already inside an editable control.
 */
export function bindSearchShortcut(onActivate: () => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const isEditable =
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable);

    const isSlash =
      event.key === '/' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !isEditable;
    const isModK =
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'k' &&
      !isEditable;

    if (isSlash || isModK) {
      event.preventDefault();
      onActivate();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}
