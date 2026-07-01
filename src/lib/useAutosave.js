import { useCallback, useEffect, useRef, useState } from "react";

// Debounced auto-save for a serializable value (e.g. a settings draft).
//
// - Waits `delay` ms after the last change, then calls `save(value)` once.
// - Skips no-ops by comparing a JSON snapshot to the last saved one, so a
//   server re-seed or a focus blur never triggers a redundant save.
// - Treats the first "ready" value as the baseline (no save on mount).
// - Coalesces bursts into a single call and never overlaps requests; edits made
//   while a save is in flight are saved once it resolves.
// - Flushes any pending save on unmount and on page hide/unload.
//
// Returns { status: 'idle'|'saving'|'saved'|'error', error, flush, retry }.
export const useAutosave = (value, { save, delay = 800, enabled = true } = {}) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const savedSnapshotRef = useRef(null); // JSON of the last successfully saved value
  const valueRef = useRef(value);
  const saveRef = useRef(save);
  const timerRef = useRef(null);
  const savingRef = useRef(false);
  const initializedRef = useRef(false);

  valueRef.current = value;
  saveRef.current = save;

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const runSave = useCallback(async () => {
    if (!initializedRef.current || savingRef.current) return;
    const current = valueRef.current;
    const snapshot = JSON.stringify(current);
    if (snapshot === savedSnapshotRef.current) return;

    savingRef.current = true;
    setStatus("saving");
    setError("");
    try {
      await saveRef.current(current);
      savedSnapshotRef.current = snapshot;
      savingRef.current = false;
      // Value changed mid-flight → persist the newer state right away.
      if (JSON.stringify(valueRef.current) !== savedSnapshotRef.current) {
        runSave();
      } else {
        setStatus("saved");
      }
    } catch (err) {
      savingRef.current = false;
      setError(err?.message || "Couldn't save changes");
      setStatus("error");
    }
  }, []);

  const flush = useCallback(() => {
    clearTimer();
    runSave();
  }, [runSave]);

  // Schedule a debounced save whenever the value changes.
  useEffect(() => {
    if (!enabled) return undefined;
    const snapshot = JSON.stringify(value);
    if (!initializedRef.current) {
      initializedRef.current = true;
      savedSnapshotRef.current = snapshot;
      return undefined;
    }
    if (snapshot === savedSnapshotRef.current) return undefined;
    clearTimer();
    timerRef.current = setTimeout(runSave, delay);
    return clearTimer;
  }, [value, enabled, delay, runSave]);

  // Persist pending changes when leaving the page or unmounting.
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("beforeunload", onHide);
    return () => {
      window.removeEventListener("beforeunload", onHide);
      flush();
    };
  }, [flush]);

  return { status, error, flush, retry: flush };
};

export default useAutosave;
