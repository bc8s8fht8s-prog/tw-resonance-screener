# ==========================================
# 台股共振選股網站
# config.py
# ==========================================

APP_NAME = "台股共振選股"

# -----------------------------
# 三個來源 JSON
# -----------------------------

# 日K
DAILY_URL = "https://bc8s8fht8s-prog.github.io/tw-stock-screener/data/result.json"

# 週K
WEEKLY_URL = "https://bc8s8fht8s-prog.github.io/tw-weekly-stock-screener/docs/data/result.json"

# 月K
MONTHLY_URL = "https://bc8s8fht8s-prog.github.io/tw-monthly-stock-screener/docs/data/result.json"

# -----------------------------
# 本機暫存
# -----------------------------

DATA_FOLDER = "data"

DAILY_JSON = "data/daily.json"
WEEKLY_JSON = "data/weekly.json"
MONTHLY_JSON = "data/monthly.json"

# -----------------------------
# 共振輸出
# -----------------------------

OUTPUT_FOLDER = "output"

SUMMARY_JSON = "output/summary.json"

DAILY_WEEKLY_JSON = "output/daily_weekly.json"
DAILY_MONTHLY_JSON = "output/daily_monthly.json"
WEEKLY_MONTHLY_JSON = "output/weekly_monthly.json"
TRIPLE_JSON = "output/triple.json"

# -----------------------------
# 匯出
# -----------------------------

PDF_FOLDER = "downloads/pdf"
EXCEL_FOLDER = "downloads/excel"
CSV_FOLDER = "downloads/csv"