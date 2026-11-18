#!/usr/bin/env python3
"""Tạo lib/tiet-khi-bang.js: bảng giờ giao 24 tiết khí năm 1900 – 2100.

    pip install sxtwl
    python3 tools/tao_bang_tiet_khi.py

Nguồn: thư viện sxtwl (Thọ Tinh vạn niên lịch — 寿星万年历, giấy phép BSD), bộ lịch mà nhiều
trang và ứng dụng lập bàn Kỳ Môn, Bát tự dùng để tra giờ giao tiết. Giờ được làm tròn tới phút
và lưu theo giờ UTC, nên dùng được ở mọi múi giờ.

Mã hóa: `phut0` là số phút (UTC, tính từ 01/01/1970) của tiết đầu tiên; `buoc` là chuỗi các
khoảng cách giữa hai tiết liền nhau, mỗi khoảng là (số phút − 20000) viết bằng 3 chữ số hệ 36.
`dau` là chỉ số của tiết đầu tiên (0 = Đông chí, 1 = Tiểu hàn, ...).

Chỉ cần chạy lại khi muốn mở rộng khoảng năm; trang không cần sxtwl để chạy.
© 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
"""
import datetime as dt
from pathlib import Path

import sxtwl

ROOT = Path(__file__).resolve().parent.parent
NAM_DAU, NAM_CUOI = 1900, 2100
BEIJING = dt.timezone(dt.timedelta(hours=8))


def phut_utc(jq):
    t = sxtwl.JD2DD(jq.jd)  # giờ Bắc Kinh
    giay = int(t.s); phan = t.s - giay
    d = dt.datetime(int(t.Y), int(t.M), int(t.D), int(t.h), int(t.m), giay, tzinfo=BEIJING) + dt.timedelta(seconds=phan)
    return round(d.timestamp() / 60)


def main():
    ds = {}
    for y in range(NAM_DAU - 1, NAM_CUOI + 2):
        for jq in sxtwl.getJieQiByYear(y):
            ds[phut_utc(jq)] = jq.jqIndex
    lo = dt.datetime(NAM_DAU - 1, 12, 1, tzinfo=dt.timezone.utc).timestamp() / 60
    hi = dt.datetime(NAM_CUOI + 1, 1, 31, tzinfo=dt.timezone.utc).timestamp() / 60
    moc = sorted((m, i) for m, i in ds.items() if lo <= m <= hi)
    buoc = []
    for (m0, i0), (m1, i1) in zip(moc, moc[1:]):
        if i1 != (i0 + 1) % 24:
            raise SystemExit(f"Thiếu tiết giữa phút {m0} và {m1}")
        k = m1 - m0 - 20000
        if not 0 <= k < 36 ** 3:
            raise SystemExit(f"Khoảng cách bất thường: {m1 - m0} phút")
        s = ""
        for _ in range(3):
            k, r = divmod(k, 36)
            s = "0123456789abcdefghijklmnopqrstuvwxyz"[r] + s
        buoc.append(s)
    noi_dung = (
        "// Bảng giờ giao 24 tiết khí " + f"{NAM_DAU} – {NAM_CUOI}" + ", tạo bởi tools/tao_bang_tiet_khi.py — không sửa tay.\n"
        "// Nguồn: thư viện sxtwl (Thọ Tinh vạn niên lịch, giấy phép BSD). Giờ UTC, làm tròn tới phút.\n"
        "(function (KM) {\n"
        f"  KM.BangTietKhi = {{ dau: {moc[0][1]}, phut0: {moc[0][0]}, buoc: \"{''.join(buoc)}\" }};\n"
        "})(typeof module !== \"undefined\" && module.exports ? (module.exports = require(\"./km.js\")) : KM);\n"
    )
    (ROOT / "lib" / "tiet-khi-bang.js").write_text(noi_dung, encoding="utf-8")
    print(f"Đã ghi lib/tiet-khi-bang.js: {len(moc)} lần giao tiết, {len(noi_dung) // 1024} KB")


if __name__ == "__main__":
    main()
