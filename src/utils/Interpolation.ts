export default class Interpolation {
    public static cubicBezier(alpha, p0, p1, p2, p3) {
        const muls = (a, n) => [a[0] * n, a[1] * n];
        const add = (a, b) => [a[0] + b[0], a[1] + b[1]];

        var u = 1 - alpha;
        var tt = alpha*alpha;
        var uu = u*u;
        var uuu = uu * u;
        var ttt = tt * alpha;

        var p = muls(p0, uuu);
        p = add(p, muls(p1, 3 * uu * alpha));
        p = add(p, muls(p2, 3 * u * tt));
        p = add(p, muls(p3, ttt));
        return p[1];
    }

    public static smooth(start: number, end: number, alpha: number) {
        return (start + (end - start) * (alpha * alpha * (3 - 2 * alpha)));
    }
}