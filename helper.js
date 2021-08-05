/**
 * All functions too small to be their own module.
 */
// Dependencies. 
const { bureaus: CREDIT_BUREAUS } = require('./config/constants')

const helper = {}

helper.catchAsync = (fn) => function (req, res, next) {
  fn(req, res, next).catch((err) => next(err))
}

helper.randomId = function () {
  return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

helper.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

helper.createCreditRows = function (creditRows, cats) {
  let html = ''
  // eslint-disable-next-line no-restricted-syntax
  for (const creditRow of creditRows) {
    const prefix = `credit_${helper.randomId()}[`
    const suffix = ']'

    const nameAttr = `${prefix}name${suffix}`
    const typeAttr = `${prefix}category${suffix}`
    const bAttr = `${prefix}bureaus${suffix}`

    html += `
    <div class="row row-negative">
    <div class="col">
      <div class="form-group">
        <label for="">Furnisher</label
        ><input
          name="${nameAttr}"
          type="text"
          class="form-control form-control-sm credit-name"
          value= ${creditRow.name}
        />
      </div>
    </div>

    <div class="col">
      <div class="form-group">
        <label for="">Type</label>

        <select
          name="${typeAttr}"
          class="form-control form-control-sm credit-type"
        >
          <option selected disabled>select a type</option>
          ${helper.createNegativeItemOptions(cats, creditRow)}
         
        </select>
      </div>
    </div>
    <div class="col">
      <div class="form-group">
        <label for="">Bureaus</label>
        <select
          name="${bAttr}"
          class="form-control form-control-sm credit-bureaus select2"
          multiple="multiple"
          data-placeholder="Select the bureaus "
        >

        ${helper.createBureausOption(creditRow)}
          <option value="transunion" Transunion</option>
          <option value="equifax">Equifax</option>
          <option value="experian">Experian</option>
        </select>
      </div>
    </div>
    <div class="col col-sm-2 rm-btn d-none">
      <div class="form-group">
        <label class="text-white">d</label
        ><input
          value="remove"
          type="button"
          class="form-control form-control-sm btn btn-danger btn-sm"
        />
      </div>
    </div>
  </div>`
  }
  return html
}

helper.createBureausOption = function (negItem) {
  let options = ''

  for (const CREDIT_BUREAU of CREDIT_BUREAUS) {
    if (negItem[CREDIT_BUREAU]) {
      options += `<option class='text-capitalize' selected value=${CREDIT_BUREAU}>${helper.capitalizeFirstLetter(
        CREDIT_BUREAU
      )} </option>`
    } else {
      options += `<option class='text-capitalize' value=${CREDIT_BUREAU}>${helper.capitalizeFirstLetter(
        CREDIT_BUREAU
      )}</option>`
    }
  }
  return options
}
helper.createNegativeItemOptions = function (categories, neg) {
  const SELECTED = 'selected'
  let options = ''
  for (const category of categories) {
    options += `<option value=${category._id} ${
      category._id.equals(neg.category) && SELECTED
    }>
  ${category.name}
 </option>`
  }
  return options
}
helper.turnObjectToArray = function (negativeItems) {
  const negItemsArray = []
  const keys = Object.keys(negativeItems)
  for (const key of keys) {
    const negativeItem = negativeItems[key]
    const negativeItemObj = { ...negativeItem }
    negItemsArray.push(negativeItemObj)
  }
  return negItemsArray
}
helper.turnBureausListToObject = function (negItem) {
  if (negItem.bureaus) {
    for (const CREDIT_BUREAU of CREDIT_BUREAUS) {
      if (negItem.bureaus.indexOf(CREDIT_BUREAU) > -1) negItem[CREDIT_BUREAU] = true
      else negItem[CREDIT_BUREAU] = false
    }
  } else {
    for (const CREDIT_BUREAU of CREDIT_BUREAUS) negItem[CREDIT_BUREAU] = false
  }
}
helper.findPreviousRecords = function ({ name, savedItems }) {
  const ITEM_PREV_RECORDS = savedItems.find(
    (previousItem) => previousItem.name === name
  )
  return ITEM_PREV_RECORDS || false
}
helper.creditDifference = function (incomingItems, savedItems) {
  // Placeholders for the new removed and added items
  const itemAdded = []
  const itemRemoved = []
  // Reviewing all item send to us.
  for (const incomingItem of incomingItems) {
    const { name, category } = incomingItem
    const ITEM_PREV_RECORDS = helper.findPreviousRecords({ name, savedItems })
    /* *
    If there is a previous records of the item.
     1. We know an item with the same name is already saved.
     2. We check against all credit bureau to see where it changed if it changed.
     3. Determine if it was removed or added.
     4. If it is was removed from a bureau we record this in the itemRemoved.
     5. If it was added to a bureau we record that in the ItemAdded array.
    */
    // console.log({ name, ITEM_PREV_RECORDS })
    if (ITEM_PREV_RECORDS) {
      // We checking against all credit bureau to see where it changed.
      for (const CREDIT_BUREAU of CREDIT_BUREAUS) {
        // Determine if the item changed in any credit bureau.
        if (ITEM_PREV_RECORDS[CREDIT_BUREAU] !== incomingItem[CREDIT_BUREAU]) {
          // Here we know there a change in one of the items. We save the item details.
          const item = { name, category, bureaus: [] }
          // If it was remove it changed from true to false
          if (ITEM_PREV_RECORDS[CREDIT_BUREAU]) {
            // Checking if we already added tha item in the item removed array
            const alreadyRegistered = helper.findPreviousRecords({
              name: item.name,
              savedItems: itemRemoved,
            })

            if (alreadyRegistered) {
              // If the credit bureau is not already in the list we add it
              if (alreadyRegistered.bureaus.indexOf(CREDIT_BUREAU) === -1) {
                alreadyRegistered.bureaus.push(CREDIT_BUREAU)
              }
            } else {
              item.bureaus.push(CREDIT_BUREAU)
              itemRemoved.push(item)
            }
          }
          // If it was added it changed from false to true
          else {
            const alreadyRegistered = helper.findPreviousRecords({
              name: item.name,
              savedItems: itemAdded,
            })

            if (alreadyRegistered) {
              // If the credit bureau is not already in the list we add it
              if (alreadyRegistered.bureaus.indexOf(CREDIT_BUREAU) === -1) {
                alreadyRegistered.bureaus.push(CREDIT_BUREAU)
              }
            } else {
              item.bureaus.push(CREDIT_BUREAU)
              itemAdded.push(item)
            }
          }
        }
      }
    } else {
      /* *
    If there is no previous record of that item:
         1. Then we know this item was just reported.
         2.  We add it to our item added array
     */
      // console.log('Item added test 1')
      // console.log({ incomingItem })

      const obj = { name, category }
      const { bureaus } = incomingItem
      obj.bureaus = Array.isArray(bureaus) ? bureaus : [bureaus]
      itemAdded.push(obj)
    }
    if (
      !incomingItem.transunion
      && !incomingItem.equifax
      && !incomingItem.experian
    ) {
      const toDeleteItemIndex = incomingItems.findIndex(
        (item) => item === incomingItem
      )

      incomingItems.splice(toDeleteItemIndex, 1)
    }
  }
  return [itemAdded, itemRemoved]
}
module.exports = helper
