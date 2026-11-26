# ManeeFlow

ต้นแบบเว็บสำหรับ macOS browser: brief → script → rule-based review → human approval → JSON plan.

## Desktop: macOS / Windows

เพิ่ม Electron shell และ build targets สำหรับ Mac (Apple Silicon / Intel) และ Windows x64 แล้ว ดูวิธีรันและ build ใน [`docs/DESKTOP.md`](docs/DESKTOP.md). ยังไม่ได้สร้างหรือทดสอบตัวติดตั้งบนระบบจริง และยังไม่มี code signing.

```sh
npm ci
npm run desktop
```

## Run in browser

ติดตั้ง Node.js 22+ บน Mac แล้วเปิด Terminal ในโฟลเดอร์โปรเจกต์:

```sh
cp .env.example .env
npm start
```

เปิด `http://localhost:3000` บนเครื่อง Mac ของคุณ ไม่ต้อง npm install (ใช้ Node built-ins).
ทดสอบด้วย `npm test`.

## AI configuration

แก้ `.env` ฝั่ง server: `AI_BASE_URL` (ลงท้าย `/v1` ตาม endpoint), `AI_MODEL`, `AI_API_KEY` แล้ว restart.
Adapter ปัจจุบันรองรับเฉพาะ OpenAI-compatible chat completions; ผู้ให้บริการที่มี native API ต่างออกไป เช่น Anthropic/Gemini ต้องเพิ่ม adapter หรือใช้ gateway ที่เข้ากันได้ ไม่ได้หมายถึงรองรับทุก API แล้ว สามารถชี้ไป local compatible server บน Mac ได้ ใช้ URL ที่เชื่อถือได้เท่านั้น (เป็นปลายทางรับข้อมูลสินค้าและ API key).

โหมด demo ใช้แม่แบบ ไม่เรียก AI ส่วนโหมด live ส่งข้อมูลสินค้าไป provider ที่ตั้งค่า มี timeout 45 วินาที ไม่มี automatic retry/fallback เพื่อไม่ให้เกิดค่าใช้จ่ายซ้ำ API key ไม่ส่งให้ browser. ไม่มีการข้าม quota หรือ billing.

## Drive / media

ดาวน์โหลด JSON แล้วบันทึกเข้า Google Drive for desktop หรืออัปโหลดด้วยตนเอง มี import JSON กลับมาแก้ไข รายชื่อสื่อเป็น metadata เท่านั้น เนื้อหาไฟล์ไม่ถูกอ่าน/อัปโหลดและไม่รวมใน JSON. OAuth/sync/Drive file browser ยังไม่ implement. Connector ใน Arena เป็นคนละส่วนกับเว็บแอป.

## Boundaries

นี่ไม่ใช่โปรแกรมตัดต่อสำเร็จรูป ยังไม่มี TTS, OCR, subtitles, timeline, MP4 rendering หรือ auto-publishing. ปุ่มส่งออกส่งเฉพาะ JSON plan. การตรวจคำเป็นเพียง heuristic ไม่ใช่การรับรองกฎหมายหรือ fact check. ต้องตรวจด้วยคนก่อนเผยแพร่.

ข้อมูลฟอร์มอยู่ในหน่วยความจำ browser เท่านั้น รีเฟรชแล้วหาย ต้อง export เพื่อเก็บ. ไม่มีฐานข้อมูลหรือ job persistence.

Server สำหรับ local/single-user development เท่านั้น ยังไม่มี authentication หรือ per-user rate limiting. อย่า expose live credentials บน public deployment; ก่อน production ต้องเพิ่ม auth, HTTPS, CSRF/session protection, tenant isolation, durable queue, audit logging และ cost controls. Preview มีไว้ทดลอง demo เป็นหลัก.

ดู `docs/REBUILD.md` สำหรับผลสำรวจและแผนพัฒนาต่อ.
