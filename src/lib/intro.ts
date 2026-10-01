/**
 * Estado global mínimo da abertura cinematográfica. O Hero espera este sinal
 * para iniciar sua coreografia; se a intro for pulada, o sinal é imediato.
 */
type Listener = () => void;

let done = false;
const listeners = new Set<Listener>();

export const INTRO_STORAGE_KEY = "msatech:intro-seen";

export function completeIntro() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntroComplete(fn: Listener) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
