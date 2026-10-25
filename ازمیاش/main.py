# main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Browser AI App")

# سرو کردن فایل‌های استاتیک (HTML, JS, …)
# این خط برای Render و هر هاست دیگری حیاتی است
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)