import { MutableRefObject, useEffect, useState } from "react";

function useFocus(ref: MutableRefObject<any>) {
  const [focus, setFocus] = useState({ state: false, detail: 0 })
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setFocus({ state: false, detail: event.detail })
      }
      if (ref.current && ref.current.contains(event.target)) {
        setFocus({ state: true, detail: event.detail })
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref]);

  return focus
}

export default useFocus