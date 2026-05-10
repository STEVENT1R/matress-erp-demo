from PIL import Image, ImageDraw

def create_icon(size, path):
    img = Image.new('RGBA', (size, size), (79, 70, 229, 255))  # #4f46e5
    draw = ImageDraw.Draw(img)
    
    margin = int(size * 0.15)
    inner = size - 2 * margin
    
    # Pillow top
    pillow_h = int(inner * 0.35)
    draw.rounded_rectangle(
        [margin, margin, size - margin, margin + pillow_h],
        radius=int(size * 0.08),
        fill=(255, 255, 255, 230)
    )
    
    # Mattress body
    body_top = margin + pillow_h
    body_h = inner - pillow_h
    draw.rounded_rectangle(
        [margin, body_top, size - margin, body_top + body_h],
        radius=int(size * 0.05),
        fill=(255, 255, 255, 200)
    )
    
    # Spring lines
    line_spacing = max(3, int(size / 12))
    for i in range(2, int(body_h / line_spacing)):
        y = body_top + i * line_spacing
        if y < body_top + body_h - 2:
            draw.line(
                [(margin + 4, y), (size - margin - 4, y)],
                fill=(79, 70, 229, 80),
                width=max(1, int(size / 64))
            )
    
    img.save(path, 'PNG')
    print(f'Created {size}x{size} at {path}')

create_icon(192, 'public/icon-192.png')
create_icon(512, 'public/icon-512.png')
print('Done!')
