'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false},
  ],
  displayChecked: true,
  search: '*',
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

function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));  
  return items.join('');
}

function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
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
  $('#js-shopping-list-form').on('click', 'button', event => {
    console.log('search');
    renderShoppingList();
  });
}

function handleShowAll() {
  $('#js-shopping-list-form :checkbox').change(event => {
    console.log('show all');
    renderShoppingList();
  });
}

function handleEditItem() {
  $('.js-shopping-list').on('click', '.shopping-item-edit', function(event) {
    $('.shopping-item').attr('contenteditable', 'true');
  });
}

function handleSaveItem() {
  $('.js-shopping-list').on('click', '.shopping-item-save', function(event) {
    $('.shopping-item').attr('contenteditable', null);    
    STORE.items[$(this).closest('.js-item-index-element').attr('data-item-index')].name = $(this).parent().siblings().text();
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