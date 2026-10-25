document.querySelectorAll('[data-note-lab]').forEach(lab => {
  const scenarios = {
    first: { nf: 'nf_A', before: '∅', leaves: 3, accept: true, explanation: 'nf_A is new and the proof verifies. Replay adds nf_A and appends two output leaves. The input leaf remains.' },
    repeat: { nf: 'nf_A', before: '{ nf_A }', leaves: 5, accept: false, explanation: 'Replay finds nf_A already in its accepted set and rejects before proof verification. Even a valid proof of membership cannot make the note unspent again.' },
    forged: { nf: 'nf_X', before: '{ nf_A }', leaves: 5, accept: false, explanation: 'nf_X is new, but a proof claiming it belongs to this same input cannot satisfy the nullifier derivation constraints. Replay rejects. This assumes the proof system and setup are secure.' }
  };
  const select = lab.querySelector('select');
  const output = lab.querySelector('[data-note-output]');
  const reset = () => {
    const scenario = scenarios[select.value];
    lab.querySelector('[data-note-before]').textContent = `Tree: ${scenario.leaves} leaves · Nullifier set: ${scenario.before}`;
    lab.querySelector('[data-note-marker]').textContent = scenario.nf;
    output.textContent = 'Predict the replay result.';
    output.removeAttribute('data-result');
  };
  select.addEventListener('change', reset);
  lab.querySelectorAll('[data-predict]').forEach(button => button.addEventListener('click', () => {
    const scenario = scenarios[select.value];
    const right = (button.dataset.predict === 'accept') === scenario.accept;
    output.dataset.result = right ? 'correct' : 'incorrect';
    output.textContent = `${right ? 'Correct' : 'Not quite'} — ${scenario.accept ? 'accepted' : 'rejected'}. ${scenario.explanation} After: ${scenario.leaves + (scenario.accept ? 2 : 0)} leaves; nullifier set { nf_A }.`;
  }));
  reset();
});

document.querySelectorAll('[data-tree-lab]').forEach(lab => {
  const frames = [
    { height: 100, leaves: 3, nfs: [], root: 'root_A', event: 'Starting checkpoint: three earlier accepted outputs. Both indexers begin with the same state and profile.', roots: [[100, 'root_A']], history: 'Prior accepted history' },
    { height: 101, leaves: 5, nfs: ['nf_A'], root: 'root_B', event: 'One accepted 1→2 transfer: append ℓ3 and ℓ4; insert nf_A. No earlier leaf is removed. Save the root after the block.', roots: [[100, 'root_A'], [101, 'root_B']], history: 'Prior history + transfer A' },
    { height: 102, leaves: 5, nfs: ['nf_A'], root: 'root_B', event: 'A confirmed carrier repeats nf_A. Replay rejects its envelope. No outputs are appended; the unchanged root is recorded for block 102.', roots: [[100, 'root_A'], [101, 'root_B'], [102, 'root_B']], history: 'Prior history + transfer A' },
    { height: 103, leaves: 7, nfs: ['nf_A', 'nf_B'], root: 'root_C', event: 'Another accepted 1→2 transfer: append ℓ5 and ℓ6; insert nf_B. Its input already existed under an eligible earlier root.', roots: [[100, 'root_A'], [101, 'root_B'], [102, 'root_B'], [103, 'root_C']], history: 'Prior history + transfers A, B' }
  ];
  let step = 0;
  const svg = frame => {
    const xs = Array.from({ length: 8 }, (_, i) => 31 + i * 73);
    let markup = '<svg class="tree-svg" viewBox="0 0 574 160" role="img" aria-label="Eight-slot teaching tree with ' + frame.leaves + ' occupied leaves"><text x="287" y="18" text-anchor="middle">' + frame.root + '</text>';
    for (let depth = 0; depth < 3; depth++) {
      const groups = 2 ** depth;
      for (let i = 0; i < groups; i++) {
        const width = 584 / groups;
        const x = -5 + width * (i + .5);
        const y = 26 + depth * 37;
        markup += `<line x1="${x}" y1="${y}" x2="${x - width / 4}" y2="${y + 31}"/><line x1="${x}" y1="${y}" x2="${x + width / 4}" y2="${y + 31}"/>`;
      }
    }
    xs.forEach((x, i) => { markup += `<g class="${i < frame.leaves ? '' : 'empty'}"><rect x="${x - 22}" y="134" width="44" height="24"/><text x="${x}" y="150" text-anchor="middle">${i < frame.leaves ? 'ℓ' + i : '·'}</text></g>`; });
    return markup + '</svg>';
  };
  const render = () => {
    const frame = frames[step];
    lab.querySelector('[data-block]').textContent = `After block ${frame.height}`;
    lab.querySelector('[data-tree-event]').textContent = frame.event;
    lab.querySelector('[data-tree-visual]').innerHTML = svg(frame);
    lab.querySelector('[data-nullifiers]').textContent = frame.nfs.length ? `{ ${frame.nfs.join(', ')} }` : '∅';
    lab.querySelector('[data-history]').textContent = frame.history;
    lab.querySelectorAll('[data-indexer-state]').forEach(element => { element.textContent = `${frame.leaves} leaves · ${frame.root} · ${frame.nfs.length} nullifiers`; });
    lab.querySelector('[data-roots]').innerHTML = frame.roots.map(([height, root]) => `<tr><td>${height}</td><td><code>${root}</code></td></tr>`).join('');
    lab.querySelector('[data-prev]').disabled = step === 0;
    lab.querySelector('[data-next]').disabled = step === frames.length - 1;
  };
  lab.querySelector('[data-next]').addEventListener('click', () => { step = Math.min(step + 1, frames.length - 1); render(); });
  lab.querySelector('[data-prev]').addEventListener('click', () => { step = Math.max(step - 1, 0); render(); });
  lab.querySelector('[data-reset]').addEventListener('click', () => { step = 0; render(); });
  render();
});

document.querySelectorAll('[data-we-lab]').forEach(lab => {
  lab.querySelector('button').addEventListener('click', () => {
    const values = [...lab.querySelectorAll('input')].map(input => Number(input.value));
    const valid = values.every(value => Number.isInteger(value) && value > 1) && values[0] * values[1] === 77;
    const output = lab.querySelector('[data-we-output]');
    output.dataset.result = valid ? 'accepted' : 'rejected';
    output.textContent = valid ? 'Valid witness: the conceptual WE decryptor returns the demo signing key. A holder can then make an ordinary Schnorr signature. Bitcoin checks that signature.' : 'Invalid witness: this pair fails the stated condition. The conceptual decryptor does not release the demo signing key.';
  });
});

document.querySelectorAll('[data-size-lab]').forEach(lab => {
  const input = lab.querySelector('input');
  const update = () => {
    const factor = Number(input.value) / 100;
    const ratio = factor * ((2 * 14371 * factor + 1) / (2 * 14371 + 1)) ** 2;
    lab.querySelector('[data-retained]').textContent = `${input.value}%`;
    lab.querySelector('[data-size]').textContent = `${(338 * ratio).toFixed(1)} TB`;
    lab.querySelector('[data-ratio]').textContent = `${(ratio * 100).toFixed(1)}% of the modeled baseline`;
    lab.querySelector('.bar').style.width = `${ratio * 100}%`;
  };
  input.addEventListener('input', update);
  update();
});
