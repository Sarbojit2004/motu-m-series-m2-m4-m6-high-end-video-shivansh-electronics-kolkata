"""Brand-layer marks. WhatsApp reproduced as vector to match the supplied asset."""

_BUBBLE = ("M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22"
           "l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65"
           "-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z")

_HANDSET = ("M17.07 14.53c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.18.28-.72.9"
            "-.88 1.09-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.83-.73-1.38-1.64"
            "-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.18-.28.28-.46"
            ".09-.19.05-.35-.02-.49-.07-.14-.63-1.51-.86-2.07-.22-.54-.45-.47-.63-.48h-.53"
            "c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.29s.99 2.66 1.13 2.85c.14.18 1.95 2.98"
            " 4.72 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.65-.67 1.88-1.32"
            ".23-.65.23-1.21.16-1.32-.06-.12-.24-.19-.52-.33z")

def whatsapp(size=64, uid='wa', ring=True, shadow=True):
    """Green-gradient bubble, white ring, white handset — the supplied mark, as vector."""
    sh = (f'<filter id="{uid}s" x="-25%" y="-25%" width="150%" height="150%">'
          f'<feDropShadow dx="0" dy="0.34" stdDeviation="0.46" flood-color="#000" '
          f'flood-opacity="0.34"/></filter>') if shadow else ''
    ringp = (f'<path d="{_BUBBLE}" fill="#fff" stroke="#fff" stroke-width="1.75" '
             f'stroke-linejoin="round"/>') if ring else ''
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" '
            f'xmlns="http://www.w3.org/2000/svg">'
            f'<defs>{sh}<linearGradient id="{uid}g" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="#5FD669"/>'
            f'<stop offset="1" stop-color="#23AF41"/></linearGradient></defs>'
            f'<g {f"filter=url(#{uid}s)" if shadow else ""}>{ringp}'
            f'<path d="{_BUBBLE}" fill="url(#{uid}g)"/>'
            f'<path d="{_HANDSET}" fill="#fff"/></g></svg>')

def globe(size=44, colour='#0C0C0E', sw=1.7):
    """Minimal globe/link mark — stroke only, so it sits inside the collage."""
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="{colour}" stroke-width="{sw}" stroke-linecap="round" '
            f'xmlns="http://www.w3.org/2000/svg">'
            f'<circle cx="12" cy="12" r="9.1"/>'
            f'<ellipse cx="12" cy="12" rx="3.9" ry="9.1"/>'
            f'<path d="M3.1 9.1h17.8M3.1 14.9h17.8"/></svg>')
