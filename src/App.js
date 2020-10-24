import React from 'react';
import logo from './logo.svg';
import './App.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { data } from "./data.js" // generate from a python script which I should prob include at some point

const json = JSON.parse(data)

// more user-friendly names for the modifiers
const friendlyModNames = {
  Resistance_All: "All Resistances (Implicit)",
  Resistance_Phys: "Physical Resistance (Implicit, Plate)",
  Implicit_Dodge: "Dodge (Implicit, Light)",
  Implicit_Memory: "Memory (Implicit, Robes)",
  MovementSpeed: "Movement Speed",
  CriticalChance: "Critical Chance",
  // Accuracy: "Accuracy",
  Resistance_Parent: "Elemental Resistance",
  // vitality
  // init
  GRN_REC: "Grenade Recovery",
  SourceGen: "Source Generation Duration",
  ReactCharge_Parent: "Free Reaction Charges",
  // dodge
  DodgeFatigue: "Dodge Fatigue Reduction",
  Damage_Parent: "Elemental Damage",
  InfusEffect_Parent: "Infusion Upgrade",
  CriticalModifier: "Critical Damage",
  CriticalChance: "Critical Chance",
  LifeSteal: "Lifesteal",
  Range: "Weapon Range",
  Incarnate_Infus: "Incarnate spawns with memorized infusions",
  SkillAbility_Parent: "Any Skill Ability",
  Melee_SkillAbility_Parent: "Skill Abilities*",
  Bow_SkillAbility_Parent: "Skill Abilities*",
  Wand_SkillAbility_Parent: "Skill Abilities*",
  Staff_SkillAbility_Parent: "Skill Abilities*",
  Shield_SkillAbility_Parent: "Skill Abilities*",
  Belt_CombatAbility_Parent: "One-handed, Two-handed, Ranged, Dual-wielding, Perseverance",
  Gloves_CombatAbility_Parent: "One-handed, Two-handed, Ranged, Dual-wielding",
  Shield_CombatAbility_Parent: "One-handed, Two-handed, Ranged, Dual-wielding, Persevereance",
  Amulet_CombatAbility_Parent: "Perseverance, Leadership, Retribution",
  Leggings_CombatAbility_Parent: "Perseverance, Leadership, Retribution",
  Boots_CombatAbility_Parent: "One-handed, Two-handed, Ranged, Dual-wielding",
  Ability_Leadership: "Leadership",
  Ability_PainReflection: "Retribution",
  Ability_OneHanded: "One-handed",
  Ability_TwoHanded: "Two-handed",
  Ability_Ranged: "Ranged",
  Ability_DualWielding: "Dual-wielding",
  CivilAbility_Amulet_Parent: "Loremaster, Telekinesis, Lucky Charm",
  CivilAbility_Belt_Parent: "Lucky Charm, Sneaking, Telekinesis, Thievery",
  CivilAbility_Gloves_Parent: "Thievery, Telekinesis",
  Ability_Sneaking: "Sneaking",
  CivilAbility_Knife_Parent: "Thievery, Sneaking",
  AnyAttribute: "Any Attribute",
  Belt_Attribute: "Con, Mem, Wits",
  Breast_Attribute: "Str, Con, Mem",
  Helmet_Attribute: "Power, Mem, Wits",
  Leggings_Attribute: "Fin, Con, Wits",
  Gloves_Attribute: "Fin, Pwr, Str",
  Boots_Attribute: "Fin, Pwr, Wit"
}

// tooltips for each type of mod, when extra info is needed
const modTooltips = {
  Resistance_Phys: "Does not include Piercing resistance.",
  Resistance_Parent: "Of a single type; not all of them in one modifier.",
  GRN_REC: "Refunds 1 Grenade thrown each round. Cannot be Masterworked.",
  ReactCharge_Parent: "Can be: Celestial, Centurion, Elementalist, Occultist or Predator. Cannot be Masterworked.",
  Damage_Parent: "Of a single type; not all of them in one modifier.",
  SourceGen: "Appears at level 6+. Cannot be Masterworked.",
  Vitality: "Adds base vitality, meaning it scales with vitality bonuses. Is controlled by a qualifier(?) similar to how attributes work.",
  LifeSteal: "Cannot be Masterworked.",
  MovementSpeed: "In centimeters.",
  InfusEffect_Parent: <div className="tooltip">
    <p>Gives +1 to a certain spells's Infusions. Possible spells are:</p>
    <p>Pressure Spike</p>
    <p>Vaporize</p>
    <p>Fossil Strike</p>
    <p>Turn to Oil</p>
    <p>Ricochet</p>
    <p>Pin Down</p>
    <p>Deep Freeze</p>
    <p>Hail Strike</p>
    <p>Blood Sucker</p>
    <p>Blood Rain</p>
    <p>Aspect of the Eagle</p>
    <p>Aspect of the Spider</p>
    <p>Immolation</p>
    <p>Throw Explosive Trap</p>
    <p>Daggers Drawn</p>
    <p>Throwing Knife</p>
    <p>Conjure Incarnate</p>
    <p>Dominate Mind</p>
    <p>Challenge</p>
    <p>Crippling Blow</p>
  </div>,
  Range: "Units are in centimeters.",
  CriticalModifier: "Note that this modifier is ignored on offhand weapons, except when performing basic attacks(?).",
  Melee_SkillAbility_Parent: "Except Huntsman.",
  Bow_SkillAbility_Parent: "Except Warfare and Scoundrel.",
  Wand_SkillAbility_Parent: "Excluding Warfare, Scoundrel, Huntsman and Polymorph.",
  Staff_SkillAbility_Parent: "Excluding Scoundrel and Huntsman.",
  Shield_SkillAbility_Parent: "Excluding Huntsman."
  // Belt_combatAbility_Parent: "These include One-handed, Two-handed, Ranged, Dual-wielding and Perseverance.",
  // Gloves_CombatAbility_Parent: "These include One-handed, Two-handed, Ranged, and Dual-wielding.",
  // Shield_CombatAbility_Parent: "These include One-handed, Perseverance, Leadership, and Retribution.",
  // Amulet_CombatAbility_Parent: "These include Perseverance, Leadership, and Retribution.",
  // Leggings_CombatAbility_Parent: "These include Perseverance, Leadership, and Retribution.",
  // Boots_CombatAbility_Parent: "These include One-handed, Two-handed, Ranged, and Dual-wielding.",
}

// some postprocessing
for (let x in json) {
  let cat = json[x]
  for (let z in cat) {
    let mod = cat[z]

    // include 2/1hand restriction in the mod name (adding a column for this feels unnecessary)
    mod.name = Object.keys(friendlyModNames).includes(mod.mod) ? friendlyModNames[mod.mod] : mod.mod;
    if (mod.handedness != "Any") {
      mod.name += (mod.handedness == "Two-handed only") ? " (2handed mod)" : " (1handed mod)"
    }

    if (mod.mod == "Range")
      console.log(mod)
    // oh my god pip this sucks
    if (mod.mod == "Range" && mod.minValue == "225") {
      mod.name += (" (Ranged weapons)")
    }
  }
}

class TableText extends React.Component {
  constructor() {super()}

  render() {
    let className = (this.props.centerText) ? "mod-text text-align" : "mod-text"
    return (
      <div style={{width: this.props.width}}>
        <p className={className}>{this.props.text}</p>
      </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      dropdownOption: "Knife", // what option is currently selected in the dropdown
    }
  }

  render() {
    let options = []
    for (let x in json) {
      options.push(<option value={x}>{x}</option>)
    }

    // get all modifiers that belong to the current section
    let modifiers = []
    for (let x in json[this.state.dropdownOption]) {
      let mod = json[this.state.dropdownOption][x]
      modifiers.push(mod)
    }

    // metadata about each column
    const columns = [
      {name: "Mod", size: "300px", value: "mod", centerText: false,},
      {name: "Min Value", size: "120px", value: "minValue", centerText: true,},
      {name: "Max Value", size: "120px", value: "maxValue", centerText: true,},
      {name: "Increment", size: "120px", value: "growStep", centerText: true,},
      {name: "LevelGrowStep", size: "120px", value: "levelGrowStep", centerText: true,},
      // {name: "Handedness", size: "120px", value: "handedness", centerText: true,},
    ]

    let rowElements = []

    // create headers
    let header = []
    for (let x in columns) {
      if (columns[x].name == "LevelGrowStep")
      header.push(<Tippy content="The level interval between new increments of a modifier becoming available, starting from 0. Ex. for a modifier with LevelGrowStep of 6, new increments of the modifier become available every 6 levels."><span><TableText text={columns[x].name} width={columns[x].size}  centerText={columns[x].centerText}/></span></Tippy>)
      else
        header.push(<TableText text={columns[x].name} width={columns[x].size}  centerText={columns[x].centerText}/>)
    }
    rowElements.push(<div className="table-row">{header}</div>)

    // create entry rows
    let rowNumber = 1;
    for (let x in modifiers) {
      let mod = modifiers[x]
      let row = []
      
      for (let z in columns) {
        let column = columns[z]
        let value = mod[column.value]

        let text = (column.value == "mod") ? mod.name : value

        let element = <TableText key={z} text={text} width={column.size} centerText={column.centerText} rowNumber={rowNumber}/>

        let textElement = (Object.keys(modTooltips).includes(value)) ? <Tippy content={modTooltips[value]} placement="bottom" duration="0" key={z}><span>{element}</span></Tippy> : element

        row.push(textElement)
      }

      let tableClass = (rowNumber % 2 == 1) ? "table-row table-bg-alt" : "table-row table-bg"
      rowElements.push(<div className={tableClass}>{row}</div>)
      rowNumber++;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h3>EE2 Gear Modifiers</h3>
          <span className="info">This is a simplified version of <a href="https://docs.google.com/spreadsheets/d/1zaLjNqaNqTbzAknvp1BcvxQClNcT-mwGrkvPxNJVC8I/edit#gid=0">this sheet</a>, showing the possible modifiers for each gear type. You can use this to find out what modifiers each type of gear supports, for use with the Combine option in the Greatforge.</span>
          <span className="info">See <a href="https://discord.com/channels/607369048929468456/709524764162785390/747097769017344011">this message</a> on the Discord for a tutorial on modifying gear through the Greatforge.</span>

          <div style={{height: "30px"}}/>
  
          <select value={this.state.dropdownOption} onChange={(e)=>{this.setState({dropdownOption: e.target.value})}}>
            {options}
          </select>

          <div className="modifier-table">
            {rowElements}
          </div>

          <div style={{height: "30px"}}/>

          <span className="info">Skill abilities refer to the stats that control your spells, like Pyromancy and Warfare.</span>
          <span className="info">Implicit modifiers (and other modifiers incompatible with the Greatforge) are not shown here; you can see some of them in the original sheet.</span>
          <span className="info">Note that while attributes roll from 1 to 4, this roll is not an absolute value but instead a "qualifier" which the game turns into a "level-appropriate amount of attribute". This way attribute boosts on items can go up to +6; see the table below:</span>

          <div>
            <pre className="info-table">Item Level | Possible Mod Values | Absolute Values (the real attribute boost)</pre>
            <pre className="info-table">--------------------------------------------------</pre>
            <pre className="info-table">    1      |         1           |       +1     </pre>
            <pre className="info-table">    6      |       1, 2          |     +1, +1      </pre>
            <pre className="info-table">    7      |       1, 2          |     +1, +2  </pre>
            <pre className="info-table">    12     |      1, 2, 3        |   +1, +2, +3    </pre>
            <pre className="info-table">    14     |      1, 2, 3        |   +2, +3, +4</pre>
            <pre className="info-table">    18     |    1, 2, 3, 4       | +2, +3, +5, +6</pre>
            <pre className="info-table">    20     |    1, 2, 3, 4       | +2, +3, +5, +6</pre>
            <pre className="info-table">    21     |    1, 2, 3, 4       | +2, +4, +5, +6</pre>
          </div>

          <span className="info">For more info on how modifiers are rolled, see <a href="https://discord.com/channels/607369048929468456/608788140550914069/769335578697138246">this message.</a></span>

          <div style={{height: "30px"}}/>
        </header>
      </div>
    );
  }
}

export default App;
