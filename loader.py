import os
import requests

from config import (
    DAILY_URL,
    WEEKLY_URL,
    MONTHLY_URL,
    DAILY_JSON,
    WEEKLY_JSON,
    MONTHLY_JSON,
    DATA_FOLDER,
)


def download_json(url, save_path):

    print(f"下載：{url}")

    response = requests.get(url, timeout=30)
    response.raise_for_status()

    with open(save_path, "wb") as f:
        f.write(response.content)

    print(f"✓ 已儲存：{save_path}")


def main():

    os.makedirs(DATA_FOLDER, exist_ok=True)

    print("========== 開始下載 ==========\n")

    download_json(DAILY_URL, DAILY_JSON)
    download_json(WEEKLY_URL, WEEKLY_JSON)
    download_json(MONTHLY_URL, MONTHLY_JSON)

    print("\n========== 全部完成 ==========")


if __name__ == "__main__":
    main()