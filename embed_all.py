import base64

p = 'index.html'
s = open(p, encoding='utf-8').read()

sounds = {
    'punch.mp3': "new Audio('punch.mp3')",
    'angryguy.mp3': "'angryguy.mp3'",
    'rahh.mp3': "'rahh.mp3'",
}

for filename, target in sounds.items():
    if 'data:audio/mpeg;base64,' in s and target.replace(filename, 'data:audio/mpeg;base64,') in s:
        print(f'{filename}: already embedded, skipping')
        continue
    b64 = base64.b64encode(open(filename, 'rb').read()).decode()
    if s.count(target) != 1:
        print(f'{filename}: reference not found, skipping')
        continue
    s = s.replace(target, target.replace(filename, f'data:audio/mpeg;base64,{b64}'))
    print(f'{filename}: embedded ({len(b64)} characters)')

open(p, 'w', encoding='utf-8').write(s)