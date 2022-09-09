import { MutableRefObject, useEffect, useState } from "react";

function useFocus(ref: MutableRefObject<any>) {
  const [focus, setFocus] = useState(false)
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        setFocus(false)
      }
      if (ref.current && ref.current.contains(event.target)) {
        setFocus(true)
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