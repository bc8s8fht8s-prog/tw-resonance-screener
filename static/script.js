// ======================================
// 台股共振選股
// script.js
// Part 1 / 4
// ======================================

const PAGE_SIZE = 50;

let allStocks = [];
let filteredStocks = [];
let currentPage = 1;


// ======================================
// 初始化
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    if (typeof DATA_FILE === "undefined") {

        loadSummary();

    } else {

        loadStocks();

    }

});


// ======================================
// 首頁
// ======================================

async function loadSummary() {

    try {

        const response = await fetch("static/output/summary.json");

        if (!response.ok) {
            throw new Error("summary.json 讀取失敗");
        }

        const data = await response.json();

        document.getElementById("update-time").textContent =
            data.update_time;

        document.getElementById("triple-count").textContent =
            data.triple;

        document.getElementById("daily-weekly-count").textContent =
            data.daily_weekly;

        document.getElementById("daily-monthly-count").textContent =
            data.daily_monthly;

        document.getElementById("weekly-monthly-count").textContent =
            data.weekly_monthly;

    }

    catch (err) {

    alert(err);

    console.error(err);

    document.getElementById("update-time").textContent =
        "讀取失敗";

}

}


// ======================================
// 股票頁
// ======================================

async function loadStocks() {

    try {

        const response = await fetch(DATA_FILE);

        if (!response.ok) {
            throw new Error("JSON 讀取失敗");
        }

        const data = await response.json();

        document.getElementById("update-time").textContent =
            "更新時間：" + data.update_time;

        document.getElementById("stock-count").textContent =
            data.count + " 檔";

        allStocks = data.stocks;

        filteredStocks = [...allStocks];

        currentPage = 1;

        renderStocks();

        renderPagination();

        initSearch();

    }

    catch (err) {

        console.error(err);

        document.getElementById("stock-list").innerHTML = `

            <div class="stock-card">

                讀取資料失敗

            </div>

        `;

    }

}

// ======================================
// 顯示股票
// ======================================

function renderStocks() {

    const container = document.getElementById("stock-list");

    container.innerHTML = "";

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const pageStocks = filteredStocks.slice(start, end);

    if (pageStocks.length === 0) {

        container.innerHTML = `
            <div class="stock-card">
                查無符合條件的股票
            </div>
        `;

        return;

    }

    pageStocks.forEach(stock => {

        const card = document.createElement("div");

        card.className = "stock-card";

        // ==========================
        // 漲幅顏色
        // ==========================

        let changeClass = "flat";

        if (stock.change_percent > 0) {

            changeClass = "up";

        } else if (stock.change_percent < 0) {

            changeClass = "down";

        }

        // ==========================
        // OSC 顏色
        // ==========================

        let oscClass = "flat";

        if (stock.osc > 0) {

            oscClass = "up";

        } else if (stock.osc < 0) {

            oscClass = "down";

        }

        // ==========================
        // 股票卡
        // ==========================

        card.innerHTML = `

            <div class="stock-header">

                <div class="stock-title">

                    ${stock.code} ${stock.name}

                </div>

                <div class="stock-subtitle">

                    ${stock.market}｜${stock.industry}

                </div>

            </div>

            <div class="stock-info">

                <div class="info-row">

                    <span class="info-label">
                        本日收盤：
                    </span>

                    <span class="info-value">

                        ${Number(stock.close).toFixed(2)}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-label">
                        昨日最高：
                    </span>

                    <span class="info-value">

                        ${Number(stock.high).toFixed(2)}

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-label">
                        本日漲幅：
                    </span>

                    <span class="info-value ${changeClass}">

                        ${Number(stock.change_percent).toFixed(2)}%

                    </span>

                </div>

                <div class="info-row">

                    <span class="info-label">
                        OSC：
                    </span>

                    <span class="info-value ${oscClass}">

                        ${Number(stock.osc).toFixed(4)}

                    </span>

                </div>

            </div>

        `;

        container.appendChild(card);

    });

}

// ======================================
// 分頁
// ======================================

function renderPagination() {

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredStocks.length / PAGE_SIZE);

    if (totalPages <= 1) {
        return;
    }

    // ------------------------
    // 上一頁
    // ------------------------

    pagination.appendChild(

        createPageButton(
            "‹",
            currentPage > 1,
            () => {

                currentPage--;

                refreshPage();

            }
        )

    );

    // ------------------------
    // 頁碼範圍
    // ------------------------

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {

        end = Math.min(5, totalPages);

    }

    if (currentPage >= totalPages - 2) {

        start = Math.max(1, totalPages - 4);

    }

    // 第一頁

    if (start > 1) {

        pagination.appendChild(

            createNumberButton(1)

        );

        if (start > 2) {

            pagination.appendChild(

                createDots()

            );

        }

    }

    // 中間頁碼

    for (let i = start; i <= end; i++) {

        pagination.appendChild(

            createNumberButton(i)

        );

    }

    // 最後一頁

    if (end < totalPages) {

        if (end < totalPages - 1) {

            pagination.appendChild(

                createDots()

            );

        }

        pagination.appendChild(

            createNumberButton(totalPages)

        );

    }

    // ------------------------
    // 下一頁
    // ------------------------

    pagination.appendChild(

        createPageButton(
            "›",
            currentPage < totalPages,
            () => {

                currentPage++;

                refreshPage();

            }
        )

    );

}


// ======================================
// 工具
// ======================================

function createNumberButton(page) {

    const btn = document.createElement("button");

    btn.className = "page-btn";

    if (page === currentPage) {

        btn.classList.add("active");

    }

    btn.textContent = page;

    btn.onclick = () => {

        currentPage = page;

        refreshPage();

    };

    return btn;

}


function createPageButton(text, enabled, action) {

    const btn = document.createElement("button");

    btn.className = "page-btn";

    btn.textContent = text;

    btn.disabled = !enabled;

    btn.onclick = action;

    return btn;

}


function createDots() {

    const span = document.createElement("span");

    span.className = "page-dots";

    span.textContent = "...";

    return span;

}


function refreshPage() {

    renderStocks();

    renderPagination();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ======================================
// 搜尋
// ======================================

function initSearch() {

    const input = document.getElementById("search-input");

    if (!input) {
        return;
    }

    input.addEventListener("input", () => {

        const keyword = input.value.trim().toLowerCase();

        if (keyword === "") {

            filteredStocks = [...allStocks];

        } else {

            filteredStocks = allStocks.filter(stock => {

                return (

                    stock.code.toLowerCase().includes(keyword) ||

                    stock.name.toLowerCase().includes(keyword) ||

                    stock.industry.toLowerCase().includes(keyword)

                );

            });

        }

        currentPage = 1;

        renderStocks();

        renderPagination();

    });

}


// ======================================
// Enter 搜尋
// ======================================

document.addEventListener("keydown", (event) => {

    if (event.key !== "Enter") {
        return;
    }

    const input = document.getElementById("search-input");

    if (!input) {
        return;
    }

    input.blur();

});


// ======================================
// 工具
// ======================================

function formatPrice(value) {

    return Number(value).toFixed(2);

}


function formatOsc(value) {

    return Number(value).toFixed(4);

}


function formatPercent(value) {

    return Number(value).toFixed(2) + "%";

}