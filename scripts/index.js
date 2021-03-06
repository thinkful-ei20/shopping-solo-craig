/* global shoppingList, cuid */
'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false},
  ],
  displayChecked: true,
  search: /./gi,
  sortBy: 'alpha',
};

function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function createNewItem() {
  const newItemName = $('.js-shopping-list-entry').val();
  if (newItemName !== '') {
    addItemToShoppingList(newItemName);
  } else {
    STORE.search = /./gi;
  }
  renderShoppingList();
}

function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        <button class="shopping-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-save">
            <span class="button-label">save</span>
        </button>
      </div>
    </li>`;
}

/*function generateShoppingItemsString(shoppingList) {  
  const listItems = shoppingList.
    filter(item => item.checked === STORE.displayChecked || STORE.displayChecked === true).
    filter(item => (item.name.match(STORE.search))).
    map((item, index) => generateItemElement(item, index));
  return listItems.join('');
}*/

// function generateShoppingItemsString(shoppingList) {  
//   const listItems = shoppingList.map((item, index) => generateItemElement(item, index));
//   const checkedItems = listItems.filter(item => {
//     if (STORE.displayChecked === false) {
//       if (item.indexOf('shopping-item__checked') === -1) return item;
//     } else {
//       return item;
//     }
//   });
//   const searchedItems = checkedItems.filter(item => {
//     console.log(item);
//     if (item.match(STORE.search)) return item;
//   });
//   return searchedItems.join('');
// }

function generateShoppingItemsString(shoppingList) {
  const mappedItems = shoppingList.map((item, index) => generateItemElement(item, index));
  const searchedItems = searchList(mappedItems);
  return searchedItems.join('');
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
  $('.js-shopping-list-entry').val('');
  $('.js-shopping-list-entry').focus();
}

// Search the generated html (rather than shoppingList) keeps index intact
function searchList(list) {
  return list.filter(item => {
    if (STORE.displayChecked === false) {
      if (item.indexOf('shopping-item__checked') === -1) return item;
    } else {
      return item;
    }
  }).filter(item => {
    if (item.match(STORE.search)) return item;
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    createNewItem();
  });
}

function handleDeleteItemClicked() {  
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    STORE.items.splice(getItemIndexFromElement(event.currentTarget), 1);    
    renderShoppingList();
  });
}

function handleEditItem() {
  $('.js-shopping-list').on('click', '.shopping-item-edit', function(event) {
    $(this).parent().siblings().attr('contenteditable', 'true');
    $(this).parent().siblings().addClass('shopping-item__editable');
  });
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleSaveItem() {
  $('.js-shopping-list').on('click', '.shopping-item-save', function(event) {
    $(this).parent().siblings().attr('contenteditable', null);
    $(this).parent().siblings().removeClass('shopping-item__editable');
    STORE.items[$(this).closest('.js-item-index-element').attr('data-item-index')].name = $(this).parent().siblings().text();
  });
}

function handleSearchSubmit() {
  $('#js-shopping-list-form').on('click', '.shopping-list-search', event => {
    STORE.search = new RegExp('>\\w*' + $('.js-shopping-list-entry').val() + '\\w*</span>', 'gi');
    renderShoppingList();
  });
}

function handleShowAll() {
  $('#js-shopping-list-form :checkbox').change(event => {
    STORE.displayChecked === true ? STORE.displayChecked = false : STORE.displayChecked = true;
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleSearchSubmit();
  handleShowAll();
  handleEditItem();
  handleSaveItem();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

$(handleShoppingList);