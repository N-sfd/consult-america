import base64
import os

out_dir = r"E:\projects\AI Projects\consult_america\consult_americ\public\brand"
with open(os.path.join(out_dir, "ca-mark.png"), "rb") as f:
    b64_mark = base64.b64encode(f.read()).decode("utf-8")

# Create consult-america-dark.svg (for light backgrounds: dark text)
svg_dark = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 84" fill="none" width="540" height="84">
  <g transform="translate(0, 2)">
    <image href="data:image/png;base64,{b64_mark}" x="0" y="0" width="120" height="80" preserveAspectRatio="xMidYMid meet" />
  </g>
  <line x1="134" y1="12" x2="134" y2="72" stroke="#B63A3A" stroke-width="2.5" stroke-linecap="round" />
  <g transform="translate(150, 0)">
    <text x="0" y="46" font-family="system-ui, -apple-system, 'Inter', 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="-0.02em" fill="#102033">CONSULT</text>
    <text x="162" y="46" font-family="system-ui, -apple-system, 'Inter', 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="500" letter-spacing="-0.01em" fill="#102033">AMERICA</text>
    <g transform="translate(0, 68)" font-family="system-ui, -apple-system, 'Inter', 'Segoe UI', Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="0.06em">
      <text x="0" y="0" fill="#695F57">ENTERPRISE TRANSFORMATION</text>
      <circle cx="194" cy="-3" r="2" fill="#B63A3A" />
      <text x="204" y="0" fill="#695F57">ORACLE</text>
      <circle cx="260" cy="-3" r="2" fill="#B63A3A" />
      <text x="270" y="0" fill="#695F57">AI</text>
      <circle cx="290" cy="-3" r="2" fill="#B63A3A" />
      <text x="300" y="0" fill="#695F57">ENGINEERING</text>
    </g>
  </g>
</svg>"""

with open(os.path.join(out_dir, "consult-america-dark.svg"), "w", encoding="utf-8") as f:
    f.write(svg_dark)

# Create consult-america-light.svg (for dark backgrounds: white text)
svg_light = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 84" fill="none" width="540" height="84">
  <g transform="translate(0, 2)">
    <image href="data:image/png;base64,{b64_mark}" x="0" y="0" width="120" height="80" preserveAspectRatio="xMidYMid meet" />
  </g>
  <line x1="134" y1="12" x2="134" y2="72" stroke="#B63A3A" stroke-width="2.5" stroke-linecap="round" />
  <g transform="translate(150, 0)">
    <text x="0" y="46" font-family="system-ui, -apple-system, 'Inter', 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="-0.02em" fill="#FFFDF8">CONSULT</text>
    <text x="162" y="46" font-family="system-ui, -apple-system, 'Inter', 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="500" letter-spacing="-0.01em" fill="#FFFDF8">AMERICA</text>
    <g transform="translate(0, 68)" font-family="system-ui, -apple-system, 'Inter', 'Segoe UI', Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="0.06em">
      <text x="0" y="0" fill="#D8C5AA">ENTERPRISE TRANSFORMATION</text>
      <circle cx="194" cy="-3" r="2" fill="#B63A3A" />
      <text x="204" y="0" fill="#D8C5AA">ORACLE</text>
      <circle cx="260" cy="-3" r="2" fill="#B63A3A" />
      <text x="270" y="0" fill="#D8C5AA">AI</text>
      <circle cx="290" cy="-3" r="2" fill="#B63A3A" />
      <text x="300" y="0" fill="#D8C5AA">ENGINEERING</text>
    </g>
  </g>
</svg>"""

with open(os.path.join(out_dir, "consult-america-light.svg"), "w", encoding="utf-8") as f:
    f.write(svg_light)

print("SVGs generated successfully.")
