//Contains the negative itemms
var negativeItems = []
let removeBs = document.querySelectorAll('.remove-btn')
for (let btn of removeBs) btn.addEventListener('click', removeRow)
let credit_form = document.querySelector('#credit-form')
let btn_submit = document.querySelector('#btn-submit')
let addB = document.querySelector('#add-btn')
addB.addEventListener('click', () => {
  console.log('adding')

  const newCredit_form = credit_form
    .querySelector('.negativeItem-row')
    .cloneNode(true)
  newCredit_form.classList.remove('d-none')
  const removeBtnWraper = newCredit_form.querySelector('.remove-btn-wraper')
  const removeBtn = document.createElement('button')
  removeBtn.className =
    'remove-btn form-control form-control-sm btn btn-sm btn-default'
  const btnAttr = document.createAttribute('type')
  btnAttr.value = 'button'
  removeBtn.setAttributeNode(btnAttr)
  const btnText = document.createElement('i')
  btnText.className = 'fas fa-times'
  btnText.style = 'pointer-events: none;'
  removeBtn.append(btnText)
  removeBtn.addEventListener('click', removeRow)
  removeBtnWraper.appendChild(removeBtn)
  credit_form.insertBefore(newCredit_form, btn_submit)
})

credit_form.addEventListener('submit', (event) => {
  event.preventDefault()

  //Fetching all fields from
  var allNegativeItemRows = document.querySelectorAll('.negativeItem-row')

  for (let row of allNegativeItemRows) {
    if (!row.classList.contains('d-none')) {
      let name = row.querySelector('.negativeItem-name').value
      let category = row.querySelector('.negativeItem-category').value
      let transunion = row.querySelector('.negativeItem-transunion').checked
      let equifax = row.querySelector('.negativeItem-equifax').checked
      let experian = row.querySelector('.negativeItem-experian').checked
      console.log({ name, category, transunion, equifax, experian })
      if (name)
        negativeItems.push({
          name,
          category,
          transunion,
          equifax,
          experian,
        })
    }
  }

  let dateAddedOnProfile = document.querySelector('#dateAddedOnProfile').value
  let score_transunion = document.querySelector('#scores-transunion').value
  let score_equifax = document.querySelector('#scores-equifax').value
  let score_experian = document.querySelector('#scores-experian').value

  let scores = {
    transunion: score_transunion,
    equifax: score_equifax,
    experian: score_experian,
  }
  // Adding the data to the body
  var postData = $(this).serializeArray()
  postData.push({
    name: 'negativeItems',
    value: JSON.stringify(negativeItems),
  })
  postData.push({
    name: 'scores',
    value: JSON.stringify(scores),
  })
  postData.push({
    name: 'dateAddedOnProfile',
    value: dateAddedOnProfile,
  })

  const url = credit_form.getAttribute('action')
  //credit_form.post(url, postData)
  //sending the data to the server
  //url = $(this).attr('action')
  $.post(
    url,
    postData,
    (resp) => (window.location.href = customerPath)
  )
})

function removeRow(e) {
  const clicker = e.target
  const clickerParent = clicker.parentElement
  const grandpa = clickerParent.parentElement
  const row = grandpa.parentElement.parentElement
  row.remove()
  //$(this).parent().remove()
}
