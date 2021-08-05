function init(e) {
  e.classList.add('ali')
  $(e).select2()
}

function uuidv4() {
  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

let numRows = 0
const btn_submit = document.querySelector('#btn-submit')
negItem_form = document.querySelector('#negItem-form')

function watchLastRow() {
  const rm_btns = document.querySelectorAll('.rm-btn')

  for (let rm_btn of rm_btns) {
    rm_btn.addEventListener('click', removeRow)
  }

  const allNegRows = document.querySelectorAll('.row-negative')
  numRows = allNegRows.length
  for (let r of allNegRows) {
    if (!r.classList.contains('d-none')) {
      const t = r.querySelector('.select2')
      if (!t.classList.contains('ali')) init(t)
    }
  }

  const lastRowCreditName = allNegRows[allNegRows.length - 1].querySelector(
    '.credit-name'
  )

  lastRowCreditName.addEventListener('change', createNewRow)
}

function createNewRow(e, withRmBtn = true) {
  console.log('Called')

  const fstNegRow = document.querySelector('.row-negative').cloneNode(true)
  fstNegRow.classList.remove('d-none')
  if (withRmBtn) fstNegRow.querySelector('.rm-btn').classList.remove('d-none')
  const credit_name = fstNegRow.querySelector('.credit-name')
  const credit_type = fstNegRow.querySelector('.credit-type')
  const credit_bureaus = fstNegRow.querySelector('.credit-bureaus')

  var prefix = 'credit_' + numRows + uuidv4() + '['
  var suffix = ']'
  const nameAttr = document.createAttribute('name')
  const typeAttr = document.createAttribute('name')
  const bAttr = document.createAttribute('name')

  nameAttr.value = prefix + 'name' + suffix
  typeAttr.value = prefix + 'category' + suffix
  bAttr.value = prefix + 'bureaus' + suffix
  credit_name.setAttributeNode(nameAttr)
  credit_type.setAttributeNode(typeAttr)
  credit_bureaus.setAttributeNode(bAttr)

  negItem_form.insertBefore(fstNegRow, btn_submit)

  watchLastRow()
}
function removeRow(e) {
  const clicker = e.target
  const clickerParent = clicker.parentElement
  const grandpa = clickerParent.parentElement
  const row = grandpa.parentElement
  row.remove()
  watchLastRow()
}

createNewRow(null, false)
