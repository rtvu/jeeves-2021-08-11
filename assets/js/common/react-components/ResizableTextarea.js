import { useEffect, useRef } from "react";

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

function updateHeight(element) {
  element.style.height = "auto";
  element.style.height = element.scrollHeight + "px";
}

function onVisible(entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    const height = entry.target.style.height;

    if (height === "0px") {
      updateHeight(entry.target);
    }
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
    updateHeight(ref.current);
  }, [ref, props.value]);

  const onChange = (event) => {
    updateHeight(event.target);
    parentOnChange(event);
  };

  return <textarea {...props} ref={ref} style={style} onChange={onChange}></textarea>;
};

export default ResizableTextarea;
