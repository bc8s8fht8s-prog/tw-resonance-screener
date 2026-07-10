import json
import os


def load_json(filepath):
    """讀取 JSON"""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def stock_dict(data):
    """
    將 stocks 轉成 dict
    key = 股票代號
    value = 完整資料
    """
    return {
        stock["code"]: stock
        for stock in data["stocks"]
    }


def build_result(update_time, stock_list):
    """建立輸出格式"""
    return {
        "update_time": update_time,
        "count": len(stock_list),
        "stocks": stock_list
    }


def save_json(filename, data):
    """儲存 JSON"""

    output_dir = os.path.join("static", "output")
    os.makedirs(output_dir, exist_ok=True)

    with open(
        os.path.join(output_dir, filename),
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=4
        )


if __name__ == "__main__":

    # ==========================
    # 讀取三個週期資料
    # ==========================

    daily = load_json("data/daily.json")
    weekly = load_json("data/weekly.json")
    monthly = load_json("data/monthly.json")

    # ==========================
    # 建立 dictionary
    # ==========================

    daily_dict = stock_dict(daily)
    weekly_dict = stock_dict(weekly)
    monthly_dict = stock_dict(monthly)

    # ==========================
    # 股票代號集合
    # ==========================

    daily_codes = set(daily_dict.keys())
    weekly_codes = set(weekly_dict.keys())
    monthly_codes = set(monthly_dict.keys())

    print(f"日K：{len(daily_codes)}")
    print(f"週K：{len(weekly_codes)}")
    print(f"月K：{len(monthly_codes)}")

    # ==========================
    # 三重共振
    # ==========================

    triple_codes = daily_codes & weekly_codes & monthly_codes

    # ==========================
    # 互斥分類
    # ==========================

    daily_weekly_codes = (daily_codes & weekly_codes) - triple_codes
    daily_monthly_codes = (daily_codes & monthly_codes) - triple_codes
    weekly_monthly_codes = (weekly_codes & monthly_codes) - triple_codes

    print()
    print("========== 共振結果 ==========")
    print(f"⭐⭐⭐ 三重共振：{len(triple_codes)}")
    print(f"🟥 日週共振：{len(daily_weekly_codes)}")
    print(f"🟪 日月共振：{len(daily_monthly_codes)}")
    print(f"🟩 週月共振：{len(weekly_monthly_codes)}")

    # ==========================
    # 建立股票清單
    # ==========================

    triple_list = [daily_dict[code] for code in triple_codes]
    daily_weekly_list = [daily_dict[code] for code in daily_weekly_codes]
    daily_monthly_list = [daily_dict[code] for code in daily_monthly_codes]
    weekly_monthly_list = [weekly_dict[code] for code in weekly_monthly_codes]

    # ==========================
    # 排序（依漲幅由大到小）
    # ==========================

    triple_list.sort(
        key=lambda x: x.get("change_percent", 0),
        reverse=True
    )

    daily_weekly_list.sort(
        key=lambda x: x.get("change_percent", 0),
        reverse=True
    )

    daily_monthly_list.sort(
        key=lambda x: x.get("change_percent", 0),
        reverse=True
    )

    weekly_monthly_list.sort(
        key=lambda x: x.get("change_percent", 0),
        reverse=True
    )

    # ==========================
    # 更新時間
    # ==========================

    update_time = daily["update_time"]

    # ==========================
    # 輸出四個 JSON
    # ==========================

    save_json(
        "triple.json",
        build_result(update_time, triple_list)
    )

    save_json(
        "daily_weekly.json",
        build_result(update_time, daily_weekly_list)
    )

    save_json(
        "daily_monthly.json",
        build_result(update_time, daily_monthly_list)
    )

    save_json(
        "weekly_monthly.json",
        build_result(update_time, weekly_monthly_list)
    )

    # ==========================
    # summary.json
    # ==========================

    summary = {
        "update_time": update_time,
        "triple": len(triple_list),
        "daily_weekly": len(daily_weekly_list),
        "daily_monthly": len(daily_monthly_list),
        "weekly_monthly": len(weekly_monthly_list)
    }

    save_json(
        "summary.json",
        summary
    )

    print()
    print("========== 已輸出 ==========")
    print("✓ static/output/triple.json")
    print("✓ static/output/daily_weekly.json")
    print("✓ static/output/daily_monthly.json")
    print("✓ static/output/weekly_monthly.json")
    print("✓ static/output/summary.json")