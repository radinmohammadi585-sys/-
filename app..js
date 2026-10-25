// static/app.js
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// اجازه‌ی دانلود مدل از Hugging Face در مرورگر
env.allowLocalModels = false; // استفاده از CDN هاگینگ فیس
env.useBrowserCache = true;   // کش کردن مدل در مرورگر برای اجراهای بعدی

const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');
const promptEl = document.getElementById('prompt');
const runBtn = document.getElementById('run');

let generator = null;

async function loadModel() {
  if (generator) return;

  statusEl.textContent = '⏳ در حال دانلود و بارگذاری مدل در مرورگر… (بار اول ممکن است چند لحظه طول بکشد)';

  // مدل کوچک و مناسب مرورگر
  generator = await pipeline(
    'text2text-generation',
    'Xenova/LaMini-Flan-T5-77M',
    { quantized: true } // نسخه‌ی کوانتیزه برای حجم کمتر و سرعت بیشتر
  );

  statusEl.textContent = '✅ مدل آماده است (کاملاً در مرورگر).';
}

runBtn.addEventListener('click', async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) return;

  outputEl.textContent = '';
  runBtn.disabled = true;

  try {
    await loadModel();

    statusEl.textContent = '⏳ در حال تولید پاسخ…';

    const result = await generator(prompt, {
      max_new_tokens: 100,
      temperature: 0.7,
      do_sample: true,
    });

    outputEl.textContent = result[0].generated_text;
    statusEl.textContent = '✅ پاسخ تولید شد.';
  } catch (err) {
    console.error(err);
    statusEl.textContent = '❌ خطا: ' + err.message;
  } finally {
    runBtn.disabled = false;
  }
});

// شروع بارگذاری مدل به‌محض باز شدن صفحه (اختیاری)
loadModel().catch(() => {
  statusEl.textContent = 'برای شروع، دکمه را بزنید.';
});