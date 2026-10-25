document.querySelectorAll('[data-quiz]').forEach(quiz => {
  const feedback = quiz.querySelector('.quiz-feedback');
  quiz.querySelectorAll('.choices button').forEach(button => {
    button.addEventListener('click', () => {
      quiz.querySelectorAll('.choices button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      const correct = button.dataset.correct === 'true';
      feedback.dataset.result = correct ? 'correct' : 'incorrect';
      feedback.textContent = `${correct ? 'Correct.' : 'Try again.'} ${button.dataset.feedback}`;
    });
  });
});

const courseButtons = [...document.querySelectorAll('[data-open-lesson]')];
function showLesson(id, moveFocus = false) {
  const panels = [...document.querySelectorAll('[data-course-panel]')];
  if (!panels.some(panel => panel.id === id)) return;
  panels.forEach(panel => { panel.hidden = panel.id !== id; });
  courseButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.openLesson === id)));
  document.querySelectorAll('[data-lesson-select]').forEach(select => { select.value = id; });
  if (moveFocus) {
    const heading = document.querySelector(`#${id} h1`);
    heading?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}
courseButtons.forEach(button => button.addEventListener('click', () => showLesson(button.dataset.openLesson, true)));
document.querySelectorAll('[data-lesson-select]').forEach(select => select.addEventListener('change', () => showLesson(select.value, true)));
document.querySelectorAll('[data-inline-lesson]').forEach(link => link.addEventListener('click', event => {
  if (document.querySelector(`[data-course-panel][id="${link.dataset.inlineLesson}"]`)) {
    event.preventDefault();
    showLesson(link.dataset.inlineLesson, true);
  }
}));
if (courseButtons.length) showLesson(document.body.dataset.initialLesson || courseButtons[0].dataset.openLesson);
