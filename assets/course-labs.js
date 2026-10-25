document.querySelectorAll('[data-case-study]').forEach(lab => {
  const buttons = [...lab.querySelectorAll('[data-case-select]')];
  const cases = [...lab.querySelectorAll('[data-case-item]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.caseSelect);
    cases.forEach((item, i) => { item.hidden = i !== index; });
    buttons.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
  }));
});

document.querySelectorAll('[data-utxo-lab]').forEach(lab => {
  const payment = lab.querySelector('[data-utxo-payment]');
  const change = lab.querySelector('[data-utxo-change]');
  const output = lab.querySelector('[data-utxo-result]');
  const update = () => {
    const values = [payment.valueAsNumber, change.valueAsNumber];
    const fee = 12000 - values[0] - values[1];
    const valid = values.every(value => Number.isSafeInteger(value) && value >= 0) && fee >= 0;
    output.dataset.result = valid ? 'correct' : 'incorrect';
    output.textContent = valid ? `Bitcoin fee: ${fee.toLocaleString('en-US')} sats. This arithmetic balances; actual spending also needs authorization and the other Bitcoin checks.` : 'These outputs are invalid for this example. Use nonnegative whole-satoshi amounts with a combined total no greater than 12,000.';
  };
  [payment, change].forEach(input => input.addEventListener('input', update));
  update();
});

document.querySelectorAll('[data-merkle-lab]').forEach(lab => {
  let count = 2;
  const letters = ['A', 'B', 'C', 'D'];
  const selection = lab.querySelector('select');
  const append = lab.querySelector('[data-merkle-append]');
  const hash = (a, b) => `H(${a},${b})`;
  const update = () => {
    const leaves = letters.map((label, i) => i < count ? label : '∅');
    const index = Number(selection.value);
    const left = hash(leaves[0], leaves[1]);
    const right = hash(leaves[2], leaves[3]);
    lab.querySelector('[data-merkle-root]').textContent = hash(left, right);
    lab.querySelector('[data-merkle-left]').textContent = left;
    lab.querySelector('[data-merkle-right]').textContent = right;
    lab.querySelectorAll('[data-merkle-leaf]').forEach((node, i) => {
      node.textContent = leaves[i];
      node.classList.toggle('empty', i >= count);
      node.classList.toggle('selected', i === index);
    });
    [...selection.options].forEach((option, i) => { option.disabled = i >= count; });
    lab.querySelector('[data-merkle-path]').textContent = `For ${leaves[index]} at position ${index}: sibling ${leaves[index ^ 1]}, then sibling subtree ${index < 2 ? right : left}. The position tells us which side each sibling belongs on.`;
    append.disabled = count === 4;
    append.textContent = count === 4 ? 'Four positions filled' : `Append leaf ${letters[count]}`;
  };
  append.addEventListener('click', () => { if (count < 4) count++; update(); });
  selection.addEventListener('change', update);
  lab.querySelector('[data-merkle-reset]').addEventListener('click', () => { count = 2; selection.value = 1; update(); });
  update();
});

document.querySelectorAll('[data-sequence-lab]').forEach(lab => {
  const data = JSON.parse(lab.querySelector('[data-sequence-data]').textContent);
  const buttons = [...lab.querySelectorAll('[data-sequence-step]')];
  let next = 0;
  const output = lab.querySelector('[data-sequence-result]');
  const list = lab.querySelector('[data-sequence-progress]');
  buttons.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.sequenceStep);
    if (index !== next) {
      output.dataset.result = 'incorrect';
      output.textContent = `First: ${data[next][0]}. ${data[next][1]}`;
      return;
    }
    const item = document.createElement('li');
    item.textContent = `${data[index][0]} — ${data[index][1]}`;
    list.append(item);
    button.disabled = true;
    next++;
    output.dataset.result = 'correct';
    output.textContent = next === data.length ? 'The sequence is complete. Now explain why making the proof before fixing the body would fail.' : `${next} of ${data.length} steps placed. Choose what must happen next.`;
  }));
  lab.querySelector('[data-sequence-reset]').addEventListener('click', () => {
    next = 0;
    list.replaceChildren();
    buttons.forEach(button => { button.disabled = false; });
    output.removeAttribute('data-result');
    output.textContent = 'Choose the first step, then continue in order.';
  });
});

document.querySelectorAll('[data-replay-lab]').forEach(lab => {
  const events = [
    { block: 101, nf: 'nf_A', outputs: 2, proof: true, label: 'A valid transfer spends initial note A and creates two outputs.' },
    { block: 101, nf: 'nf_A', outputs: 2, proof: true, label: 'A second envelope tries to spend A again.' },
    { block: 101, nf: 'nf_B', outputs: 2, proof: false, label: 'An envelope proposes nf_B but has an invalid proof.' },
    { block: 102, nf: 'nf_B', outputs: 1, proof: true, label: 'A valid transfer spends initial note B and creates one output.' },
    { block: 103, empty: true, label: 'Block 103 has no candidate envelopes.' },
  ];
  const fresh = () => ({ leaves: 2, nullifiers: new Set(), roots: {100: 'root_2'}, accepted: 0 });
  let states = [fresh(), fresh()];
  let next = 0;
  const button = lab.querySelector('[data-replay-next]');
  const output = lab.querySelector('[data-replay-result]');
  const draw = () => {
    lab.querySelectorAll('[data-replay-state]').forEach((panel, i) => {
      const state = states[i];
      panel.querySelector('[data-replay-leaves]').textContent = `${state.leaves} leaves`;
      panel.querySelector('[data-replay-nullifiers]').textContent = [...state.nullifiers].join(', ') || 'none';
      panel.querySelector('[data-replay-roots]').textContent = Object.entries(state.roots).map(([height, root]) => `${height}: ${root}`).join(' · ');
      panel.querySelector('[data-replay-history]').textContent = `${state.accepted} accepted transfers`;
    });
    button.disabled = next === events.length;
    button.textContent = next === events.length ? 'Replay complete' : `Process event ${next + 1} of ${events.length}`;
  };
  button.addEventListener('click', () => {
    if (next >= events.length) return;
    const event = events[next];
    const duplicate = !event.empty && states[0].nullifiers.has(event.nf);
    const accepted = !event.empty && !duplicate && event.proof;
    states.forEach(state => {
      if (!event.empty && !state.nullifiers.has(event.nf) && event.proof) {
        state.leaves += event.outputs;
        state.nullifiers.add(event.nf);
        state.accepted++;
      }
      if (!events[next + 1] || events[next + 1].block !== event.block) state.roots[event.block] = `root_${state.leaves}`;
    });
    output.dataset.result = event.empty || accepted ? 'correct' : 'incorrect';
    output.textContent = `Block ${event.block}: ${event.label} ${event.empty ? 'The previous root carries forward.' : accepted ? 'Accepted: append outputs and record the nullifier.' : duplicate ? 'Rejected by the nullifier check. State is unchanged.' : 'Rejected by proof verification. State is unchanged.'}`;
    next++;
    draw();
  });
  lab.querySelector('[data-replay-reset]').addEventListener('click', () => {
    states = [fresh(), fresh()]; next = 0;
    output.removeAttribute('data-result');
    output.textContent = 'Both indexers start with two leaves and no accepted spends. Predict the next state before advancing.';
    draw();
  });
  draw();
});

document.querySelectorAll('[data-anchor-lab]').forEach(lab => {
  const height = lab.querySelector('[data-anchor-height]');
  const anchor = lab.querySelector('[data-anchor-value]');
  const removed = lab.querySelector('[data-anchor-removed]');
  const output = lab.querySelector('[data-anchor-result]');
  const update = () => {
    const H = height.valueAsNumber;
    const h = anchor.valueAsNumber;
    if (![H,h].every(Number.isSafeInteger) || H < 100 || h < 0) {
      output.dataset.result = 'incorrect';
      output.textContent = 'Use whole block heights, with inclusion height at least 100 and a nonnegative anchor.';
      return;
    }
    const allowed = h >= H - 100 && h <= H - 1;
    output.dataset.result = allowed && !removed.checked ? 'correct' : 'incorrect';
    const reason = !allowed ? h >= H ? 'The anchor is too new.' : 'The anchor has expired.' : removed.checked ? 'The height is allowed, but the old proof is tied to a root no longer at that height on the active branch. Synchronize and rebuild.' : 'The height is allowed. The proof, root membership and current nullifier checks must still pass.';
    output.textContent = `Allowed heights: ${H - 100} through ${H - 1}, inclusive. ${reason}`;
  };
  [height, anchor, removed].forEach(input => input.addEventListener('input', update));
  lab.querySelector('[data-anchor-advance]').addEventListener('click', () => { height.value = height.valueAsNumber + 1; update(); });
  update();
});

document.querySelectorAll('[data-envelope-lab]').forEach(lab => {
  const n = lab.querySelector('[data-envelope-inputs]');
  const m = lab.querySelector('[data-envelope-outputs]');
  const output = lab.querySelector('[data-envelope-size]');
  const update = () => {
    const N = Number(n.value), M = Number(m.value);
    const fields = [12, 32*N, 32*M, 67*M, 64*M+16, 192];
    lab.querySelectorAll('[data-envelope-field]').forEach((cell, i) => { cell.textContent = `${fields[i]} B`; });
    output.textContent = `${fields.reduce((sum, value) => sum + value, 0)} bytes`;
  };
  [n,m].forEach(input => input.addEventListener('change', update));
  update();
});

document.querySelectorAll('[data-rehearsal-lab]').forEach(lab => {
  const prompts = JSON.parse(lab.querySelector('[data-rehearsal-data]').textContent);
  const select = lab.querySelector('select');
  const draft = lab.querySelector('textarea');
  const drafts = new Map();
  let current = 0;
  const answer = lab.querySelector('[data-rehearsal-answer]');
  const reveal = lab.querySelector('[data-rehearsal-reveal]');
  const checks = [...lab.querySelectorAll('input[type="checkbox"]')];
  select.addEventListener('change', () => {
    drafts.set(current, draft.value);
    current = Number(select.value);
    lab.querySelector('[data-rehearsal-prompt]').textContent = prompts[current][0];
    draft.value = drafts.get(current) || '';
    answer.hidden = true;
    reveal.setAttribute('aria-expanded', 'false');
    checks.forEach(check => { check.checked = false; });
  });
  reveal.addEventListener('click', () => {
    answer.textContent = prompts[current][1];
    answer.hidden = !answer.hidden;
    reveal.setAttribute('aria-expanded', String(!answer.hidden));
  });
});
