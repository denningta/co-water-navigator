import { useEffect, useState } from "react";

function useKeyPress(targetKey?: string | undefined) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState<{ 
    key: string | undefined, pressed: boolean, event: KeyboardEvent | undefined 
  }>(
    {key: targetKey ?? undefined, pressed: false, event: undefined}
  );
  // If pressed key is our target key then set to true
  function downHandler(event: KeyboardEvent) {
    if (targetKey === undefined || event.key === targetKey) {
      setKeyPressed({ key: event.key, pressed: true, event: event });
    }
  }
  // If released key is our target key then set to false
  const upHandler = (event: KeyboardEvent) => {
    if (targetKey === undefined || event.key === targetKey) {
      setKeyPressed({ key: event.key, pressed: false, event: event });
    }
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed
}

export default useKeyPress