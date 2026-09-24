import type { Answers, FactorId, SectionId } from "./types";

/**
 * The schema is the single source of truth. It drives the form *and* the
 * engine, so a new factor is one object here rather than edits in four files.
 *
 * Multiplier design notes:
 *  - Everything is a multiplier on a common base, so no factor can silently
 *    dominate by being denominated differently.
 *  - Countable assets (land, cattle, "connections") use sqrt curves. Diminishing
 *    returns keep the top end funny instead of astronomical — the original
 *    linear chain topped out around ₹31,000 crore, which is past the point
 *    where a joke number reads as a joke.
 *  - The satire lives in the *ranking*: a sarkari naukri outweighs a PhD by
 *    roughly 2x, and a buffalo herd outruns a doctorate. That is the argument.
 */

export interface Option {
    value: string;
    label: string;
}

interface FieldBase {
    id: FactorId;
    section: SectionId;
    label: string;
    /** Satirical microcopy shown under the label. */
    aside: string;
    /** Humanised answer, for the result breakdown. */
    detail: (a: Answers) => string;
    multiplier: (a: Answers) => number;
}

export interface SelectField extends FieldBase {
    kind: "select";
    options: Option[];
}

export interface ChoiceField extends FieldBase {
    kind: "choice";
    options: Option[];
}

export interface SliderField extends FieldBase {
    kind: "slider";
    min: number;
    max: number;
    step: number;
    minLabel: string;
    maxLabel: string;
    display: (v: number) => string;
}

export type Field = SelectField | ChoiceField | SliderField;

export const SECTIONS: { id: SectionId; title: string; hindi: string; blurb: string }[] = [
    {
        id: "candidate",
        title: "The Candidate",
        hindi: "उम्मीदवार",
        blurb: "Degrees and salaries, weighed on the market's own scale — which is to say, barely.",
    },
    {
        id: "assets",
        title: "Zameen, Jaayadaad & Janwar",
        hindi: "ज़मीन, जायदाद और जानवर",
        blurb: "Land, property and cattle. Historically the part that actually moves the number.",
    },
    {
        id: "sanskaar",
        title: "The Sanskaar Audit",
        hindi: "संस्कार जाँच",
        blurb: "Where a stranger's family grades your character out of a hundred. Note who gets audited here.",
    },
];

const pick = (options: Option[], value: string) =>
    options.find((o) => o.value === value)?.label ?? options[0].label;

const educationOptions: Option[] = [
    { value: "no-degree", label: "No degree" },
    { value: "high-school", label: "High school" },
    { value: "bachelors", label: "Bachelor's" },
    { value: "masters", label: "Master's" },
    { value: "phd", label: "PhD / Doctorate" },
];

const professionOptions: Option[] = [
    { value: "other", label: "Something they can't explain to relatives" },
    { value: "teacher", label: "Teacher / Professor" },
    { value: "tech", label: "Technology / IT" },
    { value: "engineer", label: "Engineer" },
    { value: "business", label: "Business owner" },
    { value: "doctor", label: "Doctor" },
    { value: "government", label: "Government employee" },
];

const nriOptions: Option[] = [
    { value: "none", label: "Very much in India" },
    { value: "gulf", label: "Gulf posting" },
    { value: "west", label: "US / UK / Canada, settled" },
];

const propertyOptions: Option[] = [
    { value: "none", label: "Nothing ancestral" },
    { value: "some", label: "A bit of land in the village" },
    { value: "substantial", label: "Substantial land and buildings" },
    { value: "haveli", label: "A 150-year-old haveli" },
];

const kundliOptions: Option[] = [
    { value: "manglik", label: "Manglik" },
    { value: "unknown", label: "Nobody has checked" },
    { value: "clean", label: "36 of 36 gun milte hain" },
];

const yesNo = (yes: string, no: string): Option[] => [
    { value: "yes", label: yes },
    { value: "no", label: no },
];

export const FIELDS: Field[] = [
    // ─── Part A · The candidate ──────────────────────────────────────────────
    {
        id: "education",
        section: "candidate",
        kind: "select",
        label: "Highest qualification",
        aside: "Years of your life, worth about as much as half a buffalo.",
        options: educationOptions,
        detail: (a) => pick(educationOptions, a.education),
        multiplier: (a) =>
            ({
                "no-degree": 0.95,
                "high-school": 1.0,
                bachelors: 1.15,
                masters: 1.25,
                phd: 1.35,
            })[a.education] ?? 1,
    },
    {
        id: "profession",
        section: "candidate",
        kind: "select",
        label: "Profession",
        aside: "What you do all day. Ranked by what the neighbours will think.",
        options: professionOptions,
        detail: (a) => pick(professionOptions, a.profession),
        multiplier: (a) =>
            ({
                other: 1.0,
                teacher: 1.15,
                tech: 1.45,
                engineer: 1.5,
                business: 1.6,
                doctor: 1.7,
                government: 2.0,
            })[a.profession] ?? 1,
    },
    {
        id: "govtJob",
        section: "candidate",
        kind: "choice",
        label: "Sarkari naukri",
        aside: "Pension, quarters, and a lifetime of being called 'sir'. The single loudest number here.",
        options: yesNo("सरकारी नौकरी — yes", "Private job"),
        detail: (a) => (a.govtJob === "yes" ? "Confirmed sarkari" : "Private sector"),
        multiplier: (a) => (a.govtJob === "yes" ? 2.4 : 1),
    },
    {
        id: "nriStatus",
        section: "candidate",
        kind: "select",
        label: "Foreign settled?",
        aside: "A visa is, market-wise, a personality.",
        options: nriOptions,
        detail: (a) => pick(nriOptions, a.nriStatus),
        multiplier: (a) => ({ none: 1.0, gulf: 1.25, west: 1.6 })[a.nriStatus] ?? 1,
    },
    {
        id: "socialMediaFollowers",
        section: "candidate",
        kind: "slider",
        label: "Social media followers",
        aside: "Modern influence. Deeply suspicious to the committee.",
        min: 0,
        max: 100_000,
        step: 500,
        minLabel: "0 · sanskaari",
        maxLabel: "100k · reels",
        display: (v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${v}`),
        detail: (a) => `${a.socialMediaFollowers.toLocaleString("en-IN")} followers`,
        multiplier: (a) => 1 + Math.log10(a.socialMediaFollowers + 1) * 0.06,
    },

    // ─── Part B · Zameen, jaayadaad, janwar ──────────────────────────────────
    {
        id: "land",
        section: "assets",
        kind: "slider",
        label: "Land owned",
        aside: "Acres. The oldest number in the Indian marriage market.",
        min: 0,
        max: 20,
        step: 0.5,
        minLabel: "0 · landless",
        maxLabel: "20 · zamindar",
        display: (v) => `${v} acres`,
        detail: (a) => `${a.land} acres`,
        multiplier: (a) => 1 + 0.34 * Math.sqrt(a.land),
    },
    {
        id: "livestock",
        section: "assets",
        kind: "slider",
        label: "Livestock",
        aside: "Gaay, bhains, bakri. Each one out-earns a semester of your degree.",
        min: 0,
        max: 15,
        step: 1,
        minLabel: "0 · none",
        maxLabel: "15 · 'dairy business'",
        display: (v) => `${v}`,
        detail: (a) => `${a.livestock} animals`,
        multiplier: (a) => 1 + 0.16 * Math.sqrt(a.livestock),
    },
    {
        id: "ancestralProperty",
        section: "assets",
        kind: "select",
        label: "Ancestral property",
        aside: "Money you did nothing to earn, counted twice as hard as money you did.",
        options: propertyOptions,
        detail: (a) => pick(propertyOptions, a.ancestralProperty),
        multiplier: (a) =>
            ({ none: 0.85, some: 1.15, substantial: 1.5, haveli: 1.9 })[a.ancestralProperty] ?? 1,
    },
    {
        id: "vehicles",
        section: "assets",
        kind: "slider",
        label: "SUVs in the family",
        aside: "Counted at the gate during the baraat. Sedans do not qualify.",
        min: 0,
        max: 6,
        step: 1,
        minLabel: "0 · scooter",
        maxLabel: "6 · convoy",
        display: (v) => `${v}`,
        detail: (a) => `${a.vehicles} SUVs`,
        multiplier: (a) => 1 + 0.13 * Math.sqrt(a.vehicles),
    },
    {
        id: "familyBusiness",
        section: "assets",
        kind: "choice",
        label: "Family business",
        aside: "'Pushtaini karobaar' — the phrase that ends negotiations early.",
        options: yesNo("Yes, pushtaini", "No business"),
        detail: (a) => (a.familyBusiness === "yes" ? "Pushtaini karobaar" : "No family business"),
        multiplier: (a) => (a.familyBusiness === "yes" ? 1.4 : 1),
    },

    // ─── Part C · The sanskaar audit ─────────────────────────────────────────
    {
        id: "cookingSkills",
        section: "sanskaar",
        kind: "slider",
        label: "Cooking skills",
        aside: "Asked of exactly one side of the family. Notice which.",
        min: 0,
        max: 100,
        step: 1,
        minLabel: "burns water",
        maxLabel: "MasterChef",
        display: (v) => `${v}%`,
        detail: (a) => `${a.cookingSkills}% graded`,
        multiplier: (a) => 0.85 + (a.cookingSkills / 100) * 0.5,
    },
    {
        id: "traditionValues",
        section: "sanskaar",
        kind: "slider",
        label: "Traditional values",
        aside: "Scored by people who will never be scored themselves.",
        min: 0,
        max: 100,
        step: 1,
        minLabel: "'too modern'",
        maxLabel: "sanskaari",
        display: (v) => `${v}%`,
        detail: (a) => `${a.traditionValues}% sanskaari`,
        multiplier: (a) => 0.8 + (a.traditionValues / 100) * 0.7,
    },
    {
        id: "relativesInGovernment",
        section: "sanskaar",
        kind: "slider",
        label: "Relatives in government",
        aside: "'Setting'. The file that moves when nobody else's does.",
        min: 0,
        max: 10,
        step: 1,
        minLabel: "0 · no setting",
        maxLabel: "10 · dynasty",
        display: (v) => `${v}`,
        detail: (a) => `${a.relativesInGovernment} in service`,
        multiplier: (a) => 1 + 0.32 * Math.sqrt(a.relativesInGovernment),
    },
    {
        id: "houseServants",
        section: "sanskaar",
        kind: "slider",
        label: "Household staff",
        aside: "Other people's labour, listed as your personal quality.",
        min: 0,
        max: 8,
        step: 1,
        minLabel: "0 · own chores",
        maxLabel: "8 · full staff",
        display: (v) => `${v}`,
        detail: (a) => `${a.houseServants} staff`,
        multiplier: (a) => 1 + 0.10 * Math.sqrt(a.houseServants),
    },
    {
        id: "kundli",
        section: "sanskaar",
        kind: "select",
        label: "Kundli status",
        aside: "Astronomy's opinion on your mortgage.",
        options: kundliOptions,
        detail: (a) => pick(kundliOptions, a.kundli),
        multiplier: (a) => ({ manglik: 0.75, unknown: 1.0, clean: 1.35 })[a.kundli] ?? 1,
    },
    {
        id: "snoreLevel",
        section: "sanskaar",
        kind: "slider",
        label: "Snoring level",
        aside: "The only genuinely relevant question on this entire form.",
        min: 0,
        max: 100,
        step: 1,
        minLabel: "silent",
        maxLabel: "sawmill",
        display: (v) => `${v}%`,
        detail: (a) => `${a.snoreLevel}% decibels`,
        multiplier: (a) => 1 - 0.35 * (a.snoreLevel / 100),
    },
];

export const FIELDS_BY_SECTION = SECTIONS.map((section) => ({
    ...section,
    fields: FIELDS.filter((f) => f.section === section.id),
}));

export const FIELD_BY_ID = new Map<FactorId, Field>(FIELDS.map((f) => [f.id, f]));

export const DEFAULT_ANSWERS: Answers = {
    education: "bachelors",
    profession: "tech",
    govtJob: "no",
    nriStatus: "none",
    socialMediaFollowers: 500,
    land: 2,
    livestock: 3,
    ancestralProperty: "some",
    vehicles: 1,
    familyBusiness: "no",
    cookingSkills: 60,
    traditionValues: 50,
    relativesInGovernment: 0,
    houseServants: 0,
    kundli: "unknown",
    snoreLevel: 20,
};
