function getActions() {
  return { left: "ArrowLeft", right: "ArrowRight" };
}

function getStates() {
  return { carriage: "carriage", colorset: "colorset", maskset: "maskset" };
}

function getDefaultState() {
  return "carriage";
}

const states = getStates();
const actions = getActions();

function transition(state, action) {
  if (state === states.carriage && action === actions.right) {
    return states.maskset;
  }

  if (state === states.maskset && action === actions.right) {
    return states.colorset;
  }

  if (state === states.maskset && action === actions.left) {
    return states.carriage;
  }

  if (state === states.colorset && action === actions.left) {
    return states.maskset;
  }

  return state;
}

export { getActions, getStates, getDefaultState, transition };
