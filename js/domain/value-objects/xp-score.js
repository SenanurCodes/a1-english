/**
 * @fileoverview Value Object: XPScore (Değişmez Puan Değer Nesnesi)
 */
export class XPScore {
  constructor(value = 0) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      throw new RangeError('XPScore negatif veya geçersiz bir sayı olamaz.');
    }
    this.value = Math.floor(parsed);
    Object.freeze(this);
  }

  add(delta) {
    const num = Number(delta);
    if (!Number.isFinite(num) || num < 0) {
      throw new RangeError('Eklenecek XP negatif olamaz.');
    }
    return new XPScore(this.value + Math.floor(num));
  }
}

export default XPScore;
