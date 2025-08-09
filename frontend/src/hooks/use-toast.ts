import * as React from "react";

interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  open?: boolean;
}

interface State {
  toasts: ToastProps[];
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function dispatch(action: {
  type: string;
  toast?: ToastProps;
  toastId?: string;
}) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = {
        ...memoryState,
        toasts: [action.toast!, ...memoryState.toasts].slice(0, 1),
      };
      break;
    case "DISMISS_TOAST":
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.filter((t) => t.id !== action.toastId),
      };
      break;
  }

  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({
  title,
  description,
  variant = "default",
}: Omit<ToastProps, "id">) {
  const id = genId();

  dispatch({
    type: "ADD_TOAST",
    toast: { id, title, description, variant, open: true },
  });

  // Auto dismiss after 3 seconds
  setTimeout(() => {
    dispatch({ type: "DISMISS_TOAST", toastId: id });
  }, 3000);

  return { id };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
