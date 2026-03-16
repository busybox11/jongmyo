import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

const pathnameAtom = atom(
  typeof window !== "undefined" ? window.location.pathname : "/",
);

export function RouterSync() {
  const setPath = useSetAtom(pathnameAtom);
  useEffect(() => {
    setPath(window.location.pathname);
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setPath]);
  return null;
}

export function useRouter() {
  const path = useAtomValue(pathnameAtom);
  const setPath = useSetAtom(pathnameAtom);

  return {
    path,
    push(href: string) {
      window.history.pushState(null, "", href);
      setPath(href);
    },
    replace(href: string) {
      window.history.replaceState(null, "", href);
      setPath(href);
    },
    goBack() {
      window.history.back();
    },
  };
}
