document.querySelectorAll('[data-subset-lab]').forEach(lab => {
  const numbers = [...lab.querySelectorAll('[data-number]')];
  const feedback = lab.querySelector('[data-subset-feedback]');
  const selected = () => numbers.filter(button => button.getAttribute('aria-pressed') === 'true').map(button => Number(button.dataset.number));
  const update = () => {
    const values = selected();
    const sum = values.reduce((total, value) => total + value, 0);
    lab.querySelector('[data-subset-equation]').textContent = `${values.length ? values.join(' + ') : 'No numbers selected'} · sum = ${sum}`;
    feedback.removeAttribute('data-result');
    feedback.textContent = 'Check whether this selection is a witness for the claim.';
  };
  numbers.forEach(button => button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    update();
  }));
  const check = () => {
    const sum = selected().reduce((total, value) => total + value, 0);
    const valid = sum === 31;
    feedback.dataset.result = valid ? 'correct' : 'incorrect';
    feedback.textContent = valid ? 'This is a valid witness: the chosen entries total 31. Anyone shown this selection can check it directly.' : `The total is ${sum}, so this selection does not establish the claim. A failed selection does not prove that no valid selection exists.`;
  };
  lab.querySelector('[data-subset-check]').addEventListener('click', check);
  lab.querySelector('[data-subset-example]').addEventListener('click', () => {
    numbers.forEach(button => button.setAttribute('aria-pressed', String([3, 6, 22].includes(Number(button.dataset.number)))));
    update();
    check();
  });
  lab.querySelector('[data-subset-reset]').addEventListener('click', () => {
    numbers.forEach(button => button.setAttribute('aria-pressed', 'false'));
    update();
  });
});

document.querySelectorAll('[data-growth-lab]').forEach(lab => {
  const slider = lab.querySelector('input');
  const update = () => {
    const n = Number(slider.value);
    lab.querySelector('[data-growth-n]').textContent = n;
    lab.querySelector('[data-growth-choices]').textContent = (2 ** n).toLocaleString('en-US');
    lab.querySelector('[data-growth-checks]').textContent = `≤ ${n}`;
  };
  slider.addEventListener('input', update);
  update();
});

document.querySelectorAll('[data-visibility-lab]').forEach(lab => {
  const variants = {
    reveal: ['Private evidence is sent', 'The indexer receives the notes, secrets, amounts and tree paths, and can check the rules directly. This discloses the very data we wanted to keep private.', 'Direct checking: possible · Witness privacy: lost'],
    assert: ['Only a claim is sent', 'Alice says “this transfer is valid.” Keeping the evidence private is easy, but the assertion gives the indexer no basis to distinguish a valid transfer from an invented one.', 'Validity established: no · Witness disclosed: no'],
    proof: ['Public inputs and a ZK proof are sent', 'The indexer verifies the transfer proof against the public data, under the proof system’s assumptions. It does not receive Alice’s private notes or amounts. It must still perform the other replay checks.', 'Proof constraints checked: yes · Private witness sent: no'],
  };
  const buttons = [...lab.querySelectorAll('[data-visibility]')];
  const show = key => {
    const [heading, description, result] = variants[key];
    const output = lab.querySelector('[data-visibility-output]');
    output.replaceChildren();
    for (const [tag, value, className] of [['h3', heading, 'violet'], ['p', description, ''], ['p', result, 'small']]) {
      const element = document.createElement(tag);
      element.textContent = value;
      element.className = className;
      output.append(element);
    }
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.visibility === key)));
  };
  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.visibility)));
  show('reveal');
});

document.querySelectorAll('[data-constraint-lab]').forEach(lab => {
  const payment = lab.querySelector('#constraint-payment');
  const change = lab.querySelector('#constraint-change');
  const feedback = lab.querySelector('[data-constraint-feedback]');
  const check = () => {
    const amounts = [payment.valueAsNumber, change.valueAsNumber];
    if (!amounts.every(Number.isSafeInteger)) {
      feedback.dataset.result = 'incorrect';
      feedback.textContent = 'Use whole numbers within the safe integer range for this teaching calculation.';
      return;
    }
    const balanced = amounts[0] + amounts[1] === 10000;
    const nonnegative = amounts.every(value => value >= 0);
    feedback.dataset.result = balanced && nonnegative ? 'correct' : 'incorrect';
    feedback.textContent = `Balance: ${balanced ? 'passes' : 'fails'} (${amounts[0].toLocaleString('en-US')} + ${amounts[1].toLocaleString('en-US')} = ${(amounts[0] + amounts[1]).toLocaleString('en-US')}). Nonnegative amounts: ${nonnegative ? 'passes' : 'fails'}. ${balanced && nonnegative ? 'Both amount checks pass; the other transfer rules still need checking.' : balanced ? 'A valid sum alone does not make negative change valid.' : 'Outputs must total exactly 10,000 sats in this example.'}`;
  };
  lab.querySelector('[data-constraint-check]').addEventListener('click', check);
  lab.querySelector('[data-constraint-negative]').addEventListener('click', () => {
    payment.value = 11000;
    change.value = -1000;
    check();
  });
  [payment, change].forEach(input => input.addEventListener('input', () => {
    feedback.removeAttribute('data-result');
    feedback.textContent = 'Values changed. Check the amounts again.';
  }));
});
