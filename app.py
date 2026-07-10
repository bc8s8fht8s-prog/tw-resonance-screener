from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/triple")
def triple():
    return render_template("triple.html")


@app.route("/daily-weekly")
def daily_weekly():
    return render_template("daily_weekly.html")


@app.route("/daily-monthly")
def daily_monthly():
    return render_template("daily_monthly.html")


@app.route("/weekly-monthly")
def weekly_monthly():
    return render_template("weekly_monthly.html")


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )