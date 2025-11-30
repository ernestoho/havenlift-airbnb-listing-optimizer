/**
 * Lightweight local replacement for react-intersection-observer.
 * Keeps implementation intentionally small and dependency-free to avoid multiple React copies / invalid hook warnings.
 */
import * as React from "react";
export interface UseInViewOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
  initialInView?: boolean;
  fallbackInView?: boolean;
  onChange?: (inView: boolean, entry?: IntersectionObserverEntry) => void;
  delay?: number;
  trackVisibility?: boolean;
}
/**
 * useInView
 *
 * @param options configuration for the observer
 * @returns [setRef, inView, entry] with attached properties .ref, .inView, .entry
 *
 * Notes:
 * - Uses React.useState to manage the element ref and the inView state.
 * - Uses native IntersectionObserver where available.
 * - If IntersectionObserver is unavailable and fallbackInView is passed, will set that fallback value immediately.
 * - Supports triggerOnce: unobserves after the first intersect.
 * - delay (ms) will debounce state updates from the observer callback.
 */
export function useInView(options?: UseInViewOptions): any {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    triggerOnce = false,
    skip = false,
    initialInView = false,
    fallbackInView,
    onChange,
    delay = 0,
    trackVisibility = false,
  } = options ?? {};
  // The observed element
  const [node, setNode] = React.useState<Element | null>(null);
  // State representing whether the node is in view and the last entry
  const [state, setState] = React.useState<{
    inView: boolean;
    entry?: IntersectionObserverEntry;
  }>({
    inView: !!initialInView,
    entry: undefined,
  });
  // Stable callback ref stored in a ref (per spec requirement)
  const setRef = React.useCallback((el: Element | null) => {
    setNode(el);
  }, []);
  const callbackRef = React.useRef(setRef);
  React.useEffect(() => {
    callbackRef.current = setRef;
  }, [setRef]);
  // Keep a ref to the timeout so we can clear on cleanup
  const timeoutRef = React.useRef<number | undefined>(undefined);
  // stringify threshold for safe dependency comparison
  const thresholdKey = React.useMemo(() => JSON.stringify(threshold), [threshold]);
  React.useEffect(() => {
    if (skip) return;
    if (!node) return;
    if (typeof window === "undefined") return;
    const IO = (window as any).IntersectionObserver;
    if (!IO) {
      // No IntersectionObserver available in this environment
      if (typeof fallbackInView !== "undefined") {
        const value = !!fallbackInView;
        setState({ inView: value, entry: undefined });
        if (onChange) {
          try {
            onChange(value, undefined);
          } catch (e) {
            // swallow onChange errors to avoid breaking app
            // eslint-disable-next-line no-console
            console.error("useInView onChange error:", e);
          }
        }
      }
      return;
    }
    // Build observer options; include trackVisibility/delay only if requested.
    const obsOptions: any = {
      root,
      rootMargin,
      threshold,
    };
    if (trackVisibility) {
      // These are non-standard in some TypeScript DOM lib versions; cast to any.
      obsOptions.trackVisibility = true;
      obsOptions.delay = Math.max(0, delay || 0);
    }
    const observer = new IO((entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;
      // Determine visibility. entry.isIntersecting is the primary indicator.
      const inView = !!entry.isIntersecting || (typeof entry.intersectionRatio === "number" && entry.intersectionRatio > 0);
      const apply = () => {
        setState((prev) => {
          // Avoid unnecessary state updates
          if (prev.inView === inView && prev.entry === entry) return prev;
          return { inView, entry };
        });
        if (onChange) {
          try {
            onChange(inView, entry);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("useInView onChange error:", e);
          }
        }
      };
      if (delay && delay > 0) {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          apply();
          timeoutRef.current = undefined;
        }, delay) as unknown as number;
      } else {
        apply();
      }
      if (triggerOnce && inView) {
        try {
          observer.unobserve(entry.target);
        } catch {
          // ignore
        }
      }
    }, obsOptions);
    try {
      observer.observe(node);
    } catch (e) {
      // Could fail if node is not observable; best effort only.
      // eslint-disable-next-line no-console
      console.error("useInView observer.observe failed:", e);
    }
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      try {
        observer.disconnect();
      } catch {
        // ignore
      }
    };
    // Intentionally include specific option parts rather than the whole options object
    // to avoid re-creating observer on unrelated option object re-creation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, skip, root, rootMargin, thresholdKey, triggerOnce, fallbackInView, onChange, delay, trackVisibility]);
  const result: any = [setRef, state.inView, state.entry];
  // Attach properties like react-intersection-observer does for compatibility
  result.ref = setRef;
  result.inView = state.inView;
  result.entry = state.entry;
  return result;
}