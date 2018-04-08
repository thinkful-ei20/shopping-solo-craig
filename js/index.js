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

function searchList(list) {
  return list.filter(item => {
    if (STORE.displayChecked === false) {
      if (item.indexOf('shopping-item__checked') === -1) return item;
    } else {
      return item;
    }
  }).filter(item => {
    //console.log(item);
    if (item.match(STORE.search)) return item;
  });
}

function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
  $('.js-shopping-list-entry').focus();
}

function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {  
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    STORE.items.splice(getItemIndexFromElement(event.currentTarget), 1);    
    renderShoppingList();
  });
}

function handleSearchSubmit() {
  $('#js-shopping-list-form').on('click', '.shopping-list-search', event => {
    STORE.search = new RegExp($('.js-shopping-list-entry').val(), 'gi');
    renderShoppingList();
  });
}

function handleShowAll() {
  $('#js-shopping-list-form :checkbox').change(event => {
    STORE.displayChecked === true ? STORE.displayChecked = false : STORE.displayChecked = true;
    renderShoppingList();
  });
}

function handleEditItem() {
  $('.js-shopping-list').on('click', '.shopping-item-edit', function(event) {
    $(this).parent().siblings().attr('contenteditable', 'true');
  });
}

function handleSaveItem() {
  $('.js-shopping-list').on('click', '.shopping-item-save', function(event) {
    $(this).parent().siblings().attr('contenteditable', null);    
    STORE.items[$(this).closest('.js-item-index-element').attr('data-item-index')].name = $(this).parent().siblings().text();
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