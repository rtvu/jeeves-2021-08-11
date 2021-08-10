import { useEffect, useRef } from "react";

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

function updateHeight(element) {
  if (element.scrollHeight > 0) {
    let height = parseInt(element.style.height);

    if (element.scrollHeight > height) {
      element.style.height = element.scrollHeight + "px";
    } else {
      while (height > element.scrollHeight) {
        element.style.height = element.scrollHeight - 1 + "px";
        height = parseInt(element.style.height);
      }
    }
  }
}

function onVisible(entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    updateHeight(entry.target);
  }
}

const ResizableTextarea = (props) => {
  const ref = useRef(null);
  const parentOnChange = props.onChange;
  const style = Object.assign({}, props.style, { overflowY: "hidden" });

  useEffect(() => {
    const observer = new IntersectionObserver(onVisible, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  useEffect(() => {
    ref.current.style.height = "0px";
  }, [ref]);

  useEffect(() => {
    const resizeHandler = () => {
      updateHeight(ref.current);
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [ref]);

  useEffect(() => {
    updateHeight(ref.current);
  }, [ref, props.value]);

  const onChange = (event) => {
    updateHeight(event.target);
    parentOnChange(event);
  };

  return <textarea {...props} ref={ref} style={style} onChange={onChange}></textarea>;
};

export default ResizableTextarea;
