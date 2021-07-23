function prettyPrint(label, data) {
  return (
    <div>
      {label}:&nbsp;<pre>{JSON.stringify(data, undefined, 2)}</pre>
    </div>
  );
}

export { prettyPrint };
