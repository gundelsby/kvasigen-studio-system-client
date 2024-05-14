export { defaultFloat4Item };

function defaultFloat4Item(item) {
  const { name } = item;

  const el = document.createElement('div');
  el.appendChild(createLabeledFloatInput('f4_val1', name));
  el.appendChild(createLabeledFloatInput('f4_val2', name));
  el.appendChild(createLabeledFloatInput('f4_val3', name));
  el.appendChild(createLabeledFloatInput('f4_val4', name));
}

function createLabeledFloatInput(name, labelText) {
  const container = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  label.appendChild(createFloatInput(name));

  container.appendChild(label);
}

function createFloatInput(name) {
  const input = document.createElement('input');
  input.type = 'number';
  input.setAttribute('name', name);
  input.setAttribute('min', '-1');
  input.setAttribute('max', '1');
  input.setAttribute('step', '0.01');
}
