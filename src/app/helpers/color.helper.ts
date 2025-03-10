export abstract class ColorHelper {

  static HexToHSL(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result![1], 16);
    let g = parseInt(result![2], 16);
    let b = parseInt(result![3], 16);

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number = (max + min) / 2;
    let s: number = (max + min) / 2;
    let l: number = (max + min) / 2;

    if (max == min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return { h, s, l };
  }

  static RGBToHSL(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin;
    let h = 0, s = 0, l = 0;

    if (delta == 0)
      h = 0;

    else if (cmax == r)
      h = ((g - b) / delta) % 6;

    else if (cmax == g)
      h = (b - r) / delta + 2;

    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
      h += 360;
    l = (cmax + cmin) / 2;

    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
  }

  static HSLToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    let rstr = Math.round((r + m) * 255).toString(16);
    let gstr = Math.round((g + m) * 255).toString(16);
    let bstr = Math.round((b + m) * 255).toString(16);

    if (rstr.length == 1)
      rstr = "0" + rstr;
    if (gstr.length == 1)
      gstr = "0" + gstr;
    if (bstr.length == 1)
      bstr = "0" + bstr;

    return "#" + rstr + gstr + bstr;
  }

  static rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

    function componentToHex(c: number) {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
  }

  static rgbToHexFromString(rgbString: string) {
    const rgbNumbers = rgbString.match(/\d+/g);
    const rgbArray = rgbNumbers!.map(Number);
    return ColorHelper.rgbToHex(rgbArray[0], rgbArray[1], rgbArray[2]);
  }

  static rgbToHslFromString(rgbString: string) {
    const rgbNumbers = rgbString.match(/\d+/g);
    const rgbArray = rgbNumbers!.map(Number);
    return ColorHelper.RGBToHSL(rgbArray[0], rgbArray[1], rgbArray[2]);
  }

  static darkenHexColor(hex: string, percent: number): string {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }

    if (hex.length !== 6) {
      throw new Error('Ungültige Hex-Farbe');
    }

    let [r, g, b] = [0, 2, 4].map(start =>
      parseInt(hex.substring(start, start + 2), 16)
    );

    const darken = (color: number) => Math.max(0, Math.min(255, Math.round(color * (1 - percent / 100))));

    r = darken(r);
    g = darken(g);
    b = darken(b);

    return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
  }

  static isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }
}
