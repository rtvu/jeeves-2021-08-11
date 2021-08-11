import { useState } from "react";

function useOnChange(callback, value) {
  const [reference, setReference] = useState(null);

  if (reference !== value) {
    setReference(value);

    callback();
  }
}

export { useOnChange };
