document.querySelectorAll('[data-curriculum]').forEach(plan => {
  plan.querySelectorAll('a[href^="#module-"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = plan.querySelector(link.getAttribute('href'))
      if (target) target.open = true
    })
  })
  plan.querySelectorAll('[data-expand-modules]').forEach(button => {
    button.addEventListener('click', () => {
      const open = button.dataset.expandModules === 'true'
      plan.querySelectorAll('details.module').forEach(module => { module.open = open })
    })
  })
})
