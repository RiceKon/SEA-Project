/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

console.log("scripts.js loaded");

// import keyboard data from another file
import { Keyboard } from './keyboard.js';

// Global arrays for keyboards and the filtered subset.
let keyboards = [];
let filteredKeyboards = [];

// Categories we want to gather from the JSON
// Key used in the JSON => property name in the Keyboard object => label for the user
// The "Hot-Swappable" property is stored as "hotSwappable" in the Keyboard class, etc.
const CATEGORIES = [
  { jsProp: "layout", label: "Layout" },
  { jsProp: "switches", label: "Switches" },
  { jsProp: "connection", label: "Connection" },
  { jsProp: "hotSwappable", label: "Hot-Swappable" },
  { jsProp: "keycapMaterial", label: "Keycap Material" },
  { jsProp: "backlight", label: "Backlight" },
  { jsProp: "mountingStyle", label: "Mounting Style" },
  { jsProp: "caseMaterial", label: "Case Material" },
];


fetch("./extended_keyboards_specs.json")
  .then(response => response.json())
  .then(data => {
    keyboards = data.map((item, index) => {
      const kb = new Keyboard(item);
      kb.id = index; // synthetic ID for filtering
      return kb;
    });

    // Copy the entire array initially
    filteredKeyboards = [...keyboards];

    // Console logs for debugging
    console.log("Loaded keyboards:", keyboards);
    keyboards.forEach(kb => console.log(kb.getDescription()));

    // Render the main catalog
    showCards();

    // Build the Frankenstein builder selects
    buildFrankensteinBuilder();
  })
  .catch(error => console.error("Error loading keyboard data:", error));


// Builds the select boxes for each category in the Frankenstein builder
function buildFrankensteinBuilder() {
  const builderContainer = document.getElementById("frankenstein-builder");
  if (!builderContainer) return; // If there's no container, just return

  // For each category, gather unique values from 'keyboards'
  CATEGORIES.forEach(cat => {
    const categorySet = new Set();
      keyboards.forEach(kb => {
        const value = kb[cat.jsProp];
        if (typeof value !== "undefined" && value !== null) {
          // For booleans (hotSwappable), display user-friendly strings in the <option>
          if (typeof value === "boolean") {
            categorySet.add(value ? "Yes" : "No");
          } else {
            categorySet.add(value);
          }
      }
    });

    // Convert the set to an array so we can sort or do other manipulations if needed
    const uniqueValues = Array.from(categorySet);

    // Create a label + select for this category
    const labelElem = document.createElement("label");
    labelElem.textContent = cat.label;

    const selectElem = document.createElement("select");
    selectElem.id = `frankSelect-${cat.jsProp}`;

    // We'll add a default placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = `Select ${cat.label}`;
    selectElem.appendChild(placeholderOption);

    // Populate each unique value as an <option>
    uniqueValues.forEach(val => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      selectElem.appendChild(option);
    });

    // Attach the label and select to the builder container
    builderContainer.appendChild(labelElem);
    builderContainer.appendChild(selectElem);
  });
}

// Utility function to read checkboxes
function getCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(input => input.value);
}

// Render the main catalog from the global filteredKeyboards
function showCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Clear container

  if (filteredKeyboards.length === 0) {
    container.innerHTML = "<p>No keyboards match the criteria.</p>";
    return;
  }

  filteredKeyboards.forEach((keyboard) => {
    const card = document.createElement("article");
    card.classList.add("keyboard");
    card.setAttribute("data-id", keyboard.id);

    // Only show Remove if isCustom = true
    const removeButtonHTML = keyboard.isCustom ? `<button class="remove-btn" data-id="${keyboard.id}">Remove</button>`: "";

    card.innerHTML = `
      <h2>${keyboard.model}</h2>
      <p><strong>Brand:</strong> ${keyboard.brand}</p>
      <div class="product-details">
        <h3>Key Specs</h3>
        <ul>
          <li><strong>Layout:</strong> ${keyboard.layout}</li>
          <li><strong>Connection:</strong> ${keyboard.connection}</li>
          <li><strong>Switches:</strong> ${keyboard.switches}</li>
          <li><strong>Hot-Swappable:</strong> ${
            keyboard.hotSwappable === "Yes" || keyboard.hotSwappable === true ? "Yes" : "No"
          }</li>
          <li><strong>Keycap Material:</strong> ${keyboard.keycapMaterial}</li>
          <li><strong>Backlight:</strong> ${keyboard.backlight || "None"}</li>
          <li><strong>Mounting Style:</strong> ${keyboard.mountingStyle}</li>
          <li><strong>Case Material:</strong> ${keyboard.caseMaterial}</li>
        </ul>
      </div>
      <div class="price-availability">
        <h3>Price</h3>
        <ul>
          <li>${
            typeof keyboard.getFormattedPrice === "function"
              ? keyboard.getFormattedPrice()
              : `$${keyboard.price || 0}`
          }</li>
        </ul>
      </div>
      ${removeButtonHTML}
    `;

    container.appendChild(card);
    });
}

  function removeKeyboard(id) {
    console.log("Attempting to remove ID:", id);  
    const index = keyboards.findIndex(k => k.id === id);

    console.log("Index found:", index);           

    if (index !== -1) {
      if (keyboards[index].isCustom) {
        keyboards.splice(index, 1);
        applyFilter();
      } else {
        console.warn("This keyboard is not custom; cannot remove.");
      }
    }
  }
// Add a new keyboard
function addKeyboard(newKeyboard) {
  // Insert the new keyboard at the front of the array
  keyboards.unshift(newKeyboard);
  // Re-run the filter to refresh the displayed keyboards
  applyFilter();
}


function applyFilter() {
  const layoutValues = getCheckboxValues("layout");
  const priceRanges = getCheckboxValues("price");
  const searchTerm = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";
  const sortValue = document.getElementById("sortSelect")?.value || "";

  // Filter the keyboards first
  filteredKeyboards = keyboards.filter(kb => {
    let match = true;
    
    // Layout filter (exact match)
    if (layoutValues.length > 0 && !layoutValues.includes(kb.layout)) {
      match = false;
    }
    
    // Price filter (assumes ranges like "0-100")
    if (priceRanges.length > 0) {
      const inAnyRange = priceRanges.some(range => {
        const [min, max] = range.split("-").map(Number);
        return kb.price >= min && kb.price <= max;
      });
      if (!inAnyRange) match = false;
    }
    
    // Search filter: brand or model must include the search term
    if (searchTerm) {
      const brandMatch = kb.brand.toLowerCase().includes(searchTerm);
      const modelMatch = kb.model.toLowerCase().includes(searchTerm);
      if (!brandMatch && !modelMatch) match = false;
    }
    
    return match;
  });

  // 5. Sort logic
  if (sortValue === "priceLowHigh") {
    filteredKeyboards.sort((a, b) => a.price - b.price); // ascending
  } else if (sortValue === "priceHighLow") {
    filteredKeyboards.sort((a, b) => b.price - a.price); // descending
  } else if (sortValue === "newest") {
    // Example: sort by ID descending if "newest"
    filteredKeyboards.sort((a, b) => b.id - a.id);
  }
  // Re-render the catalog.
  showCards();
}

document.addEventListener("click", (e) => {
  if (e.target.id === "buildKeyboardBtn") {
    e.preventDefault();

    // 1) Grab the user-typed name from the input field
    const nameField = document.getElementById("buildNameInput");
    let userBuildName = nameField ? nameField.value.trim() : "";

    // 2) Gather the user's Frankenstein selections
    const frankensteinBuild = {};

    CATEGORIES.forEach(cat => {
      const selectElem = document.getElementById(`frankSelect-${cat.jsProp}`);
      let chosenValue = selectElem ? selectElem.value.trim() : "";

      if (!chosenValue) {
        chosenValue = "None";
      }
      if (cat.jsProp === "hotSwappable") {
        if (chosenValue === "Yes") {
          chosenValue = true;
        } else if (chosenValue === "No") {
          chosenValue = false;
        } else {
          chosenValue = "None";
        }
      }
      frankensteinBuild[cat.jsProp] = chosenValue;
    });

    // 3) Construct the main object with placeholders for missing fields
    const newKeyboardData = {
      Brand: frankensteinBuild.brand === "None" ? "Custom Brand" : frankensteinBuild.brand,
      // 4) If user gave a custom name, we use that for the Model
      //    Otherwise, we fall back to "Custom Model"
      Model: userBuildName ? userBuildName : "Custom Model",
      Layout: frankensteinBuild.layout === "None" ? "Custom Layout" : frankensteinBuild.layout,
      Switches: frankensteinBuild.switches === "None" ? "Custom Switches" : frankensteinBuild.switches,
      Connection: frankensteinBuild.connection === "None" ? "Custom Connection" : frankensteinBuild.connection,
      "Hot-Swappable": frankensteinBuild.hotSwappable === true ? "Yes" : frankensteinBuild.hotSwappable === false ? "No" : "None",
      "Keycap Material": frankensteinBuild.keycapMaterial === "None" ? "Custom Keycaps" : frankensteinBuild.keycapMaterial, 
      
      Backlight: frankensteinBuild.backlight === "None" ? "None" : frankensteinBuild.backlight,
      "Mounting Style": frankensteinBuild.mountingStyle === "None" ? "Custom Mount" : frankensteinBuild.mountingStyle,
      "Case Material": frankensteinBuild.caseMaterial === "None" ? "Custom Case" : frankensteinBuild.caseMaterial,

      "Price (USD)": 0 // or parse out a numeric price if you'd like
    };

    // 5) Create new Keyboard and mark it as custom
    const customKeyboard = new Keyboard(newKeyboardData);
    // Use a unique ID to avoid collisions
    customKeyboard.id = keyboards.length + 1000;
    customKeyboard.isCustom = true;

    // 6) Add the keyboard to the front of our array
    addKeyboard(customKeyboard);

    // 7) Optional: Clear the input field for next time
    if (nameField) {
      nameField.value = "";
    }

    console.log("Newly added Frankenstein keyboard:", customKeyboard);
  }
});

// Event Listeners for filter form, search input, and container
document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilter();
    });
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterForm?.dispatchEvent(new Event("submit"));
    });
  }

  const container = document.getElementById("card-container");
  if (container) {
    container.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-btn")) {
        const id = parseInt(event.target.getAttribute("data-id"));
        removeKeyboard(id);
      }
    });
  }

  // Auto-filter whenever any checkbox is toggled
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", applyFilter);
  });

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      // Re-run your filtering + sorting logic
      applyFilter();
    });
  }
});

// Expose some functions globally if needed
window.addKeyboard = addKeyboard;
window.applyFilter = applyFilter;