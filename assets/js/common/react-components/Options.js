const Options = (props) => {
  if (props.values.length !== props.descriptions.length) {
    return null;
  } else {
    const array = [...Array(props.values.length).keys()];

    return array.map((index) => {
      return (
        <option key={props.values[index]} value={props.values[index]}>
          {props.descriptions[index]}
        </option>
      );
    });
  }
};

export default Options;
