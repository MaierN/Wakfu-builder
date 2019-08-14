
main_tbody = document.getElementById("main-tbody")

rarities = [
    "Common",
    "Unusual",
    "Rare",
    "Mythical",
    "Legendary",
    "Relic",
    "Souvenir",
    "Epique",
]

function add_info(tr, content) {
    td = document.createElement("td")
    td.appendChild(content)
    tr.appendChild(td)
}

function text_elt(content) {
    span = document.createElement("span")
    span.textContent = content
    return span
}

function show_items(items) {
    while (main_tbody.firstChild) {
        main_tbody.removeChild(main_tbody.firstChild)
    }

    for (index in items) {
        item = items[index]

        imgs = item.dom_elt.getElementsByTagName("img")
        for (let i = 0; i < imgs.length; i++) {
            img = imgs.item(i)
            if (!img.getAttribute("src")) {
                img.setAttribute("src", img.getAttribute("src_tmp"))
            }
        }
        
        main_tbody.appendChild(item.dom_elt)
    }
}

function main_form_submit() {
    level_from = document.getElementById("filter-level-from").value || 0
    level_to = document.getElementById("filter-level-to").value || 200

    console.log(level_from, level_to)

    filtered_items = []
    item_data.forEach(item => {
        if (item.level < level_from) return
        if (item.level > level_to) return

        filtered_items.push(item)
    })

    show_items(filtered_items)
}

item_data.forEach(item => {
    tr = document.createElement("tr")

    item_img = document.createElement("img")
    item_img.setAttribute("src_tmp", item.item_img)
    add_info(tr, item_img)

    item_name = document.createElement("a")
    item_name.setAttribute("href", item.item_link)
    item_name.setAttribute("target", "_blank")
    item_name.textContent=item.name
    add_info(tr, item_name)

    rarity_elt = document.createElement("div")
    rarity_name = document.createElement("div")
    rarity_name.textContent = rarities[item.rarity]
    rarity_elt.appendChild(rarity_name)
    rarity_img = document.createElement("img")
    rarity_img.setAttribute("src_tmp", "img/rarity-" + item.rarity + ".png")
    rarity_img.setAttribute("class", "rarity_img")
    rarity_elt.appendChild(rarity_img)
    add_info(tr, rarity_elt)

    type_elt = document.createElement("div")
    type_name = document.createElement("div")
    type_name.textContent = item.type
    type_elt.appendChild(type_name)
    type_img = document.createElement("img")
    type_img.setAttribute("src_tmp", item.type_img)
    type_elt.appendChild(type_img)
    add_info(tr, type_elt)

    bonus_table = document.createElement("table")
    bonus_table.setAttribute("class", "table table-striped table-sm compact-table")
    bonus_tbody = document.createElement("tbody")
    item.bonuses_raw.forEach(bonus => {
        bonus_tr = document.createElement("tr")
        add_info(bonus_tr, text_elt(bonus))
        bonus_tbody.appendChild(bonus_tr)
    })
    bonus_table.appendChild(bonus_tbody)
    add_info(tr, bonus_table)

    add_info(tr, text_elt(item.level))

    item.dom_elt = tr
})
