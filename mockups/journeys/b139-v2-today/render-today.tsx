// Renders today's cards from the real card code (main 9aa45af45) with fixed sample data, for b139 v2's before/after.
import * as ReactNS from "react";
(globalThis as unknown as { React: unknown }).React = ReactNS;
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { loadCardFonts } from "@/lib/card-fonts";
import { typeCardBody, streakRuns } from "@/lib/type-card";
import { matchCardBody } from "@/lib/match-card";
import { recutCardBody } from "@/lib/recut-card";
import { mnCardBody } from "@/lib/mn-share-card-og";
import { CARD_SIZES } from "@/lib/card-kit";
import { tonightPickCardBody } from "@/lib/tonight-pick-card";

const OUT = process.argv[2];
const T = (id: string, w = 342) => `https://image.tmdb.org/t/p/w${w}/${id}.jpg`;
function uri(url: string): string {
  const f = `${OUT}/cache-${url.split("/").pop()}-${url.match(/w(\d+)/)?.[1]}`;
  if (!fs.existsSync(f)) execFileSync("curl", ["-sSf", "--max-time", "20", "-o", f, url]);
  return `data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}`;
}
const SEPIA = [[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]];
const GRADE = SEPIA.map((row, i) => row.map((v, j) => 0.08 * v + (i === j ? 0.92 : 0))) as [[number, number, number], [number, number, number], [number, number, number]];
async function graded(u: string): Promise<string> {
  const out = await sharp(Buffer.from(u.slice(u.indexOf(",") + 1), "base64")).modulate({ saturation: 0.8 }).linear(1.05, -0.05 * 128).recomb(GRADE).jpeg({ quality: 84 }).toBuffer();
  return `data:image/jpeg;base64,${out.toString("base64")}`;
}
const F = { inception: "8ZTVqvKDQ8emSGUEMjsS4yHAwrp", primer: "xEoq2WmDzpzxhkHEsmOYOg6BPg6", arrival: "x2FJsf1ElAgr63Y3PNPtJrcmpoe", mulholland: "x7A59t6ySylr1L7aubOQEA480vM", synecdoche: "5UwdhrjXhUgsiDhe1dpS9z4yj7q", pastlives: "k3waqVXSnvCZWfJYNtdamTgTtTA", her: "eCOtqtfvn7mxGl6nfmq4b1exJRc", mood: "iYypPT4bhqXfq1b6EnmxvRt6b2Y" };
const WALL = ["z2FnLKpFi1HPO7BEJxdkv6hpJSU","7IiTTgloJzvGI1TAYymCfbfl3vT","zhG3vKWyDRaZYoaww1UVAi29T9h","6FfCtAuVAW8XJjZ7eWeLibRLWTw","ve72VxNqjGM69Uky4WTo2bK6rfq","n0YuM4f5lvGAP6MAW2kBIzugXnc","jSziioSwPVrOy9Yow3XhWIBDjq1","xlaY2zyzMfkhk0HSC5VUwzoZPU1","lxM6kqilAdpdhqUl2biYp5frUxE","602vevIURmpDfzbnv5Ubi6wIkQm","3bhkrj58Vtu7enYsRolD1fZdja1","39wmItIWsg5sZMyRUHLkWBcuVCM","6d5XOczc226jECq0LIX0siKtgHR","9OkCLM73MIU2CrKZbqiT8Ln1wY2","lGCEKlJo2CnWydQj7aamY7s1S7Q","1pdfLvkbY9ohJlCjQH2CZjjYVvJ","fKTPH2WvH8nHTXeBYBVhawtRqtR","dXNAPwY7VrqMAo51EKhhCJfaGb5","15uOEfqBNTVtDUT7hGBVCka0rZz","uAR0AWqhQL1hQa69UDEbb2rE5Wx"];
async function png(el: React.ReactElement, size: { width: number; height: number }, name: string, fonts: Awaited<ReturnType<typeof loadCardFonts>>) {
  const r = new ImageResponse(el, { ...size, fonts });
  fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(await r.arrayBuffer()));
  console.log("wrote", name);
}
(async () => {
  const fonts = await loadCardFonts();
  if (process.argv[3] === "tonight") { await png(tonightPickCardBody({ title: "Arrival", year: 2016, director: "Denis Villeneuve", runtime: 116, poster: uri(T(F.arrival, 780)) }, { eyebrow: "Tonight's pick", line: "91% match for Maya", date: "Fri, Nov 13" }, "story"), { width: 1080, height: 1920 }, "today-tonight", fonts); return; }
  const films = [F.inception, F.primer, F.arrival, F.mulholland, F.synecdoche];
  const label = "Overthinker";
  await png(typeCardBody({
    label, tag: "Always piecing it together. You leave with a theory.",
    streak: streakRuns("with streaks of Nihilist and Lovestruck", ["Nihilist", "Lovestruck"]),
    mix: [{ pct: 58, shade: "#7a1220" }, { pct: 27, shade: "#5b8fc4" }, { pct: 15, shade: "#6a6a70" }],
    films: films.map((p, i) => ({ posterUrl: T(p), title: String(i), slug: `f${i}` })),
    posters: await Promise.all(films.map((p) => graded(uri(T(p))))),
    wall: await Promise.all(WALL.map((p) => graded(uri(T(p))))), handle: "maya",
  }, "story"), CARD_SIZES.story, "today-archetype", fonts);
  await png(matchCardBody({ score: 94, band: "Cinematic soulmates", line: "You both love slow, aching romance.", aName: "Sam", bName: "Maya", aFace: null, bFace: null, aId: "sam-1", bId: "maya-1",
    posters: [F.pastlives, F.her, F.mood].map((p) => uri(T(p))), lanes: [], wall: WALL.slice(4).map((p) => uri(T(p))), bHandle: "maya" }, "post"), CARD_SIZES.post, "today-blend", fonts);
  await png(recutCardBody({ id: "x", sentence: "Feels like a rainy Sunday", query: {} as never, handle: "maya",
    top: [["Past Lives", F.pastlives], ["In the Mood for Love", F.mood], ["Her", F.her]].map(([title, p]) => ({ title, year: null, posterUrl: T(p) })) },
    [F.pastlives, F.mood, F.her].map((p) => uri(T(p)))), CARD_SIZES.story, "today-pitch", fonts);
  await png(mnCardBody({ film: { slug: "arrival-2016", title: "Arrival", year: 2016, director: "Denis Villeneuve", posterUrl: T(F.arrival, 780), runtime: 116 },
    people: 5, minutes: 4, agreed: "4 of 5 voted for it", won: "Won 4 of 5 votes", roomPct: 88, roomName: "The Midnight Society", initials: ["M", "S", "J", "P", "L"],
    tints: ["#8fb3d9", "#c9a46a", "#a7c4a0", "#c48f9a", "#b3a6d9"], watch: null, moods: ["Tense", "Smart"], date: "Fri 13 Nov", rating: null }, "story", uri(T(F.arrival, 780)), null), { width: 1080, height: 1920 }, "today-night", fonts);
  await png(tonightPickCardBody({ title: "Arrival", year: 2016, director: "Denis Villeneuve", runtime: 116, poster: uri(T(F.arrival, 780)) }, { eyebrow: "Tonight's pick", line: "91% match for Maya", date: "Fri, Nov 13" }, "story"), { width: 1080, height: 1920 }, "today-tonight", fonts);
})().catch((e) => { console.error(e); process.exit(1); });
