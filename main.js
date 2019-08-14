
const n_filter_bonus_groups = 5
const n_filter_bonus_tables = 4

let bonus_count = 0
let bonuses = []

let bonus_filters = []
for (let i = 0; i < n_filter_bonus_groups; i++) {
    bonus_filters.push([])
}

function add_info(tr, content, is_header = false) {
    let td = document.createElement(is_header ? "th" : "td")
    td.appendChild(content)
    tr.appendChild(td)
}

function text_elt(content) {
    let span = document.createElement("span")
    span.textContent = content
    return span
}

function show_items(items) {
    let main_tbody = document.getElementById("main-tbody")

    while (main_tbody.firstChild) {
        main_tbody.removeChild(main_tbody.firstChild)
    }

    for (index in items) {
        let item = items[index]

        let imgs = item.dom_elt.getElementsByTagName("img")
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs.item(i)
            if (!img.getAttribute("src")) {
                img.setAttribute("src", img.getAttribute("data-src"))
            }
        }
        
        main_tbody.appendChild(item.dom_elt)
    }
}

function main_form_submit() {
    let level_from = document.getElementById("filter-level-from").value || 0
    let level_to = document.getElementById("filter-level-to").value || 200

    show_items(item_data.filter(item => {
        if (item.level < level_from) return false
        if (item.level > level_to) return false

        for (let i = 0; i < bonus_filters.length; i++) {
            bonus_filter = bonus_filters[i]
            if (bonus_filter.length > 0 && !bonus_filter.some(bonus => {
                return bonus in item.bonuses
            })) return false
        }

        return true
    }))
}

function init_data() {
    let rarities = [
        "Commun",
        "Inhabituel",
        "Rare",
        "Mythique",
        "Légendaire",
        "Relique",
        "Souvenir",
        "Epique",
    ]
    
    item_data.forEach(item => {
        let tr = document.createElement("tr")
    
        let item_img = document.createElement("img")
        item_img.setAttribute("data-src", item.item_img)
        add_info(tr, item_img)
    
        let item_name = document.createElement("a")
        item_name.setAttribute("href", item.item_link)
        item_name.setAttribute("target", "_blank")
        item_name.textContent=item.name
        add_info(tr, item_name)
    
        let rarity_elt = document.createElement("div")
        let rarity_name = document.createElement("div")
        rarity_name.textContent = rarities[item.rarity]
        rarity_elt.appendChild(rarity_name)
        let rarity_img = document.createElement("img")
        rarity_img.setAttribute("data-src", "img/rarity-" + item.rarity + ".png")
        rarity_img.setAttribute("class", "rarity_img")
        rarity_elt.appendChild(rarity_img)
        add_info(tr, rarity_elt)
    
        let type_elt = document.createElement("div")
        let type_name = document.createElement("div")
        type_name.textContent = item.type
        type_elt.appendChild(type_name)
        let type_img = document.createElement("img")
        type_img.setAttribute("data-src", item.type_img)
        type_elt.appendChild(type_img)
        add_info(tr, type_elt)
    
        let bonus_table = document.createElement("table")
        bonus_table.setAttribute("class", "table table-striped table-sm compact-table")
        let bonus_tbody = document.createElement("tbody")
        item.bonuses_raw.forEach(bonus => {
            let bonus_tr = document.createElement("tr")
            add_info(bonus_tr, text_elt(bonus))
            bonus_tbody.appendChild(bonus_tr)
        })
        bonus_table.appendChild(bonus_tbody)
        add_info(tr, bonus_table)
    
        add_info(tr, text_elt(item.level))
    
        item.dom_elt = tr
    
        for (index in item.bonuses) {
            if (!bonuses.includes(index)) {
                bonus_count++
                bonuses.push(index)
            }
        }
    })

    bonuses.sort()
}

function render_bonus_filter_tables() {
    let filter_bonus_tr = document.getElementById("filter-bonus-tr")
    let individual_n_bonus = Math.ceil(bonus_count/n_filter_bonus_tables)

    let tbodies = []
    for (let i = 0; i < n_filter_bonus_tables; i++) {
        let table = document.createElement("table")
        table.setAttribute("class", "table table-sm compact-table")
        let thead = document.createElement("thead")
        let tr = document.createElement("tr")
        add_info(tr, text_elt("Grp :"), true)
        for (let j = 0; j < n_filter_bonus_groups; j++) {
            add_info(tr, text_elt("g" + (j+1)), true)
        }
        thead.appendChild(tr)
        table.appendChild(thead)
        let tbody = document.createElement("tbody")
        table.appendChild(tbody)
        add_info(filter_bonus_tr, table)

        tbodies.push(tbody)
    }
    
    let current_bonus_count = 0
    bonuses.forEach(bonus => {
        let tr = document.createElement("tr")
        tr.setAttribute("class", "filter-bonus-table-tr")
    
        add_info(tr, text_elt(bonus))
    
        for (let i = 0; i < n_filter_bonus_groups; i++) {
            let input_id = "filter-bonus-" + bonus + "-" + i
            let input = document.createElement("input")
            input.setAttribute("type", "checkbox")
            input.setAttribute("onclick", "bonus_checkbox_click(this)")
            input.setAttribute("data-bonus", bonus)
            input.setAttribute("data-group", i)
            add_info(tr, input)
        }

        tbodies[Math.floor(current_bonus_count/individual_n_bonus)].appendChild(tr)

        current_bonus_count++
    })
}

function bonus_checkbox_click(e) {
    let group = parseInt(e.dataset.group)
    let bonus = e.dataset.bonus

    bonus_filters[group] = bonus_filters[group].filter(elt => {return elt !== bonus})
    if (e.checked) {
        bonus_filters[group].push(bonus)
    }
}

init_data()
render_bonus_filter_tables()
