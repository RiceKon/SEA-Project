export class Keyboard {
  constructor({
    Brand,
    Model,
    Layout,
    Switches,
    Connection,
    "Hot-Swappable": HotSwappable,
    "Keycap Material": KeycapMaterial,
    Backlight,
    "Mounting Style": MountingStyle,
    "Case Material": CaseMaterial,
    "Price (USD)": PriceUSD
  }) {
    this.brand = Brand;
    this.model = Model;
    this.layout = Layout;
    this.switches = Switches;
    this.connection = Connection;
    this.hotSwappable = HotSwappable;
    this.keycapMaterial = KeycapMaterial;
    this.backlight = Backlight;
    this.mountingStyle = MountingStyle;
    this.caseMaterial = CaseMaterial;
    this.price = PriceUSD;

    //Mark all keyboards as non-custom by default
    this.isCustom = false;
  }
    // Returns the keyboard's price formatted as a currency string.
    getFormattedPrice() {
      // Ensure price is a number and then format it to two decimal places.
      return `$${Number(this.price).toFixed(2)}`;
    }
  
    // Returns a full description of the keyboard.
    getDescription() {
      return `${this.brand} ${this.model} features a ${this.layout} layout with ${this.switches} switches and a ${this.connection} connection. ` +
             `Hot-swappable: ${this.hotSwappable ? "Yes" : "No"}. ` +
             `Keycap Material: ${this.keycapMaterial}. ` +
             `Backlight: ${this.backlight ? this.backlight : "None"}. ` +
             `Mounting Style: ${this.mountingStyle}. ` +
             `Case Material: ${this.caseMaterial}. ` +
             `Price: ${this.getFormattedPrice()}.`;
    }
  }